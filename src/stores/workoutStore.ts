import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Exercise, ExerciseWithLastSet, Workout, WorkoutSet } from '../types';
import { zustandStorage } from '../utils/storage';

interface WorkoutState {
  // Current active workout
  activeWorkout: Workout | null;
  activeWorkoutSets: WorkoutSet[];
  activeWorkoutExercises: ExerciseWithLastSet[];
  isWorkoutActive: boolean;
  workoutStartTime: number | null;

  // Actions
  startWorkout: () => void;
  endWorkout: () => void;
  addExerciseToWorkout: (exercise: Exercise) => void;
  removeExerciseFromWorkout: (exerciseId: string) => void;
  addSetToWorkout: (
    exerciseId: string,
    set: Omit<WorkoutSet, '_id' | '_creationTime' | 'workoutId' | 'exerciseId' | 'order'>
  ) => void;
  removeSetFromWorkout: (setId: string) => void;
  updateSetInWorkout: (setId: string, updates: Partial<WorkoutSet>) => void;
  clearWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeWorkout: null,
      activeWorkoutSets: [],
      activeWorkoutExercises: [],
      isWorkoutActive: false,
      workoutStartTime: null,

      // Actions
      startWorkout: () => {
        const now = Date.now();
        const workout: Workout = {
          _id: `temp_${now}`, // Temporary ID until synced with Convex
          _creationTime: now,
          userId: 'temp_user', // Will be updated with real user ID
          startTime: now,
        };

        set({
          activeWorkout: workout,
          activeWorkoutSets: [],
          activeWorkoutExercises: [],
          isWorkoutActive: true,
          workoutStartTime: now,
        });
      },

      endWorkout: () => {
        const state = get();
        if (!state.activeWorkout) return;

        const endTime = Date.now();
        const duration = state.workoutStartTime ? Math.floor((endTime - state.workoutStartTime) / 1000) : 0;

        // Update workout with end time and duration
        const updatedWorkout: Workout = {
          ...state.activeWorkout,
          endTime,
          duration,
        };

        // Here we would normally save to Convex
        // For now, we just clear the local state
        set({
          activeWorkout: null,
          activeWorkoutSets: [],
          activeWorkoutExercises: [],
          isWorkoutActive: false,
          workoutStartTime: null,
        });
      },

      addExerciseToWorkout: (exercise: Exercise) => {
        const state = get();
        const isAlreadyAdded = state.activeWorkoutExercises.some((e) => e._id === exercise._id);
        if (isAlreadyAdded) return;

        const exerciseWithLastSet: ExerciseWithLastSet = {
          ...exercise,
          // TODO: Fetch last set from Convex
          lastSet: undefined,
        };

        set({
          activeWorkoutExercises: [...state.activeWorkoutExercises, exerciseWithLastSet],
        });
      },

      removeExerciseFromWorkout: (exerciseId: string) => {
        const state = get();

        set({
          activeWorkoutExercises: state.activeWorkoutExercises.filter((e) => e._id !== exerciseId),
          activeWorkoutSets: state.activeWorkoutSets.filter((s) => s.exerciseId !== exerciseId),
        });
      },

      addSetToWorkout: (exerciseId: string, setData) => {
        const state = get();
        if (!state.activeWorkout) return;

        const existingSetsForExercise = state.activeWorkoutSets.filter((s) => s.exerciseId === exerciseId);
        const order = existingSetsForExercise.length;

        const newSet: WorkoutSet = {
          _id: `temp_set_${Date.now()}_${Math.random()}`,
          _creationTime: Date.now(),
          workoutId: state.activeWorkout._id,
          exerciseId,
          order,
          ...setData,
        };

        set({
          activeWorkoutSets: [...state.activeWorkoutSets, newSet],
        });
      },

      removeSetFromWorkout: (setId: string) => {
        const state = get();

        set({
          activeWorkoutSets: state.activeWorkoutSets.filter((s) => s._id !== setId),
        });
      },

      updateSetInWorkout: (setId: string, updates: Partial<WorkoutSet>) => {
        const state = get();

        set({
          activeWorkoutSets: state.activeWorkoutSets.map((s) => (s._id === setId ? { ...s, ...updates } : s)),
        });
      },

      clearWorkout: () => {
        set({
          activeWorkout: null,
          activeWorkoutSets: [],
          activeWorkoutExercises: [],
          isWorkoutActive: false,
          workoutStartTime: null,
        });
      },
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

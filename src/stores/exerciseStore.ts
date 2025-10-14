import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { POPULAR_EXERCISES } from '../constants/exercises';
import type { Exercise } from '../types';
import { zustandStorage } from '../utils/storage';

interface ExerciseState {
  // Data
  exercises: Exercise[];
  searchQuery: string;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;

  // Actions
  setExercises: (exercises: Exercise[]) => void;
  addExercise: (exercise: Omit<Exercise, '_id' | '_creationTime'>) => void;
  updateExercise: (id: string, updates: Partial<Exercise>) => void;
  removeExercise: (id: string) => void;
  setSearchQuery: (query: string) => void;
  getFilteredExercises: () => Exercise[];
  initializeWithPopularExercises: (userId: string) => void;
  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
}

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, get) => ({
      // Initial state
      exercises: [],
      searchQuery: '',
      isLoading: false,
      isCreating: false,

      // Actions
      setExercises: (exercises: Exercise[]) => {
        set({ exercises });
      },

      addExercise: (exerciseData) => {
        const state = get();
        const newExercise: Exercise = {
          _id: `temp_exercise_${Date.now()}_${Math.random()}`,
          _creationTime: Date.now(),
          ...exerciseData,
        };

        set({
          exercises: [...state.exercises, newExercise],
        });
      },

      updateExercise: (id: string, updates: Partial<Exercise>) => {
        const state = get();

        set({
          exercises: state.exercises.map((exercise) => (exercise._id === id ? { ...exercise, ...updates } : exercise)),
        });
      },

      removeExercise: (id: string) => {
        const state = get();

        set({
          exercises: state.exercises.filter((exercise) => exercise._id !== id),
        });
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      getFilteredExercises: () => {
        const state = get();
        const { exercises, searchQuery } = state;

        if (!searchQuery.trim()) {
          return exercises;
        }

        const lowercaseQuery = searchQuery.toLowerCase().trim();
        return exercises.filter((exercise) => exercise.name.toLowerCase().includes(lowercaseQuery));
      },

      initializeWithPopularExercises: (userId: string) => {
        const state = get();

        // Only initialize if no exercises exist yet
        if (state.exercises.length > 0) return;

        const popularExercises: Exercise[] = POPULAR_EXERCISES.map((exercise, index) => ({
          _id: `popular_${index}`,
          _creationTime: Date.now(),
          userId,
          ...exercise,
        }));

        set({
          exercises: popularExercises,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setCreating: (creating: boolean) => {
        set({ isCreating: creating });
      },
    }),
    {
      name: 'exercise-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

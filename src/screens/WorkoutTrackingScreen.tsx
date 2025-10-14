import type React from 'react';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import SetInputModal from '../components/SetInputModal';
import WorkoutExerciseCard from '../components/WorkoutExerciseCard';
import { useWorkoutStore } from '../stores/workoutStore';
import type { Exercise, ExerciseWithLastSet, SetInput, WorkoutSet } from '../types';
import { formatTime } from '../utils/calculations';
import ExerciseLibraryScreen from './ExerciseLibraryScreen';

interface WorkoutTrackingScreenProps {
  onWorkoutComplete: () => void;
}

const WorkoutTrackingScreen: React.FC<WorkoutTrackingScreenProps> = ({ onWorkoutComplete }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [showSetInput, setShowSetInput] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseWithLastSet | null>(null);
  const [editingSet, setEditingSet] = useState<WorkoutSet | null>(null);

  const {
    activeWorkout,
    activeWorkoutSets,
    activeWorkoutExercises,
    workoutStartTime,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    addSetToWorkout,
    removeSetFromWorkout,
    updateSetInWorkout,
    endWorkout,
  } = useWorkoutStore();

  // Timer effect
  useEffect(() => {
    if (!workoutStartTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - workoutStartTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [workoutStartTime]);

  const handleAddExercise = (exercise: Exercise) => {
    addExerciseToWorkout(exercise);
    setShowExerciseLibrary(false);
  };

  const handleRemoveExercise = (exerciseId: string) => {
    removeExerciseFromWorkout(exerciseId);
  };

  const handleAddSet = (exercise: ExerciseWithLastSet) => {
    setSelectedExercise(exercise);
    setEditingSet(null);
    setShowSetInput(true);
  };

  const handleEditSet = (set: WorkoutSet) => {
    const exercise = activeWorkoutExercises.find((e) => e._id === set.exerciseId);
    if (!exercise) return;

    setSelectedExercise(exercise);
    setEditingSet(set);
    setShowSetInput(true);
  };

  const handleSetSubmit = (setData: SetInput) => {
    if (!selectedExercise) return;

    if (editingSet) {
      // Update existing set
      updateSetInWorkout(editingSet._id, setData);
    } else {
      // Add new set
      addSetToWorkout(selectedExercise._id, setData);
    }

    setShowSetInput(false);
    setSelectedExercise(null);
    setEditingSet(null);
  };

  const handleSetInputCancel = () => {
    setShowSetInput(false);
    setSelectedExercise(null);
    setEditingSet(null);
  };

  const handleEndWorkout = () => {
    if (activeWorkoutExercises.length === 0) {
      Alert.alert(
        'Workout beenden',
        'Du hast noch keine Übungen hinzugefügt. Möchtest du das Workout trotzdem beenden?',
        [
          { text: 'Weiter trainieren', style: 'cancel' },
          {
            text: 'Beenden',
            style: 'destructive',
            onPress: () => {
              endWorkout();
              onWorkoutComplete();
            },
          },
        ]
      );
      return;
    }

    const totalSets = activeWorkoutSets.length;
    Alert.alert(
      'Workout beenden',
      `Du hast ${totalSets} ${totalSets === 1 ? 'Satz' : 'Sätze'} in ${formatTime(elapsedTime)} absolviert. Workout speichern?`,
      [
        { text: 'Weiter trainieren', style: 'cancel' },
        {
          text: 'Speichern & Beenden',
          onPress: () => {
            endWorkout();
            onWorkoutComplete();
          },
        },
      ]
    );
  };

  const getSetsForExercise = (exerciseId: string): WorkoutSet[] => {
    return activeWorkoutSets.filter((set) => set.exerciseId === exerciseId).sort((a, b) => a.order - b.order);
  };

  if (showExerciseLibrary) {
    return (
      <ExerciseLibraryScreen
        onSelectExercise={handleAddExercise}
        onCreateExercise={() => {}} // TODO: Navigate to exercise builder
        selectedExercises={activeWorkoutExercises}
      />
    );
  }

  if (!activeWorkout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Kein aktives Workout gefunden</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Workout-Zeit</Text>
          <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
        </View>

        <Button title="Beenden" variant="danger" size="small" onPress={handleEndWorkout} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.exercisesHeader}>
          <Text style={styles.exercisesTitle}>Übungen ({activeWorkoutExercises.length})</Text>
          <Button title="+ Übung hinzufügen" onPress={() => setShowExerciseLibrary(true)} size="small" />
        </View>

        {activeWorkoutExercises.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Noch keine Übungen</Text>
            <Text style={styles.emptyStateText}>Füge Übungen hinzu, um mit deinem Workout zu beginnen.</Text>
            <Button
              title="Erste Übung hinzufügen"
              onPress={() => setShowExerciseLibrary(true)}
              style={styles.emptyStateButton}
            />
          </View>
        ) : (
          activeWorkoutExercises.map((exercise) => {
            const exerciseSets = getSetsForExercise(exercise._id);

            return (
              <WorkoutExerciseCard
                key={exercise._id}
                exercise={exercise}
                sets={exerciseSets}
                onAddSet={() => handleAddSet(exercise)}
                onRemoveSet={removeSetFromWorkout}
                onEditSet={handleEditSet}
                onRemoveExercise={() => handleRemoveExercise(exercise._id)}
              />
            );
          })
        )}
      </ScrollView>

      {selectedExercise && (
        <SetInputModal
          visible={showSetInput}
          exercise={selectedExercise}
          onSubmit={handleSetSubmit}
          onCancel={handleSetInputCancel}
          initialValues={
            editingSet
              ? {
                  weight: editingSet.weight,
                  reps: editingSet.reps,
                  time: editingSet.time,
                  distance: editingSet.distance,
                  notes: editingSet.notes,
                }
              : undefined
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  timerContainer: {
    alignItems: 'flex-start',
  },
  timerLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  exercisesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyStateButton: {
    minWidth: 200,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
  },
});

export default WorkoutTrackingScreen;

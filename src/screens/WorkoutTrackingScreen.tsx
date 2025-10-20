import type React from 'react';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../theme';
import Button from '../components/Button';
import WorkoutExerciseCard from '../components/WorkoutExerciseCard';
import { useWorkoutStore } from '../stores/workoutStore';
import type { Exercise, SetInput, WorkoutSet } from '../types';
import { formatTime } from '../utils/calculations';
import ExerciseLibraryScreen from './ExerciseLibraryScreen';

interface WorkoutTrackingScreenProps {
  onWorkoutComplete: () => void;
  onBack?: () => void;
}

const WorkoutTrackingScreen: React.FC<WorkoutTrackingScreenProps> = ({ onWorkoutComplete, onBack }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);

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

  const handleAddSet = (exerciseId: string, setData: SetInput) => {
    addSetToWorkout(exerciseId, setData);
  };

  const handleEditSet = (setId: string, setData: SetInput) => {
    updateSetInWorkout(setId, setData);
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
        onBack={() => setShowExerciseLibrary(false)}
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
        {onBack && (
          <Button title="← Zurück" variant="secondary" size="small" onPress={onBack} style={styles.backButton} />
        )}
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
                onAddSet={(setData) => handleAddSet(exercise._id, setData)}
                onRemoveSet={removeSetFromWorkout}
                onEditSet={handleEditSet}
                onRemoveExercise={() => handleRemoveExercise(exercise._id)}
              />
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    backgroundColor: colors.background.secondary,
    gap: spacing[3],
  },
  backButton: {
    paddingVertical: spacing[2],
  },
  timerContainer: {
    alignItems: 'center',
    flex: 1,
  },
  timerLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing[0] + 2,
    fontWeight: typography.fontWeight.regular,
  },
  timer: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.info.main,
    letterSpacing: -1,
  },
  content: {
    flex: 1,
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[5],
  },
  exercisesTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[16],
  },
  emptyStateTitle: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  emptyStateText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing[8],
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
    fontSize: typography.fontSize.xl - 1,
    color: colors.error.main,
    textAlign: 'center',
  },
});

export default WorkoutTrackingScreen;

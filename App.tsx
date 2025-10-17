import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ExerciseBuilderScreen from './src/screens/ExerciseBuilderScreen';
import ExerciseDetailScreen from './src/screens/ExerciseDetailScreen';
import ExerciseLibraryScreen from './src/screens/ExerciseLibraryScreen';
import HomeScreen from './src/screens/HomeScreen';
// Screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import WorkoutDetailScreen from './src/screens/WorkoutDetailScreen';
import WorkoutTrackingScreen from './src/screens/WorkoutTrackingScreen';
import { useExerciseStore } from './src/stores/exerciseStore';
// Stores
import { useWorkoutStore } from './src/stores/workoutStore';
import type { CompletedWorkout, Exercise } from './src/types';

type Screen =
  | 'onboarding'
  | 'home'
  | 'workout'
  | 'exercises'
  | 'exercise-builder'
  | 'exercise-detail'
  | 'workout-detail';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<CompletedWorkout | null>(null);

  const { isWorkoutActive, startWorkout } = useWorkoutStore();
  const { exercises } = useExerciseStore();

  // Check if user has completed onboarding
  useEffect(() => {
    // In a real app, this would be stored in AsyncStorage or similar
    // For now, we check if there are any exercises (indicating onboarding was completed)
    if (exercises.length > 0) {
      setHasCompletedOnboarding(true);
      setCurrentScreen('home');
    }
  }, [exercises.length]);

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    setCurrentScreen('home');
  };

  const handleStartWorkout = () => {
    if (!isWorkoutActive) {
      startWorkout();
    }
    setCurrentScreen('workout');
  };

  const handleWorkoutComplete = () => {
    setCurrentScreen('home');
  };

  const handleOpenExercises = () => {
    setCurrentScreen('exercises');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleCreateExercise = () => {
    setCurrentScreen('exercise-builder');
  };

  const handleExerciseBuilderComplete = () => {
    setCurrentScreen('exercises');
  };

  const handleExerciseBuilderCancel = () => {
    if (currentScreen === 'exercise-builder') {
      setCurrentScreen('exercises');
    }
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentScreen('exercise-detail');
  };

  const handleViewWorkout = (workout: CompletedWorkout) => {
    setSelectedWorkout(workout);
    setCurrentScreen('workout-detail');
  };

  const handleExerciseDetailBack = () => {
    setCurrentScreen('exercises');
  };

  const renderScreen = () => {
    if (!hasCompletedOnboarding) {
      return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    }

    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onStartWorkout={handleStartWorkout}
            onOpenExercises={handleOpenExercises}
            onCreateExercise={handleCreateExercise}
            onViewWorkout={handleViewWorkout}
          />
        );

      case 'workout':
        return <WorkoutTrackingScreen onWorkoutComplete={handleWorkoutComplete} onBack={handleBackToHome} />;

      case 'exercises':
        return (
          <ExerciseLibraryScreen
            onSelectExercise={handleExerciseSelect}
            onCreateExercise={handleCreateExercise}
            onBack={handleBackToHome}
          />
        );

      case 'exercise-builder':
        return (
          <ExerciseBuilderScreen onComplete={handleExerciseBuilderComplete} onCancel={handleExerciseBuilderCancel} />
        );

      case 'exercise-detail':
        return selectedExercise ? (
          <ExerciseDetailScreen exercise={selectedExercise} onBack={handleExerciseDetailBack} />
        ) : (
          <ExerciseLibraryScreen
            onSelectExercise={handleExerciseSelect}
            onCreateExercise={handleCreateExercise}
            onBack={handleBackToHome}
          />
        );

      case 'workout-detail':
        return selectedWorkout ? (
          <WorkoutDetailScreen workout={selectedWorkout} onBack={handleBackToHome} />
        ) : (
          <HomeScreen
            onStartWorkout={handleStartWorkout}
            onOpenExercises={handleOpenExercises}
            onCreateExercise={handleCreateExercise}
            onViewWorkout={handleViewWorkout}
          />
        );

      default:
        return (
          <HomeScreen
            onStartWorkout={handleStartWorkout}
            onOpenExercises={handleOpenExercises}
            onCreateExercise={handleCreateExercise}
            onViewWorkout={handleViewWorkout}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {renderScreen()}
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});

import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ExerciseBuilderScreen from './src/screens/ExerciseBuilderScreen';
import ExerciseLibraryScreen from './src/screens/ExerciseLibraryScreen';
import HomeScreen from './src/screens/HomeScreen';
// Screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import WorkoutTrackingScreen from './src/screens/WorkoutTrackingScreen';
import { useExerciseStore } from './src/stores/exerciseStore';
// Stores
import { useWorkoutStore } from './src/stores/workoutStore';

type Screen = 'onboarding' | 'home' | 'workout' | 'exercises' | 'exercise-builder';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const { isWorkoutActive, startWorkout } = useWorkoutStore();
  const { exercises, initializeWithPopularExercises } = useExerciseStore();

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

  const handleExerciseSelect = () => {
    // Handle exercise selection if needed
    // For now, just return to exercises list
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
          />
        );

      case 'workout':
        return <WorkoutTrackingScreen onWorkoutComplete={handleWorkoutComplete} />;

      case 'exercises':
        return (
          <ExerciseLibraryScreen onSelectExercise={handleExerciseSelect} onCreateExercise={handleCreateExercise} />
        );

      case 'exercise-builder':
        return (
          <ExerciseBuilderScreen onComplete={handleExerciseBuilderComplete} onCancel={handleExerciseBuilderCancel} />
        );

      default:
        return (
          <HomeScreen
            onStartWorkout={handleStartWorkout}
            onOpenExercises={handleOpenExercises}
            onCreateExercise={handleCreateExercise}
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

import type React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import { useExerciseStore } from '../stores/exerciseStore';
import { useWorkoutStore } from '../stores/workoutStore';

interface HomeScreenProps {
  onStartWorkout: () => void;
  onOpenExercises: () => void;
  onCreateExercise: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartWorkout, onOpenExercises, onCreateExercise }) => {
  const { isWorkoutActive } = useWorkoutStore();
  const { exercises } = useExerciseStore();

  const quickStats = {
    totalExercises: exercises.length,
    workoutsThisWeek: 0, // TODO: Calculate from workout history
    currentStreak: 0, // TODO: Calculate streak
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Simple Strength</Text>
        <Text style={styles.subtitle}>{isWorkoutActive ? 'Workout läuft...' : 'Bereit zum Training?'}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{quickStats.totalExercises}</Text>
            <Text style={styles.statLabel}>Übungen</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{quickStats.workoutsThisWeek}</Text>
            <Text style={styles.statLabel}>Diese Woche</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{quickStats.currentStreak}</Text>
            <Text style={styles.statLabel}>Tage Streak</Text>
          </Card>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title={isWorkoutActive ? '🏋️ Workout fortsetzen' : '🏋️ Workout starten'}
            onPress={onStartWorkout}
            size="large"
            style={styles.primaryAction}
          />

          <View style={styles.secondaryActions}>
            <Button
              title="📚 Übungen verwalten"
              variant="secondary"
              onPress={onOpenExercises}
              style={styles.secondaryAction}
            />

            <Button
              title="➕ Übung erstellen"
              variant="secondary"
              onPress={onCreateExercise}
              style={styles.secondaryAction}
            />
          </View>
        </View>

        {isWorkoutActive && (
          <Card style={styles.activeWorkoutBanner}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerIcon}>
                <Text style={styles.bannerIconText}>🔥</Text>
              </View>
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>Aktives Workout</Text>
                <Text style={styles.bannerSubtitle}>Tippe auf "Workout fortsetzen" um weiterzumachen</Text>
              </View>
            </View>
          </Card>
        )}

        {exercises.length === 0 && (
          <Card style={styles.emptyStateBanner}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerIcon}>
                <Text style={styles.bannerIconText}>💡</Text>
              </View>
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>Erste Schritte</Text>
                <Text style={styles.bannerSubtitle}>
                  Erstelle deine ersten Übungen, um mit dem Training zu beginnen
                </Text>
              </View>
            </View>
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  primaryAction: {
    marginBottom: 16,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
  },
  activeWorkoutBanner: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFE69C',
    borderWidth: 1,
    marginBottom: 16,
    marginHorizontal: 0,
  },
  emptyStateBanner: {
    backgroundColor: '#D1ECF1',
    borderColor: '#BEE5EB',
    borderWidth: 1,
    marginBottom: 16,
    marginHorizontal: 0,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bannerIconText: {
    fontSize: 24,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
});

export default HomeScreen;

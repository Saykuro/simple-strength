import type React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  const { isWorkoutActive, completedWorkouts } = useWorkoutStore();
  const { exercises } = useExerciseStore();

  // Calculate stats
  const now = Date.now();
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const workoutsThisWeek = completedWorkouts.filter((w) => w.endTime && w.endTime >= oneWeekAgo).length;

  // Calculate current streak (consecutive days with workouts)
  const calculateStreak = () => {
    if (completedWorkouts.length === 0) return 0;

    const sortedWorkouts = [...completedWorkouts]
      .filter((w) => w.endTime)
      .sort((a, b) => (b.endTime || 0) - (a.endTime || 0));

    const workoutDays = new Set(
      sortedWorkouts.map((w) => {
        const date = new Date(w.endTime || 0);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      })
    );

    const today = new Date(now);
    const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

    if (!workoutDays.has(todayStr)) {
      // Check yesterday
      const yesterday = new Date(now - 24 * 60 * 60 * 1000);
      const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;
      if (!workoutDays.has(yesterdayStr)) {
        return 0;
      }
    }

    let streak = 0;
    let currentDate = new Date(now);

    while (true) {
      const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
      if (!workoutDays.has(dateStr)) {
        break;
      }
      streak++;
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    }

    return streak;
  };

  const currentStreak = calculateStreak();

  const quickStats = {
    totalExercises: exercises.length,
    workoutsThisWeek,
    currentStreak,
  };

  const formatWorkoutDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return 'Heute';
    }

    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Gestern';
    }

    return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} Min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const recentWorkouts = [...completedWorkouts].sort((a, b) => (b.endTime || 0) - (a.endTime || 0)).slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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

          {/* Recent Workouts */}
          {recentWorkouts.length > 0 && (
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>Letzte Workouts</Text>
              {recentWorkouts.map((workout) => (
                <Card key={workout._id} style={styles.workoutCard}>
                  <View style={styles.workoutHeader}>
                    <Text style={styles.workoutDate}>{formatWorkoutDate(workout.endTime || workout.startTime)}</Text>
                    {workout.duration && <Text style={styles.workoutDuration}>{formatDuration(workout.duration)}</Text>}
                  </View>
                  <View style={styles.workoutStats}>
                    <Text style={styles.workoutStat}>
                      {workout.exercises?.length || 0} Übungen • {workout.sets?.length || 0} Sätze
                    </Text>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
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
    paddingBottom: 24,
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
  historySection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  workoutCard: {
    marginBottom: 12,
    marginHorizontal: 0,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  workoutDuration: {
    fontSize: 14,
    color: '#666666',
  },
  workoutStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutStat: {
    fontSize: 14,
    color: '#999999',
  },
});

export default HomeScreen;

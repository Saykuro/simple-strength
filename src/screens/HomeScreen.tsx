import type React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius } from '../theme';
import Button from '../components/Button';
import Card from '../components/Card';
import { useExerciseStore } from '../stores/exerciseStore';
import { useWorkoutStore } from '../stores/workoutStore';
import type { CompletedWorkout } from '../types';

interface HomeScreenProps {
  onStartWorkout: () => void;
  onOpenExercises: () => void;
  onCreateExercise: () => void;
  onViewWorkout: (workout: CompletedWorkout) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartWorkout,
  onOpenExercises,
  onCreateExercise,
  onViewWorkout,
}) => {
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
                <TouchableOpacity key={workout._id} onPress={() => onViewWorkout(workout)} activeOpacity={0.7}>
                  <Card style={styles.workoutCard}>
                    <View style={styles.workoutHeader}>
                      <Text style={styles.workoutDate}>{formatWorkoutDate(workout.endTime || workout.startTime)}</Text>
                      {workout.duration && (
                        <Text style={styles.workoutDuration}>{formatDuration(workout.duration)}</Text>
                      )}
                    </View>
                    <View style={styles.workoutStats}>
                      <Text style={styles.workoutStat}>
                        {workout.exercises?.length || 0} Übungen • {workout.sets?.length || 0} Sätze
                      </Text>
                    </View>
                    <Text style={styles.tapHint}>Tippen für Details →</Text>
                  </Card>
                </TouchableOpacity>
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
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.fontSize.xl - 1,
    color: colors.text.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[6],
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[8],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[5],
    marginVertical: 0,
    marginHorizontal: 0,
  },
  statNumber: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    marginBottom: spacing[1],
  },
  statLabel: {
    fontSize: typography.fontSize.sm + 1,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  actionsContainer: {
    marginBottom: spacing[6],
  },
  primaryAction: {
    marginBottom: spacing[4],
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  secondaryAction: {
    flex: 1,
  },
  activeWorkoutBanner: {
    backgroundColor: colors.warning.background,
    borderColor: colors.warning.main,
    borderWidth: 1,
    marginBottom: spacing[4],
    marginHorizontal: 0,
  },
  emptyStateBanner: {
    backgroundColor: colors.info.background,
    borderColor: colors.info.main,
    borderWidth: 1,
    marginBottom: spacing[4],
    marginHorizontal: 0,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[4],
  },
  bannerIconText: {
    fontSize: typography.fontSize['4xl'],
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  bannerSubtitle: {
    fontSize: typography.fontSize.sm + 1,
    color: colors.text.secondary,
  },
  historySection: {
    marginTop: spacing[6],
  },
  sectionTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  workoutCard: {
    marginBottom: spacing[3],
    marginHorizontal: 0,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  workoutDate: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  workoutDuration: {
    fontSize: typography.fontSize.sm + 1,
    color: colors.text.secondary,
  },
  workoutStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutStat: {
    fontSize: typography.fontSize.sm + 1,
    color: colors.text.tertiary,
  },
  tapHint: {
    fontSize: typography.fontSize.xs,
    color: colors.primary.main,
    marginTop: spacing[2],
    fontWeight: typography.fontWeight.medium,
  },
});

export default HomeScreen;

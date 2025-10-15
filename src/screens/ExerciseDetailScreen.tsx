import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Card from '../components/Card';
import { useWorkoutStore } from '../stores/workoutStore';
import type { Exercise } from '../types';
import { calculateOneRepMax } from '../utils/calculations';

interface ExerciseDetailScreenProps {
  exercise: Exercise;
  onBack: () => void;
}

interface PersonalRecord {
  type: 'heaviest_weight' | 'most_reps' | 'highest_volume' | 'best_1rm';
  value: number;
  date: number;
  details?: string;
}

export default function ExerciseDetailScreen({ exercise, onBack }: ExerciseDetailScreenProps) {
  const { completedWorkouts } = useWorkoutStore();

  // Collect all historical data for this exercise
  const exerciseHistory = useMemo(() => {
    const history: Array<{
      date: number;
      volume: number;
      oneRepMax: number;
      weight?: number;
      reps?: number;
    }> = [];

    for (const workout of completedWorkouts) {
      const workoutSets = workout.sets?.filter((set) => set.exerciseId === exercise._id) || [];

      if (workoutSets.length > 0) {
        let totalVolume = 0;
        let maxOneRepMax = 0;

        for (const set of workoutSets) {
          // Calculate volume
          if (set.weight && set.reps) {
            totalVolume += set.weight * set.reps;
            const orm = calculateOneRepMax(set.weight, set.reps);
            maxOneRepMax = Math.max(maxOneRepMax, orm);
          } else if (set.reps && !exercise.trackingComponents.weight) {
            // If weight is not tracked, volume is just reps
            totalVolume += set.reps;
          }
        }

        if (totalVolume > 0 || maxOneRepMax > 0) {
          history.push({
            date: workout.endTime || workout.startTime,
            volume: totalVolume,
            oneRepMax: maxOneRepMax,
          });
        }
      }
    }

    // Sort by date
    return history.sort((a, b) => a.date - b.date);
  }, [completedWorkouts, exercise._id, exercise.trackingComponents.weight]);

  // Calculate Personal Records
  const personalRecords = useMemo(() => {
    const records: PersonalRecord[] = [];

    if (exercise.trackingComponents.weight) {
      // Find heaviest weight
      let maxWeight = 0;
      let maxWeightDate = 0;
      let maxWeightReps = 0;

      // Find highest 1RM
      let maxOneRepMax = 0;
      let maxOneRepMaxDate = 0;

      for (const workout of completedWorkouts) {
        const workoutSets = workout.sets?.filter((set) => set.exerciseId === exercise._id) || [];

        for (const set of workoutSets) {
          if (set.weight && set.weight > maxWeight) {
            maxWeight = set.weight;
            maxWeightDate = workout.endTime || workout.startTime;
            maxWeightReps = set.reps || 0;
          }

          if (set.weight && set.reps) {
            const orm = calculateOneRepMax(set.weight, set.reps);
            if (orm > maxOneRepMax) {
              maxOneRepMax = orm;
              maxOneRepMaxDate = workout.endTime || workout.startTime;
            }
          }
        }
      }

      if (maxWeight > 0) {
        records.push({
          type: 'heaviest_weight',
          value: maxWeight,
          date: maxWeightDate,
          details: `${maxWeightReps} reps`,
        });
      }

      if (maxOneRepMax > 0) {
        records.push({
          type: 'best_1rm',
          value: maxOneRepMax,
          date: maxOneRepMaxDate,
        });
      }
    }

    if (exercise.trackingComponents.reps) {
      // Find most reps in a single set
      let maxReps = 0;
      let maxRepsDate = 0;
      let maxRepsWeight = 0;

      for (const workout of completedWorkouts) {
        const workoutSets = workout.sets?.filter((set) => set.exerciseId === exercise._id) || [];

        for (const set of workoutSets) {
          if (set.reps && set.reps > maxReps) {
            maxReps = set.reps;
            maxRepsDate = workout.endTime || workout.startTime;
            maxRepsWeight = set.weight || 0;
          }
        }
      }

      if (maxReps > 0) {
        records.push({
          type: 'most_reps',
          value: maxReps,
          date: maxRepsDate,
          details: maxRepsWeight > 0 ? `${maxRepsWeight} kg` : undefined,
        });
      }
    }

    // Find highest volume in a single workout
    const volumeByWorkout = new Map<string, { volume: number; date: number }>();

    for (const workout of completedWorkouts) {
      const workoutSets = workout.sets?.filter((set) => set.exerciseId === exercise._id) || [];
      let totalVolume = 0;

      for (const set of workoutSets) {
        if (set.weight && set.reps) {
          totalVolume += set.weight * set.reps;
        } else if (set.reps && !exercise.trackingComponents.weight) {
          totalVolume += set.reps;
        }
      }

      if (totalVolume > 0) {
        volumeByWorkout.set(workout._id, {
          volume: totalVolume,
          date: workout.endTime || workout.startTime,
        });
      }
    }

    if (volumeByWorkout.size > 0) {
      const maxVolumeEntry = Array.from(volumeByWorkout.values()).reduce((max, entry) =>
        entry.volume > max.volume ? entry : max
      );

      records.push({
        type: 'highest_volume',
        value: maxVolumeEntry.volume,
        date: maxVolumeEntry.date,
      });
    }

    return records;
  }, [completedWorkouts, exercise._id, exercise.trackingComponents]);

  const getRecordLabel = (type: PersonalRecord['type']) => {
    switch (type) {
      case 'heaviest_weight':
        return 'Heaviest Weight';
      case 'most_reps':
        return 'Most Reps';
      case 'highest_volume':
        return 'Highest Volume';
      case 'best_1rm':
        return 'Best 1RM';
    }
  };

  const formatRecordValue = (record: PersonalRecord) => {
    switch (record.type) {
      case 'heaviest_weight':
      case 'best_1rm':
        return `${record.value.toFixed(1)} kg`;
      case 'most_reps':
        return `${record.value} reps`;
      case 'highest_volume':
        return exercise.trackingComponents.weight ? `${record.value.toFixed(0)} kg·reps` : `${record.value} reps`;
    }
  };

  const formatDate = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  }, []);

  // Prepare chart data
  const volumeChartData = useMemo(() => {
    if (exerciseHistory.length === 0) return [];

    return exerciseHistory.map((entry, index) => ({
      value: entry.volume,
      label: index === 0 || index === exerciseHistory.length - 1 ? formatDate(entry.date) : '',
      dataPointText: '',
    }));
  }, [exerciseHistory, formatDate]);

  const oneRepMaxChartData = useMemo(() => {
    if (exerciseHistory.length === 0 || !exercise.trackingComponents.weight) return [];

    return exerciseHistory
      .filter((entry) => entry.oneRepMax > 0)
      .map((entry, index, arr) => ({
        value: entry.oneRepMax,
        label: index === 0 || index === arr.length - 1 ? formatDate(entry.date) : '',
        dataPointText: '',
      }));
  }, [exerciseHistory, exercise.trackingComponents.weight, formatDate]);

  const hasData = exerciseHistory.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{exercise.name}</Text>
          <Text style={styles.subtitle}>Progress Overview</Text>
        </View>

        {!hasData && (
          <Card style={styles.noDataCard}>
            <Text style={styles.noDataText}>No workout data yet.</Text>
            <Text style={styles.noDataSubtext}>Complete a workout with this exercise to see your progress.</Text>
          </Card>
        )}

        {hasData && (
          <>
            {/* Volume Chart */}
            <Card style={styles.chartCard}>
              <Text style={styles.chartTitle}>Total Volume per Workout</Text>
              <View style={styles.chartContainer}>
                <LineChart
                  data={volumeChartData}
                  width={300}
                  height={200}
                  spacing={volumeChartData.length > 1 ? 250 / (volumeChartData.length - 1) : 250}
                  initialSpacing={20}
                  color="#4A90E2"
                  thickness={2}
                  startFillColor="rgba(74, 144, 226, 0.3)"
                  endFillColor="rgba(74, 144, 226, 0.01)"
                  startOpacity={0.9}
                  endOpacity={0.2}
                  areaChart
                  hideDataPoints={false}
                  dataPointsHeight={6}
                  dataPointsWidth={6}
                  dataPointsColor="#4A90E2"
                  xAxisColor="#E0E0E0"
                  yAxisColor="#E0E0E0"
                  yAxisTextStyle={styles.chartAxisText}
                  xAxisLabelTextStyle={styles.chartAxisText}
                  rulesColor="#F0F0F0"
                  rulesType="solid"
                  yAxisThickness={1}
                  xAxisThickness={1}
                  curved
                  curveType={0} // CUBIC
                />
              </View>
            </Card>

            {/* 1RM Chart */}
            {exercise.trackingComponents.weight && oneRepMaxChartData.length > 0 && (
              <Card style={styles.chartCard}>
                <Text style={styles.chartTitle}>Estimated 1-Rep Max (1RM)</Text>
                <View style={styles.chartContainer}>
                  <LineChart
                    data={oneRepMaxChartData}
                    width={300}
                    height={200}
                    spacing={oneRepMaxChartData.length > 1 ? 250 / (oneRepMaxChartData.length - 1) : 250}
                    initialSpacing={20}
                    color="#E94B3C"
                    thickness={2}
                    startFillColor="rgba(233, 75, 60, 0.3)"
                    endFillColor="rgba(233, 75, 60, 0.01)"
                    startOpacity={0.9}
                    endOpacity={0.2}
                    areaChart
                    hideDataPoints={false}
                    dataPointsHeight={6}
                    dataPointsWidth={6}
                    dataPointsColor="#E94B3C"
                    xAxisColor="#E0E0E0"
                    yAxisColor="#E0E0E0"
                    yAxisTextStyle={styles.chartAxisText}
                    xAxisLabelTextStyle={styles.chartAxisText}
                    rulesColor="#F0F0F0"
                    rulesType="solid"
                    yAxisThickness={1}
                    xAxisThickness={1}
                    curved
                    curveType={0} // CUBIC
                  />
                </View>
              </Card>
            )}

            {/* Personal Records */}
            {personalRecords.length > 0 && (
              <Card style={styles.recordsCard}>
                <Text style={styles.chartTitle}>Personal Records 🏆</Text>
                <View style={styles.recordsList}>
                  {personalRecords.map((record, index) => (
                    <View key={`${record.type}-${index}`} style={styles.recordItem}>
                      <View style={styles.recordHeader}>
                        <Text style={styles.recordLabel}>{getRecordLabel(record.type)}</Text>
                        <Text style={styles.recordValue}>{formatRecordValue(record)}</Text>
                      </View>
                      <View style={styles.recordDetails}>
                        <Text style={styles.recordDate}>{formatDate(record.date)}</Text>
                        {record.details && <Text style={styles.recordDetailsText}>{record.details}</Text>}
                      </View>
                    </View>
                  ))}
                </View>
              </Card>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Back" onPress={onBack} variant="secondary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  noDataCard: {
    padding: 32,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  chartCard: {
    marginBottom: 16,
    padding: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartAxisText: {
    fontSize: 10,
    color: '#999',
  },
  recordsCard: {
    marginBottom: 16,
    padding: 16,
  },
  recordsList: {
    gap: 12,
  },
  recordItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 12,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recordLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recordValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  recordDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  recordDate: {
    fontSize: 14,
    color: '#999',
  },
  recordDetailsText: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Card from '../components/Card';
import type { CompletedWorkout, Exercise, WorkoutSet } from '../types';

export interface WorkoutDetailScreenProps {
  workout: CompletedWorkout;
  onBack: () => void;
}

const WorkoutDetailScreen: React.FC<WorkoutDetailScreenProps> = ({ workout, onBack }) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} Minuten`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const totalSets = workout.sets?.length || 0;
  const totalVolume =
    workout.sets?.reduce((sum: number, set: { weight?: number; reps?: number }) => {
      const weight = set.weight || 0;
      const reps = set.reps || 0;
      return sum + weight * reps;
    }, 0) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button title="← Zurück" variant="secondary" onPress={onBack} style={styles.backButton} />
        <Text style={styles.title}>Workout Details</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Date & Time Card */}
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Datum</Text>
              <Text style={styles.infoValue}>{formatDate(workout.endTime || workout.startTime)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Startzeit</Text>
              <Text style={styles.infoValue}>{formatTime(workout.startTime)}</Text>
            </View>
            {workout.endTime && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Endzeit</Text>
                  <Text style={styles.infoValue}>{formatTime(workout.endTime)}</Text>
                </View>
              </>
            )}
            {workout.duration && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Dauer</Text>
                  <Text style={styles.infoValue}>{formatDuration(workout.duration)}</Text>
                </View>
              </>
            )}
          </Card>

          {/* Statistics Card */}
          <Card style={styles.statsCard}>
            <Text style={styles.cardTitle}>Statistik</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{workout.exercises?.length || 0}</Text>
                <Text style={styles.statLabel}>Übungen</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalSets}</Text>
                <Text style={styles.statLabel}>Sätze</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalVolume.toFixed(0)}</Text>
                <Text style={styles.statLabel}>kg Volumen</Text>
              </View>
            </View>
          </Card>

          {/* Exercises Card */}
          <Card style={styles.exercisesCard}>
            <Text style={styles.cardTitle}>Übungen</Text>
            {workout.exercises && workout.exercises.length > 0 ? (
              workout.exercises.map((exercise: Exercise, index: number) => {
                const exerciseSets = workout.sets?.filter((set: WorkoutSet) => set.exerciseId === exercise._id) || [];
                const exerciseVolume = exerciseSets.reduce((sum: number, set: WorkoutSet) => {
                  const weight = set.weight || 0;
                  const reps = set.reps || 0;
                  return sum + weight * reps;
                }, 0);

                return (
                  <View key={`${exercise._id}-${index}`} style={styles.exerciseItem}>
                    <View style={styles.exerciseHeader}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseVolume}>{exerciseVolume.toFixed(0)} kg</Text>
                    </View>

                    {exerciseSets.map((set: WorkoutSet, setIndex: number) => (
                      <View key={`${set.exerciseId}-${setIndex}`} style={styles.setRow}>
                        <Text style={styles.setNumber}>Satz {setIndex + 1}</Text>
                        <View style={styles.setDetails}>
                          {set.weight !== undefined && <Text style={styles.setValue}>{set.weight} kg</Text>}
                          {set.reps !== undefined && <Text style={styles.setValue}>{set.reps} Wdh</Text>}
                          {set.time !== undefined && (
                            <Text style={styles.setValue}>
                              {Math.floor(set.time / 60)}:{String(set.time % 60).padStart(2, '0')} min
                            </Text>
                          )}
                          {set.distance !== undefined && <Text style={styles.setValue}>{set.distance} m</Text>}
                        </View>
                      </View>
                    ))}

                    {index < (workout.exercises?.length || 0) - 1 && <View style={styles.exerciseDivider} />}
                  </View>
                );
              })
            ) : (
              <Text style={styles.emptyText}>Keine Übungen aufgezeichnet</Text>
            )}
          </Card>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    gap: 12,
  },
  backButton: {
    paddingHorizontal: 12,
    minWidth: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  infoCard: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
  statsCard: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  exercisesCard: {
    padding: 20,
  },
  exerciseItem: {
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  exerciseVolume: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 6,
  },
  setNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  setDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  setValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  exerciseDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default WorkoutDetailScreen;

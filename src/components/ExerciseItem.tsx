import type React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Exercise, WorkoutSet } from '../types';
import { formatSet } from '../utils/calculations';
import Card from './Card';

export interface ExerciseItemProps {
  exercise: Exercise;
  onPress: (exercise: Exercise) => void;
  lastSet?: WorkoutSet;
  showLastSet?: boolean;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, onPress, lastSet, showLastSet = true }) => {
  const getTrackingComponents = () => {
    const components: string[] = [];

    if (exercise.trackWeight) components.push('Gewicht');
    if (exercise.trackReps) components.push('Wiederholungen');
    if (exercise.trackTime) components.push('Zeit');
    if (exercise.trackDistance) components.push('Distanz');
    if (exercise.trackNotes) components.push('Notizen');

    return components.join(', ');
  };

  return (
    <Card onPress={() => onPress(exercise)}>
      <View style={styles.header}>
        <Text style={styles.name}>{exercise.name}</Text>
        {exercise.isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Beliebt</Text>
          </View>
        )}
      </View>

      <Text style={styles.components}>Tracking: {getTrackingComponents()}</Text>

      {showLastSet && lastSet && (
        <View style={styles.lastSetContainer}>
          <Text style={styles.lastSetLabel}>Letzter Satz:</Text>
          <Text style={styles.lastSetValue}>{formatSet(lastSet)}</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  popularBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  components: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  lastSetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  lastSetLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  lastSetValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default ExerciseItem;

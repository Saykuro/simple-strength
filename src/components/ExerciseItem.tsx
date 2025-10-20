import type React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../theme';
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
    marginBottom: spacing[2],
  },
  name: {
    fontSize: typography.fontSize.xl - 1,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    flex: 1,
  },
  popularBadge: {
    backgroundColor: colors.success.main,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.lg,
  },
  popularText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  components: {
    fontSize: typography.fontSize.sm + 1,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  lastSetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  lastSetLabel: {
    fontSize: typography.fontSize.sm + 1,
    color: colors.text.secondary,
    marginRight: spacing[2],
  },
  lastSetValue: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary.main,
  },
});

export default ExerciseItem;

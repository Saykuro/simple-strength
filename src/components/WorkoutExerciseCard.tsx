import type React from 'react';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../theme';
import type { ExerciseWithLastSet, SetInput, WorkoutSet } from '../types';
import { formatSet } from '../utils/calculations';
import Button from './Button';
import Card from './Card';
import InlineSetInput from './InlineSetInput';

export interface WorkoutExerciseCardProps {
  exercise: ExerciseWithLastSet;
  sets: WorkoutSet[];
  onAddSet: (setData: SetInput) => void;
  onRemoveSet: (setId: string) => void;
  onEditSet: (setId: string, setData: SetInput) => void;
  onRemoveExercise: () => void;
}

const WorkoutExerciseCard: React.FC<WorkoutExerciseCardProps> = ({
  exercise,
  sets,
  onAddSet,
  onRemoveSet,
  onEditSet,
  onRemoveExercise,
}) => {
  const [isAddingSet, setIsAddingSet] = useState(false);
  const [editingSetId, setEditingSetId] = useState<string | null>(null);

  const handleRemoveExercise = () => {
    Alert.alert(
      'Übung entfernen',
      `Möchtest du "${exercise.name}" aus diesem Workout entfernen? Alle Sätze gehen verloren.`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Entfernen', style: 'destructive', onPress: onRemoveExercise },
      ]
    );
  };

  const handleRemoveSet = (setId: string) => {
    Alert.alert('Satz entfernen', 'Möchtest du diesen Satz wirklich entfernen?', [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Entfernen', style: 'destructive', onPress: () => onRemoveSet(setId) },
    ]);
  };

  const handleAddSetClick = () => {
    setIsAddingSet(true);
    setEditingSetId(null);
  };

  const handleEditSetClick = (setId: string) => {
    setEditingSetId(setId);
    setIsAddingSet(false);
  };

  const handleSetSubmit = (setData: SetInput) => {
    if (editingSetId) {
      onEditSet(editingSetId, setData);
    } else {
      onAddSet(setData);
    }
    setIsAddingSet(false);
    setEditingSetId(null);
  };

  const handleSetCancel = () => {
    setIsAddingSet(false);
    setEditingSetId(null);
  };

  return (
    <View style={styles.cardWrapper}>
      <Pressable style={styles.card} onPress={() => {}}>
        <View style={styles.cardContent}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>1</Text>
          </View>

          <View style={styles.textContent}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.setsSummary}>
              {sets.length} {sets.length === 1 ? 'Satz' : 'Sätze'}
              {sets.length > 0 && ` • ${formatSet(sets[0])}`}
            </Text>
          </View>

          <Pressable onPress={handleRemoveExercise} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>×</Text>
          </Pressable>
        </View>
      </Pressable>

      {/* Sets Section - expandable area */}
      <View style={styles.setsContainer}>
        {sets.map((set, index) => {
          const isEditing = editingSetId === set._id;

          if (isEditing) {
            return (
              <InlineSetInput
                key={set._id}
                exercise={exercise}
                initialValues={{
                  weight: set.weight,
                  reps: set.reps,
                  time: set.time,
                  distance: set.distance,
                  notes: set.notes,
                }}
                onSubmit={handleSetSubmit}
                onCancel={handleSetCancel}
                setNumber={index + 1}
              />
            );
          }

          return (
            <View key={set._id} style={styles.setRow}>
              <View style={styles.setInfo}>
                <Text style={styles.setNumber}>{index + 1}.</Text>
                <Text style={styles.setValue}>{formatSet(set)}</Text>
              </View>
              <View style={styles.setActions}>
                <Pressable onPress={() => handleEditSetClick(set._id)} style={styles.editButton}>
                  <Text style={styles.editButtonText}>Bearbeiten</Text>
                </Pressable>
                <Pressable onPress={() => handleRemoveSet(set._id)} style={styles.removeSetButton}>
                  <Text style={styles.removeSetButtonText}>×</Text>
                </Pressable>
              </View>
            </View>
          );
        })}

        {isAddingSet && (
          <InlineSetInput
            exercise={exercise}
            onSubmit={handleSetSubmit}
            onCancel={handleSetCancel}
            setNumber={sets.length + 1}
          />
        )}

        {sets.length === 0 && !isAddingSet && <Text style={styles.emptySets}>Noch keine Sätze hinzugefügt</Text>}

        <Button
          title="+ Satz hinzufügen"
          onPress={handleAddSetClick}
          variant="secondary"
          style={styles.addSetButton}
          disabled={isAddingSet || editingSetId !== null}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: spacing[3],
    paddingHorizontal: spacing[4],
  },
  card: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius['2xl'],
    padding: spacing[4],
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberBadge: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[4],
  },
  numberText: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  textContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  setsSummary: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.regular,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.error.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing[2],
  },
  removeButtonText: {
    color: colors.error.main,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: 24,
  },
  setsContainer: {
    marginTop: spacing[3],
    paddingHorizontal: spacing[4],
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    marginBottom: spacing[2],
  },
  setInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  setNumber: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    minWidth: 28,
  },
  setValue: {
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    flex: 1,
    fontWeight: typography.fontWeight.medium,
  },
  setActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  editButton: {
    paddingHorizontal: spacing[3] + 2,
    paddingVertical: spacing[1] + 3,
    backgroundColor: colors.info.main,
    borderRadius: borderRadius.sm,
  },
  editButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  removeSetButton: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.error.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeSetButtonText: {
    color: colors.error.main,
    fontSize: typography.fontSize.xl - 1,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 22,
  },
  emptySets: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingVertical: spacing[6],
  },
  addSetButton: {
    alignSelf: 'stretch',
    marginTop: spacing[2],
  },
});

export default WorkoutExerciseCard;

import type React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Exercise, ExerciseWithLastSet, WorkoutSet } from '../types';
import { formatSet } from '../utils/calculations';
import Button from './Button';
import Card from './Card';

export interface WorkoutExerciseCardProps {
  exercise: ExerciseWithLastSet;
  sets: WorkoutSet[];
  onAddSet: () => void;
  onRemoveSet: (setId: string) => void;
  onEditSet: (set: WorkoutSet) => void;
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

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Pressable onPress={handleRemoveExercise} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>×</Text>
          </Pressable>
        </View>

        {exercise.lastSet && (
          <View style={styles.lastSetContainer}>
            <Text style={styles.lastSetLabel}>Letztes Mal:</Text>
            <Text style={styles.lastSetValue}>{formatSet(exercise.lastSet)}</Text>
          </View>
        )}
      </View>

      <View style={styles.setsContainer}>
        <Text style={styles.setsTitle}>Sätze ({sets.length})</Text>

        {sets.map((set, index) => (
          <View key={set._id} style={styles.setRow}>
            <View style={styles.setInfo}>
              <Text style={styles.setNumber}>{index + 1}.</Text>
              <Text style={styles.setValue}>{formatSet(set)}</Text>
            </View>
            <View style={styles.setActions}>
              <Pressable onPress={() => onEditSet(set)} style={styles.editButton}>
                <Text style={styles.editButtonText}>Bearbeiten</Text>
              </Pressable>
              <Pressable onPress={() => handleRemoveSet(set._id)} style={styles.removeSetButton}>
                <Text style={styles.removeSetButtonText}>×</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {sets.length === 0 && <Text style={styles.emptySets}>Noch keine Sätze hinzugefügt</Text>}
      </View>

      <Button title="+ Satz hinzufügen" onPress={onAddSet} variant="secondary" style={styles.addSetButton} />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
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
  setsContainer: {
    marginBottom: 16,
  },
  setsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  setInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  setNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    minWidth: 24,
  },
  setValue: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  setActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 16,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  removeSetButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeSetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  emptySets: {
    fontSize: 14,
    color: '#999999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
  addSetButton: {
    alignSelf: 'stretch',
  },
});

export default WorkoutExerciseCard;

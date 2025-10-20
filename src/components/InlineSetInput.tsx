import type React from 'react';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../theme';
import type { Exercise, SetInput } from '../types';

export interface InlineSetInputProps {
  exercise: Exercise;
  initialValues?: SetInput;
  onSubmit: (setData: SetInput) => void;
  onCancel: () => void;
  setNumber: number;
}

const InlineSetInput: React.FC<InlineSetInputProps> = ({ exercise, initialValues, onSubmit, onCancel, setNumber }) => {
  const [weight, setWeight] = useState(initialValues?.weight?.toString() || '');
  const [reps, setReps] = useState(initialValues?.reps?.toString() || '');
  const [timeMinutes, setTimeMinutes] = useState(
    initialValues?.time ? Math.floor(initialValues.time / 60).toString() : ''
  );
  const [timeSeconds, setTimeSeconds] = useState(initialValues?.time ? (initialValues.time % 60).toString() : '');
  const [distance, setDistance] = useState(initialValues?.distance?.toString() || '');
  const [notes, setNotes] = useState(initialValues?.notes || '');

  const handleSubmit = () => {
    const setData: SetInput = {};

    if (exercise.trackWeight && weight) {
      setData.weight = parseFloat(weight);
    }

    if (exercise.trackReps && reps) {
      setData.reps = parseInt(reps, 10);
    }

    if (exercise.trackTime && (timeMinutes || timeSeconds)) {
      const minutes = parseInt(timeMinutes || '0', 10);
      const seconds = parseInt(timeSeconds || '0', 10);
      setData.time = minutes * 60 + seconds;
    }

    if (exercise.trackDistance && distance) {
      setData.distance = parseFloat(distance);
    }

    if (exercise.trackNotes && notes.trim()) {
      setData.notes = notes.trim();
    }

    onSubmit(setData);
  };

  const isFormValid = () => {
    // Check if at least one tracked field is filled
    if (exercise.trackWeight && !weight) return false;
    if (exercise.trackReps && !reps) return false;
    if (exercise.trackTime && !timeMinutes && !timeSeconds) return false;
    if (exercise.trackDistance && !distance) return false;

    return true;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.setNumber}>{setNumber}.</Text>
        <View style={styles.inputsContainer}>
          {exercise.trackWeight && (
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="kg"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.text.tertiary}
                autoFocus
              />
              <Text style={styles.unit}>kg</Text>
            </View>
          )}

          {exercise.trackReps && (
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                value={reps}
                onChangeText={setReps}
                placeholder="Wdh"
                keyboardType="number-pad"
                placeholderTextColor={colors.text.tertiary}
                autoFocus={!exercise.trackWeight}
              />
              <Text style={styles.unit}>Wdh</Text>
            </View>
          )}

          {exercise.trackTime && (
            <View style={styles.timeInputGroup}>
              <TextInput
                style={styles.timeInput}
                value={timeMinutes}
                onChangeText={setTimeMinutes}
                placeholder="0"
                keyboardType="number-pad"
                placeholderTextColor={colors.text.tertiary}
                maxLength={2}
              />
              <Text style={styles.timeSeparator}>:</Text>
              <TextInput
                style={styles.timeInput}
                value={timeSeconds}
                onChangeText={setTimeSeconds}
                placeholder="00"
                keyboardType="number-pad"
                placeholderTextColor={colors.text.tertiary}
                maxLength={2}
              />
            </View>
          )}

          {exercise.trackDistance && (
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                value={distance}
                onChangeText={setDistance}
                placeholder="m"
                keyboardType="number-pad"
                placeholderTextColor={colors.text.tertiary}
              />
              <Text style={styles.unit}>m</Text>
            </View>
          )}
        </View>
      </View>

      {exercise.trackNotes && (
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Notizen..."
          placeholderTextColor="#999999"
          multiline
        />
      )}

      <View style={styles.actions}>
        <Pressable onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>×</Text>
        </Pressable>
        <Pressable onPress={handleSubmit} disabled={!isFormValid()} style={styles.submitButton}>
          <Text style={[styles.submitButtonText, !isFormValid() && styles.submitButtonTextDisabled]}>✓</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.elevated,
    paddingVertical: spacing[3] + 2,
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    marginBottom: spacing[2],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2] + 2,
  },
  setNumber: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    minWidth: 28,
  },
  inputsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2] + 2,
    marginLeft: spacing[2],
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.overlay,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[3] + 2,
    paddingVertical: spacing[2] + 3,
    minWidth: 90,
  },
  input: {
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
    minWidth: 42,
    padding: 0,
  },
  unit: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    marginLeft: spacing[1] + 2,
    fontWeight: typography.fontWeight.medium,
  },
  timeInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.overlay,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[3] + 2,
    paddingVertical: spacing[2] + 3,
    gap: spacing[1] + 2,
  },
  timeInput: {
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
    minWidth: 34,
    textAlign: 'center',
    padding: 0,
  },
  timeSeparator: {
    fontSize: typography.fontSize.lg,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeight.semibold,
  },
  notesInput: {
    backgroundColor: colors.background.overlay,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[3] + 2,
    paddingVertical: spacing[2] + 3,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    minHeight: 44,
    marginBottom: spacing[2] + 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[2] + 2,
  },
  cancelButton: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: colors.error.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: colors.error.main,
    fontSize: typography.fontSize.xl - 1,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 22,
  },
  submitButton: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: colors.success.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl - 1,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 22,
  },
  submitButtonTextDisabled: {
    opacity: 0.3,
  },
});

export default InlineSetInput;

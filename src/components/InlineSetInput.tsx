import type React from 'react';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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
                placeholderTextColor="#999999"
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
                placeholderTextColor="#999999"
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
                placeholderTextColor="#999999"
                maxLength={2}
              />
              <Text style={styles.timeSeparator}>:</Text>
              <TextInput
                style={styles.timeInput}
                value={timeSeconds}
                onChangeText={setTimeSeconds}
                placeholder="00"
                keyboardType="number-pad"
                placeholderTextColor="#999999"
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
                placeholderTextColor="#999999"
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
    backgroundColor: '#F0F7FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  setNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    minWidth: 24,
  },
  inputsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginLeft: 8,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 80,
  },
  input: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
    minWidth: 40,
    padding: 0,
  },
  unit: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  timeInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 4,
  },
  timeInput: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
    padding: 0,
  },
  timeSeparator: {
    fontSize: 16,
    color: '#666666',
    fontWeight: 'bold',
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 14,
    color: '#333333',
    minHeight: 40,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  submitButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  submitButtonTextDisabled: {
    opacity: 0.5,
  },
});

export default InlineSetInput;

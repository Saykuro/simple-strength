import type React from 'react';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import type { Exercise, SetInput } from '../types';
import { formatTime } from '../utils/calculations';
import Button from './Button';
import Input from './Input';

export interface SetInputModalProps {
  visible: boolean;
  exercise: Exercise;
  onSubmit: (setData: SetInput) => void;
  onCancel: () => void;
  initialValues?: SetInput;
}

const SetInputModal: React.FC<SetInputModalProps> = ({ visible, exercise, onSubmit, onCancel, initialValues }) => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [timeMinutes, setTimeMinutes] = useState('');
  const [timeSeconds, setTimeSeconds] = useState('');
  const [distance, setDistance] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialValues) {
      setWeight(initialValues.weight?.toString() || '');
      setReps(initialValues.reps?.toString() || '');
      if (initialValues.time) {
        const minutes = Math.floor(initialValues.time / 60);
        const seconds = initialValues.time % 60;
        setTimeMinutes(minutes.toString());
        setTimeSeconds(seconds.toString());
      }
      setDistance(initialValues.distance?.toString() || '');
      setNotes(initialValues.notes || '');
    } else {
      // Reset form
      setWeight('');
      setReps('');
      setTimeMinutes('');
      setTimeSeconds('');
      setDistance('');
      setNotes('');
    }
  }, [initialValues, visible]);

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
    // Check if at least one required field is filled
    if (exercise.trackWeight && !weight) return false;
    if (exercise.trackReps && !reps) return false;
    if (exercise.trackTime && !timeMinutes && !timeSeconds) return false;
    if (exercise.trackDistance && !distance) return false;

    return true;
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onCancel}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Satz hinzufügen</Text>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
        </View>

        <View style={styles.form}>
          {exercise.trackWeight && (
            <Input
              label="Gewicht (kg)"
              value={weight}
              onChangeText={setWeight}
              placeholder="z.B. 80"
              keyboardType="numeric"
            />
          )}

          {exercise.trackReps && (
            <Input
              label="Wiederholungen"
              value={reps}
              onChangeText={setReps}
              placeholder="z.B. 10"
              keyboardType="numeric"
            />
          )}

          {exercise.trackTime && (
            <View style={styles.timeContainer}>
              <Text style={styles.timeLabel}>Zeit</Text>
              <View style={styles.timeInputs}>
                <Input
                  value={timeMinutes}
                  onChangeText={setTimeMinutes}
                  placeholder="Min"
                  keyboardType="numeric"
                  style={styles.timeInput}
                />
                <Text style={styles.timeSeparator}>:</Text>
                <Input
                  value={timeSeconds}
                  onChangeText={setTimeSeconds}
                  placeholder="Sek"
                  keyboardType="numeric"
                  style={styles.timeInput}
                />
              </View>
            </View>
          )}

          {exercise.trackDistance && (
            <Input
              label="Distanz (m)"
              value={distance}
              onChangeText={setDistance}
              placeholder="z.B. 1000"
              keyboardType="numeric"
            />
          )}

          {exercise.trackNotes && (
            <Input
              label="Notizen"
              value={notes}
              onChangeText={setNotes}
              placeholder="Optionale Notizen zu diesem Satz..."
              multiline
              numberOfLines={3}
            />
          )}
        </View>

        <View style={styles.actions}>
          <Button title="Abbrechen" variant="secondary" onPress={onCancel} style={styles.cancelButton} />

          <Button
            title="Satz hinzufügen"
            onPress={handleSubmit}
            disabled={!isFormValid()}
            style={styles.submitButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  timeContainer: {
    marginBottom: 16,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeInput: {
    flex: 1,
    marginBottom: 0,
  },
  timeSeparator: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});

export default SetInputModal;

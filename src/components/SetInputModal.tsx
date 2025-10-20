import { Picker } from '@react-native-picker/picker';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../theme';
import type { Exercise, SetInput } from '../types';
import Button from './Button';
import Input from './Input';

// Helper functions to generate picker values
const generateWeightOptions = () => {
  const options = [''];
  // 0.5 - 300 kg in 0.5kg steps
  for (let i = 0.5; i <= 300; i += 0.5) {
    options.push(i.toString());
  }
  return options;
};

const generateRepsOptions = () => {
  const options = [''];
  // 1 - 100 reps
  for (let i = 1; i <= 100; i++) {
    options.push(i.toString());
  }
  return options;
};

const generateTimeOptions = () => {
  const options = [''];
  // 0 - 59 for both minutes and seconds
  for (let i = 0; i <= 59; i++) {
    options.push(i.toString());
  }
  return options;
};

const generateDistanceOptions = () => {
  const options = [''];
  // 10 - 50000 meters in various increments
  // 10-100m: 10m steps
  for (let i = 10; i <= 100; i += 10) {
    options.push(i.toString());
  }
  // 100-1000m: 50m steps
  for (let i = 150; i <= 1000; i += 50) {
    options.push(i.toString());
  }
  // 1000-10000m: 100m steps
  for (let i = 1100; i <= 10000; i += 100) {
    options.push(i.toString());
  }
  // 10000-50000m: 500m steps
  for (let i = 10500; i <= 50000; i += 500) {
    options.push(i.toString());
  }
  return options;
};

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
  }, [initialValues]);

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

        <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
          {exercise.trackWeight && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gewicht (kg)</Text>
              {Platform.OS === 'ios' ? (
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={weight}
                    onValueChange={(itemValue) => setWeight(itemValue)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    {generateWeightOptions().map((value) => (
                      <Picker.Item key={value} label={value || 'Wählen...'} value={value} />
                    ))}
                  </Picker>
                </View>
              ) : (
                <Input value={weight} onChangeText={setWeight} placeholder="z.B. 80" keyboardType="decimal-pad" />
              )}
            </View>
          )}

          {exercise.trackReps && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Wiederholungen</Text>
              {Platform.OS === 'ios' ? (
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={reps}
                    onValueChange={(itemValue) => setReps(itemValue)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    {generateRepsOptions().map((value) => (
                      <Picker.Item key={value} label={value || 'Wählen...'} value={value} />
                    ))}
                  </Picker>
                </View>
              ) : (
                <Input value={reps} onChangeText={setReps} placeholder="z.B. 10" keyboardType="number-pad" />
              )}
            </View>
          )}

          {exercise.trackTime && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Zeit</Text>
              {Platform.OS === 'ios' ? (
                <View style={styles.timePickerRow}>
                  <View style={styles.timePickerWrapper}>
                    <Text style={styles.timePickerSubLabel}>Minuten</Text>
                    <Picker
                      selectedValue={timeMinutes}
                      onValueChange={(itemValue) => setTimeMinutes(itemValue)}
                      style={styles.timePicker}
                      itemStyle={styles.pickerItem}
                    >
                      {generateTimeOptions().map((value) => (
                        <Picker.Item key={`min-${value}`} label={value || '0'} value={value} />
                      ))}
                    </Picker>
                  </View>
                  <Text style={styles.timeSeparator}>:</Text>
                  <View style={styles.timePickerWrapper}>
                    <Text style={styles.timePickerSubLabel}>Sekunden</Text>
                    <Picker
                      selectedValue={timeSeconds}
                      onValueChange={(itemValue) => setTimeSeconds(itemValue)}
                      style={styles.timePicker}
                      itemStyle={styles.pickerItem}
                    >
                      {generateTimeOptions().map((value) => (
                        <Picker.Item key={`sec-${value}`} label={value || '0'} value={value} />
                      ))}
                    </Picker>
                  </View>
                </View>
              ) : (
                <View style={styles.timeInputRow}>
                  <Input
                    value={timeMinutes}
                    onChangeText={setTimeMinutes}
                    placeholder="Min"
                    keyboardType="number-pad"
                    style={styles.timeInput}
                  />
                  <Text style={styles.timeSeparator}>:</Text>
                  <Input
                    value={timeSeconds}
                    onChangeText={setTimeSeconds}
                    placeholder="Sek"
                    keyboardType="number-pad"
                    style={styles.timeInput}
                  />
                </View>
              )}
            </View>
          )}

          {exercise.trackDistance && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Distanz (m)</Text>
              {Platform.OS === 'ios' ? (
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={distance}
                    onValueChange={(itemValue) => setDistance(itemValue)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    {generateDistanceOptions().map((value) => (
                      <Picker.Item key={value} label={value || 'Wählen...'} value={value} />
                    ))}
                  </Picker>
                </View>
              ) : (
                <Input value={distance} onChangeText={setDistance} placeholder="z.B. 1000" keyboardType="number-pad" />
              )}
            </View>
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
        </ScrollView>

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
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
    paddingBottom: spacing[6],
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  exerciseName: {
    fontSize: typography.fontSize.xl - 1,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.semibold,
  },
  form: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    paddingBottom: spacing[6],
  },
  inputContainer: {
    marginBottom: spacing[6],
  },
  inputLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing[2],
    color: colors.text.primary,
  },
  pickerWrapper: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 180 : 50,
    width: '100%',
  },
  pickerItem: {
    fontSize: typography.fontSize.xl - 1,
    height: Platform.OS === 'ios' ? 180 : undefined,
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  timePickerWrapper: {
    flex: 1,
  },
  timePickerSubLabel: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing[1],
    color: colors.text.secondary,
    textAlign: 'center',
  },
  timePicker: {
    height: Platform.OS === 'ios' ? 140 : 50,
    width: '100%',
  },
  timeInput: {
    flex: 1,
    marginBottom: 0,
  },
  timeSeparator: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginTop: Platform.OS === 'ios' ? spacing[5] : 0,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
    paddingTop: spacing[4],
    gap: spacing[3],
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});

export default SetInputModal;

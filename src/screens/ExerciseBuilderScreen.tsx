import type React from 'react';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Input from '../components/Input';
import { useExerciseStore } from '../stores/exerciseStore';
import type { TrackingComponent } from '../types';

interface ExerciseBuilderScreenProps {
  onComplete: () => void;
  onCancel: () => void;
}

const ExerciseBuilderScreen: React.FC<ExerciseBuilderScreenProps> = ({ onComplete, onCancel }) => {
  const [exerciseName, setExerciseName] = useState('');
  const [trackingComponents, setTrackingComponents] = useState<TrackingComponent>({
    weight: false,
    reps: false,
    time: false,
    distance: false,
    notes: false,
  });

  const { addExercise, setCreating, isCreating } = useExerciseStore();

  const handleTrackingToggle = (component: keyof TrackingComponent) => {
    setTrackingComponents((prev) => ({
      ...prev,
      [component]: !prev[component],
    }));
  };

  const validateForm = (): string | null => {
    if (!exerciseName.trim()) {
      return 'Bitte gib einen Namen für die Übung ein.';
    }

    const hasAnyTracking = Object.values(trackingComponents).some(Boolean);
    if (!hasAnyTracking) {
      return 'Bitte wähle mindestens eine Tracking-Komponente aus.';
    }

    return null;
  };

  const handleCreate = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Fehler', validationError);
      return;
    }

    setCreating(true);

    try {
      const exerciseData = {
        userId: 'temp_user', // Will be replaced with real user ID
        name: exerciseName.trim(),
        trackWeight: trackingComponents.weight,
        trackReps: trackingComponents.reps,
        trackTime: trackingComponents.time,
        trackDistance: trackingComponents.distance,
        trackNotes: trackingComponents.notes,
        trackingComponents: {
          weight: trackingComponents.weight,
          reps: trackingComponents.reps,
          time: trackingComponents.time,
          distance: trackingComponents.distance,
          notes: trackingComponents.notes,
        },
      };

      addExercise(exerciseData);

      // Show success message
      Alert.alert('Erfolgreich erstellt!', `Die Übung "${exerciseName}" wurde zu deiner Bibliothek hinzugefügt.`, [
        { text: 'OK', onPress: onComplete },
      ]);
    } catch (_error) {
      Alert.alert('Fehler', 'Die Übung konnte nicht erstellt werden. Bitte versuche es erneut.');
    } finally {
      setCreating(false);
    }
  };

  const trackingOptions = [
    { key: 'weight' as const, label: 'Gewicht', description: 'Tracke das verwendete Gewicht in kg' },
    { key: 'reps' as const, label: 'Wiederholungen', description: 'Tracke die Anzahl der Wiederholungen' },
    { key: 'time' as const, label: 'Zeit', description: 'Tracke die Dauer in Sekunden' },
    { key: 'distance' as const, label: 'Distanz', description: 'Tracke die zurückgelegte Strecke' },
    { key: 'notes' as const, label: 'Notizen', description: 'Füge Notizen zu jedem Satz hinzu' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Neue Übung erstellen</Text>
        <Text style={styles.subtitle}>Definiere deine eigene Übung mit individuellen Tracking-Komponenten</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Input
          label="Name der Übung"
          value={exerciseName}
          onChangeText={setExerciseName}
          placeholder="z.B. Kniebeuge, Bankdrücken, ..."
          required
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tracking-Komponenten</Text>
          <Text style={styles.sectionSubtitle}>Wähle aus, was du bei dieser Übung tracken möchtest:</Text>

          {trackingOptions.map((option) => (
            <View key={option.key} style={styles.trackingOption}>
              <Checkbox
                label={option.label}
                checked={trackingComponents[option.key]}
                onToggle={() => handleTrackingToggle(option.key)}
              />
              <Text style={styles.trackingDescription}>{option.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Vorschau</Text>
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>{exerciseName || 'Name der Übung'}</Text>
            <Text style={styles.previewTracking}>
              Tracking:{' '}
              {Object.entries(trackingComponents)
                .filter(([_, enabled]) => enabled)
                .map(([key]) => {
                  const option = trackingOptions.find((opt) => opt.key === key);
                  return option?.label;
                })
                .join(', ') || 'Keine Komponenten ausgewählt'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Abbrechen"
          variant="secondary"
          onPress={onCancel}
          style={styles.cancelButton}
          disabled={isCreating}
        />

        <Button
          title={isCreating ? 'Erstelle...' : 'Übung erstellen'}
          onPress={handleCreate}
          style={styles.createButton}
          disabled={isCreating}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  trackingOption: {
    marginBottom: 16,
  },
  trackingDescription: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 36,
    marginTop: 4,
  },
  previewSection: {
    marginBottom: 32,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  previewTracking: {
    fontSize: 14,
    color: '#666666',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  createButton: {
    flex: 2,
  },
});

export default ExerciseBuilderScreen;

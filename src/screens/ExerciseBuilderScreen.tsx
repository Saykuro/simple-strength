import type React from 'react';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
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
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
  },
  section: {
    marginBottom: spacing[8],
  },
  sectionTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing[4],
  },
  trackingOption: {
    marginBottom: spacing[4],
  },
  trackingDescription: {
    fontSize: typography.fontSize.sm + 1,
    color: colors.text.tertiary,
    marginLeft: 36,
    marginTop: spacing[1],
  },
  previewSection: {
    marginBottom: spacing[8],
  },
  previewCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    ...shadows.sm,
  },
  previewTitle: {
    fontSize: typography.fontSize.xl - 1,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  previewTracking: {
    fontSize: typography.fontSize.sm + 1,
    color: colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
    gap: spacing[3],
  },
  cancelButton: {
    flex: 1,
  },
  createButton: {
    flex: 2,
  },
});

export default ExerciseBuilderScreen;

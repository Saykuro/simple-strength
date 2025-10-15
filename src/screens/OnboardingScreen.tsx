import type React from 'react';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import Checkbox from '../components/Checkbox';
import { POPULAR_EXERCISES } from '../constants/exercises';
import { useExerciseStore } from '../stores/exerciseStore';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedExercises, setSelectedExercises] = useState<Set<number>>(new Set());
  const { initializeWithPopularExercises } = useExerciseStore();

  const handleExerciseToggle = (index: number) => {
    const newSelected = new Set(selectedExercises);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedExercises(newSelected);
  };

  const handleComplete = () => {
    // Initialize exercises store with selected popular exercises
    const selectedExercisesList = POPULAR_EXERCISES.filter((_, index) => selectedExercises.has(index));

    if (selectedExercisesList.length > 0) {
      initializeWithPopularExercises('temp_user'); // Will be replaced with real user ID
    }

    onComplete();
  };

  const steps = [
    {
      id: 'welcome',
      title: 'Willkommen bei Simple Strength!',
      subtitle: 'Die einfachste Art, dein Training zu tracken',
      content: (
        <View style={styles.welcomeContent}>
          <View style={styles.featureItem}>
            <Text style={styles.featureNumber}>1</Text>
            <View>
              <Text style={styles.featureTitle}>Tracken</Text>
              <Text style={styles.featureDescription}>Protokolliere deine Workouts schnell und einfach</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureNumber}>2</Text>
            <View>
              <Text style={styles.featureTitle}>Bauen</Text>
              <Text style={styles.featureDescription}>Erstelle deine eigenen Übungen individuell</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureNumber}>3</Text>
            <View>
              <Text style={styles.featureTitle}>Wachsen</Text>
              <Text style={styles.featureDescription}>Verfolge deinen Fortschritt und erreiche neue Rekorde</Text>
            </View>
          </View>
        </View>
      ),
    },
    {
      id: 'exercises',
      title: 'Wähle deine Übungen',
      subtitle: 'Fülle deine Bibliothek mit beliebten Übungen',
      content: (
        <ScrollView style={styles.exerciseList} showsVerticalScrollIndicator={false}>
          {POPULAR_EXERCISES.map((exercise, index) => (
            <Card key={exercise.name} style={styles.exerciseCard}>
              <Checkbox
                label={exercise.name}
                checked={selectedExercises.has(index)}
                onToggle={() => handleExerciseToggle(index)}
              />
            </Card>
          ))}
        </ScrollView>
      ),
    },
    {
      id: 'ready',
      title: 'Bereit zum Start!',
      subtitle: `Du hast ${selectedExercises.size} Übungen ausgewählt`,
      content: (
        <View style={styles.readyContent}>
          <Text style={styles.readyText}>Du kannst jederzeit weitere Übungen hinzufügen oder eigene erstellen.</Text>
          <Text style={styles.readySubtext}>Lass uns dein erstes Workout starten!</Text>
        </View>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          {steps.map((step) => (
            <View
              key={step.id}
              style={[styles.progressDot, steps.indexOf(step) <= currentStep && styles.progressDotActive]}
            />
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{currentStepData.title}</Text>
        <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>

        <View style={styles.stepContent}>{currentStepData.content}</View>
      </View>

      <View style={styles.footer}>
        {currentStep > 0 && (
          <Button
            title="Zurück"
            variant="secondary"
            onPress={() => setCurrentStep(currentStep - 1)}
            style={styles.backButton}
          />
        )}

        <Button
          title={isLastStep ? "Los geht's!" : 'Weiter'}
          onPress={isLastStep ? handleComplete : () => setCurrentStep(currentStep + 1)}
          style={styles.nextButton}
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
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#007AFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  stepContent: {
    flex: 1,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  featureNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 40,
    marginRight: 20,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 16,
    color: '#666666',
  },
  exerciseList: {
    flex: 1,
  },
  exerciseCard: {
    marginHorizontal: 0,
    marginVertical: 4,
  },
  readyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readyText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  readySubtext: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});

export default OnboardingScreen;

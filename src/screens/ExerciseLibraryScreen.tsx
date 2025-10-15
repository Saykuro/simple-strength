import type React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import ExerciseItem from '../components/ExerciseItem';
import Input from '../components/Input';
import { useExerciseStore } from '../stores/exerciseStore';
import type { Exercise } from '../types';

interface ExerciseLibraryScreenProps {
  onSelectExercise: (exercise: Exercise) => void;
  onCreateExercise: () => void;
  selectedExercises?: Exercise[];
}

const ExerciseLibraryScreen: React.FC<ExerciseLibraryScreenProps> = ({
  onSelectExercise,
  onCreateExercise,
  selectedExercises = [],
}) => {
  const { searchQuery, setSearchQuery, getFilteredExercises, isLoading } = useExerciseStore();

  const filteredExercises = getFilteredExercises();
  const selectedExerciseIds = new Set(selectedExercises.map((e) => e._id));

  const renderExerciseItem = ({ item }: { item: Exercise }) => {
    const isSelected = selectedExerciseIds.has(item._id);

    return (
      <View style={[styles.exerciseItemContainer, isSelected && styles.selectedItem]}>
        <ExerciseItem exercise={item} onPress={onSelectExercise} showLastSet={false} />
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedText}>Ausgewählt</Text>
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>Lade Übungen...</Text>
        </View>
      );
    }

    if (searchQuery.trim() && filteredExercises.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>Keine Übungen gefunden</Text>
          <Text style={styles.emptyStateText}>Versuche einen anderen Suchbegriff oder erstelle eine neue Übung.</Text>
          <Button title="Neue Übung erstellen" onPress={onCreateExercise} style={styles.createButton} />
        </View>
      );
    }

    if (filteredExercises.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>Noch keine Übungen</Text>
          <Text style={styles.emptyStateText}>Erstelle deine erste Übung, um mit dem Training zu beginnen.</Text>
          <Button title="Erste Übung erstellen" onPress={onCreateExercise} style={styles.createButton} />
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Übungen</Text>
        <Text style={styles.subtitle}>
          {filteredExercises.length} {filteredExercises.length === 1 ? 'Übung' : 'Übungen'} verfügbar
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Übungen durchsuchen..."
          style={styles.searchInput}
        />
      </View>

      <View style={styles.actionsContainer}>
        <Button title="+ Neue Übung erstellen" onPress={onCreateExercise} style={styles.createNewButton} />
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={filteredExercises}
          renderItem={renderExerciseItem}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
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
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 0,
  },
  actionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  createNewButton: {
    alignSelf: 'flex-start',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 32,
  },
  exerciseItemContainer: {
    position: 'relative',
  },
  selectedItem: {
    opacity: 0.7,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 32,
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createButton: {
    minWidth: 200,
  },
});

export default ExerciseLibraryScreen;

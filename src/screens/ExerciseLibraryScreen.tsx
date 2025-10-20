import type React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius } from '../theme';
import Button from '../components/Button';
import ExerciseItem from '../components/ExerciseItem';
import Input from '../components/Input';
import { useExerciseStore } from '../stores/exerciseStore';
import type { Exercise } from '../types';

interface ExerciseLibraryScreenProps {
  onSelectExercise: (exercise: Exercise) => void;
  onCreateExercise: () => void;
  onBack?: () => void;
  selectedExercises?: Exercise[];
}

const ExerciseLibraryScreen: React.FC<ExerciseLibraryScreenProps> = ({
  onSelectExercise,
  onCreateExercise,
  onBack,
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
        <View style={styles.headerTop}>
          {onBack && <Button title="← Zurück" variant="secondary" onPress={onBack} style={styles.backButton} />}
          <View style={styles.headerTitles}>
            <Text style={styles.title}>Übungen</Text>
            <Text style={styles.subtitle}>
              {filteredExercises.length} {filteredExercises.length === 1 ? 'Übung' : 'Übungen'} verfügbar
            </Text>
          </View>
        </View>
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
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  backButton: {
    paddingVertical: spacing[2],
  },
  headerTitles: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  searchContainer: {
    paddingHorizontal: spacing[6],
    marginBottom: spacing[4],
  },
  searchInput: {
    marginBottom: 0,
  },
  actionsContainer: {
    paddingHorizontal: spacing[6],
    marginBottom: spacing[4],
  },
  createNewButton: {
    alignSelf: 'flex-start',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing[8],
  },
  exerciseItemContainer: {
    position: 'relative',
  },
  selectedItem: {
    opacity: 0.7,
  },
  selectedIndicator: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[8],
    backgroundColor: colors.success.main,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1] + 2,
    borderRadius: borderRadius['2xl'],
  },
  selectedText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[16],
  },
  emptyStateTitle: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  emptyStateText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing[8],
  },
  createButton: {
    minWidth: 200,
  },
});

export default ExerciseLibraryScreen;

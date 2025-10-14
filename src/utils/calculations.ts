import type { WorkoutSet } from '../types';

/**
 * Berechnet das Trainingsvolumen eines Satzes
 * Volumen = Gewicht * Wiederholungen
 * Wenn kein Gewicht getrackt wird, ist Volumen = Wiederholungen
 */
export const calculateVolume = (set: WorkoutSet): number => {
  const weight = set.weight ?? 1;
  const reps = set.reps ?? 1;
  return weight * reps;
};

/**
 * Berechnet das geschätzte 1-Rep-Max nach der Epley-Formel
 * 1RM = Gewicht * (1 + Wiederholungen / 30)
 */
export const calculateOneRepMax = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
};

/**
 * Formatiert die Zeit in Sekunden zu MM:SS Format
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Formatiert die Distanz in Metern zu einer lesbaren Form
 */
export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${meters} m`;
};

/**
 * Formatiert das Gewicht zu einer lesbaren Form
 */
export const formatWeight = (weight: number): string => {
  return `${weight} kg`;
};

/**
 * Berechnet die Gesamtdauer eines Workouts in Sekunden
 */
export const calculateWorkoutDuration = (startTime: number, endTime?: number): number => {
  if (!endTime) return 0;
  return Math.floor((endTime - startTime) / 1000);
};

/**
 * Formatiert eine Trainingseinheit für die Anzeige
 */
export const formatSet = (set: WorkoutSet): string => {
  const parts: string[] = [];

  if (set.weight) parts.push(`${set.weight} kg`);
  if (set.reps) parts.push(`${set.reps} ${set.reps === 1 ? 'Wdh' : 'Wdh'}`);
  if (set.time) parts.push(formatTime(set.time));
  if (set.distance) parts.push(formatDistance(set.distance));

  return parts.join(' × ');
};

/**
 * Überprüft ob ein neuer Rekord erreicht wurde
 */
export const isNewRecord = (currentValue: number, previousRecord?: number): boolean => {
  return !previousRecord || currentValue > previousRecord;
};

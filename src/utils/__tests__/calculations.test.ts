import type { WorkoutSet } from '../../types';
import {
  calculateOneRepMax,
  calculateVolume,
  calculateWorkoutDuration,
  formatDistance,
  formatSet,
  formatTime,
  formatWeight,
  isNewRecord,
} from '../calculations';

describe('Calculations Utils', () => {
  describe('calculateVolume', () => {
    it('should calculate volume correctly with weight and reps', () => {
      const set: WorkoutSet = {
        _id: 'test-1',
        _creationTime: Date.now(),
        workoutId: 'workout-1',
        exerciseId: 'exercise-1',
        weight: 80,
        reps: 10,
        order: 0,
      };

      expect(calculateVolume(set)).toBe(800);
    });

    it('should default weight to 1 if not provided', () => {
      const set: WorkoutSet = {
        _id: 'test-1',
        _creationTime: Date.now(),
        workoutId: 'workout-1',
        exerciseId: 'exercise-1',
        reps: 10,
        order: 0,
      };

      expect(calculateVolume(set)).toBe(10);
    });

    it('should default reps to 1 if not provided', () => {
      const set: WorkoutSet = {
        _id: 'test-1',
        _creationTime: Date.now(),
        workoutId: 'workout-1',
        exerciseId: 'exercise-1',
        weight: 80,
        order: 0,
      };

      expect(calculateVolume(set)).toBe(80);
    });
  });

  describe('calculateOneRepMax', () => {
    it('should return weight if reps is 1', () => {
      expect(calculateOneRepMax(100, 1)).toBe(100);
    });

    it('should calculate 1RM using Epley formula', () => {
      const result = calculateOneRepMax(80, 10);
      const expected = Math.round(80 * (1 + 10 / 30));
      expect(result).toBe(expected);
    });

    it('should round result to nearest integer', () => {
      const result = calculateOneRepMax(75, 8);
      expect(result).toBe(Math.round(75 * (1 + 8 / 30)));
    });
  });

  describe('formatTime', () => {
    it('should format seconds to MM:SS format', () => {
      expect(formatTime(65)).toBe('01:05');
      expect(formatTime(120)).toBe('02:00');
      expect(formatTime(599)).toBe('09:59');
    });

    it('should handle zero seconds', () => {
      expect(formatTime(0)).toBe('00:00');
    });

    it('should pad single digits with zeros', () => {
      expect(formatTime(5)).toBe('00:05');
      expect(formatTime(60)).toBe('01:00');
    });
  });

  describe('formatDistance', () => {
    it('should format meters when less than 1000', () => {
      expect(formatDistance(500)).toBe('500 m');
      expect(formatDistance(999)).toBe('999 m');
    });

    it('should format kilometers when 1000 or more', () => {
      expect(formatDistance(1000)).toBe('1.0 km');
      expect(formatDistance(2500)).toBe('2.5 km');
      expect(formatDistance(10000)).toBe('10.0 km');
    });
  });

  describe('formatWeight', () => {
    it('should format weight with kg unit', () => {
      expect(formatWeight(80)).toBe('80 kg');
      expect(formatWeight(125.5)).toBe('125.5 kg');
    });
  });

  describe('calculateWorkoutDuration', () => {
    it('should calculate duration correctly', () => {
      const startTime = Date.now();
      const endTime = startTime + 3600000; // 1 hour later

      expect(calculateWorkoutDuration(startTime, endTime)).toBe(3600);
    });

    it('should return 0 if no end time', () => {
      expect(calculateWorkoutDuration(Date.now())).toBe(0);
    });
  });

  describe('formatSet', () => {
    it('should format set with weight and reps', () => {
      const set: WorkoutSet = {
        _id: 'test-1',
        _creationTime: Date.now(),
        workoutId: 'workout-1',
        exerciseId: 'exercise-1',
        weight: 80,
        reps: 10,
        order: 0,
      };

      expect(formatSet(set)).toBe('80 kg × 10 Wdh');
    });

    it('should format set with time', () => {
      const set: WorkoutSet = {
        _id: 'test-1',
        _creationTime: Date.now(),
        workoutId: 'workout-1',
        exerciseId: 'exercise-1',
        time: 120,
        order: 0,
      };

      expect(formatSet(set)).toBe('02:00');
    });

    it('should format set with multiple components', () => {
      const set: WorkoutSet = {
        _id: 'test-1',
        _creationTime: Date.now(),
        workoutId: 'workout-1',
        exerciseId: 'exercise-1',
        distance: 1000,
        time: 300,
        order: 0,
      };

      expect(formatSet(set)).toBe('05:00 × 1.0 km');
    });
  });

  describe('isNewRecord', () => {
    it('should return true for first record', () => {
      expect(isNewRecord(100)).toBe(true);
    });

    it('should return true if current value is higher', () => {
      expect(isNewRecord(120, 100)).toBe(true);
    });

    it('should return false if current value is lower or equal', () => {
      expect(isNewRecord(100, 120)).toBe(false);
      expect(isNewRecord(100, 100)).toBe(false);
    });
  });
});

import type { Id } from '../../convex/_generated/dataModel';

export interface User {
  _id: Id<'users'>;
  clerkId: string;
  name: string;
  email: string;
  createdAt: number;
}

export interface Exercise {
  _id: Id<'exercises'>;
  userId: Id<'users'>;
  name: string;
  trackingComponents: {
    weight: boolean;
    reps: boolean;
    time: boolean;
    distance: boolean;
    notes: boolean;
  };
  createdAt: number;
  isArchived: boolean;
}

export interface Workout {
  _id: Id<'workouts'>;
  userId: Id<'users'>;
  name?: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  createdAt: number;
}

export interface Set {
  _id: Id<'sets'>;
  workoutId: Id<'workouts'>;
  exerciseId: Id<'exercises'>;
  weight?: number;
  reps?: number;
  time?: number;
  distance?: number;
  notes?: string;
  createdAt: number;
  order: number;
}

export interface WorkoutWithSets extends Workout {
  sets: (Set & { exercise?: Exercise })[];
}

// Helper types for form inputs
export interface CreateExerciseInput {
  name: string;
  trackingComponents: Exercise['trackingComponents'];
}

export interface CreateSetInput {
  exerciseId: Id<'exercises'>;
  weight?: number;
  reps?: number;
  time?: number;
  distance?: number;
  notes?: string;
}

export interface CreateWorkoutInput {
  name?: string;
}

// Popular exercises for onboarding
export const POPULAR_EXERCISES: Omit<CreateExerciseInput, 'userId'>[] = [
  {
    name: 'Bankdrücken',
    trackingComponents: { weight: true, reps: true, time: false, distance: false, notes: false },
  },
  {
    name: 'Kniebeugen',
    trackingComponents: { weight: true, reps: true, time: false, distance: false, notes: false },
  },
  {
    name: 'Kreuzheben',
    trackingComponents: { weight: true, reps: true, time: false, distance: false, notes: false },
  },
  {
    name: 'Schulterdrücken',
    trackingComponents: { weight: true, reps: true, time: false, distance: false, notes: false },
  },
  {
    name: 'Klimmzüge',
    trackingComponents: { weight: false, reps: true, time: false, distance: false, notes: false },
  },
  {
    name: 'Liegestütze',
    trackingComponents: { weight: false, reps: true, time: false, distance: false, notes: false },
  },
  {
    name: 'Bizeps-Curls',
    trackingComponents: { weight: true, reps: true, time: false, distance: false, notes: false },
  },
  {
    name: 'Trizeps-Dips',
    trackingComponents: { weight: false, reps: true, time: false, distance: false, notes: false },
  },
  {
    name: 'Plank',
    trackingComponents: { weight: false, reps: false, time: true, distance: false, notes: false },
  },
  {
    name: 'Laufen',
    trackingComponents: { weight: false, reps: false, time: true, distance: true, notes: false },
  },
  {
    name: 'Rudern',
    trackingComponents: { weight: true, reps: true, time: false, distance: false, notes: false },
  },
  {
    name: 'Lat-Ziehen',
    trackingComponents: { weight: true, reps: true, time: false, distance: false, notes: false },
  },
  {
    name: 'Beinpresse',
    trackingComponents: { weight: true, reps: true, time: false, distance: false, notes: false },
  },
  {
    name: 'Bauchmuskeltraining',
    trackingComponents: { weight: false, reps: true, time: false, distance: false, notes: false },
  },
  {
    name: 'Burpees',
    trackingComponents: { weight: false, reps: true, time: false, distance: false, notes: false },
  },
];
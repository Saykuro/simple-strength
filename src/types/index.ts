export interface Exercise {
  _id: string;
  _creationTime: number;
  userId: string;
  name: string;
  trackWeight: boolean;
  trackReps: boolean;
  trackTime: boolean;
  trackDistance: boolean;
  trackNotes: boolean;
  isPopular?: boolean;
  trackingComponents: {
    weight: boolean;
    reps: boolean;
    time: boolean;
    distance: boolean;
    notes: boolean;
  };
}

export interface WorkoutSet {
  _id: string;
  _creationTime: number;
  workoutId: string;
  exerciseId: string;
  weight?: number;
  reps?: number;
  time?: number; // in seconds
  distance?: number; // in meters
  notes?: string;
  order: number;
}

export interface Workout {
  _id: string;
  _creationTime: number;
  userId: string;
  name?: string;
  startTime: number;
  endTime?: number;
  duration?: number; // in seconds
}

export interface PersonalRecord {
  _id: string;
  _creationTime: number;
  userId: string;
  exerciseId: string;
  type: 'max_weight' | 'max_reps' | 'max_volume' | 'max_one_rep_max';
  value: number;
  achievedAt: number;
  workoutSetId: string;
}

export interface TrackingComponent {
  weight: boolean;
  reps: boolean;
  time: boolean;
  distance: boolean;
  notes: boolean;
}

export interface SetInput {
  weight?: number;
  reps?: number;
  time?: number;
  distance?: number;
  notes?: string;
}

export interface ExerciseWithLastSet extends Exercise {
  lastSet?: WorkoutSet;
}

export interface WorkoutWithSets extends Workout {
  sets?: WorkoutSet[];
  exercises?: Exercise[];
}

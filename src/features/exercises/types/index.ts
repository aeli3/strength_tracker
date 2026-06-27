export const MUSCLE_GROUPS = [
  'All',
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Core',
  'Legs',
  'Glutes',
  'Cardio',
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];
export type TargetMuscleGroup = Exclude<MuscleGroup, 'All'>;

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: TargetMuscleGroup;
}

export interface ExerciseSection {
  title: MuscleGroup;
  data: Exercise[];
}

export interface ExerciseSet {
  id?: string;
  weight: number;
  reps: number;
}

export interface ExerciseSession {
  id: string;
  exerciseId: string;
  dateLabel: string;
  loggedAt: string;
  sets: ExerciseSet[];
  isPr?: boolean;
}

export interface ExerciseHomeStats {
  weeklySessions: number;
  streakDays: number;
  prsThisMonth: number;
}

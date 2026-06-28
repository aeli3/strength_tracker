import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { createExercise, getExercises } from '../services/exercise-session-store';
import type { Exercise, TargetMuscleGroup } from '../types';

interface ExercisesState {
  exercises: Exercise[];
  loading: boolean;
  error: Error | undefined;
  addExercise: (input: { name: string; muscleGroup: TargetMuscleGroup }) => Promise<Exercise>;
}

export function useExercises(): ExercisesState {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      async function load() {
        try {
          const nextExercises = await getExercises();

          if (mounted) {
            setExercises(nextExercises);
            setError(undefined);
          }
        } catch (caught) {
          if (mounted) {
            setError(caught instanceof Error ? caught : new Error('Unable to load exercises'));
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }

      load();

      return () => {
        mounted = false;
      };
    }, []),
  );

  const addExercise = useCallback(async (input: { name: string; muscleGroup: TargetMuscleGroup }) => {
    const exercise = await createExercise(input);
    setExercises(current =>
      [...current, exercise].sort((a, b) => a.name.localeCompare(b.name)),
    );
    return exercise;
  }, []);

  return { exercises, loading, error, addExercise };
}

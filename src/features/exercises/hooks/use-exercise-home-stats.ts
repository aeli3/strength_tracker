import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { getExerciseHomeStats } from '../services/exercise-session-store';
import type { ExerciseHomeStats } from '../types';

interface ExerciseHomeStatsState {
  stats: ExerciseHomeStats;
  loading: boolean;
  error: Error | undefined;
}

const EMPTY_STATS: ExerciseHomeStats = {
  weeklySessions: 0,
  streakDays: 0,
  prsThisMonth: 0,
};

export function useExerciseHomeStats(): ExerciseHomeStatsState {
  const [stats, setStats] = useState<ExerciseHomeStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      async function load() {
        try {
          const nextStats = await getExerciseHomeStats();

          if (mounted) {
            setStats(nextStats);
            setError(undefined);
          }
        } catch (caught) {
          if (mounted) {
            setError(caught instanceof Error ? caught : new Error('Unable to load home stats'));
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

  return { stats, loading, error };
}

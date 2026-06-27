import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  createExerciseSession,
  deleteExerciseSession,
  getExerciseSessions,
} from '../services/exercise-session-store';
import type { ExerciseSession, ExerciseSet } from '../types';
import { sortSessions } from '../utils/session-stats';

interface ExerciseSessionsState {
  sessions: ExerciseSession[];
  loading: boolean;
  error: Error | undefined;
  saveSession: (set: Omit<ExerciseSet, 'id'>) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
}

export function useExerciseSessions(exerciseId: string): ExerciseSessionsState {
  const [sessions, setSessions] = useState<ExerciseSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const refresh = useCallback(async () => {
    try {
      const nextSessions = await getExerciseSessions(exerciseId);
      setSessions(nextSessions);
      setError(undefined);
    } catch (caught) {
      setError(caught instanceof Error ? caught : new Error('Unable to load sessions'));
    } finally {
      setLoading(false);
    }
  }, [exerciseId]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const nextSessions = await getExerciseSessions(exerciseId);

        if (mounted) {
          setSessions(nextSessions);
          setError(undefined);
        }
      } catch (caught) {
        if (mounted) {
          setError(caught instanceof Error ? caught : new Error('Unable to load sessions'));
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
  }, [exerciseId]);

  const saveSession = useCallback(
    async (set: Omit<ExerciseSet, 'id'>) => {
      await createExerciseSession(exerciseId, set);
      await refresh();
    },
    [exerciseId, refresh],
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      await deleteExerciseSession(sessionId);
      await refresh();
    },
    [refresh],
  );

  return useMemo(
    () => ({
      sessions: sortSessions(sessions),
      loading,
      error,
      saveSession,
      deleteSession,
    }),
    [deleteSession, error, loading, saveSession, sessions],
  );
}

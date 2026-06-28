import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import { Fonts } from '@/constants/theme';
import { LogSessionFormScreen } from '@/features/exercises/components/log-session-form-screen';
import { useExerciseSessions } from '@/features/exercises/hooks/use-exercise-sessions';
import { getExerciseById } from '@/features/exercises/services/exercise-session-store';
import type { Exercise } from '@/features/exercises/types';
import { getBestSet, getFirstSet, getTopSet } from '@/features/exercises/utils/session-stats';
import { useTheme } from '@/hooks/use-theme';

export default function LogEditRoute() {
  const colors = useTheme();
  const { exerciseId, sessionId } = useLocalSearchParams<{ exerciseId: string; sessionId: string }>();
  const [exercise, setExercise] = useState<Exercise | undefined>();
  const { sessions, editSession } = useExerciseSessions(exerciseId ?? '');
  const session = sessions.find(item => item.id === sessionId);
  const bestSet = useMemo(() => getBestSet(sessions), [sessions]);
  const recentSet = useMemo(() => getFirstSet(sessions), [sessions]);
  const initialSet = session ? getTopSet(session) : undefined;

  useEffect(() => {
    let mounted = true;

    async function loadExercise() {
      if (!exerciseId) {
        setExercise(undefined);
        return;
      }

      const nextExercise = await getExerciseById(exerciseId);

      if (mounted) {
        setExercise(nextExercise);
      }
    }

    loadExercise();

    return () => {
      mounted = false;
    };
  }, [exerciseId]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Log',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { fontFamily: Fonts?.sans, color: colors.text },
          headerTintColor: colors.accent,
        }}
      />
      {exercise && session && initialSet ? (
        <LogSessionFormScreen
          exercise={exercise}
          bestSet={bestSet}
          recentSet={recentSet}
          initialSet={initialSet}
          onSave={set => editSession(session.id, set)}
        />
      ) : null}
    </>
  );
}

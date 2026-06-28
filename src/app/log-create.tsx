import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import { Fonts } from '@/constants/theme';
import { LogSessionFormScreen } from '@/features/exercises/components/log-session-form-screen';
import { useExerciseSessions } from '@/features/exercises/hooks/use-exercise-sessions';
import { getExerciseById } from '@/features/exercises/services/exercise-session-store';
import type { Exercise } from '@/features/exercises/types';
import { getBestSet, getFirstSet } from '@/features/exercises/utils/session-stats';
import { useTheme } from '@/hooks/use-theme';

export default function LogCreateRoute() {
  const colors = useTheme();
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const [exercise, setExercise] = useState<Exercise | undefined>();
  const { sessions, saveSession } = useExerciseSessions(exerciseId ?? '');
  const bestSet = useMemo(() => getBestSet(sessions), [sessions]);
  const recentSet = useMemo(() => getFirstSet(sessions), [sessions]);

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
          title: 'New Log',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { fontFamily: Fonts?.sans, color: colors.text },
          headerTintColor: colors.accent,
        }}
      />
      {exercise ? (
        <LogSessionFormScreen
          exercise={exercise}
          bestSet={bestSet}
          recentSet={recentSet}
          onSave={saveSession}
        />
      ) : null}
    </>
  );
}

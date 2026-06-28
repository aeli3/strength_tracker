import { Stack, useFocusEffect, useLocalSearchParams, router } from 'expo-router';
import { useCallback, useState } from 'react';

import { useTheme } from '@/hooks/use-theme';
import { Fonts } from '@/constants/theme';
import { ExerciseDetailScreen } from '@/features/exercises/components/exercise-detail-screen';
import { getExerciseById } from '@/features/exercises/services/exercise-session-store';
import type { Exercise } from '@/features/exercises/types';

export default function ExerciseScreen() {
  const colors = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | undefined>();

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      async function loadExercise() {
        if (!id) {
          setExercise(undefined);
          return;
        }

        setExercise(undefined);
        const nextExercise = await getExerciseById(id);

        if (mounted) {
          if (!nextExercise) {
            router.replace('/');
            return;
          }

          setExercise(nextExercise);
        }
      }

      loadExercise();

      return () => {
        mounted = false;
      };
    }, [id]),
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: exercise?.name ?? 'Exercise',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { fontFamily: Fonts?.sans, color: colors.text },
          headerTintColor: '#007AFF',
          headerShown: false,
        }}
      />
      {exercise ? <ExerciseDetailScreen exercise={exercise} /> : null}
    </>
  );
}

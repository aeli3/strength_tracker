import { Stack, useLocalSearchParams } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import { Fonts } from '@/constants/theme';
import { ALL_EXERCISES } from '@/features/exercises/data/exercises';
import { ExerciseDetailScreen } from '@/features/exercises/components/exercise-detail-screen';

export default function ExerciseScreen() {
  const colors = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = ALL_EXERCISES.find(e => e.id === id);

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

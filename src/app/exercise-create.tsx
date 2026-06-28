import { Stack } from 'expo-router';

import { Fonts } from '@/constants/theme';
import { ExerciseFormScreen } from '@/features/exercises/components/exercise-form-screen';
import { useExercises } from '@/features/exercises/hooks/use-exercises';
import { useTheme } from '@/hooks/use-theme';

export default function ExerciseCreateRoute() {
  const colors = useTheme();
  const { exercises, addExercise } = useExercises();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'New Exercise',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { fontFamily: Fonts?.sans, color: colors.text },
          headerTintColor: colors.accent,
        }}
      />
      <ExerciseFormScreen exercises={exercises} onSave={addExercise} />
    </>
  );
}

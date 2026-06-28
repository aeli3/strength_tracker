import { Stack, useLocalSearchParams } from 'expo-router';

import { Fonts } from '@/constants/theme';
import { ExerciseFormScreen } from '@/features/exercises/components/exercise-form-screen';
import { useExercises } from '@/features/exercises/hooks/use-exercises';
import { useTheme } from '@/hooks/use-theme';

export default function ExerciseEditRoute() {
  const colors = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { exercises, editExercise } = useExercises();
  const exercise = exercises.find(item => item.id === id);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Exercise',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { fontFamily: Fonts?.sans, color: colors.text },
          headerTintColor: colors.accent,
        }}
      />
      {exercise ? (
        <ExerciseFormScreen
          exercises={exercises}
          initialExercise={exercise}
          onSave={input => editExercise(exercise.id, input)}
        />
      ) : null}
    </>
  );
}

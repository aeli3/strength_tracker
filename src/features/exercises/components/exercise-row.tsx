import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { ExerciseIconColors, Fonts, Spacing, Typography } from '@/constants/theme';
import { useTheme, useThemePreference } from '@/hooks/use-theme';
import type { Exercise } from '../types';

interface ExerciseRowProps {
  exercise: Exercise;
  onPress: (exercise: Exercise) => void;
  showSeparator?: boolean;
}

export function ExerciseRow({ exercise, onPress, showSeparator = true }: ExerciseRowProps) {
  const colors = useTheme();
  const { resolvedTheme } = useThemePreference();
  const iconColors = getExerciseIconColors(exercise.id, ExerciseIconColors[resolvedTheme]);
  const initials = getExerciseInitials(exercise.name);

  return (
    <AnimatedPressable
      onPress={() => onPress(exercise)}
      android_ripple={{ color: colors.backgroundSelected }}
      pressedOpacity={0.9}
      style={[
        styles.card,
        {
          backgroundColor: colors.backgroundElement,
          borderColor: colors.backgroundSelected,
          marginBottom: showSeparator ? Spacing.two : Spacing.three,
        },
      ]}
    >
      <View style={[styles.iconBlock, { backgroundColor: iconColors.background }]}>
        <Text style={[styles.iconText, { color: iconColors.text, fontFamily: Fonts?.rounded }]}>
          {initials}
        </Text>
      </View>

      <View style={styles.copy}>
        <Text
          style={[styles.name, { color: colors.text, fontFamily: Fonts?.sans }]}
          numberOfLines={1}
        >
          {exercise.name}
        </Text>
        <Text
          style={[styles.muscles, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}
          numberOfLines={1}
        >
          {exercise.muscleGroup}
        </Text>
      </View>

      <SymbolView
        name={{ ios: 'chevron.right' }}
        size={13}
        tintColor={colors.textSecondary}
        fallback={<Text style={[styles.chevronText, { color: colors.textSecondary }]}>{'>'}</Text>}
      />

    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 74,
    marginHorizontal: Spacing.four,
    padding: Spacing.twoAndHalf,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.three,
  },
  iconBlock: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    ...Typography.label,
  },
  muscles: {
    ...Typography.smallLabel,
    marginTop: Spacing.half,
  },
  chevronText: {
    fontSize: 16,
    lineHeight: 20,
  },
});

function getExerciseInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

function getExerciseIconColors<T extends readonly { background: string; text: string }[]>(
  id: string,
  palette: T,
) {
  const hash = id.split('').reduce((total, char) => total + char.charCodeAt(0), 0);

  return palette[hash % palette.length];
}

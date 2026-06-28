import { StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { ChevronIcon } from '@/components/ui/chevron-icon';
import { ExerciseIconColors, Fonts, Spacing, Typography } from '@/constants/theme';
import { useTheme, useThemePreference } from '@/hooks/use-theme';
import type { Exercise } from '../types';

interface ExerciseRowProps {
  exercise: Exercise;
  onPress: (exercise: Exercise) => void;
  onLongPress?: (exercise: Exercise) => void;
  onPressStateChange?: (exercise: Exercise, active: boolean) => void;
  selected?: boolean;
  showSeparator?: boolean;
}

export function ExerciseRow({
  exercise,
  onPress,
  onLongPress,
  onPressStateChange,
  selected = false,
  showSeparator = true,
}: ExerciseRowProps) {
  const colors = useTheme();
  const { resolvedTheme } = useThemePreference();
  const iconColors = getExerciseIconColors(exercise.id, ExerciseIconColors[resolvedTheme]);
  const initials = getExerciseInitials(exercise.name);

  return (
    <AnimatedPressable
      onPress={() => onPress(exercise)}
      onLongPress={() => onLongPress?.(exercise)}
      onPressIn={() => onPressStateChange?.(exercise, true)}
      onPressOut={() => onPressStateChange?.(exercise, false)}
      android_ripple={{ color: colors.backgroundSelected }}
      pressedOpacity={0.82}
      pressedScale={0.985}
      style={[
        styles.card,
        {
          backgroundColor: selected ? colors.backgroundSelected : colors.backgroundElement,
          borderColor: selected ? colors.accent : colors.backgroundSelected,
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

      <View style={styles.chevronSlot}>
        <ChevronIcon direction="right" size={13} color={colors.textSecondary} />
      </View>
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
  chevronSlot: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
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

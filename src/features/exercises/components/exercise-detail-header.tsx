import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { ChevronIcon } from '@/components/ui/chevron-icon';
import { Fonts, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Exercise } from '../types';

interface ExerciseDetailHeaderProps {
  exercise: Exercise;
}

export function ExerciseDetailHeader({ exercise }: ExerciseDetailHeaderProps) {
  const colors = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: colors.backgroundElement }]}>
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={() => router.back()}
        hitSlop={8}
        pressedScale={0.9}
        android_ripple={{ color: colors.backgroundSelected, borderless: true }}
        style={styles.backButton}
      >
        <ChevronIcon direction="left" size={17} color={colors.textSecondary} />
      </AnimatedPressable>
      <Text style={[styles.headerTitle, { color: colors.text, fontFamily: Fonts?.sans }]} numberOfLines={1}>
        {exercise.name}
      </Text>
      <View style={[styles.musclePill, { backgroundColor: colors.backgroundSelected }]}>
        <Text style={[styles.muscleText, { color: colors.accent, fontFamily: Fonts?.sans }]}>
          {exercise.muscleGroup}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -Spacing.two,
  },
  headerTitle: {
    ...Typography.label,
    flex: 1,
  },
  musclePill: {
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  muscleText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
  },
});

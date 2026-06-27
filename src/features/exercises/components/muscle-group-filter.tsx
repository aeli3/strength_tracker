import { Keyboard, ScrollView, StyleSheet, Text } from 'react-native';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Spacing, Typography } from '@/constants/theme';
import { MUSCLE_GROUPS } from '../data/exercises';
import type { MuscleGroup } from '../types';

const MUSCLE_GROUP_ICONS: Record<MuscleGroup, { fallback: string; symbol: SFSymbol }> = {
  All: { fallback: 'A', symbol: 'circle.grid.3x3.fill' },
  Chest: { fallback: 'C', symbol: 'heart.fill' },
  Back: { fallback: 'B', symbol: 'arrow.left.and.right' },
  Shoulders: { fallback: 'S', symbol: 'arrow.up.left.and.arrow.down.right' },
  Arms: { fallback: 'A', symbol: 'bolt.fill' },
  Core: { fallback: 'C', symbol: 'circle.grid.hex.fill' },
  Legs: { fallback: 'L', symbol: 'arrow.up.and.down' },
  Glutes: { fallback: 'G', symbol: 'star.fill' },
  Cardio: { fallback: 'M', symbol: 'heart.fill' },
};

interface MuscleGroupFilterProps {
  selected: MuscleGroup;
  onSelect: (group: MuscleGroup) => void;
}

export function MuscleGroupFilter({ selected, onSelect }: MuscleGroupFilterProps) {
  const colors = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
    >
      {MUSCLE_GROUPS.map(group => {
        const isSelected = selected === group;
        const icon = MUSCLE_GROUP_ICONS[group];
        return (
          <AnimatedPressable
            key={group}
            onPress={() => {
              Keyboard.dismiss();
              onSelect(group);
            }}
            android_ripple={{ color: colors.backgroundSelected }}
            pressedScale={0.95}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.accent : colors.backgroundElement,
                opacity: isSelected ? 1 : 0.96,
              },
            ]}
          >
            <Animated.View
              layout={LinearTransition.duration(180)}
              style={[
                styles.iconBadge,
                {
                  backgroundColor: isSelected ? colors.accentText : colors.backgroundSelected,
                },
              ]}
            >
              <SymbolView
                name={{ ios: icon.symbol }}
                size={12}
                tintColor={isSelected ? colors.accent : colors.textSecondary}
                fallback={
                  <Text
                    style={[
                      styles.iconFallback,
                      { color: isSelected ? colors.accent : colors.textSecondary },
                    ]}
                  >
                    {icon.fallback}
                  </Text>
                }
              />
            </Animated.View>
            <Text
              style={[
                styles.chipText,
                {
                  color: isSelected ? colors.accentText : colors.text,
                  fontFamily: Fonts?.sans,
                },
              ]}
            >
              {group}
            </Text>
          </AnimatedPressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.two,
    gap: Spacing.two,
  },
  chip: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    justifyContent: 'center',
    paddingLeft: Spacing.two,
    paddingRight: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 17,
  },
  iconBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconFallback: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '700',
  },
  chipText: {
    ...Typography.smallLabel,
  },
});

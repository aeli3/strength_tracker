import { Platform, StyleSheet, Text } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface AddExerciseButtonProps {
  onPress: () => void;
}

export function AddExerciseButton({ onPress }: AddExerciseButtonProps) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom + Spacing.three, Spacing.four);

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel="Add exercise"
      onPress={onPress}
      android_ripple={{ color: colors.backgroundSelected }}
      pressedOpacity={0.86}
      pressedScale={0.94}
      style={[
        styles.button,
        {
          backgroundColor: colors.accent,
          bottom: bottomOffset,
          shadowColor: colors.text,
        },
      ]}
    >
      {Platform.OS === 'ios' ? (
        <SymbolView name="plus" size={22} tintColor={colors.accentText} />
      ) : (
        <Text style={[styles.fallback, { color: colors.accentText }]}>+</Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: Spacing.four,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 8,
  },
  fallback: {
    ...Typography.title,
    lineHeight: 32,
  },
});

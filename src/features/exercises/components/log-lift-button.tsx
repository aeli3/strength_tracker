import { SymbolView } from 'expo-symbols';
import { Platform, StyleSheet, Text } from 'react-native';

import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { Fonts, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface LogLiftButtonProps {
  onPress: () => void;
}

export function LogLiftButton({ onPress }: LogLiftButtonProps) {
  const colors = useTheme();

  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPress={onPress}
      android_ripple={{ color: colors.backgroundSelected }}
      pressedOpacity={0.82}
      pressedScale={0.97}
      style={[styles.button, { backgroundColor: colors.accent }]}
    >
      {Platform.OS === 'ios' ? (
        <SymbolView name="plus" size={15} tintColor={colors.accentText} />
      ) : (
        <Text style={[styles.plusText, { color: colors.accentText }]}>+</Text>
      )}
      <Text style={[styles.text, { color: colors.accentText, fontFamily: Fonts?.sans }]}>
        Add
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    gap: Spacing.two,
  },
  plusText: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '600',
  },
  text: {
    ...Typography.smallLabel,
    fontWeight: '600',
  },
});

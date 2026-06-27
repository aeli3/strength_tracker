import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextStyle } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Spacing, Typography } from '@/constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const webInputStyle =
  Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : undefined;

export function SearchBar({ value, onChangeText, placeholder = 'Search exercises' }: SearchBarProps) {
  const colors = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundElement }]}>
      {Platform.OS === 'ios' && (
        <SymbolView name="magnifyingglass" size={16} tintColor={colors.textSecondary} />
      )}

      <TextInput
        style={[
          styles.input,
          webInputStyle,
          { color: colors.text, fontFamily: Fonts?.sans },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {Platform.OS !== 'ios' && value.length > 0 && (
        <AnimatedPressable onPress={() => onChangeText('')} hitSlop={8} pressedScale={0.9}>
          <Text style={[styles.clearText, { color: colors.textSecondary }]}>x</Text>
        </AnimatedPressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: 11,
    gap: Spacing.two,
  },
  input: {
    ...Typography.label,
    flex: 1,
    padding: 0,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

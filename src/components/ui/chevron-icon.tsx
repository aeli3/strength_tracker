import { Platform, StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

interface ChevronIconProps {
  color: string;
  direction: 'left' | 'right';
  size?: number;
}

export function ChevronIcon({ color, direction, size = 14 }: ChevronIconProps) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name={direction === 'left' ? 'chevron.left' : 'chevron.right'}
        size={size}
        tintColor={color}
      />
    );
  }

  return (
    <View
      style={[
        styles.chevron,
        {
          width: size * 0.58,
          height: size * 0.58,
          borderColor: color,
          borderTopWidth: Math.max(1.6, size * 0.14),
          borderRightWidth: Math.max(1.6, size * 0.14),
          transform: [{ rotate: direction === 'left' ? '-135deg' : '45deg' }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  chevron: {
    borderRadius: 1,
  },
});

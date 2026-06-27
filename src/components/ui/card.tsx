import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, style }: CardProps) {
  const colors = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.backgroundElement,
          borderColor: colors.backgroundSelected,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 18,
    padding: Spacing.twoAndHalf,
  },
});

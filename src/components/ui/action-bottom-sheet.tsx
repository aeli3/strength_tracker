import {
  BottomSheet,
  BottomSheetView,
  type BottomSheetMethods,
} from '@expo/ui/community/bottom-sheet';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { AnimatedPressable } from './animated-pressable';

interface ActionBottomSheetProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  actions: ActionSheetItem[];
}

interface ActionSheetItem {
  id: string;
  title: string;
  icon: ComponentProps<typeof SymbolView>['name'];
  destructive?: boolean;
  onPress: () => void;
}

const CLOSE_DELAY_MS = Platform.OS === 'web' ? 260 : 0;

export function ActionBottomSheet({ visible, title, onClose, actions }: ActionBottomSheetProps) {
  if (!visible) {
    return null;
  }

  return <ActionBottomSheetContent title={title} actions={actions} onClose={onClose} />;
}

function ActionBottomSheetContent({
  title,
  actions,
  onClose,
}: Omit<ActionBottomSheetProps, 'visible'>) {
  const colors = useTheme();
  const sheetRef = useRef<BottomSheetMethods>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeRequestedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleClose = useCallback(() => {
    if (closeRequestedRef.current) {
      return;
    }

    closeRequestedRef.current = true;

    if (CLOSE_DELAY_MS === 0) {
      onClose();
      return;
    }

    closeTimeoutRef.current = setTimeout(onClose, CLOSE_DELAY_MS);
  }, [onClose]);

  function runAction(action: ActionSheetItem) {
    action.onPress();

    if (sheetRef.current) {
      sheetRef.current.close();
    } else {
      onClose();
    }
  }

  return (
    <BottomSheet
      ref={sheetRef}
      enablePanDownToClose
      onClose={handleClose}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{ backgroundColor: colors.textSecondary }}
    >
      <BottomSheetView
        style={[
          styles.sheet,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.backgroundElement,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.text, fontFamily: Fonts?.rounded }]}>
          {title}
        </Text>

        <View style={styles.actions}>
          {actions.map(action => {
            const textColor = action.destructive ? '#FF3B30' : colors.text;

            return (
              <AnimatedPressable
                key={action.id}
                accessibilityRole="button"
                onPress={() => runAction(action)}
                android_ripple={{ color: colors.backgroundSelected }}
                pressedOpacity={0.86}
                pressedScale={0.98}
                style={[styles.actionRow, { backgroundColor: colors.backgroundElement }]}
              >
                {Platform.OS === 'ios' ? (
                  <SymbolView name={action.icon} size={18} tintColor={textColor} />
                ) : (
                  <Text style={[styles.fallbackIcon, { color: textColor }]}>
                    {action.destructive ? '-' : '+'}
                  </Text>
                )}
                <Text style={[styles.actionText, { color: textColor, fontFamily: Fonts?.sans }]}>
                  {action.title}
                </Text>
              </AnimatedPressable>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.twoAndHalf,
    paddingBottom: Spacing.four,
  },
  title: {
    ...Typography.label,
    marginBottom: Spacing.two,
  },
  actions: {
    gap: Spacing.two,
  },
  actionRow: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  fallbackIcon: {
    width: 18,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  actionText: {
    ...Typography.smallLabel,
    fontWeight: '600',
  },
});

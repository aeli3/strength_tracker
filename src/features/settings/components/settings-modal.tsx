import { BottomSheet, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useCallback, useEffect, useRef } from 'react';

import { ThemeSwitch } from '@/components/ui/theme-switch';
import { Fonts, Spacing, Typography } from '@/constants/theme';
import { useTheme, useThemePreference } from '@/hooks/use-theme';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SHEET_CLOSE_DELAY_MS = Platform.OS === 'web' ? 260 : 0;

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  if (!visible) {
    return null;
  }

  return <SettingsModalContent onClose={onClose} />;
}

function SettingsModalContent({ onClose }: Pick<SettingsModalProps, 'onClose'>) {
  const colors = useTheme();
  const { resolvedTheme, setPreference } = useThemePreference();
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

    if (SHEET_CLOSE_DELAY_MS === 0) {
      onClose();
      return;
    }

    closeTimeoutRef.current = setTimeout(onClose, SHEET_CLOSE_DELAY_MS);
  }, [onClose]);

  return (
    <BottomSheet
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
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text, fontFamily: Fonts?.rounded }]}>
            Settings
          </Text>
        </View>

        <View style={[styles.row, { backgroundColor: colors.backgroundElement }]}>
          <Text style={[styles.label, { color: colors.text, fontFamily: Fonts?.sans }]}>
            Dark Mode
          </Text>
          <ThemeSwitch
            value={resolvedTheme === 'dark'}
            onValueChange={enabled => setPreference(enabled ? 'dark' : 'light')}
          />
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
  header: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  title: {
    ...Typography.label,
  },
  closeButton: {
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
  },
  closeText: {
    ...Typography.smallLabel,
    fontWeight: '600',
  },
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  label: {
    ...Typography.label,
    flex: 1,
  },
});

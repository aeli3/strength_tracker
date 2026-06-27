import {
  BottomSheet,
  BottomSheetTextInput,
  BottomSheetView,
  type BottomSheetMethods,
} from '@expo/ui/community/bottom-sheet';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { Fonts, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ExerciseSet } from '../types';
import { formatWeight } from '../utils/session-stats';

interface LogLiftSheetProps {
  visible: boolean;
  bestSet: ExerciseSet | undefined;
  recentSet: ExerciseSet | undefined;
  onClose: () => void;
  onSave: (set: Omit<ExerciseSet, 'id'>) => void | Promise<void>;
}

const SHEET_CLOSE_DELAY_MS = Platform.OS === 'web' ? 260 : 0;

export function LogLiftSheet({ visible, bestSet, recentSet, onClose, onSave }: LogLiftSheetProps) {
  if (!visible) {
    return null;
  }

  return (
    <LogLiftSheetContent
      bestSet={bestSet}
      recentSet={recentSet}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

function LogLiftSheetContent({ bestSet, recentSet, onClose, onSave }: Omit<LogLiftSheetProps, 'visible'>) {
  const colors = useTheme();
  const sheetRef = useRef<BottomSheetMethods>(null);
  const [weight, setWeight] = useState(recentSet ? String(recentSet.weight) : '');
  const [reps, setReps] = useState(recentSet ? String(recentSet.reps) : '');
  const [saving, setSaving] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeRequestedRef = useRef(false);
  const parsedWeight = Number(weight);
  const bestWeight = bestSet?.weight ?? 0;
  const prDelta = Number.isFinite(parsedWeight) ? parsedWeight - bestWeight : 0;
  const isNewPr = prDelta > 0;

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

  async function handleSave() {
    if (saving) {
      return;
    }

    const nextWeight = Number(weight);
    const nextReps = Number(reps);

    if (!Number.isFinite(nextWeight) || !Number.isFinite(nextReps) || nextWeight <= 0 || nextReps <= 0) {
      return;
    }

    try {
      setSaving(true);
      await onSave({ weight: nextWeight, reps: Math.round(nextReps) });
      if (sheetRef.current) {
        sheetRef.current.close();
      } else {
        onClose();
      }
    } catch {
      setSaving(false);
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
          Add
        </Text>
        <Text style={[styles.reference, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
          {bestSet ? (
            <>
              Beat your best:{' '}
              <Text style={{ color: colors.accent, fontWeight: '600' }}>
                {formatWeight(bestSet.weight)} kg x {bestSet.reps}
              </Text>
            </>
          ) : (
            'Log your first session'
          )}
        </Text>

        <View style={styles.inputRow}>
          <NumberField label="Weight" value={weight} onChangeText={setWeight} />
          <NumberField label="Reps" value={reps} onChangeText={setReps} />
        </View>

        {isNewPr && (
          <Animated.View
            entering={FadeInDown.duration(180)}
            exiting={FadeOutUp.duration(140)}
            layout={LinearTransition.duration(180)}
            style={[
              styles.prHint,
              {
                backgroundColor: colors.backgroundSelected,
                borderColor: colors.accent,
              },
            ]}
          >
            <Text style={[styles.prHintTitle, { color: colors.text, fontFamily: Fonts?.sans }]}>
              New PR! +{formatWeight(prDelta)} kg
            </Text>
            <Text
              style={[
                styles.prHintText,
                { color: colors.textSecondary, fontFamily: Fonts?.sans },
              ]}
            >
              Your best is about to get better.
            </Text>
          </Animated.View>
        )}

        <AnimatedPressable
          accessibilityRole="button"
          onPress={handleSave}
          android_ripple={{ color: colors.backgroundSelected }}
          disabled={saving}
          pressedOpacity={0.82}
          pressedScale={0.98}
          style={[styles.saveButton, { backgroundColor: colors.accent, opacity: saving ? 0.7 : 1 }]}
        >
          <Text style={[styles.saveText, { color: colors.accentText, fontFamily: Fonts?.sans }]}>
            {saving ? 'Saving' : 'Save session'}
          </Text>
        </AnimatedPressable>

        <AnimatedPressable
          accessibilityRole="button"
          onPress={handleSave}
          disabled={saving}
          hitSlop={8}
          pressedScale={0.98}
          style={styles.skipButton}
        >
          <Text style={[styles.skipText, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
            Did not beat it - log anyway
          </Text>
        </AnimatedPressable>
      </BottomSheetView>
    </BottomSheet>
  );
}

interface NumberFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}

function NumberField({ label, value, onChangeText }: NumberFieldProps) {
  const colors = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
        {label.toUpperCase()}
      </Text>
      <BottomSheetTextInput
        keyboardType="decimal-pad"
        inputMode="decimal"
        selectTextOnFocus
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          {
            backgroundColor: colors.backgroundElement,
            borderColor: focused ? colors.accent : colors.backgroundSelected,
            color: colors.text,
            fontFamily: Fonts?.sans,
          },
        ]}
      />
    </View>
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
    marginBottom: Spacing.half,
  },
  reference: {
    ...Typography.smallLabel,
    fontWeight: '400',
    marginBottom: Spacing.twoAndHalf,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.twoAndHalf,
  },
  field: {
    flex: 1,
  },
  fieldLabel: {
    ...Typography.sectionLabel,
    fontWeight: '500',
    marginBottom: Spacing.one,
  },
  input: {
    ...Typography.label,
    minHeight: 42,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    textAlign: 'center',
  },
  prHint: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: Spacing.twoAndHalf,
    paddingVertical: Spacing.two,
    marginBottom: Spacing.twoAndHalf,
  },
  prHintTitle: {
    ...Typography.smallLabel,
  },
  prHintText: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: Spacing.half,
  },
  saveButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: Spacing.two,
  },
  saveText: {
    ...Typography.smallLabel,
    fontWeight: '600',
  },
  skipButton: {
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    fontSize: 12,
    lineHeight: 16,
  },
});

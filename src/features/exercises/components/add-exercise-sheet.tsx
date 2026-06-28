import {
  BottomSheet,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
  type BottomSheetMethods,
} from '@expo/ui/community/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { Fonts, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MUSCLE_GROUPS } from '../data/exercises';
import type { Exercise, TargetMuscleGroup } from '../types';

interface AddExerciseSheetProps {
  visible: boolean;
  exercises: Exercise[];
  onClose: () => void;
  onSave: (input: { name: string; muscleGroup: TargetMuscleGroup }) => void | Promise<void>;
}

const SHEET_CLOSE_DELAY_MS = Platform.OS === 'web' ? 260 : 0;
const TARGET_GROUPS = MUSCLE_GROUPS.filter(
  (group): group is TargetMuscleGroup => group !== 'All',
);

export function AddExerciseSheet({ visible, exercises, onClose, onSave }: AddExerciseSheetProps) {
  if (!visible) {
    return null;
  }

  return (
    <AddExerciseSheetContent
      exercises={exercises}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

function AddExerciseSheetContent({
  exercises,
  onClose,
  onSave,
}: Omit<AddExerciseSheetProps, 'visible'>) {
  const colors = useTheme();
  const sheetRef = useRef<BottomSheetMethods>(null);
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<TargetMuscleGroup>('Chest');
  const [focused, setFocused] = useState(false);
  const [groupStripActive, setGroupStripActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const groupStripTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeRequestedRef = useRef(false);
  const trimmedName = name.trim();
  const duplicate = useMemo(
    () =>
      exercises.some(
        exercise =>
          exercise.muscleGroup === muscleGroup &&
          exercise.name.trim().toLowerCase() === trimmedName.toLowerCase(),
      ),
    [exercises, muscleGroup, trimmedName],
  );
  const canSave = trimmedName.length > 1 && !duplicate && !saving;

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      if (groupStripTimeoutRef.current) {
        clearTimeout(groupStripTimeoutRef.current);
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

  function setGroupStripGestureActive(active: boolean) {
    if (groupStripTimeoutRef.current) {
      clearTimeout(groupStripTimeoutRef.current);
    }

    if (active) {
      setGroupStripActive(true);
      return;
    }

    groupStripTimeoutRef.current = setTimeout(() => setGroupStripActive(false), 140);
  }

  async function handleSave() {
    if (saving) {
      return;
    }

    if (trimmedName.length <= 1) {
      setError('Add a longer name');
      return;
    }

    if (duplicate) {
      setError('Already in this muscle group');
      return;
    }

    try {
      setSaving(true);
      setError(undefined);
      await onSave({ name: trimmedName, muscleGroup });
      if (sheetRef.current) {
        sheetRef.current.close();
      } else {
        onClose();
      }
    } catch {
      setSaving(false);
      setError('Could not save exercise');
    }
  }

  return (
    <BottomSheet
      ref={sheetRef}
      enablePanDownToClose={!groupStripActive}
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
          New exercise
        </Text>

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
            NAME
          </Text>
          <BottomSheetTextInput
            autoFocus
            autoCapitalize="words"
            returnKeyType="done"
            value={name}
            onChangeText={value => {
              setName(value);
              setError(undefined);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onSubmitEditing={handleSave}
            placeholder="e.g. Hack squat"
            placeholderTextColor={`${colors.textSecondary}99`}
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

        <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
          MUSCLE GROUP
        </Text>
        <BottomSheetScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.groupRow}
          keyboardShouldPersistTaps="always"
          nestedScrollEnabled
          onTouchStart={() => setGroupStripGestureActive(true)}
          onTouchEnd={() => setGroupStripGestureActive(false)}
          onTouchCancel={() => setGroupStripGestureActive(false)}
          onScrollBeginDrag={() => setGroupStripGestureActive(true)}
          onScrollEndDrag={() => setGroupStripGestureActive(false)}
          onMomentumScrollEnd={() => setGroupStripGestureActive(false)}
        >
          {TARGET_GROUPS.map(group => {
            const selected = group === muscleGroup;

            return (
              <AnimatedPressable
                key={group}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  setMuscleGroup(group);
                  setError(undefined);
                }}
                android_ripple={{ color: colors.backgroundSelected }}
                pressedScale={0.96}
                style={[
                  styles.groupChip,
                  {
                    backgroundColor: selected ? colors.accent : colors.backgroundElement,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.groupText,
                    {
                      color: selected ? colors.accentText : colors.text,
                      fontFamily: Fonts?.sans,
                    },
                  ]}
                >
                  {group}
                </Text>
              </AnimatedPressable>
            );
          })}
        </BottomSheetScrollView>

        <View style={styles.footer}>
          <Text style={[styles.errorText, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
            {error ?? ' '}
          </Text>

          <AnimatedPressable
            accessibilityRole="button"
            accessibilityLabel="Save exercise"
            onPress={handleSave}
            android_ripple={{ color: colors.backgroundSelected }}
            disabled={!canSave}
            pressedOpacity={0.82}
            pressedScale={0.98}
            style={[
              styles.saveButton,
              { backgroundColor: colors.accent, opacity: canSave ? 1 : 0.45 },
            ]}
          >
            <Text style={[styles.saveText, { color: colors.accentText, fontFamily: Fonts?.sans }]}>
              {saving ? 'Saving' : 'Add exercise'}
            </Text>
          </AnimatedPressable>
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
    ...Typography.sheetTitle,
    marginBottom: Spacing.three,
  },
  field: {
    marginBottom: Spacing.three,
  },
  fieldLabel: {
    ...Typography.sectionLabel,
    marginBottom: Spacing.one,
  },
  input: {
    ...Typography.label,
    minHeight: 46,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  groupRow: {
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  groupChip: {
    minHeight: 36,
    justifyContent: 'center',
    borderRadius: 18,
    paddingHorizontal: Spacing.three,
  },
  groupText: {
    ...Typography.smallLabel,
    fontWeight: '600',
  },
  footer: {
    paddingTop: Spacing.two,
  },
  errorText: {
    ...Typography.smallLabel,
    minHeight: 20,
    marginBottom: Spacing.two,
  },
  saveButton: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  saveText: {
    ...Typography.smallLabel,
    fontWeight: '600',
  },
});

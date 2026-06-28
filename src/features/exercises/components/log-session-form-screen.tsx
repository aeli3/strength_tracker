import { router } from 'expo-router';
import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { Fonts, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Exercise, ExerciseSet } from '../types';
import { formatWeight } from '../utils/session-stats';

interface LogSessionFormScreenProps {
  exercise: Exercise;
  bestSet: ExerciseSet | undefined;
  recentSet: ExerciseSet | undefined;
  initialSet?: ExerciseSet;
  onSave: (set: Omit<ExerciseSet, 'id'>) => Promise<void>;
}

export function LogSessionFormScreen({
  exercise,
  bestSet,
  recentSet,
  initialSet,
  onSave,
}: LogSessionFormScreenProps) {
  const colors = useTheme();
  const startingSet = initialSet ?? recentSet;
  const [weight, setWeight] = useState(startingSet ? String(startingSet.weight) : '');
  const [reps, setReps] = useState(startingSet ? String(startingSet.reps) : '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const parsedWeight = Number(weight);
  const parsedReps = Number(reps);
  const bestWeight = bestSet?.weight ?? 0;
  const prDelta = Number.isFinite(parsedWeight) ? parsedWeight - bestWeight : 0;
  const isNewPr = !initialSet && prDelta > 0;
  const canSave = Number.isFinite(parsedWeight) && Number.isFinite(parsedReps) && parsedWeight > 0 && parsedReps > 0 && !saving;

  async function handleSave() {
    Keyboard.dismiss();

    if (saving) {
      return;
    }

    const nextWeight = Number(weight);
    const nextReps = Number(reps);

    if (!Number.isFinite(nextWeight) || !Number.isFinite(nextReps) || nextWeight <= 0 || nextReps <= 0) {
      setError('Add weight and reps');
      return;
    }

    try {
      setSaving(true);
      setError(undefined);
      await onSave({ weight: nextWeight, reps: Math.round(nextReps) });
      router.back();
    } catch {
      setSaving(false);
      setError('Could not save log');
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.inner}>
              <Text style={[styles.eyebrow, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
                {exercise.name.toUpperCase()}
              </Text>
              <Text style={[styles.title, { color: colors.text, fontFamily: Fonts?.rounded }]}>
                {initialSet ? 'Edit log' : 'New log'}
              </Text>
              <Text style={[styles.reference, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
                {bestSet ? (
                  <>
                    Best:{' '}
                    <Text style={{ color: colors.accent, fontWeight: '600' }}>
                      {formatWeight(bestSet.weight)} kg x {bestSet.reps}
                    </Text>
                  </>
                ) : (
                  'Log your first session'
                )}
              </Text>

              <View style={styles.inputRow}>
                <NumberField
                  label="Weight"
                  value={weight}
                  onChangeText={value => {
                    setWeight(value);
                    setError(undefined);
                  }}
                />
                <NumberField
                  label="Reps"
                  value={reps}
                  onChangeText={value => {
                    setReps(value);
                    setError(undefined);
                  }}
                />
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
                  <Text style={[styles.prHintText, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
                    Your best is about to get better.
                  </Text>
                </Animated.View>
              )}

              <Text style={[styles.errorText, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
                {error ?? ' '}
              </Text>

              <AnimatedPressable
                accessibilityRole="button"
                onPress={handleSave}
                android_ripple={{ color: colors.backgroundSelected }}
                disabled={!canSave}
                pressedOpacity={0.82}
                pressedScale={0.98}
                style={[styles.saveButton, { backgroundColor: colors.accent, opacity: canSave ? 1 : 0.45 }]}
              >
                <Text style={[styles.saveText, { color: colors.accentText, fontFamily: Fonts?.sans }]}>
                  {saving ? 'Saving' : initialSet ? 'Save changes' : 'Save session'}
                </Text>
              </AnimatedPressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
      <TextInput
        autoFocus={label === 'Weight'}
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
  safeArea: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.four,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  eyebrow: {
    ...Typography.sectionLabel,
    marginBottom: Spacing.one,
  },
  title: {
    ...Typography.title,
  },
  reference: {
    ...Typography.smallLabel,
    fontWeight: '400',
    marginTop: Spacing.one,
    marginBottom: Spacing.five,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.two,
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
    ...Typography.title,
    minHeight: 76,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    textAlign: 'center',
  },
  prHint: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoAndHalf,
    marginTop: Spacing.three,
  },
  prHintTitle: {
    ...Typography.smallLabel,
  },
  prHintText: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: Spacing.half,
  },
  errorText: {
    ...Typography.smallLabel,
    minHeight: 20,
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  saveButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  saveText: {
    ...Typography.smallLabel,
    fontWeight: '600',
  },
});

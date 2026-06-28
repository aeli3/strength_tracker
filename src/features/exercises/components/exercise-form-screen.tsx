import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { Fonts, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MUSCLE_GROUPS } from '../data/exercises';
import type { Exercise, TargetMuscleGroup } from '../types';

interface ExerciseFormScreenProps {
  exercises: Exercise[];
  initialExercise?: Exercise;
  onSave: (input: { name: string; muscleGroup: TargetMuscleGroup }) => Promise<unknown>;
}

const TARGET_GROUPS = MUSCLE_GROUPS.filter(
  (group): group is TargetMuscleGroup => group !== 'All',
);

export function ExerciseFormScreen({ exercises, initialExercise, onSave }: ExerciseFormScreenProps) {
  const colors = useTheme();
  const [name, setName] = useState(initialExercise?.name ?? '');
  const [muscleGroup, setMuscleGroup] = useState<TargetMuscleGroup>(
    initialExercise?.muscleGroup ?? 'Chest',
  );
  const [focused, setFocused] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const trimmedName = name.trim();
  const duplicate = useMemo(
    () =>
      exercises.some(
        exercise =>
          exercise.id !== initialExercise?.id &&
          exercise.muscleGroup === muscleGroup &&
          exercise.name.trim().toLowerCase() === trimmedName.toLowerCase(),
      ),
    [exercises, initialExercise?.id, muscleGroup, trimmedName],
  );
  const canSave = trimmedName.length > 1 && !duplicate && !saving;
  const title = initialExercise ? 'Edit exercise' : 'New exercise';

  async function handleSave() {
    Keyboard.dismiss();

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
      router.back();
    } catch {
      setSaving(false);
      setError('Could not save exercise');
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inner}>
              <Text style={[styles.eyebrow, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
                EXERCISE
              </Text>
              <Text style={[styles.title, { color: colors.text, fontFamily: Fonts?.rounded }]}>
                {title}
              </Text>

              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
                  NAME
                </Text>
                <TextInput
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
              <View style={styles.groupRow}>
                {TARGET_GROUPS.map(group => {
                  const selected = group === muscleGroup;

                  return (
                    <AnimatedPressable
                      key={group}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => {
                        Keyboard.dismiss();
                        setMuscleGroup(group);
                        setError(undefined);
                      }}
                      android_ripple={{ color: colors.backgroundSelected }}
                      pressedScale={0.96}
                      style={[
                        styles.groupChip,
                        { backgroundColor: selected ? colors.accent : colors.backgroundElement },
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
              </View>

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
                style={[styles.saveButton, { backgroundColor: colors.accent, opacity: canSave ? 1 : 0.45 }]}
              >
                <Text style={[styles.saveText, { color: colors.accentText, fontFamily: Fonts?.sans }]}>
                  {saving ? 'Saving' : initialExercise ? 'Save changes' : 'Add exercise'}
                </Text>
              </AnimatedPressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    flexGrow: 1,
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
    marginBottom: Spacing.five,
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
    minHeight: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  groupRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  groupChip: {
    minHeight: 38,
    justifyContent: 'center',
    borderRadius: 19,
    paddingHorizontal: Spacing.three,
  },
  groupText: {
    ...Typography.smallLabel,
    fontWeight: '600',
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

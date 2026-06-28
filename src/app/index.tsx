import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Keyboard, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionBottomSheet } from '@/components/ui/action-bottom-sheet';
import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { Fonts, Spacing, Typography } from '@/constants/theme';
import { AddExerciseButton } from '@/features/exercises/components/add-exercise-button';
import { ExerciseSectionList } from '@/features/exercises/components/exercise-section-list';
import { HomeStatsBar } from '@/features/exercises/components/home-stats-bar';
import { MuscleGroupFilter } from '@/features/exercises/components/muscle-group-filter';
import { SearchBar } from '@/features/exercises/components/search-bar';
import { useExerciseFilter } from '@/features/exercises/hooks/use-exercise-filter';
import { useExerciseHomeStats } from '@/features/exercises/hooks/use-exercise-home-stats';
import { useExercises } from '@/features/exercises/hooks/use-exercises';
import type { Exercise, MuscleGroup } from '@/features/exercises/types';
import { SettingsModal } from '@/features/settings/components/settings-modal';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const colors = useTheme();
  const { exercises, removeExercise } = useExercises();
  const { query, setQuery, selectedGroup, setSelectedGroup, sections } = useExerciseFilter(exercises);
  const { stats, loading: statsLoading } = useExerciseHomeStats();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [activeExerciseId, setActiveExerciseId] = useState<string | undefined>();
  const [actionExercise, setActionExercise] = useState<Exercise | undefined>();

  function handleExercisePress(exercise: Exercise) {
    Keyboard.dismiss();
    router.push({ pathname: '/exercise/[id]', params: { id: exercise.id } });
  }

  function handleExerciseLongPress(exercise: Exercise) {
    Keyboard.dismiss();
    setActionExercise(exercise);
    setActiveExerciseId(exercise.id);
  }

  function handleGroupSelect(group: MuscleGroup) {
    Keyboard.dismiss();
    setSelectedGroup(group);
  }

  function handleAddExercisePress() {
    Keyboard.dismiss();
    router.push('/exercise-create');
  }

  function handleExercisePressStateChange(exercise: Exercise, active: boolean) {
    setActiveExerciseId(current => {
      if (active) {
        return exercise.id;
      }

      return current === exercise.id ? undefined : current;
    });
  }

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
              Strength Tracker
            </Text>
            <Text style={[styles.title, { color: colors.text, fontFamily: Fonts?.rounded }]}>
              Exercises
            </Text>
          </View>

          <AnimatedPressable
            accessibilityRole="button"
            accessibilityLabel="Open settings"
            hitSlop={8}
            onPress={() => {
              Keyboard.dismiss();
              setSettingsVisible(true);
            }}
            android_ripple={{ color: colors.backgroundSelected, borderless: false }}
            pressedScale={0.94}
            style={[
              styles.settingsButton,
              {
                backgroundColor: colors.backgroundElement,
              },
            ]}
          >
            {Platform.OS === 'ios' ? (
              <SymbolView name="gearshape" size={18} tintColor={colors.text} />
            ) : (
              <Text style={[styles.settingsText, { color: colors.text }]}>...</Text>
            )}
          </AnimatedPressable>
        </View>

        <HomeStatsBar stats={stats} loading={statsLoading} />

        <View style={styles.searchWrapper}>
          <SearchBar value={query} onChangeText={setQuery} />
        </View>
      </View>

      <View style={styles.filterWrapper}>
        <MuscleGroupFilter selected={selectedGroup} onSelect={handleGroupSelect} />
      </View>

      <ExerciseSectionList
        sections={sections}
        onExercisePress={handleExercisePress}
        onExerciseLongPress={handleExerciseLongPress}
        onExercisePressStateChange={handleExercisePressStateChange}
        onListTouchStart={Keyboard.dismiss}
        selectedExerciseId={actionExercise?.id ?? activeExerciseId}
      />

      <AddExerciseButton onPress={handleAddExercisePress} />

      <ActionBottomSheet
        visible={Boolean(actionExercise)}
        title={actionExercise?.name ?? 'Exercise'}
        onClose={() => {
          setActionExercise(undefined);
          setActiveExerciseId(undefined);
        }}
        actions={[
          {
            id: 'edit',
            title: 'Edit exercise',
            icon: 'pencil',
            onPress: () => {
              Keyboard.dismiss();
              if (actionExercise) {
                router.push({ pathname: '/exercise-edit', params: { id: actionExercise.id } });
              }
            },
          },
          {
            id: 'delete',
            title: 'Delete exercise',
            icon: 'trash',
            destructive: true,
            onPress: () => {
              Keyboard.dismiss();
              if (actionExercise) {
                void removeExercise(actionExercise.id);
                setQuery('');
              }
            },
          },
        ]}
      />

      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.three,
  },
  titleRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  eyebrow: {
    ...Typography.eyebrow,
    marginBottom: Spacing.one,
  },
  title: {
    ...Typography.title,
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  settingsText: {
    ...Typography.body,
    fontWeight: '700',
    paddingBottom: 6,
  },
  searchWrapper: {
    minHeight: 46,
  },
  filterWrapper: {
    paddingBottom: Spacing.three,
  },
});

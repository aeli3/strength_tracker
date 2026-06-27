import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { Fonts, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { SearchBar } from '@/features/exercises/components/search-bar';
import { MuscleGroupFilter } from '@/features/exercises/components/muscle-group-filter';
import { ExerciseSectionList } from '@/features/exercises/components/exercise-section-list';
import { HomeStatsBar } from '@/features/exercises/components/home-stats-bar';
import { useExerciseFilter } from '@/features/exercises/hooks/use-exercise-filter';
import { useExerciseHomeStats } from '@/features/exercises/hooks/use-exercise-home-stats';
import { SettingsModal } from '@/features/settings/components/settings-modal';
import type { Exercise } from '@/features/exercises/types';

export default function HomeScreen() {
  const colors = useTheme();
  const { query, setQuery, selectedGroup, setSelectedGroup, sections } = useExerciseFilter();
  const { stats, loading: statsLoading } = useExerciseHomeStats();
  const [settingsVisible, setSettingsVisible] = useState(false);

  function handleExercisePress(exercise: Exercise) {
    router.push({ pathname: '/exercise/[id]', params: { id: exercise.id } });
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
            onPress={() => setSettingsVisible(true)}
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
        <MuscleGroupFilter selected={selectedGroup} onSelect={setSelectedGroup} />
      </View>

      <ExerciseSectionList sections={sections} onExercisePress={handleExercisePress} />

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
  },
  searchWrapper: {
    minHeight: 46,
  },
  filterWrapper: {
    paddingBottom: Spacing.three,
  },
});

import { SectionList, StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';
import { BottomTabInset, Fonts, Spacing, Typography } from '@/constants/theme';
import type { Exercise, ExerciseSection } from '../types';
import { ExerciseRow } from './exercise-row';

interface ExerciseSectionListProps {
  sections: ExerciseSection[];
  onExercisePress: (exercise: Exercise) => void;
}

export function ExerciseSectionList({ sections, onExercisePress }: ExerciseSectionListProps) {
  const colors = useTheme();

  return (
    <SectionList<Exercise, ExerciseSection>
      sections={sections}
      keyExtractor={item => item.id}
      stickySectionHeadersEnabled
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
      style={[styles.list, { backgroundColor: colors.background }]}
      renderSectionHeader={({ section }) => (
        <Animated.View
          entering={FadeIn.duration(180)}
          layout={LinearTransition.duration(180)}
          style={[styles.sectionHeader, { backgroundColor: colors.background }]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textSecondary, fontFamily: Fonts?.sans },
            ]}
          >
            {section.title.toUpperCase()}
          </Text>
        </Animated.View>
      )}
      renderItem={({ item, index, section }) => (
        <Animated.View
          entering={FadeInDown.duration(180).delay(Math.min(index * 18, 120))}
          layout={LinearTransition.duration(190)}
        >
          <ExerciseRow
            exercise={item}
            onPress={onExercisePress}
            showSeparator={index < section.data.length - 1}
          />
        </Animated.View>
      )}
      ListEmptyComponent={
        <Animated.View entering={FadeIn.duration(180)} style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
            No exercises found
          </Text>
        </Animated.View>
      }
      contentContainerStyle={styles.contentContainer}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  sectionTitle: {
    ...Typography.sectionLabel,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: Spacing.six,
  },
  emptyText: {
    ...Typography.label,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: BottomTabInset + Spacing.six,
  },
});

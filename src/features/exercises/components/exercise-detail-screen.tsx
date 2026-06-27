import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useExerciseSessions } from '../hooks/use-exercise-sessions';
import type { Exercise, ExerciseSet } from '../types';
import {
  getBestDate,
  getBestSet,
  getFirstSet,
  getPrCountThisMonth,
} from '../utils/session-stats';
import { ExerciseBestCard } from './exercise-best-card';
import { ExerciseDetailHeader } from './exercise-detail-header';
import { ExerciseSessionTimeline } from './exercise-session-timeline';
import { LogLiftButton } from './log-lift-button';
import { LogLiftSheet } from './log-lift-sheet';

interface ExerciseDetailScreenProps {
  exercise: Exercise;
}

export function ExerciseDetailScreen({ exercise }: ExerciseDetailScreenProps) {
  const colors = useTheme();
  const [sheetVisible, setSheetVisible] = useState(false);
  const { sessions, loading, error, saveSession, deleteSession } = useExerciseSessions(exercise.id);
  const bestSet = useMemo(() => getBestSet(sessions), [sessions]);
  const bestDate = useMemo(() => getBestDate(sessions, bestSet), [bestSet, sessions]);
  const recentSet = useMemo(() => getFirstSet(sessions), [sessions]);
  const prsThisMonth = useMemo(() => getPrCountThisMonth(sessions), [sessions]);

  async function handleSave(set: Omit<ExerciseSet, 'id'>) {
    await saveSession(set);
  }

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <ExerciseDetailHeader exercise={exercise} />

        <View style={styles.stickyTop}>
          <ExerciseBestCard bestSet={bestSet} bestDate={bestDate} prsThisMonth={prsThisMonth} />
          <LogLiftButton onPress={() => setSheetVisible(true)} />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.backgroundElement }]} />

        <ExerciseSessionTimeline
          sessions={sessions}
          loading={loading}
          error={error}
          onDeleteSession={deleteSession}
        />
      </View>

      <LogLiftSheet
        visible={sheetVisible}
        bestSet={bestSet}
        recentSet={recentSet}
        onClose={() => setSheetVisible(false)}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  stickyTop: {
    padding: Spacing.three,
    paddingBottom: Spacing.twoAndHalf,
    gap: Spacing.twoAndHalf,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: Spacing.three,
  },
});

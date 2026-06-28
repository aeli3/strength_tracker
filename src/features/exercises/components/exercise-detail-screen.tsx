import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionBottomSheet } from '@/components/ui/action-bottom-sheet';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useExerciseSessions } from '../hooks/use-exercise-sessions';
import type { Exercise, ExerciseSession } from '../types';
import {
  getBestDate,
  getBestSet,
  getPrCountThisMonth,
} from '../utils/session-stats';
import { ExerciseBestCard } from './exercise-best-card';
import { ExerciseDetailHeader } from './exercise-detail-header';
import { ExerciseSessionTimeline } from './exercise-session-timeline';
import { LogLiftButton } from './log-lift-button';

interface ExerciseDetailScreenProps {
  exercise: Exercise;
}

export function ExerciseDetailScreen({ exercise }: ExerciseDetailScreenProps) {
  const colors = useTheme();
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [actionSession, setActionSession] = useState<ExerciseSession | undefined>();
  const { sessions, loading, error, deleteSession } = useExerciseSessions(exercise.id);
  const bestSet = useMemo(() => getBestSet(sessions), [sessions]);
  const bestDate = useMemo(() => getBestDate(sessions, bestSet), [bestSet, sessions]);
  const prsThisMonth = useMemo(() => getPrCountThisMonth(sessions), [sessions]);

  function handleSessionLongPress(session: ExerciseSession) {
    setActionSession(session);
    setActiveSessionId(session.id);
  }

  function handleSessionPressStateChange(session: ExerciseSession, active: boolean) {
    setActiveSessionId(current => {
      if (active) {
        return session.id;
      }

      return current === session.id ? undefined : current;
    });
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
          <LogLiftButton
            onPress={() => router.push({ pathname: '/log-create', params: { exerciseId: exercise.id } })}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.backgroundElement }]} />

        <ExerciseSessionTimeline
          sessions={sessions}
          loading={loading}
          error={error}
          selectedSessionId={actionSession?.id ?? activeSessionId}
          onSessionLongPress={handleSessionLongPress}
          onSessionPressStateChange={handleSessionPressStateChange}
        />
      </View>

      <ActionBottomSheet
        visible={Boolean(actionSession)}
        title={actionSession?.dateLabel ?? 'Log'}
        onClose={() => {
          setActionSession(undefined);
          setActiveSessionId(undefined);
        }}
        actions={[
          {
            id: 'edit',
            title: 'Edit log',
            icon: 'pencil',
            onPress: () => {
              if (actionSession) {
                router.push({
                  pathname: '/log-edit',
                  params: { exerciseId: exercise.id, sessionId: actionSession.id },
                });
              }
            },
          },
          {
            id: 'delete',
            title: 'Delete log',
            icon: 'trash',
            destructive: true,
            onPress: () => {
              if (actionSession) {
                void deleteSession(actionSession.id);
              }
            },
          },
        ]}
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

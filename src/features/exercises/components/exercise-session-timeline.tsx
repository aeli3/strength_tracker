import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';

import { Fonts, Spacing, Typography } from '@/constants/theme';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import type { ExerciseSession } from '../types';
import { ExerciseSessionRow } from './exercise-session-row';

interface ExerciseSessionTimelineProps {
  sessions: ExerciseSession[];
  loading: boolean;
  error?: Error;
  selectedSessionId?: string;
  onSessionLongPress: (session: ExerciseSession) => void;
  onSessionPressStateChange?: (session: ExerciseSession, active: boolean) => void;
}

export function ExerciseSessionTimeline({
  sessions,
  loading,
  error,
  selectedSessionId,
  onSessionLongPress,
  onSessionPressStateChange,
}: ExerciseSessionTimelineProps) {
  const colors = useTheme();
  const emptyLabel = error ? 'Unable to load sessions' : loading ? 'Loading sessions' : 'No sessions yet';

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: Fonts?.sans }]}>
          Recent sessions
        </Text>
      </View>

      {sessions.length > 0 ? (
        sessions.map((session, index) => (
          <Animated.View
            key={session.id}
            entering={FadeInDown.duration(190).delay(Math.min(index * 20, 120))}
            layout={LinearTransition.duration(190)}
          >
            <ExerciseSessionRow
              session={session}
              isLast={index === sessions.length - 1}
              selected={selectedSessionId === session.id}
              onLongPress={onSessionLongPress}
              onPressStateChange={onSessionPressStateChange}
            />
          </Animated.View>
        ))
      ) : (
        <Animated.View entering={FadeIn.duration(180)} layout={LinearTransition.duration(190)}>
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
              {emptyLabel}
            </Text>
          </Card>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    paddingTop: Spacing.twoAndHalf,
    paddingBottom: Spacing.six,
  },
  sectionRow: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  sectionTitle: {
    ...Typography.smallLabel,
  },
  emptyCard: {
    minHeight: 96,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.three,
  },
  emptyText: {
    ...Typography.smallLabel,
  },
});

import { Platform, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { Fonts, Spacing, Typography } from '@/constants/theme';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import type { ExerciseSet } from '../types';
import { formatWeight } from '../utils/session-stats';

interface ExerciseBestCardProps {
  bestSet: ExerciseSet | undefined;
  bestDate: string | undefined;
  prsThisMonth: number;
}

export function ExerciseBestCard({ bestSet, bestDate, prsThisMonth }: ExerciseBestCardProps) {
  const colors = useTheme();
  const hasBest = Boolean(bestSet);

  return (
    <Card style={styles.card}>
      <View style={styles.copy}>
        <Text style={[styles.label, { color: colors.accent, fontFamily: Fonts?.sans }]}>
          YOUR BEST
        </Text>
        <Text style={[styles.value, { color: colors.text, fontFamily: Fonts?.rounded }]}>
          {hasBest && bestSet ? formatWeight(bestSet.weight) : '--'}
          <Text style={[styles.unit, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
            {' '}kg
          </Text>
        </Text>
        <Text style={[styles.meta, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
          {bestSet ? `${bestSet.reps} reps` : 'No logs yet'}
        </Text>
        <Text style={[styles.date, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
          {bestDate ? `Set ${bestDate}` : 'Start with your first lift'}
        </Text>
      </View>

      <View style={styles.aside}>
        {Platform.OS === 'ios' ? (
          <SymbolView name="trophy.fill" size={24} tintColor={colors.accent} />
        ) : (
          <Text style={[styles.trophyText, { color: colors.accent }]}>PR</Text>
        )}
        <Text style={[styles.asideText, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
          {prsThisMonth} PRs this month
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 132,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.three,
  },
  copy: {
    flex: 1,
  },
  label: {
    ...Typography.sectionLabel,
    marginBottom: Spacing.one,
  },
  value: {
    fontSize: 38,
    lineHeight: 43,
    fontWeight: '700',
    letterSpacing: 0,
  },
  unit: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  meta: {
    ...Typography.smallLabel,
    marginTop: Spacing.one,
  },
  date: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: Spacing.half,
  },
  aside: {
    alignItems: 'flex-end',
    paddingBottom: Spacing.one,
  },
  trophyText: {
    ...Typography.smallLabel,
    fontWeight: '700',
  },
  asideText: {
    maxWidth: 90,
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'right',
    marginTop: Spacing.two,
  },
});

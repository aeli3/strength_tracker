import { StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { Fonts, Spacing, Typography } from '@/constants/theme';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import type { ExerciseHomeStats } from '../types';

interface HomeStatsBarProps {
  stats: ExerciseHomeStats;
  loading?: boolean;
}

type HomeStat = {
  label: string;
  value: number;
  fallbackIcon: string;
  symbol: 'calendar' | 'flame.fill' | 'trophy.fill';
};

export function HomeStatsBar({ stats, loading = false }: HomeStatsBarProps) {
  const colors = useTheme();
  const items: HomeStat[] = [
    {
      label: 'Week',
      value: stats.weeklySessions,
      fallbackIcon: 'W',
      symbol: 'calendar',
    },
    {
      label: 'Streak',
      value: stats.streakDays,
      fallbackIcon: 'S',
      symbol: 'flame.fill',
    },
    {
      label: 'PRs',
      value: stats.prsThisMonth,
      fallbackIcon: 'PR',
      symbol: 'trophy.fill',
    },
  ];

  return (
    <View style={styles.container}>
      {items.map(item => (
        <Card key={item.label} style={styles.card}>
          <View style={[styles.iconBadge, { backgroundColor: colors.backgroundSelected }]}>
            <SymbolView
              name={{ ios: item.symbol }}
              size={15}
              tintColor={colors.accent}
              fallback={
                <Text style={[styles.fallbackIcon, { color: colors.accent }]}>
                  {item.fallbackIcon}
                </Text>
              }
            />
          </View>
          <Text style={[styles.value, { color: colors.text, fontFamily: Fonts?.rounded }]}>
            {loading ? '--' : item.value}
          </Text>
          <Text style={[styles.label, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
            {item.label}
          </Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  card: {
    flex: 1,
    minHeight: 88,
    justifyContent: 'space-between',
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  fallbackIcon: {
    ...Typography.sectionLabel,
    fontWeight: '700',
  },
  value: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: 0,
  },
  label: {
    ...Typography.smallLabel,
    marginTop: Spacing.half,
  },
});

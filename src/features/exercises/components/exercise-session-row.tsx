import { StyleSheet, Text, View } from 'react-native';
import { MenuView } from '@expo/ui/community/menu';

import { Fonts, Spacing, Typography } from '@/constants/theme';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import type { ExerciseSession } from '../types';
import { formatVolume, formatWeight, getTopSet, getVolume } from '../utils/session-stats';

interface ExerciseSessionRowProps {
  session: ExerciseSession;
  isLast: boolean;
  onDelete: (sessionId: string) => void;
}

export function ExerciseSessionRow({ session, isLast, onDelete }: ExerciseSessionRowProps) {
  const colors = useTheme();
  const isPr = Boolean(session.isPr);
  const topSet = getTopSet(session);
  const volume = getVolume(session);

  return (
    <View style={styles.row}>
      <View style={styles.spine}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: isPr ? colors.accent : colors.text,
              borderColor: isPr ? colors.accent : colors.text,
            },
          ]}
        />
        {!isLast && <View style={[styles.line, { backgroundColor: colors.backgroundElement }]} />}
      </View>

      <MenuView
        shouldOpenOnLongPress
        actions={[
          {
            id: 'delete',
            title: 'Delete Log',
            image: 'trash',
            attributes: { destructive: true },
          },
        ]}
        onPressAction={event => {
          if (event.nativeEvent.event === 'delete') {
            onDelete(session.id);
          }
        }}
        style={styles.menu}
      >
        <Card style={styles.card}>
          <View style={styles.topRow}>
            <Text style={[styles.date, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
              {session.dateLabel}
            </Text>
            {isPr && (
              <View style={[styles.prBadge, { backgroundColor: colors.accent }]}>
                <Text style={[styles.prBadgeText, { color: colors.accentText, fontFamily: Fonts?.sans }]}>
                  PR
                </Text>
              </View>
            )}
          </View>

          {topSet ? (
            <>
              <Text style={[styles.weight, { color: colors.text, fontFamily: Fonts?.sans }]}>
                {formatWeight(topSet.weight)} kg
              </Text>
              <View style={styles.setPills}>
                {session.sets.map((set, index) => (
                  <View
                    key={set.id ?? `${session.id}-${index}`}
                    style={[
                      styles.setPill,
                      {
                        backgroundColor: colors.background,
                        borderColor: isPr ? colors.accent : colors.backgroundSelected,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.setPillText,
                        { color: isPr ? colors.text : colors.textSecondary, fontFamily: Fonts?.sans },
                      ]}
                    >
                      {formatWeight(set.weight)} x {set.reps}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.volumeText, { color: colors.textSecondary, fontFamily: Fonts?.sans }]}>
                {formatVolume(volume)} kg vol.
              </Text>
            </>
          ) : null}
        </Card>
      </MenuView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  spine: {
    width: 12,
    alignItems: 'center',
    paddingTop: Spacing.two,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
  },
  line: {
    width: StyleSheet.hairlineWidth,
    flex: 1,
    minHeight: 76,
    marginTop: Spacing.one,
  },
  menu: {
    flex: 1,
  },
  card: {
    paddingHorizontal: Spacing.twoAndHalf,
    paddingVertical: Spacing.two,
  },
  topRow: {
    minHeight: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  date: {
    fontSize: 12,
    lineHeight: 16,
  },
  prBadge: {
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  prBadgeText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
  },
  weight: {
    ...Typography.smallLabel,
    marginTop: Spacing.one,
  },
  setPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  setPill: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 7,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  setPillText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
  },
  volumeText: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: Spacing.one,
  },
});

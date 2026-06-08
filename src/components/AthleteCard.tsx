import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from './Avatar';
import { ProgressBar } from './ProgressBar';
import { theme, AVATAR_COLORS, SPORT_COLORS, SPORT_EMOJIS, getScoreColor } from '@/constants/theme';
import type { Athlete, SportStats } from '@/types';
import { isFootballStats, isBasketballStats, isAthleticsStats } from '@/types';

interface AthleteCardProps {
  athlete: Athlete;
  onPress: () => void;
}

function getPrimaryStat(stats: SportStats): { label: string; value: number } {
  if (isFootballStats(stats)) return { label: 'Speed', value: stats.speed };
  if (isBasketballStats(stats)) return { label: 'Speed', value: stats.speed };
  if (isAthleticsStats(stats)) return { label: 'Speed', value: stats.speed };
  return { label: 'Speed', value: 0 };
}

export function AthleteCard({ athlete, onPress }: AthleteCardProps) {
  const avatarColor = AVATAR_COLORS[parseInt(athlete.id, 10) % AVATAR_COLORS.length];
  const sportColor = SPORT_COLORS[athlete.sport] ?? theme.colors.primary;
  const scoreColor = getScoreColor(athlete.score);
  const primaryStat = getPrimaryStat(athlete.stats);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.sportBar, { backgroundColor: sportColor }]} />
      <View style={styles.topRow}>
        <Avatar name={athlete.name} size={44} color={avatarColor} />
        <View style={styles.info}>
          <Text style={styles.name}>{athlete.name}</Text>
          <Text style={styles.meta}>
            {SPORT_EMOJIS[athlete.sport]} {athlete.sport} · {athlete.position} · Age {athlete.age}
          </Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: scoreColor + '26' }]}>
          <Text style={[styles.scoreText, { color: scoreColor }]}>{athlete.score}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.bottomRow}>
        <Text style={styles.scoreLabel}>Score</Text>
        <View style={styles.progressBarWrap}>
          <ProgressBar value={athlete.score} height={5} color={scoreColor} />
        </View>
        <Text style={[styles.scoreValueSmall, { color: scoreColor }]}>{athlete.score}</Text>
      </View>
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>{primaryStat.label}</Text>
        <View style={styles.statBarWrap}>
          <ProgressBar value={primaryStat.value} height={4} color={sportColor} />
        </View>
        <Text style={[styles.statValue, { color: sportColor }]}>{primaryStat.value}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    marginBottom: 12,
    ...theme.shadow.card,
    overflow: 'hidden',
  },
  sportBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  meta: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  scoreBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    width: 40,
  },
  progressBarWrap: {
    flex: 1,
    marginHorizontal: 6,
  },
  scoreValueSmall: {
    fontSize: 11,
    fontWeight: '600',
    width: 24,
    textAlign: 'right',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    width: 40,
  },
  statBarWrap: {
    flex: 1,
    marginHorizontal: 6,
  },
  statValue: {
    fontSize: 11,
    fontWeight: '600',
    width: 24,
    textAlign: 'right',
  },
});

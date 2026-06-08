import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from './Avatar';
import { ProgressBar } from './ProgressBar';
import { theme, AVATAR_COLORS, SPORT_COLORS, SPORT_EMOJIS, getScoreColor } from '@/constants/theme';
import type { Athlete } from '@/types';

interface AthleteCardProps {
  athlete: Athlete;
  onPress: () => void;
}

export function AthleteCard({ athlete, onPress }: AthleteCardProps) {
  const avatarColor = AVATAR_COLORS[parseInt(athlete.id, 10) % AVATAR_COLORS.length];
  const sportColor = SPORT_COLORS[athlete.sport] ?? theme.colors.primary;
  const scoreColor = getScoreColor(athlete.score);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      {/* Sport accent bar */}
      <View style={[styles.sportBar, { backgroundColor: sportColor }]} />

      <View style={styles.topRow}>
        <Avatar name={athlete.name} size={46} color={avatarColor} sport={athlete.sport} gender={athlete.gender} />
        <View style={styles.info}>
          <Text style={styles.name}>{athlete.name}</Text>
          <Text style={styles.meta}>
            {SPORT_EMOJIS[athlete.sport]} {athlete.sport} · {athlete.position} · Age {athlete.age}
          </Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: scoreColor + '16', borderColor: scoreColor + '40' }]}>
          <Text style={[styles.scoreText, { color: scoreColor }]}>{athlete.score}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.scoreLabel}>Score</Text>
        <View style={styles.progressBarWrap}>
          <ProgressBar value={athlete.score} height={7} color={scoreColor} />
        </View>
        <Text style={[styles.scoreValueSmall, { color: scoreColor }]}>
          {athlete.score}/100
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 13,
    paddingLeft: 16,
    marginBottom: 10,
    ...theme.shadow.card,
    overflow: 'hidden',
  },
  sportBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
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
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.1,
  },
  meta: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 3,
  },
  scoreBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  scoreText: {
    fontSize: 15,
    fontWeight: '800',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 11,
    paddingLeft: 4,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    width: 42,
  },
  progressBarWrap: {
    flex: 1,
    marginHorizontal: 10,
  },
  scoreValueSmall: {
    fontSize: 11,
    fontWeight: '700',
    width: 48,
    textAlign: 'right',
  },
});

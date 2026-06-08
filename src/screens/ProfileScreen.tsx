import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar } from '@/components/Avatar';
import { ProgressBar } from '@/components/ProgressBar';
import { StatRow } from '@/components/StatRow';
import {
  theme,
  AVATAR_COLORS,
  SPORT_COLORS,
  SPORT_EMOJIS,
  getScoreColor,
} from '@/constants/theme';
import athletesData from '@/data/athletes.json';
import type { Athlete, DiscoverStackParamList, ShortlistStackParamList } from '@/types';
import { isFootballStats, isBasketballStats, isAthleticsStats } from '@/types';
import type { UseShortlistReturn } from '@/hooks/useShortlist';

const athletes = athletesData as Athlete[];

type ProfileProps =
  | (NativeStackScreenProps<DiscoverStackParamList, 'Profile'> & {
      shortlistProps: UseShortlistReturn;
    })
  | (NativeStackScreenProps<ShortlistStackParamList, 'Profile'> & {
      shortlistProps: UseShortlistReturn;
    });

export function ProfileScreen({ route, shortlistProps }: ProfileProps) {
  const { athleteId } = route.params;
  const athlete = athletes.find((a) => a.id === athleteId);
  const buttonScale = useRef(new Animated.Value(1)).current;

  if (!athlete) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Athlete not found</Text>
      </View>
    );
  }

  const shortlisted = shortlistProps.isShortlisted(athlete.id);
  const avatarColor = AVATAR_COLORS[parseInt(athlete.id, 10) % AVATAR_COLORS.length];
  const sportColor = SPORT_COLORS[athlete.sport] ?? theme.colors.primary;
  const scoreColor = getScoreColor(athlete.score);

  const readinessLabel =
    athlete.score >= 80 ? 'High Readiness' : athlete.score >= 60 ? 'Mid Readiness' : 'Low Readiness';

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const renderStats = () => {
    if (isFootballStats(athlete.stats)) {
      return (
        <>
          <StatRow label="Speed" value={athlete.stats.speed} />
          <StatRow label="Stamina" value={athlete.stats.stamina} />
          <StatRow label="Accuracy" value={athlete.stats.accuracy} />
          <StatRow label="Dribbling" value={athlete.stats.dribbling} />
        </>
      );
    }
    if (isBasketballStats(athlete.stats)) {
      return (
        <>
          <StatRow label="Speed" value={athlete.stats.speed} />
          <StatRow label="Vertical Jump" value={athlete.stats.verticalJump} />
          <StatRow label="3-Point Acc" value={athlete.stats.threePointAcc} />
          <StatRow label="Defense" value={athlete.stats.defense} />
        </>
      );
    }
    if (isAthleticsStats(athlete.stats)) {
      return (
        <>
          <StatRow label="Speed" value={athlete.stats.speed} />
          <StatRow label="Endurance" value={athlete.stats.endurance} />
          <StatRow label="Reaction Time" value={athlete.stats.reactionTime} />
          <StatRow label="Agility" value={athlete.stats.agility} />
        </>
      );
    }
    return null;
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <View style={styles.hero}>
        <Avatar name={athlete.name} size={80} color={avatarColor} />
        <Text style={styles.heroName}>{athlete.name}</Text>
        <View style={[styles.sportBadge, { backgroundColor: sportColor + '26' }]}>
          <Text style={[styles.sportBadgeText, { color: sportColor }]}>
            {SPORT_EMOJIS[athlete.sport]} {athlete.sport} · {athlete.position}
          </Text>
        </View>
        <Text style={styles.heroAge}>Age {athlete.age}</Text>
        <Text style={styles.heroEmoji}>{SPORT_EMOJIS[athlete.sport]}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>OVERALL READINESS</Text>
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreBig, { color: scoreColor }]}>{athlete.score}</Text>
          <Text style={styles.scoreOutOf}>/ 100</Text>
        </View>
        <ProgressBar value={athlete.score} height={12} color={scoreColor} />
        <Text style={[styles.readinessLabel, { color: scoreColor }]}>{readinessLabel}</Text>
      </View>

      <View style={[styles.card, { marginTop: 0 }]}>
        <Text style={styles.sectionTitle}>{athlete.sport} Stats</Text>
        {renderStats()}
      </View>

      <View style={[styles.card, { marginTop: 0 }]}>
        <Text style={styles.sectionTitle}>Biography</Text>
        <Text style={styles.bioText}>{athlete.bio}</Text>
      </View>

      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={[
            styles.shortlistButton,
            { backgroundColor: shortlisted ? theme.colors.danger : theme.colors.primary },
          ]}
          onPress={() => shortlistProps.toggleShortlist(athlete)}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          activeOpacity={0.9}
        >
          <Text style={styles.shortlistButtonText}>
            {shortlisted ? '✓ Remove from Shortlist' : '+ Add to Shortlist'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.text,
  },
  hero: {
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    paddingBottom: 24,
    paddingTop: 16,
  },
  heroName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 12,
  },
  sportBadge: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 14,
    marginTop: 6,
  },
  sportBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  heroAge: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  heroEmoji: {
    fontSize: 32,
    marginTop: 4,
  },
  card: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: 16,
    ...theme.shadow.card,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 8,
  },
  scoreBig: {
    fontSize: 48,
    fontWeight: '800',
  },
  scoreOutOf: {
    fontSize: 20,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    marginLeft: 2,
  },
  readinessLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  bioText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  shortlistButton: {
    marginHorizontal: theme.spacing.md,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  shortlistButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textInverse,
  },
});

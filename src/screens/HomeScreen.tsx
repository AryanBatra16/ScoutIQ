import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar } from '@/components/Avatar';
import { ProgressBar } from '@/components/ProgressBar';
import {
  theme,
  AVATAR_COLORS,
  SPORT_COLORS,
  SPORT_EMOJIS,
  getScoreColor,
} from '@/constants/theme';
import athletesData from '@/data/athletes.json';
import type { RootTabParamList, DiscoverStackParamList, Athlete } from '@/types';
import type { UseShortlistReturn } from '@/hooks/useShortlist';

const athletes = athletesData as Athlete[];

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Home'>,
  NativeStackScreenProps<DiscoverStackParamList>
> & {
  shortlistProps: UseShortlistReturn;
};

export function HomeScreen({ navigation, shortlistProps }: Props) {
  const { shortlist } = shortlistProps;

  // Compute stats
  const totalAthletes = athletes.length;
  const shortlistCount = shortlist.length;
  const avgShortlistScore =
    shortlistCount > 0
      ? Math.round(shortlist.reduce((sum, a) => sum + a.score, 0) / shortlistCount)
      : 0;

  // Filter high performing featured athletes (score >= 85)
  const featuredAthletes = React.useMemo(() => {
    return athletes.filter((a) => a.score >= 85).slice(0, 5);
  }, []);

  // Sport counts
  const sportCounts = React.useMemo(() => {
    return athletes.reduce(
      (acc, a) => {
        acc[a.sport] = (acc[a.sport] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Premium Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeTitle}>ScoutIQ</Text>
        <Text style={styles.welcomeSubtitle}>SCIENTIFIC TALENT SCOUTING</Text>
      </View>

      {/* Grid of Key Statistics */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderTopColor: theme.colors.primary }]}>
          <Text style={styles.statNumber}>{totalAthletes}</Text>
          <Text style={styles.statLabel}>Total Database</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: theme.colors.success }]}>
          <Text style={[styles.statNumber, { color: theme.colors.success }]}>
            {shortlistCount}
          </Text>
          <Text style={styles.statLabel}>Shortlisted</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: theme.colors.warning }]}>
          <Text
            style={[
              styles.statNumber,
              { color: shortlistCount > 0 ? getScoreColor(avgShortlistScore) : theme.colors.textSecondary },
            ]}
          >
            {shortlistCount > 0 ? avgShortlistScore : '-'}
          </Text>
          <Text style={styles.statLabel}>Avg Readiness</Text>
        </View>
      </View>

      {/* Sport Distributions */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionLabel}>DATABASE BY SPORT</Text>
        {Object.entries(sportCounts).map(([sport, count]) => {
          const sportColor = SPORT_COLORS[sport] ?? theme.colors.primary;
          const percentage = (count / totalAthletes) * 100;
          return (
            <View key={sport} style={styles.sportProgressRow}>
              <View style={styles.sportTextInfo}>
                <Text style={styles.sportName}>
                  {SPORT_EMOJIS[sport]} {sport}
                </Text>
                <Text style={styles.sportCountText}>
                  {count} ({Math.round(percentage)}%)
                </Text>
              </View>
              <ProgressBar value={percentage} height={6} color={sportColor} />
            </View>
          );
        })}
      </View>

      {/* Featured Athletes Horizontal Scroll */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionLabelLarge}>FEATURED PROSPECTS</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredContainer}
        >
          {featuredAthletes.map((athlete) => {
            const avatarColor = AVATAR_COLORS[parseInt(athlete.id, 10) % AVATAR_COLORS.length];
            const sportColor = SPORT_COLORS[athlete.sport] ?? theme.colors.primary;
            const scoreColor = getScoreColor(athlete.score);
            return (
              <TouchableOpacity
                key={athlete.id}
                style={styles.featuredCard}
                activeOpacity={0.8}
                onPress={() =>
                  (navigation.navigate as any)('Discover', {
                    screen: 'Profile',
                    params: { athleteId: athlete.id },
                  })
                }
              >
                <View style={[styles.cardSportTag, { backgroundColor: sportColor }]}>
                  <Text style={styles.sportTagText}>
                    {SPORT_EMOJIS[athlete.sport]} {athlete.sport}
                  </Text>
                </View>
                <Avatar name={athlete.name} size={50} color={avatarColor} />
                <Text style={styles.featuredName} numberOfLines={1}>
                  {athlete.name}
                </Text>
                <Text style={styles.featuredPosition} numberOfLines={1}>
                  {athlete.position}
                </Text>
                <View style={[styles.scoreBadge, { backgroundColor: scoreColor + '15' }]}>
                  <Text style={[styles.scoreText, { color: scoreColor }]}>
                    {athlete.score}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Quick Navigation / CTA Banner */}
      <View style={styles.ctaBanner}>
        <Text style={styles.ctaTitle}>Ready to Scout?</Text>
        <Text style={styles.ctaSubtitle}>
          Filter and discover athletes, view performance ratings, and save candidates.
        </Text>
        <View style={styles.ctaActions}>
          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: theme.colors.primary }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Discover')}
          >
            <Text style={styles.ctaButtonText}>Search Feed 🔭</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Shortlist')}
          >
            <Text style={[styles.ctaButtonText, { color: '#FFFFFF' }]}>Shortlist 📌</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 36,
  },
  header: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingTop: 28,
    paddingBottom: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  welcomeSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 1.8,
    marginTop: 6,
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 4,
    ...theme.shadow.card,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    borderRadius: 14,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionLabelLarge: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    paddingHorizontal: theme.spacing.md,
    marginBottom: 12,
  },
  sportProgressRow: {
    marginBottom: 12,
  },
  sportTextInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sportName: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  sportCountText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  featuredSection: {
    marginTop: 20,
  },
  featuredContainer: {
    paddingHorizontal: theme.spacing.md,
    gap: 12,
    paddingBottom: 8,
  },
  featuredCard: {
    backgroundColor: theme.colors.surface,
    width: 140,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    ...theme.shadow.card,
    position: 'relative',
    overflow: 'hidden',
  },
  cardSportTag: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 2,
    alignItems: 'center',
  },
  sportTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  featuredName: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 20,
    textAlign: 'center',
  },
  featuredPosition: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  scoreBadge: {
    marginTop: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
  },
  ctaBanner: {
    margin: theme.spacing.md,
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ctaSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  ctaActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    width: '100%',
  },
  ctaButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

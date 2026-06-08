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
      {/* Light Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeTitle}>ScoutIQ</Text>
        <Text style={styles.welcomeSubtitle}>SCIENTIFIC TALENT SCOUTING</Text>
        <View style={styles.headerAccentLine} />
      </View>

      {/* Grid of Key Statistics */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.statCardPurple]}>
          <View style={styles.statIconBg}>
            <Text style={styles.statIconEmoji}>🗄️</Text>
          </View>
          <Text style={[styles.statNumber, { color: '#7C3AED' }]}>{totalAthletes}</Text>
          <Text style={styles.statLabel}>Total Database</Text>
        </View>
        <View style={[styles.statCard, styles.statCardTeal]}>
          <View style={[styles.statIconBg, { backgroundColor: 'rgba(13, 148, 136, 0.12)' }]}>
            <Text style={styles.statIconEmoji}>📋</Text>
          </View>
          <Text style={[styles.statNumber, { color: '#0D9488' }]}>{shortlistCount}</Text>
          <Text style={styles.statLabel}>Shortlisted</Text>
        </View>
        <View style={[styles.statCard, styles.statCardAmber]}>
          <View style={[styles.statIconBg, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
            <Text style={styles.statIconEmoji}>📈</Text>
          </View>
          <Text
            style={[
              styles.statNumber,
              { color: shortlistCount > 0 ? getScoreColor(avgShortlistScore) : '#F59E0B' },
            ]}
          >
            {shortlistCount > 0 ? avgShortlistScore : '—'}
          </Text>
          <Text style={styles.statLabel}>Avg Readiness</Text>
        </View>
      </View>

      {/* Sport Distributions */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>DATABASE BY SPORT</Text>
          <Text style={styles.sectionLabelCount}>{totalAthletes} total</Text>
        </View>
        {Object.entries(sportCounts).map(([sport, count]) => {
          const sportColor = SPORT_COLORS[sport] ?? theme.colors.primary;
          const percentage = (count / totalAthletes) * 100;
          return (
            <View key={sport} style={styles.sportProgressRow}>
              <View style={styles.sportTextInfo}>
                <View style={styles.sportNameRow}>
                  <View style={[styles.sportDot, { backgroundColor: sportColor }]} />
                  <Text style={styles.sportName}>
                    {SPORT_EMOJIS[sport]} {sport}
                  </Text>
                </View>
                <Text style={[styles.sportCountText, { color: sportColor }]}>
                  {count} ({Math.round(percentage)}%)
                </Text>
              </View>
              <ProgressBar value={percentage} height={8} color={sportColor} />
            </View>
          );
        })}
      </View>

      {/* Featured Athletes Horizontal Scroll */}
      <View style={styles.featuredSection}>
        <View style={styles.featuredHeader}>
          <Text style={styles.sectionLabelLarge}>FEATURED PROSPECTS</Text>
          <Text style={styles.featuredSubtitle}>Score ≥ 85</Text>
        </View>
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
                <View style={styles.avatarWrapper}>
                  <Avatar name={athlete.name} size={54} color={avatarColor} sport={athlete.sport} gender={athlete.gender} />
                </View>
                <Text style={styles.featuredName} numberOfLines={1}>
                  {athlete.name}
                </Text>
                <Text style={styles.featuredPosition} numberOfLines={1}>
                  {athlete.position}
                </Text>
                <View style={[styles.scoreBadge, { backgroundColor: scoreColor + '18', borderColor: scoreColor + '40' }]}>
                  <Text style={[styles.scoreText, { color: scoreColor }]}>
                    ★ {athlete.score}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Quick Navigation / CTA Banner */}
      <View style={styles.ctaBanner}>
        <Text style={styles.ctaEyebrow}>GET STARTED</Text>
        <Text style={styles.ctaTitle}>Ready to Scout?</Text>
        <Text style={styles.ctaSubtitle}>
          Filter and discover athletes, view performance ratings, and save top candidates.
        </Text>
        <View style={styles.ctaActions}>
          <TouchableOpacity
            style={[styles.ctaButton, styles.ctaButtonPrimary]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Discover')}
          >
            <Text style={styles.ctaButtonTextPrimary}>🔭  Search Feed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ctaButton, styles.ctaButtonSecondary]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Shortlist')}
          >
            <Text style={styles.ctaButtonTextSecondary}>📌  Shortlist</Text>
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
    paddingBottom: 40,
  },
  header: {
    backgroundColor: theme.colors.headerBg,
    paddingHorizontal: theme.spacing.md,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: theme.colors.headerBorder,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 2.5,
    marginTop: 6,
    textAlign: 'center',
  },
  headerAccentLine: {
    width: 40,
    height: 2,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
    marginTop: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingTop: 18,
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
  },
  statCardPurple: {
    backgroundColor: 'rgba(124, 58, 237, 0.06)',
    borderColor: '#7C3AED',
    shadowColor: '#7C3AED',
  },
  statCardTeal: {
    backgroundColor: 'rgba(13, 148, 136, 0.06)',
    borderColor: '#0D9488',
    shadowColor: '#0D9488',
  },
  statCardAmber: {
    backgroundColor: 'rgba(245, 158, 11, 0.06)',
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
  },
  statIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconEmoji: {
    fontSize: 14,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 3,
    letterSpacing: 0.2,
  },
  sectionCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginTop: 18,
    borderRadius: 16,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 1.2,
  },
  sectionLabelCount: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  sportProgressRow: {
    marginBottom: 14,
  },
  sportTextInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sportNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sportDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sportName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },
  sportCountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  featuredSection: {
    marginTop: 22,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: 14,
  },
  sectionLabelLarge: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 1.2,
  },
  featuredSubtitle: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  featuredContainer: {
    paddingHorizontal: theme.spacing.md,
    gap: 12,
    paddingBottom: 8,
  },
  featuredCard: {
    backgroundColor: theme.colors.surface,
    width: 148,
    borderRadius: 16,
    paddingBottom: 14,
    alignItems: 'center',
    ...theme.shadow.card,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardSportTag: {
    width: '100%',
    paddingVertical: 5,
    alignItems: 'center',
    marginBottom: 0,
  },
  sportTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  avatarWrapper: {
    marginTop: 14,
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  featuredName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  featuredPosition: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  scoreBadge: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
  },
  ctaBanner: {
    marginHorizontal: theme.spacing.md,
    marginTop: 22,
    backgroundColor: '#2D1266',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    overflow: 'hidden',
  },
  ctaEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C4B5FD',
    letterSpacing: 2,
    marginBottom: 6,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  ctaSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    maxWidth: 260,
  },
  ctaActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    width: '100%',
  },
  ctaButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaButtonPrimary: {
    backgroundColor: '#7C3AED',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaButtonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  ctaButtonTextPrimary: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ctaButtonTextSecondary: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
  },
});

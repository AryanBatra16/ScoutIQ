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

  const [toastMessage, setToastMessage] = React.useState('');
  const [toastType, setToastType] = React.useState<'add' | 'remove'>('add');
  const toastTranslateY = useRef(new Animated.Value(120)).current;
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  if (!athlete) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>🤷</Text>
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

  const readinessBg = athlete.score >= 80
    ? 'rgba(13, 148, 136, 0.1)'
    : athlete.score >= 60
    ? 'rgba(245, 158, 11, 0.1)'
    : 'rgba(239, 68, 68, 0.1)';

  const triggerToast = (type: 'add' | 'remove') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastType(type);
    setToastMessage(type === 'add' ? 'Added to shortlist ✓' : 'Removed from shortlist');

    Animated.spring(toastTranslateY, {
      toValue: 0,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();

    toastTimeoutRef.current = setTimeout(() => {
      Animated.timing(toastTranslateY, {
        toValue: 120,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }, 2000);
  };

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
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={[styles.heroAccent, { backgroundColor: sportColor + '30' }]} />
          <View style={styles.heroContent}>
            <View style={styles.avatarRing}>
              <Avatar name={athlete.name} size={90} color={avatarColor} sport={athlete.sport} gender={athlete.gender} />
            </View>
            <Text style={styles.heroName}>{athlete.name}</Text>
            <View style={[styles.sportBadge, { backgroundColor: sportColor + '22', borderColor: sportColor + '50' }]}>
              <Text style={[styles.sportBadgeText, { color: sportColor }]}>
                {SPORT_EMOJIS[athlete.sport]} {athlete.sport}  ·  {athlete.position}
              </Text>
            </View>
            <View style={styles.heroMeta}>
              <View style={styles.heroMetaItem}>
                <Text style={styles.heroMetaValue}>{athlete.age}</Text>
                <Text style={styles.heroMetaLabel}>Age</Text>
              </View>
              <View style={styles.heroMetaDivider} />
              <View style={styles.heroMetaItem}>
                <Text style={[styles.heroMetaValue, { color: scoreColor }]}>{athlete.score}</Text>
                <Text style={styles.heroMetaLabel}>Score</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Readiness Card */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>OVERALL READINESS</Text>
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreBig, { color: scoreColor }]}>{athlete.score}</Text>
            <Text style={styles.scoreOutOf}> / 100</Text>
          </View>
          <ProgressBar value={athlete.score} height={12} color={scoreColor} />
          <View style={[styles.readinessBadge, { backgroundColor: readinessBg }]}>
            <Text style={[styles.readinessLabel, { color: scoreColor }]}>● {readinessLabel}</Text>
          </View>
        </View>

        {/* Stats Card */}
        <View style={[styles.card, { marginTop: 0 }]}>
          <Text style={styles.sectionTitle}>{SPORT_EMOJIS[athlete.sport]}  {athlete.sport} Performance Stats</Text>
          {renderStats()}
        </View>

        {/* Biography Card */}
        <View style={[styles.card, { marginTop: 0 }]}>
          <Text style={styles.sectionTitle}>📝  Biography</Text>
          <Text style={styles.bioText}>{athlete.bio}</Text>
        </View>

        {/* CTA Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[
              styles.shortlistButton,
              {
                backgroundColor: shortlisted ? theme.colors.danger : theme.colors.primary,
              },
            ]}
            onPress={() => {
              shortlistProps.toggleShortlist(athlete);
              triggerToast(!shortlisted ? 'add' : 'remove');
            }}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
            activeOpacity={0.9}
          >
            <Text style={styles.shortlistButtonText}>
              {shortlisted ? '✕  Remove from Shortlist' : '+  Add to Shortlist'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Floating Toast Notification */}
      <Animated.View
        style={[
          styles.toast,
          {
            transform: [{ translateY: toastTranslateY }],
            backgroundColor: toastType === 'add' ? theme.colors.brandDark : '#3B3B4F',
          },
        ]}
      >
        <View
          style={[
            styles.toastCheckCircle,
            { backgroundColor: toastType === 'add' ? theme.colors.success : theme.colors.danger },
          ]}
        >
          <Text style={styles.toastCheckIcon}>{toastType === 'add' ? '✓' : '✕'}</Text>
        </View>
        <Text style={styles.toastText}>{toastMessage}</Text>
      </Animated.View>
    </View>
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
    gap: 12,
  },
  errorEmoji: {
    fontSize: 40,
  },
  errorText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.text,
  },
  hero: {
    backgroundColor: theme.colors.surface,
    paddingBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  heroAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  heroContent: {
    alignItems: 'center',
    paddingTop: 24,
  },
  avatarRing: {
    padding: 4,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  heroName: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 14,
    letterSpacing: 0.3,
  },
  sportBadge: {
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
  },
  sportBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 32,
  },
  heroMetaItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroMetaValue: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
  },
  heroMetaLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroMetaDivider: {
    width: 1,
    height: 36,
    backgroundColor: theme.colors.border,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: 16,
    ...theme.shadow.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  scoreBig: {
    fontSize: 56,
    fontWeight: '800',
    lineHeight: 60,
  },
  scoreOutOf: {
    fontSize: 22,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  readinessBadge: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 12,
  },
  readinessLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  bioText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  shortlistButton: {
    marginHorizontal: theme.spacing.md,
    marginBottom: 32,
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  shortlistButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textInverse,
    letterSpacing: 0.3,
  },
  toast: {
    position: 'absolute',
    bottom: 24,
    left: theme.spacing.md,
    right: theme.spacing.md,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 10,
    flex: 1,
  },
  toastCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastCheckIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

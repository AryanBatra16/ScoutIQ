import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Swipeable } from 'react-native-gesture-handler';
import { AthleteCard } from '@/components/AthleteCard';
import { EmptyState } from '@/components/EmptyState';
import { theme, getScoreColor } from '@/constants/theme';
import type { ShortlistStackParamList, Athlete } from '@/types';
import type { UseShortlistReturn } from '@/hooks/useShortlist';

interface Props extends NativeStackScreenProps<ShortlistStackParamList, 'ShortlistFeed'> {
  shortlistProps: UseShortlistReturn;
}

export function ShortlistScreen({ navigation, shortlistProps }: Props) {
  const { shortlist, isLoading, removeFromShortlist } = shortlistProps;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const avgScore =
    shortlist.length > 0
      ? Math.round(shortlist.reduce((sum, a) => sum + a.score, 0) / shortlist.length)
      : 0;

  const topScore = shortlist.length > 0
    ? Math.max(...shortlist.map((a) => a.score))
    : 0;

  const renderRightActions = (athlete: Athlete) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => removeFromShortlist(athlete.id)}
      activeOpacity={0.7}
    >
      <Text style={styles.deleteEmoji}>🗑️</Text>
      <Text style={styles.deleteLabel}>Remove</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Athlete }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)} overshootRight={false}>
      <AthleteCard
        athlete={item}
        onPress={() => navigation.navigate('Profile', { athleteId: item.id })}
      />
    </Swipeable>
  );

  return (
    <View style={styles.screen}>
      {/* Stats Header */}
      <View style={styles.statsSection}>
        <View style={styles.statsBar}>
          <View style={[styles.statBox, styles.statBoxTeal]}>
            <Text style={[styles.statBoxValue, { color: '#0D9488' }]}>{shortlist.length}</Text>
            <Text style={styles.statBoxLabel}>📋  Athletes</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxAmber]}>
            <Text style={[styles.statBoxValue, { color: getScoreColor(avgScore) }]}>
              {avgScore || '—'}
            </Text>
            <Text style={styles.statBoxLabel}>📈  Avg Score</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxPurple]}>
            <Text style={[styles.statBoxValue, { color: getScoreColor(topScore) }]}>
              {topScore || '—'}
            </Text>
            <Text style={styles.statBoxLabel}>🏆  Top Score</Text>
          </View>
        </View>

        {shortlist.length > 0 && (
          <View style={styles.swipeHintRow}>
            <Text style={styles.swipeHint}>← Swipe left on a card to remove</Text>
          </View>
        )}
      </View>

      <FlatList
        data={shortlist}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          shortlist.length === 0
            ? [styles.listContent, styles.emptyListContent]
            : styles.listContent
        }
        ListEmptyComponent={
          <EmptyState
            icon="🏆"
            title="No athletes shortlisted"
            subtitle="Head over to Discover and add your top candidates to the shortlist."
            actionLabel="Browse athletes →"
            onAction={() => {
              navigation.getParent()?.navigate('Discover');
            }}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  statsSection: {
    backgroundColor: theme.colors.surface,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statsBar: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.md,
    marginTop: 14,
    gap: 10,
  },
  statBox: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  statBoxTeal: {
    backgroundColor: 'rgba(13, 148, 136, 0.06)',
    borderColor: '#0D9488',
    shadowColor: '#0D9488',
  },
  statBoxAmber: {
    backgroundColor: 'rgba(245, 158, 11, 0.06)',
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
  },
  statBoxPurple: {
    backgroundColor: 'rgba(124, 58, 237, 0.06)',
    borderColor: '#7C3AED',
    shadowColor: '#7C3AED',
  },
  statBoxValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  statBoxLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  swipeHintRow: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: 'center',
  },
  swipeHint: {
    fontSize: 11,
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 32,
    paddingTop: 12,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  deleteAction: {
    width: 80,
    backgroundColor: theme.colors.danger,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginBottom: 10,
  },
  deleteEmoji: {
    fontSize: 20,
  },
  deleteLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 2,
  },
});

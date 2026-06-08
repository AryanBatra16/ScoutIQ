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
      <View style={styles.statsBar}>
        <View style={styles.statBox}>
          <Text style={styles.statBoxValue}>{shortlist.length}</Text>
          <Text style={styles.statBoxLabel}>Athletes</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statBoxValue, { color: getScoreColor(avgScore) }]}>
            {avgScore}
          </Text>
          <Text style={styles.statBoxLabel}>Avg Score</Text>
        </View>
      </View>

      {shortlist.length > 0 && (
        <Text style={styles.swipeHint}>← Swipe left to remove</Text>
      )}

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
            subtitle="Go discover some talent!"
            actionLabel="Browse athletes"
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
  statsBar: {
    flexDirection: 'row',
    margin: theme.spacing.md,
    gap: theme.spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statBoxValue: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  statBoxLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  swipeHint: {
    fontSize: 11,
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 32,
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

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AthleteCard } from '@/components/AthleteCard';
import { FilterChip } from '@/components/FilterChip';
import { EmptyState } from '@/components/EmptyState';
import { useDebounce } from '@/hooks/useDebounce';
import { theme, SPORT_EMOJIS } from '@/constants/theme';
import athletesData from '@/data/athletes.json';
import type { DiscoverStackParamList, Sport, Athlete } from '@/types';
import type { UseShortlistReturn } from '@/hooks/useShortlist';

const athletes = athletesData as Athlete[];

interface Props extends NativeStackScreenProps<DiscoverStackParamList, 'Feed'> {
  shortlistProps: UseShortlistReturn;
}

const FILTERS: { label: string; value: Sport | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: `${SPORT_EMOJIS.Football} Football`, value: 'Football' },
  { label: `${SPORT_EMOJIS.Basketball} Basketball`, value: 'Basketball' },
  { label: `${SPORT_EMOJIS.Athletics} Athletics`, value: 'Athletics' },
];

export function DiscoverScreen({ navigation, shortlistProps }: Props) {
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<Sport | 'All'>('All');
  const debouncedSearch = useDebounce(searchText, 300);

  const filteredAthletes = useMemo(() => {
    let result = athletes;
    if (activeFilter !== 'All') {
      result = result.filter((a) => a.sport === activeFilter);
    }
    if (debouncedSearch.length > 0) {
      const lower = debouncedSearch.toLowerCase();
      result = result.filter((a) => a.name.toLowerCase().includes(lower));
    }
    return result;
  }, [activeFilter, debouncedSearch]);

  const resultCount = filteredAthletes.length;

  return (
    <View style={styles.screen}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search athletes..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          clearButtonMode="while-editing"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.resultCount}>
        Showing {resultCount} result{resultCount === 1 ? '' : 's'}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsContainer}
        keyboardShouldPersistTaps="handled"
      >
        {FILTERS.map((f) => (
          <FilterChip
            key={f.value}
            label={f.label}
            active={activeFilter === f.value}
            onPress={() => setActiveFilter(f.value)}
          />
        ))}
      </ScrollView>

      <FlatList
        data={filteredAthletes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AthleteCard
            athlete={item}
            onPress={() => navigation.navigate('Profile', { athleteId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            icon="🔍"
            title="No athletes found"
            subtitle="Try a different name or change the sport filter"
          />
        }
        keyboardShouldPersistTaps="handled"
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
  searchContainer: {
    marginHorizontal: theme.spacing.md,
    marginTop: 12,
    marginBottom: 8,
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
    fontSize: 16,
  },
  searchInput: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: 12,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
  },
  resultCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.md,
    marginBottom: 8,
  },
  chipsScroll: {
    maxHeight: 40,
  },
  chipsContainer: {
    paddingHorizontal: theme.spacing.md,
    gap: 8,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 32,
    paddingTop: 8,
  },
  separator: {
    height: 0,
  },
});

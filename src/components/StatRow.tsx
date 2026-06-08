import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from './ProgressBar';
import { theme, getScoreColor } from '@/constants/theme';

interface StatRowProps {
  label: string;
  value: number;
}

export function StatRow({ label, value }: StatRowProps) {
  const color = getScoreColor(value);
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barContainer}>
        <ProgressBar value={value} height={8} color={color} />
      </View>
      <View style={[styles.valueBadge, { backgroundColor: color + '18' }]}>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    width: 100,
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  barContainer: {
    flex: 1,
    marginRight: 10,
  },
  valueBadge: {
    width: 34,
    height: 22,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
});

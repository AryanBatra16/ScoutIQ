import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from './ProgressBar';
import { theme, getScoreColor } from '@/constants/theme';

interface StatRowProps {
  label: string;
  value: number;
}

export function StatRow({ label, value }: StatRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barContainer}>
        <ProgressBar value={value} height={8} color={getScoreColor(value)} />
      </View>
      <Text style={[styles.value, { color: getScoreColor(value) }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  label: {
    width: 90,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  barContainer: {
    flex: 1,
  },
  value: {
    width: 28,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '600',
  },
});

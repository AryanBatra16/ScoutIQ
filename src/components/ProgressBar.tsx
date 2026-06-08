import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface ProgressBarProps {
  value: number;
  height?: number;
  color?: string;
}

export function ProgressBar({ value, height = 6, color = theme.colors.primary }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clamped}%`,
            height,
            borderRadius: height / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: theme.colors.scoreTrack,
  },
  fill: {
    backgroundColor: theme.colors.primary,
  },
});

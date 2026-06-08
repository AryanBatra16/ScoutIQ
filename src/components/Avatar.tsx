import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { getInitials } from '@/constants/theme';

interface AvatarProps {
  name: string;
  size: number;
  color: string;
}

export function Avatar({ name, size, color }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: Math.round(size * 0.36) }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

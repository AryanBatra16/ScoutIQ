import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  name: string;
  size: number;
  color: string;
}

export function Avatar({ name, size, color }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
      <Text style={[styles.initials, { fontSize: Math.round(size / 2.8) }]}>
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

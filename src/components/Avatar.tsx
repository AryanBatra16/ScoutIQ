import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getInitials } from '@/constants/theme';
import { getAthleteAvatar } from '@/constants/avatars';

interface AvatarProps {
  name: string;
  size: number;
  color: string;
  sport?: string;
  gender?: 'male' | 'female';
}

export function Avatar({ name, size, color, sport, gender }: AvatarProps) {
  const initials = getInitials(name);
  const avatarImage = sport && gender ? getAthleteAvatar(sport, gender) : null;

  if (avatarImage) {
    return (
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: 'hidden',
          },
        ]}
      >
        <Image
          source={avatarImage}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      </View>
    );
  }

  // Fallback to initials
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

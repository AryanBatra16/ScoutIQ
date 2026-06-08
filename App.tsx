import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from '@/navigation/AppNavigator';
import { theme } from '@/constants/theme';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.delay(700),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSplash(false);
    });
  }, [fadeAnim]);

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
        <Animated.View style={[styles.splashContent, { opacity: fadeAnim }]}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>⚡</Text>
          </View>
          <Text style={styles.splashTitle}>ScoutIQ</Text>
          <Text style={styles.splashSubtitle}>Athlete Discovery</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar
        barStyle={Platform.OS === 'web' ? 'light-content' : 'dark-content'}
        backgroundColor={Platform.OS === 'web' ? '#1A1A2E' : theme.colors.surface}
      />
      <View style={styles.appContainer}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#11111F' : theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.background,
    ...(Platform.OS === 'web' && {
      maxWidth: 460,
      maxHeight: 820,
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: 8,
      borderColor: '#2D2D44',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 10,
    }),
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#4F46E5', // Matches the gradient/brand primary in the brief
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  splashContent: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 36,
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  splashSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 4,
    fontWeight: '500',
  },
});

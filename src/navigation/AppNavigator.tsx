import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { useShortlist } from '@/hooks/useShortlist';
import type { UseShortlistReturn } from '@/hooks/useShortlist';
import type {
  RootTabParamList,
  DiscoverStackParamList,
  ShortlistStackParamList,
} from '@/types';
import { DiscoverScreen } from '@/screens/DiscoverScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { ShortlistScreen } from '@/screens/ShortlistScreen';
import { HomeScreen } from '@/screens/HomeScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const DiscoverStack = createNativeStackNavigator<DiscoverStackParamList>();
const ShortlistStack = createNativeStackNavigator<ShortlistStackParamList>();

const headerOptions = {
  headerStyle: {
    backgroundColor: theme.colors.surface,
  },
  headerTintColor: theme.colors.text,
  headerTitleStyle: {
    fontWeight: '700' as const,
    fontSize: 18,
  },
  headerShadowVisible: false,
};

interface ShortlistProps {
  shortlistProps: UseShortlistReturn;
}

function DiscoverStackNavigator({ shortlistProps }: ShortlistProps) {
  return (
    <DiscoverStack.Navigator screenOptions={headerOptions}>
      <DiscoverStack.Screen name="Feed" options={{ title: 'Discover' }}>
        {(props) => <DiscoverScreen {...props} shortlistProps={shortlistProps} />}
      </DiscoverStack.Screen>
      <DiscoverStack.Screen name="Profile" options={{ title: 'Athlete Profile' }}>
        {(props) => <ProfileScreen {...props} shortlistProps={shortlistProps} />}
      </DiscoverStack.Screen>
    </DiscoverStack.Navigator>
  );
}

function ShortlistStackNavigator({ shortlistProps }: ShortlistProps) {
  return (
    <ShortlistStack.Navigator screenOptions={headerOptions}>
      <ShortlistStack.Screen name="ShortlistFeed" options={{ title: 'Shortlist' }}>
        {(props) => <ShortlistScreen {...props} shortlistProps={shortlistProps} />}
      </ShortlistStack.Screen>
      <ShortlistStack.Screen name="Profile" options={{ title: 'Athlete Profile' }}>
        {(props) => <ProfileScreen {...props} shortlistProps={shortlistProps} />}
      </ShortlistStack.Screen>
    </ShortlistStack.Navigator>
  );
}

export function AppNavigator() {
  const shortlistProps = useShortlist();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      >
        {(props) => <HomeScreen {...props} shortlistProps={shortlistProps} />}
      </Tab.Screen>
      <Tab.Screen
        name="Discover"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      >
        {() => <DiscoverStackNavigator shortlistProps={shortlistProps} />}
      </Tab.Screen>
      <Tab.Screen
        name="Shortlist"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="bookmark" size={size} color={color} />
          ),
          tabBarBadge:
            shortlistProps.shortlist.length > 0
              ? shortlistProps.shortlist.length
              : undefined,
        }}
      >
        {() => <ShortlistStackNavigator shortlistProps={shortlistProps} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

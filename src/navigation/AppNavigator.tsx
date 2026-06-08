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
    backgroundColor: theme.colors.headerBg,
  },
  headerTintColor: theme.colors.primary,
  headerTitleStyle: {
    fontWeight: '700' as const,
    fontSize: 18,
    color: theme.colors.headerText,
  },
  headerShadowVisible: false,
  headerBorderBottomColor: theme.colors.headerBorder,
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
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          backgroundColor: theme.colors.headerBg,
          borderTopColor: theme.colors.headerBorder,
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.2,
          marginTop: 2,
        },
        tabBarActiveBackgroundColor: 'transparent',
        tabBarItemStyle: {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: 'Home',
          tabBarShowLabel: true,
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
          tabBarLabel: 'Discover',
          tabBarShowLabel: true,
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
          tabBarLabel: 'Shortlist',
          tabBarShowLabel: true,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="bookmark" size={size} color={color} />
          ),
          tabBarBadge:
            shortlistProps.shortlist.length > 0
              ? shortlistProps.shortlist.length
              : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.colors.primary,
            fontSize: 10,
            fontWeight: '700',
          },
        }}
      >
        {() => <ShortlistStackNavigator shortlistProps={shortlistProps} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

# ScoutIQ — Technical Requirements Document (TRD)
**Version:** 1.0  
**Timeline:** 24 Hours  
**Platform:** React Native (Expo SDK 51) + TypeScript  
**Author:** Solo Build  

---

## 1. Environment Setup

### 1.1 Prerequisites
```
Node.js       >= 18.x
npm           >= 9.x
Expo CLI      >= 0.18.x  (via npx, no global install needed)
Expo Go app   installed on iOS and/or Android device for testing
```

### 1.2 Project Initialization
```bash
npx create-expo-app ScoutIQ --template blank-typescript
cd ScoutIQ
```

### 1.3 All Dependencies — Install in This Exact Order

```bash
# Step 1: Navigation core
npx expo install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context

# Step 2: Navigation types
npx expo install @react-navigation/bottom-tabs
npx expo install @react-navigation/native-stack

# Step 3: Storage
npx expo install @react-native-async-storage/async-storage

# Step 4: Gesture handler (for swipe-to-delete)
npx expo install react-native-gesture-handler
```

> ⚠️ Always use `npx expo install` not `npm install` for Expo packages.
> Expo picks the version compatible with your SDK. `npm install` can pull
> incompatible versions and cause silent runtime errors.

### 1.4 `tsconfig.json`
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 1.5 `babel.config.js`
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // Must be last plugin
    ],
  };
};
```

> ⚠️ `react-native-reanimated/plugin` must be the LAST item in plugins array.
> After editing babel.config.js, always restart the Metro bundler with `--clear`:
> `npx expo start --clear`

### 1.6 `App.tsx` — Entry Point
```typescript
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '@/navigation/AppNavigator';

export default function App() {
  return (
    // GestureHandlerRootView must wrap EVERYTHING for swipe gestures to work
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
```

> ⚠️ `GestureHandlerRootView` with `style={{ flex: 1 }}` is mandatory.
> Without it, swipe-to-delete will silently not work on Android.

---

## 2. Folder Structure

```
ScoutIQ/
├── App.tsx                          ← Entry point
├── app.json                         ← Expo config
├── babel.config.js                  ← Reanimated plugin config
├── tsconfig.json                    ← Strict TypeScript config
├── package.json
├── README.md
└── src/
    ├── components/
    │   ├── AthleteCard.tsx           ← Feed card: avatar, name, sport, score, mini bar
    │   ├── Avatar.tsx                ← Initials circle with dynamic background color
    │   ├── ProgressBar.tsx           ← Reusable progress bar (custom, no lib)
    │   ├── FilterChip.tsx            ← Sport filter pill
    │   ├── StatRow.tsx               ← Single labeled stat with progress bar
    │   └── EmptyState.tsx            ← Reusable empty state (icon + title + subtitle)
    ├── screens/
    │   ├── DiscoverScreen.tsx        ← Feed + search bar + filter chips
    │   ├── ProfileScreen.tsx         ← Full athlete detail + shortlist button
    │   └── ShortlistScreen.tsx       ← Persisted shortlist + swipe-to-delete
    ├── navigation/
    │   └── AppNavigator.tsx          ← All nav config: tabs + stack
    ├── hooks/
    │   ├── useShortlist.ts           ← AsyncStorage read/write, shared state
    │   └── useDebounce.ts            ← 300ms debounce for search input
    ├── data/
    │   └── athletes.json             ← 15 mock athletes, 3 sports, pre-scored
    ├── types/
    │   └── index.ts                  ← All TypeScript interfaces + nav param types
    └── constants/
        └── theme.ts                  ← Colors, spacing, fontSizes, borderRadius
```

---

## 3. TypeScript Types (`src/types/index.ts`)

Define all types FIRST. Every component and hook depends on these.

```typescript
// ─── Sport Stat Shapes ───────────────────────────────────────────────────────

export interface FootballStats {
  speed: number;        // 0–100
  stamina: number;      // 0–100
  accuracy: number;     // 0–100
  dribbling: number;    // 0–100
}

export interface BasketballStats {
  speed: number;
  verticalJump: number;
  threePointAcc: number;
  defense: number;
}

export interface AthleticsStats {
  speed: number;
  endurance: number;
  reactionTime: number;
  agility: number;
}

export type SportStats = FootballStats | BasketballStats | AthleticsStats;

// ─── Sport Enum ───────────────────────────────────────────────────────────────

export type Sport = 'Football' | 'Basketball' | 'Athletics';

// ─── Athlete ──────────────────────────────────────────────────────────────────

export interface Athlete {
  id: string;
  name: string;
  sport: Sport;
  position: string;
  age: number;
  bio: string;
  stats: SportStats;
  score: number;        // Pre-calculated: average of all stat values, rounded
}

// ─── Navigation Param Lists ───────────────────────────────────────────────────

export type RootTabParamList = {
  Discover: undefined;
  Shortlist: undefined;
};

export type DiscoverStackParamList = {
  Feed: undefined;
  Profile: { athleteId: string };   // Only pass ID, look up athlete in screen
};

// ─── Utility ──────────────────────────────────────────────────────────────────

// Type guard to check which sport stats shape we have
export const isFootballStats = (stats: SportStats): stats is FootballStats =>
  'dribbling' in stats;

export const isBasketballStats = (stats: SportStats): stats is BasketballStats =>
  'verticalJump' in stats;

export const isAthleticsStats = (stats: SportStats): stats is AthleticsStats =>
  'endurance' in stats;
```

---

## 4. Theme & Design Tokens (`src/constants/theme.ts`)

Single source of truth for all visual values. Never hardcode colors or spacing.

```typescript
export const theme = {

  colors: {
    // Brand
    primary:        '#6C63FF',   // Accent — buttons, active chips, primary actions
    primaryLight:   '#EEF0FF',   // Active chip background

    // Surfaces
    background:     '#F7F8FC',   // Screen background
    surface:        '#FFFFFF',   // Card, header, tab bar background
    border:         '#E5E7EB',   // Card borders, dividers

    // Text
    text:           '#1A1A2E',   // Primary text
    textSecondary:  '#6B7280',   // Subtitles, metadata
    textInverse:    '#FFFFFF',   // Text on colored backgrounds

    // Semantic
    success:        '#10B981',   // Score >= 80, shortlisted state
    warning:        '#F59E0B',   // Score 60–79
    danger:         '#EF4444',   // Score < 60, remove button, swipe action

    // Misc
    scoreTrack:     '#E5E7EB',   // Progress bar background track
  },

  spacing: {
    xs:  4,
    sm:  8,
    md:  16,
    lg:  24,
    xl:  32,
    xxl: 48,
  },

  fontSizes: {
    xs:  11,
    sm:  13,
    md:  15,
    lg:  18,
    xl:  22,
    xxl: 28,
  },

  fontWeights: {
    regular: '400' as const,
    medium:  '500' as const,
    semibold:'600' as const,
    bold:    '700' as const,
  },

  borderRadius: {
    sm:   8,
    md:   12,
    lg:   16,
    xl:   24,
    full: 9999,
  },

  shadow: {
    // Use with StyleSheet.create — spread these into a style object
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,             // Android
    },
  },

} as const;

// ─── Avatar Colors ────────────────────────────────────────────────────────────
// Cycle through these based on athlete.id index
export const AVATAR_COLORS = [
  '#6C63FF', '#F59E0B', '#10B981',
  '#EF4444', '#3B82F6', '#8B5CF6',
];

// ─── Score Color Utility ──────────────────────────────────────────────────────
// Used by ProgressBar and AthleteCard score badge
export const getScoreColor = (score: number): string => {
  if (score >= 80) return theme.colors.success;   // green
  if (score >= 60) return theme.colors.warning;   // amber
  return theme.colors.danger;                      // red
};

// ─── Initials Utility ─────────────────────────────────────────────────────────
export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ─── Avatar Color Utility ─────────────────────────────────────────────────────
export const getAvatarColor = (id: string): string => {
  const index = parseInt(id, 10) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};
```

---

## 5. Mock Data (`src/data/athletes.json`)

15 athletes — 5 Football, 5 Basketball, 5 Athletics.  
Score = `Math.round(average of all stat values)` — pre-calculated.

```json
[
  {
    "id": "1", "name": "Rahul Sharma", "sport": "Football",
    "position": "Striker", "age": 22,
    "bio": "State-level striker with exceptional finishing. Represented Delhi under-19 for 2 seasons.",
    "stats": { "speed": 88, "stamina": 76, "accuracy": 91, "dribbling": 83 },
    "score": 85
  },
  {
    "id": "2", "name": "Arjun Patel", "sport": "Football",
    "position": "Midfielder", "age": 20,
    "bio": "Creative playmaker known for long-range passes and tireless engine.",
    "stats": { "speed": 74, "stamina": 89, "accuracy": 78, "dribbling": 71 },
    "score": 78
  },
  {
    "id": "3", "name": "Vikram Nair", "sport": "Football",
    "position": "Goalkeeper", "age": 24,
    "bio": "Commanding keeper with excellent reflexes. Clean sheet record of 65% last season.",
    "stats": { "speed": 62, "stamina": 80, "accuracy": 88, "dribbling": 45 },
    "score": 69
  },
  {
    "id": "4", "name": "Suresh Kumar", "sport": "Football",
    "position": "Defender", "age": 21,
    "bio": "Aggressive centre-back, dominant in aerial duels, strong in the tackle.",
    "stats": { "speed": 70, "stamina": 85, "accuracy": 65, "dribbling": 58 },
    "score": 70
  },
  {
    "id": "5", "name": "Aditya Rao", "sport": "Football",
    "position": "Winger", "age": 19,
    "bio": "Pacey winger with raw talent. Needs positional refinement but explosive potential.",
    "stats": { "speed": 94, "stamina": 68, "accuracy": 70, "dribbling": 88 },
    "score": 80
  },
  {
    "id": "6", "name": "Karan Singh", "sport": "Basketball",
    "position": "Point Guard", "age": 21,
    "bio": "High-IQ floor general with elite court vision. Averaged 9 assists last season.",
    "stats": { "speed": 86, "verticalJump": 78, "threePointAcc": 82, "defense": 74 },
    "score": 80
  },
  {
    "id": "7", "name": "Priya Menon", "sport": "Basketball",
    "position": "Small Forward", "age": 23,
    "bio": "Versatile two-way player with a reliable mid-range game and lockdown defense.",
    "stats": { "speed": 79, "verticalJump": 85, "threePointAcc": 76, "defense": 91 },
    "score": 83
  },
  {
    "id": "8", "name": "Dev Malhotra", "sport": "Basketball",
    "position": "Center", "age": 22,
    "bio": "Imposing presence in the paint. Leads the league in blocks and rebounds.",
    "stats": { "speed": 58, "verticalJump": 90, "threePointAcc": 45, "defense": 93 },
    "score": 72
  },
  {
    "id": "9", "name": "Sneha Iyer", "sport": "Basketball",
    "position": "Shooting Guard", "age": 20,
    "bio": "Elite three-point shooter with quick release. Deadly off the catch.",
    "stats": { "speed": 82, "verticalJump": 72, "threePointAcc": 95, "defense": 68 },
    "score": 79
  },
  {
    "id": "10", "name": "Rohit Bose", "sport": "Basketball",
    "position": "Power Forward", "age": 24,
    "bio": "Physical forward with strong post game. Improving face-up skills.",
    "stats": { "speed": 65, "verticalJump": 83, "threePointAcc": 58, "defense": 86 },
    "score": 73
  },
  {
    "id": "11", "name": "Meera Pillai", "sport": "Athletics",
    "position": "Sprinter", "age": 19,
    "bio": "Sub-11 second 100m athlete. National youth silver medalist.",
    "stats": { "speed": 96, "endurance": 70, "reactionTime": 94, "agility": 89 },
    "score": 87
  },
  {
    "id": "12", "name": "Anand Krishnan", "sport": "Athletics",
    "position": "Long Distance", "age": 25,
    "bio": "Marathon specialist with sub-2:30 timing. Exceptional mental toughness.",
    "stats": { "speed": 72, "endurance": 97, "reactionTime": 68, "agility": 74 },
    "score": 78
  },
  {
    "id": "13", "name": "Pooja Desai", "sport": "Athletics",
    "position": "Hurdler", "age": 21,
    "bio": "Technical hurdler with explosive stride. Represented state at nationals twice.",
    "stats": { "speed": 88, "endurance": 79, "reactionTime": 85, "agility": 92 },
    "score": 86
  },
  {
    "id": "14", "name": "Tarun Ghosh", "sport": "Athletics",
    "position": "High Jump", "age": 22,
    "bio": "Clean Fosbury flop technique. Personal best of 2.18m achieved last season.",
    "stats": { "speed": 77, "endurance": 65, "reactionTime": 80, "agility": 95 },
    "score": 79
  },
  {
    "id": "15", "name": "Lakshmi Varma", "sport": "Athletics",
    "position": "Shot Put", "age": 23,
    "bio": "Power athlete with excellent rotational mechanics. Consistent regional podium finisher.",
    "stats": { "speed": 58, "endurance": 72, "reactionTime": 75, "agility": 68 },
    "score": 68
  }
]
```

---

## 6. Hooks

### 6.1 `useDebounce` (`src/hooks/useDebounce.ts`)

```typescript
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the previous timer if value changes before delay
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
```

**How it works:**
- Every keystroke restarts a 300ms timer
- Only when the user stops typing for 300ms does `debouncedValue` update
- The `useEffect` cleanup (`clearTimeout`) is what cancels the previous timer
- Generic `<T>` means it works with string, number, or any type

---

### 6.2 `useShortlist` (`src/hooks/useShortlist.ts`)

This is the most important hook. It is the single source of truth for shortlist state.

```typescript
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Athlete } from '@/types';

const STORAGE_KEY = '@scoutiq_shortlist';

interface UseShortlistReturn {
  shortlist: Athlete[];
  isShortlisted: (id: string) => boolean;
  toggleShortlist: (athlete: Athlete) => Promise<void>;
  removeFromShortlist: (id: string) => Promise<void>;
  isLoading: boolean;
}

function useShortlist(): UseShortlistReturn {
  const [shortlist, setShortlist] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Load from AsyncStorage on mount ───────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setShortlist(JSON.parse(raw));
      } catch (e) {
        console.error('Failed to load shortlist:', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // ── Persist helper — call after every state update ─────────────────────────
  const persist = useCallback(async (updated: Athlete[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save shortlist:', e);
    }
  }, []);

  // ── Check if athlete is shortlisted ───────────────────────────────────────
  const isShortlisted = useCallback(
    (id: string) => shortlist.some(a => a.id === id),
    [shortlist]
  );

  // ── Remove by ID ───────────────────────────────────────────────────────────
  const removeFromShortlist = useCallback(
    async (id: string) => {
      const updated = shortlist.filter(a => a.id !== id);
      setShortlist(updated);
      await persist(updated);
    },
    [shortlist, persist]
  );

  // ── Toggle: add if not shortlisted, remove if already shortlisted ──────────
  const toggleShortlist = useCallback(
    async (athlete: Athlete) => {
      let updated: Athlete[];
      if (isShortlisted(athlete.id)) {
        updated = shortlist.filter(a => a.id !== athlete.id);
      } else {
        updated = [...shortlist, athlete];
      }
      setShortlist(updated);
      await persist(updated);
    },
    [shortlist, isShortlisted, persist]
  );

  return { shortlist, isShortlisted, toggleShortlist, removeFromShortlist, isLoading };
}

export default useShortlist;
```

> ⚠️ **Critical:** Call `useShortlist()` only ONCE — in `AppNavigator` or a
> Context provider — and pass the return values down as props. If each screen
> calls the hook independently, they each get their own state and will go
> out of sync.

---

## 7. Navigation (`src/navigation/AppNavigator.tsx`)

```typescript
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import DiscoverScreen from '@/screens/DiscoverScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import ShortlistScreen from '@/screens/ShortlistScreen';
import useShortlist from '@/hooks/useShortlist';
import { theme } from '@/constants/theme';
import { RootTabParamList, DiscoverStackParamList } from '@/types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<DiscoverStackParamList>();

// ── Shared screen options (consistent header across all screens) ──────────────
const sharedHeaderOptions = {
  headerStyle:      { backgroundColor: theme.colors.surface },
  headerTintColor:  theme.colors.text,
  headerTitleStyle: { fontWeight: theme.fontWeights.bold, fontSize: theme.fontSizes.lg },
  headerShadowVisible: false,
};

// ── Discover Stack (Feed → Profile) ──────────────────────────────────────────
function DiscoverStack({
  shortlistProps
}: {
  shortlistProps: ReturnType<typeof useShortlist>
}) {
  return (
    <Stack.Navigator screenOptions={sharedHeaderOptions}>
      <Stack.Screen name="Feed" options={{ title: 'Discover' }}>
        {props => <DiscoverScreen {...props} {...shortlistProps} />}
      </Stack.Screen>
      <Stack.Screen name="Profile" options={{ title: 'Athlete Profile' }}>
        {props => <ProfileScreen {...props} {...shortlistProps} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// ── Root Tab Navigator ────────────────────────────────────────────────────────
export default function AppNavigator() {
  const shortlistProps = useShortlist(); // ← Single instance, shared everywhere

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
        tabBarActiveTintColor:   theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: theme.fontSizes.xs,
          fontWeight: theme.fontWeights.medium,
        },
      }}
    >
      <Tab.Screen
        name="Discover"
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🔭</Text>,
        }}
      >
        {() => <DiscoverStack shortlistProps={shortlistProps} />}
      </Tab.Screen>

      <Tab.Screen
        name="Shortlist"
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📌</Text>,
          // Badge shows shortlist count when > 0
          tabBarBadge: shortlistProps.shortlist.length > 0
            ? shortlistProps.shortlist.length
            : undefined,
          tabBarBadgeStyle: { backgroundColor: theme.colors.primary },
        }}
      >
        {() => <ShortlistScreen {...shortlistProps} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
```

> **Why pass shortlistProps as props instead of calling the hook in each screen?**
> Hooks create independent state instances. If DiscoverScreen and ShortlistScreen
> each call `useShortlist()`, they have separate state. The shortlist button on
> ProfileScreen would never know that ShortlistScreen removed an athlete.
> One hook instance at the navigator level = one source of truth.

---

## 8. Components

### 8.1 `ProgressBar` (`src/components/ProgressBar.tsx`)

The custom progress bar. Built with two Views — no external library.

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { getScoreColor } from '@/constants/theme';

interface ProgressBarProps {
  value: number;        // 0–100
  height?: number;      // default 8
  color?: string;       // if not provided, derives from value using getScoreColor
  trackColor?: string;  // default theme.colors.scoreTrack
}

export default function ProgressBar({
  value,
  height = 8,
  color,
  trackColor = theme.colors.scoreTrack,
}: ProgressBarProps) {
  const fillColor = color ?? getScoreColor(value);
  const clampedValue = Math.min(100, Math.max(0, value)); // safety clamp

  return (
    <View
      style={[
        styles.track,
        { height, backgroundColor: trackColor, borderRadius: height / 2 }
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clampedValue}%`,
            height,
            backgroundColor: fillColor,
            borderRadius: height / 2,
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',   // Clips the fill so it doesn't bleed past rounded corners
  },
  fill: {
    // width is set dynamically via inline style
  },
});
```

---

### 8.2 `Avatar` (`src/components/Avatar.tsx`)

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getInitials, getAvatarColor } from '@/constants/theme';
import { theme } from '@/constants/theme';

interface AvatarProps {
  name: string;
  id: string;       // Used to determine color from AVATAR_COLORS array
  size?: number;    // default 44
}

export default function Avatar({ name, id, size = 44 }: AvatarProps) {
  const bgColor = getAvatarColor(id);
  const initials = getInitials(name);
  const fontSize = size * 0.36; // proportional font size

  return (
    <View style={[
      styles.container,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bgColor,
      }
    ]}>
      <Text style={[styles.initials, { fontSize }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: theme.colors.textInverse,
    fontWeight: theme.fontWeights.bold,
  },
});
```

---

### 8.3 `FilterChip` (`src/components/FilterChip.tsx`)

```typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export default function FilterChip({ label, active, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.label, active && styles.labelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm - 2,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    marginRight: theme.spacing.sm,
  },
  chipActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.textSecondary,
  },
  labelActive: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.semibold,
  },
});
```

---

### 8.4 `EmptyState` (`src/components/EmptyState.tsx`)

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface EmptyStateProps {
  icon: string;           // Emoji or unicode icon
  title: string;
  subtitle: string;
  actionLabel?: string;   // Optional CTA button text
  onAction?: () => void;
}

export default function EmptyState({
  icon, title, subtitle, actionLabel, onAction
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
  },
  icon: {
    fontSize: 56,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
  },
  buttonText: {
    color: theme.colors.textInverse,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
  },
});
```

---

### 8.5 `AthleteCard` (`src/components/AthleteCard.tsx`)

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Athlete } from '@/types';
import { theme, getScoreColor } from '@/constants/theme';
import Avatar from './Avatar';
import ProgressBar from './ProgressBar';

interface AthleteCardProps {
  athlete: Athlete;
  onPress: () => void;
}

export default function AthleteCard({ athlete, onPress }: AthleteCardProps) {
  const scoreColor = getScoreColor(athlete.score);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Top row: avatar + info + score */}
      <View style={styles.row}>
        <Avatar name={athlete.name} id={athlete.id} size={48} />

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{athlete.name}</Text>
          <Text style={styles.meta}>
            {athlete.sport} · {athlete.position}
          </Text>
          <Text style={styles.meta}>Age {athlete.age}</Text>
        </View>

        {/* Score badge */}
        <View style={[styles.scoreBadge, { backgroundColor: scoreColor + '18' }]}>
          <Text style={[styles.scoreText, { color: scoreColor }]}>
            {athlete.score}
          </Text>
        </View>
      </View>

      {/* Bottom: mini progress bar */}
      <View style={styles.barRow}>
        <Text style={styles.barLabel}>Score</Text>
        <View style={styles.barContainer}>
          <ProgressBar value={athlete.score} height={6} />
        </View>
        <Text style={[styles.barValue, { color: scoreColor }]}>
          {athlete.score}/100
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  info: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  name: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  meta: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: 1,
  },
  scoreBadge: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  barLabel: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    width: 34,
  },
  barContainer: {
    flex: 1,
  },
  barValue: {
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.semibold,
    width: 38,
    textAlign: 'right',
  },
});
```

---

### 8.6 `StatRow` (`src/components/StatRow.tsx`)

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import ProgressBar from './ProgressBar';

interface StatRowProps {
  label: string;
  value: number;    // 0–100
}

export default function StatRow({ label, value }: StatRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barContainer}>
        <ProgressBar value={value} height={8} />
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  label: {
    width: 110,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.medium,
    textTransform: 'capitalize',
  },
  barContainer: {
    flex: 1,
  },
  value: {
    width: 28,
    textAlign: 'right',
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
});
```

---

## 9. Screens

### 9.1 `DiscoverScreen` (`src/screens/DiscoverScreen.tsx`)

```typescript
import React, { useState, useMemo, useCallback } from 'react';
import {
  View, TextInput, Text, FlatList,
  StyleSheet, SafeAreaView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import athletes from '@/data/athletes.json';
import { Athlete, Sport, DiscoverStackParamList } from '@/types';
import { theme } from '@/constants/theme';
import useDebounce from '@/hooks/useDebounce';
import AthleteCard from '@/components/AthleteCard';
import FilterChip from '@/components/FilterChip';
import EmptyState from '@/components/EmptyState';

type Props = NativeStackScreenProps<DiscoverStackParamList, 'Feed'>;

const SPORT_FILTERS: Array<Sport | 'All'> = ['All', 'Football', 'Basketball', 'Athletics'];

export default function DiscoverScreen({ navigation }: Props) {
  const [searchText, setSearchText]     = useState('');
  const [activeFilter, setActiveFilter] = useState<Sport | 'All'>('All');

  // Debounced search — only filters 300ms after user stops typing
  const debouncedSearch = useDebounce(searchText, 300);

  // Filtered list — recomputes only when debounced search or filter changes
  const filteredAthletes = useMemo(() => {
    return (athletes as Athlete[]).filter(athlete => {
      const matchesSport  = activeFilter === 'All' || athlete.sport === activeFilter;
      const matchesSearch = athlete.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase().trim());
      return matchesSport && matchesSearch;
    });
  }, [debouncedSearch, activeFilter]);

  const handleCardPress = useCallback((id: string) => {
    navigation.navigate('Profile', { athleteId: id });
  }, [navigation]);

  const handleFilterPress = useCallback((filter: Sport | 'All') => {
    setActiveFilter(filter);
  }, []);

  const resultText = `Showing ${filteredAthletes.length} result${filteredAthletes.length !== 1 ? 's' : ''}`;

  return (
    <SafeAreaView style={styles.container}>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search athletes..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          clearButtonMode="while-editing"   // iOS only — shows X button
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {/* Result count */}
      <Text style={styles.resultCount}>{resultText}</Text>

      {/* Filter chips — horizontal scroll for smaller screens */}
      <View style={styles.chipsRow}>
        {SPORT_FILTERS.map(filter => (
          <FilterChip
            key={filter}
            label={filter}
            active={activeFilter === filter}
            onPress={() => handleFilterPress(filter)}
          />
        ))}
      </View>

      {/* Athlete Feed */}
      <FlatList
        data={filteredAthletes}
        keyExtractor={(item) => item.id}              // Must be unique string
        renderItem={({ item }) => (
          <AthleteCard
            athlete={item}
            onPress={() => handleCardPress(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[
          styles.listContent,
          filteredAthletes.length === 0 && styles.listContentEmpty
        ]}
        ListEmptyComponent={
          <EmptyState
            icon="🔍"
            title="No athletes found"
            subtitle="Try a different name or change the sport filter"
          />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"   // Tap card without dismissing keyboard
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  searchInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resultCount: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  listContentEmpty: {
    flex: 1,   // Makes EmptyState fill the screen vertically
  },
  separator: {
    height: theme.spacing.sm,
  },
});
```

---

### 9.2 `ProfileScreen` (`src/screens/ProfileScreen.tsx`)

```typescript
import React, { useMemo } from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, StyleSheet, ActivityIndicator
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import athletes from '@/data/athletes.json';
import { Athlete, DiscoverStackParamList, isFootballStats, isBasketballStats } from '@/types';
import { theme, getScoreColor } from '@/constants/theme';
import useShortlist from '@/hooks/useShortlist';
import Avatar from '@/components/Avatar';
import ProgressBar from '@/components/ProgressBar';
import StatRow from '@/components/StatRow';

type Props = NativeStackScreenProps<DiscoverStackParamList, 'Profile'>
  & ReturnType<typeof useShortlist>;   // shortlistProps passed from navigator

export default function ProfileScreen({
  route, isShortlisted, toggleShortlist
}: Props) {
  const { athleteId } = route.params;

  // Look up athlete by ID — never pass full objects through navigation params
  const athlete = useMemo(
    () => (athletes as Athlete[]).find(a => a.id === athleteId),
    [athleteId]
  );

  if (!athlete) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Athlete not found</Text>
      </View>
    );
  }

  const shortlisted   = isShortlisted(athlete.id);
  const scoreColor    = getScoreColor(athlete.score);

  // Build stat entries generically from the stats object
  const statEntries = Object.entries(athlete.stats).map(([key, value]) => ({
    // "threePointAcc" → "Three Point Acc"
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
    value: value as number,
  }));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <View style={styles.hero}>
        <Avatar name={athlete.name} id={athlete.id} size={72} />
        <Text style={styles.name}>{athlete.name}</Text>
        <Text style={styles.meta}>
          {athlete.sport} · {athlete.position} · Age {athlete.age}
        </Text>
      </View>

      {/* Bio */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bio}>{athlete.bio}</Text>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        {statEntries.map(({ label, value }) => (
          <StatRow key={label} label={label} value={value} />
        ))}
      </View>

      {/* Readiness Score */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Readiness Score</Text>
        <ProgressBar value={athlete.score} height={16} />
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreNumber, { color: scoreColor }]}>
            {athlete.score}
          </Text>
          <Text style={styles.scoreOutOf}> / 100</Text>
        </View>
      </View>

      {/* Shortlist Button */}
      <TouchableOpacity
        style={[
          styles.shortlistButton,
          shortlisted
            ? styles.shortlistButtonRemove
            : styles.shortlistButtonAdd
        ]}
        onPress={() => toggleShortlist(athlete)}
        activeOpacity={0.8}
      >
        <Text style={styles.shortlistButtonText}>
          {shortlisted ? '✓  Remove from Shortlist' : '+  Add to Shortlist'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: theme.spacing.xxl,
  },
  centered: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  errorText: {
    color: theme.colors.textSecondary, fontSize: theme.fontSizes.md,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  name: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  meta: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
  },

  // Sections
  section: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  bio: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },

  // Score
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  scoreNumber: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
  },
  scoreOutOf: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.textSecondary,
  },

  // Shortlist Button
  shortlistButton: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.md + 2,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  shortlistButtonAdd: {
    backgroundColor: theme.colors.primary,
  },
  shortlistButtonRemove: {
    backgroundColor: theme.colors.danger,
  },
  shortlistButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
  },
});
```

---

### 9.3 `ShortlistScreen` (`src/screens/ShortlistScreen.tsx`)

```typescript
import React, { useRef } from 'react';
import {
  View, Text, FlatList,
  TouchableOpacity, StyleSheet, ActivityIndicator
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { Athlete } from '@/types';
import { theme } from '@/constants/theme';
import useShortlist from '@/hooks/useShortlist';
import AthleteCard from '@/components/AthleteCard';
import EmptyState from '@/components/EmptyState';

type Props = ReturnType<typeof useShortlist>;

export default function ShortlistScreen({
  shortlist, removeFromShortlist, isLoading
}: Props) {

  const avgScore = shortlist.length > 0
    ? Math.round(
        shortlist.reduce((sum, a) => sum + a.score, 0) / shortlist.length
      )
    : 0;

  // ── Swipe-to-delete right action ────────────────────────────────────────────
  const renderRightActions = (athleteId: string) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => removeFromShortlist(athleteId)}
    >
      <Text style={styles.deleteIcon}>🗑️</Text>
      <Text style={styles.deleteText}>Remove</Text>
    </TouchableOpacity>
  );

  // Loading state while AsyncStorage reads on mount
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Stats bar — only shown when list has items */}
      {shortlist.length > 0 && (
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{shortlist.length}</Text>
            <Text style={styles.statLabel}>Athletes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{avgScore}</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
        </View>
      )}

      <FlatList
        data={shortlist}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => renderRightActions(item.id)}
            overshootRight={false}   // Prevents rubber-band overscroll
            friction={2}             // Swipe resistance feel
          >
            <AthleteCard
              athlete={item}
              onPress={() => {}}     // No navigation from Shortlist tab (optional)
            />
          </Swipeable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[
          styles.listContent,
          shortlist.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={
          <EmptyState
            icon="🏆"
            title="No athletes shortlisted"
            subtitle="Swipe right on the Discover tab to find talent worth saving"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },

  // Stats bar
  statsBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xs,
  },

  // List
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
  },
  listContentEmpty: {
    flex: 1,
  },
  separator: {
    height: theme.spacing.sm,
  },

  // Swipe delete action
  deleteAction: {
    backgroundColor: theme.colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: theme.borderRadius.md,
    marginLeft: theme.spacing.sm,
    marginBottom: 0,
  },
  deleteIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  deleteText: {
    color: theme.colors.textInverse,
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.semibold,
  },
});
```

---

## 10. AsyncStorage — Technical Details

### Key Used
```
'@scoutiq_shortlist'
```

Using a namespaced key (with `@appname_` prefix) avoids collision with any
other apps or libraries that might use AsyncStorage on the same device.

### Data Format Stored
```json
[
  { "id": "1", "name": "Rahul Sharma", "sport": "Football", ... },
  { "id": "6", "name": "Karan Singh", "sport": "Basketball", ... }
]
```

Full athlete objects are stored (not just IDs) so the Shortlist screen
can render without cross-referencing the athletes array.

### Read/Write Flow
```
App Launch
  └── useShortlist mounts in AppNavigator
      └── useEffect fires → AsyncStorage.getItem('@scoutiq_shortlist')
          ├── Found → JSON.parse → setShortlist(parsed)
          └── Not found → setShortlist([])   ← first launch
          └── finally → setIsLoading(false)

User taps "Add to Shortlist"
  └── toggleShortlist(athlete) called
      └── setShortlist(updated)           ← UI updates immediately
      └── AsyncStorage.setItem(...)       ← persists in background
```

### Testing AsyncStorage (Do This at Hour 9)
```
1. Add 2-3 athletes to shortlist
2. Shake device → "Reload" in Expo Dev Menu
   OR close Expo Go completely and reopen
3. Navigate to Shortlist tab
4. Athletes must still be there ← this is what the grader checks
```

---

## 11. Critical Technical Rules

### Rule 1 — Never Use ScrollView for the Feed
```typescript
// ❌ WRONG — ScrollView renders ALL items at once
<ScrollView>
  {athletes.map(a => <AthleteCard key={a.id} athlete={a} />)}
</ScrollView>

// ✅ CORRECT — FlatList only renders visible items (virtualized)
<FlatList
  data={athletes}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <AthleteCard athlete={item} />}
/>
```

### Rule 2 — Never Use `any` Type
```typescript
// ❌ WRONG
const athlete: any = athletes[0];

// ✅ CORRECT
const athlete: Athlete = athletes[0];
```

### Rule 3 — Never Pass Full Objects Through Navigation Params
```typescript
// ❌ WRONG — large objects in params cause memory issues
navigation.navigate('Profile', { athlete: athleteObject });

// ✅ CORRECT — pass only the ID, look up in the screen
navigation.navigate('Profile', { athleteId: athlete.id });
const athlete = athletes.find(a => a.id === athleteId);
```

### Rule 4 — Never Call useShortlist in Multiple Screens
```typescript
// ❌ WRONG — creates separate state instances, they go out of sync
// In DiscoverScreen: const { isShortlisted } = useShortlist();
// In ProfileScreen:  const { toggleShortlist } = useShortlist();

// ✅ CORRECT — call once in AppNavigator, pass down as props
const shortlistProps = useShortlist(); // In AppNavigator only
// Pass shortlistProps to all screens that need it
```

### Rule 5 — Always GestureHandlerRootView at App Root
```typescript
// ❌ WRONG — swipe-to-delete silently broken on Android
<NavigationContainer><AppNavigator /></NavigationContainer>

// ✅ CORRECT
<GestureHandlerRootView style={{ flex: 1 }}>
  <NavigationContainer><AppNavigator /></NavigationContainer>
</GestureHandlerRootView>
```

### Rule 6 — Always `npx expo install` for Expo Packages
```bash
# ❌ WRONG — may install incompatible version
npm install react-native-gesture-handler

# ✅ CORRECT — Expo resolves compatible version
npx expo install react-native-gesture-handler
```

---

## 12. Score Color Logic

Used consistently across AthleteCard, ProgressBar, and ProfileScreen.
Defined once in `theme.ts`, imported everywhere.

```typescript
export const getScoreColor = (score: number): string => {
  if (score >= 80) return theme.colors.success;   // '#10B981' green
  if (score >= 60) return theme.colors.warning;   // '#F59E0B' amber
  return theme.colors.danger;                      // '#EF4444' red
};
```

| Score Range | Color | Meaning |
|---|---|---|
| 80 – 100 | Green `#10B981` | High readiness |
| 60 – 79 | Amber `#F59E0B` | Mid readiness |
| 0 – 59 | Red `#EF4444` | Low readiness |

---

## 13. Platform-Specific Considerations

### iOS
- `clearButtonMode="while-editing"` on TextInput shows native X button
- `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` for card shadow
- Safe area handled by `react-native-safe-area-context`

### Android
- `elevation: 3` for card shadow (iOS shadow props ignored on Android)
- `GestureHandlerRootView` is especially important — swipe gestures silently
  fail without it on Android
- Status bar color handled automatically by React Navigation

### Both
- Test swipe-to-delete on a real device if possible — simulator gesture
  simulation can be unreliable for swipe interactions

---

## 14. Build Order & File Creation Sequence

Follow this exact order — each file depends on the ones above it.

```
Hour 0:00  npx create-expo-app + install dependencies + babel config
Hour 0:30  src/types/index.ts
Hour 0:45  src/data/athletes.json
Hour 1:00  src/constants/theme.ts
Hour 1:30  App.tsx (GestureHandlerRootView + NavigationContainer)
Hour 1:45  src/navigation/AppNavigator.tsx (shell only, placeholder screens)
           → Verify: app loads, two tabs visible ✓
Hour 2:00  src/components/ProgressBar.tsx
Hour 2:15  src/components/Avatar.tsx
Hour 2:30  src/components/FilterChip.tsx
Hour 2:45  src/components/EmptyState.tsx
Hour 3:00  src/components/StatRow.tsx
Hour 3:15  src/components/AthleteCard.tsx
           → Verify: render a single AthleteCard, looks correct ✓
Hour 3:30  src/hooks/useDebounce.ts
Hour 3:45  src/screens/DiscoverScreen.tsx
           → Verify: feed shows 15 cards, filter chips work, search debounces ✓
Hour 5:30  src/hooks/useShortlist.ts
           → Verify: add athlete, reload app, still there ✓
Hour 7:00  src/screens/ProfileScreen.tsx
           → Verify: stats render, progress bar shows, shortlist button toggles ✓
Hour 9:00  src/screens/ShortlistScreen.tsx
           → Verify: swipe-to-delete works, empty state shows, stats bar correct ✓
Hour 11:00 Wire shortlistProps through AppNavigator fully
           → Verify: add from Profile, see in Shortlist, remove from Shortlist,
                     Profile button updates correctly ✓
Hour 12:00 Tab badge wired up
Hour 12:30 Full end-to-end test pass
```

---

## 15. README Template

```markdown
# ScoutIQ

A React Native app for sports talent scouts to browse athletes,
review profiles, and maintain a shortlist.

## Tech Stack
React Native (Expo SDK 51) · TypeScript · React Navigation v6 · AsyncStorage

## Setup
1. Clone the repo: `git clone <url>`
2. Install deps: `npm install`
3. Start: `npx expo start --clear`
4. Scan QR with Expo Go on iOS or Android

## Key Decisions
- **Score formula:** Average of all stat values, rounded to integer.
  `score = Math.round(sum(stats) / count(stats))`
- **Single useShortlist instance:** Hook called once in AppNavigator and
  props passed down to avoid de-synced state between screens.
- **Swipeable over custom Reanimated:** Used react-native-gesture-handler's
  Swipeable for swipe-to-delete — reliable on both platforms within time budget.
- **Dynamic score colors:** green ≥ 80, amber 60–79, red < 60 for instant
  visual signal to scouts.

## What's Incomplete
- [List anything you didn't finish here]
- [Explain the tradeoff: time vs complexity]

## What I'd Do Differently
- [Honest reflection — e.g. "use React Context for cleaner prop threading"]

## AI Tools Used
- Claude: TRD generation, component architecture, hook design
- [Any other tools you used and for what]
```

---

*TRD Version 1.0 — ScoutIQ 24-Hour Build*

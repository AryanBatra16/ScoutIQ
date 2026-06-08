# ScoutIQ — Product Requirements Document
**Version:** 1.0  
**Timeline:** 24 Hours  
**Platform:** React Native (Expo) + TypeScript  
**Mode:** Solo Build  

---

## 1. Product Overview

ScoutIQ is a mobile app for sports talent scouts to browse athletes, review individual profiles, and maintain a shortlist for upcoming trials. All data is local — no backend, no Firebase, no cloud.

### 1.1 Core Goals
- Let a scout **discover** athletes quickly via a filterable, searchable feed
- Let a scout **study** an athlete's full stats on a dedicated profile screen
- Let a scout **save** promising athletes to a persistent shortlist
- Work cleanly on both **iOS and Android**

### 1.2 What We Are NOT Building
- No authentication / login
- No real API or backend
- No push notifications
- No athlete editing / creation by the user
- No social features

---

## 2. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React Native + Expo SDK 51 | Fast setup, cross-platform, Expo Go for testing |
| Language | TypeScript (strict) | Required by assignment, catches bugs early |
| Navigation | React Navigation v6 | Bottom tabs + stack navigator |
| Persistence | AsyncStorage | Simple key-value store, survives app restarts |
| Styling | StyleSheet API only | Assignment rule — no UI kits |
| Gestures | react-native-gesture-handler + Reanimated | Required for swipe-to-delete on Shortlist |
| State | React built-ins (useState, useEffect, custom hooks) | No Redux needed at this scope |

### 2.1 Full Dependency List

```bash
# Core
expo ~51.0.0
react 18.2.0
react-native 0.74.0
typescript ^5.x

# Navigation
@react-navigation/native
@react-navigation/bottom-tabs
@react-navigation/native-stack
react-native-screens
react-native-safe-area-context

# Storage
@react-native-async-storage/async-storage

# Gestures (for swipe-to-delete)
react-native-gesture-handler
react-native-reanimated
```

---

## 3. Folder Structure

```
ScoutIQ/
├── src/
│   ├── components/
│   │   ├── AthleteCard.tsx         ← Feed card with avatar, score, mini progress bar
│   │   ├── ProgressBar.tsx         ← Reusable custom progress bar (no lib)
│   │   ├── FilterChip.tsx          ← Sport filter pill button
│   │   ├── Avatar.tsx              ← Colored circle with initials
│   │   ├── EmptyState.tsx          ← Reusable empty state component
│   │   └── StatRow.tsx             ← Single stat row on Profile screen
│   ├── screens/
│   │   ├── DiscoverScreen.tsx      ← Feed + search + filters
│   │   ├── ProfileScreen.tsx       ← Athlete detail + shortlist button
│   │   └── ShortlistScreen.tsx     ← Saved athletes list
│   ├── navigation/
│   │   └── AppNavigator.tsx        ← All navigation config in one file
│   ├── hooks/
│   │   ├── useShortlist.ts         ← AsyncStorage read/write logic
│   │   └── useDebounce.ts          ← 300ms debounce for search
│   ├── data/
│   │   └── athletes.json           ← 15 mock athletes across 3 sports
│   ├── types/
│   │   └── index.ts                ← All TypeScript interfaces
│   └── constants/
│       └── theme.ts                ← Colors, spacing, fontSizes, borderRadius
├── App.tsx                         ← Entry point, wraps NavigationContainer
├── app.json
├── tsconfig.json
└── README.md
```

---

## 4. Data Model

### 4.1 TypeScript Types (`src/types/index.ts`)

```typescript
// Sport-specific stats shapes
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

export type Sport = 'Football' | 'Basketball' | 'Athletics';

export interface Athlete {
  id: string;
  name: string;
  sport: Sport;
  position: string;
  age: number;
  bio: string;
  stats: SportStats;
  score: number;        // Derived: average of all stat values, pre-calculated
}

// Navigation types
export type RootTabParamList = {
  Discover: undefined;
  Shortlist: undefined;
};

export type DiscoverStackParamList = {
  Feed: undefined;
  Profile: { athleteId: string };
};
```

### 4.2 Score Formula

```
score = Math.round(
  Object.values(athlete.stats).reduce((sum, val) => sum + val, 0) /
  Object.values(athlete.stats).length
)
```

Pre-calculate and store in each athlete object in `athletes.json`.  
Document this formula in the README.

### 4.3 Mock Data Shape (`src/data/athletes.json`)

```json
[
  {
    "id": "1",
    "name": "Rahul Sharma",
    "sport": "Football",
    "position": "Striker",
    "age": 22,
    "bio": "Playing since age 12, represented Delhi state under-19 team.",
    "stats": {
      "speed": 88,
      "stamina": 76,
      "accuracy": 91,
      "dribbling": 83
    },
    "score": 85
  }
  // ... 14 more athletes: 5 Football, 5 Basketball, 5 Athletics
]
```

**Required distribution:** 5 Football · 5 Basketball · 5 Athletics  
**Score range:** Spread across 55–95 to make sorting interesting

---

## 5. Theme & Design System (`src/constants/theme.ts`)

```typescript
export const theme = {
  colors: {
    primary: '#6C63FF',         // Accent — buttons, active chips, progress bar fill
    primaryLight: '#EEF0FF',    // Chip selected background
    background: '#F7F8FC',      // Screen background
    surface: '#FFFFFF',         // Card background
    text: '#1A1A2E',            // Primary text
    textSecondary: '#6B7280',   // Secondary text (age, position)
    border: '#E5E7EB',          // Card border, dividers
    success: '#10B981',         // Shortlisted indicator
    danger: '#EF4444',          // Remove button
    scoreHigh: '#10B981',       // Score >= 80
    scoreMid: '#F59E0B',        // Score 60–79
    scoreLow: '#EF4444',        // Score < 60
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 999,
  },
};
```

### Avatar Colors (cycle by athlete id)
```typescript
export const AVATAR_COLORS = [
  '#6C63FF', '#F59E0B', '#10B981',
  '#EF4444', '#3B82F6', '#8B5CF6'
];
```

---

## 6. Screen Specifications

---

### 6.1 Screen: Discover (Feed)

**File:** `src/screens/DiscoverScreen.tsx`  
**Points:** 30 (feed) + 10 (search) = 40 pts  
**Route:** Tab root → `Feed` in stack

#### Layout (top to bottom):
```
┌──────────────────────────────┐
│  Header: "Discover"          │  ← React Navigation header
├──────────────────────────────┤
│  [ 🔍 Search athletes...   ] │  ← TextInput
│  Showing 15 results          │  ← Dynamic count
├──────────────────────────────┤
│ [All] [⚽ Football] [🏀 Basketball] [🏃 Athletics] │  ← Filter chips
├──────────────────────────────┤
│                              │
│  [ AthleteCard ]             │  ← FlatList
│  [ AthleteCard ]             │
│  [ AthleteCard ]             │
│  ...                         │
│                              │
│  OR: EmptyState component    │  ← If no results
└──────────────────────────────┘
```

#### Component Rules:
- Use `FlatList` — **not ScrollView**
- `keyExtractor={(item) => item.id}` — must be correct
- `contentContainerStyle={{ padding: theme.spacing.md }}` with `ItemSeparatorComponent` for gap
- Search and sport filter work together — both can be active simultaneously
- Result count shows filtered count, not total

#### Search Behavior:
- Debounce: 300ms via `useDebounce` hook
- Filters by `athlete.name.toLowerCase().includes(query.toLowerCase())`
- Count text: `"Showing {n} result{n !== 1 ? 's' : ''}"`

#### Filter Chip Behavior:
- Default: "All" is active
- Tap sport chip → deactivates "All", shows only that sport
- Tap active sport chip again → resets to "All"
- Active chip: `backgroundColor: theme.colors.primaryLight`, `color: theme.colors.primary`, border accent color
- Inactive chip: `backgroundColor: theme.colors.surface`, `color: theme.colors.textSecondary`

#### Empty State:
- Icon: 🔍 (emoji or vector)
- Title: "No athletes found"
- Subtitle: "Try a different search or filter"

---

### 6.2 Component: AthleteCard

**File:** `src/components/AthleteCard.tsx`

```
┌─────────────────────────────────────┐
│  [Avatar]  Rahul Sharma         87  │
│   R S      Football · Striker       │
│            Age 22                   │
│                                     │
│  Score  [████████████░░░░░]  87/100 │
└─────────────────────────────────────┘
```

**Props:**
```typescript
interface AthleteCardProps {
  athlete: Athlete;
  onPress: () => void;
}
```

**Details:**
- Shadow: `elevation: 3` (Android), `shadowOpacity: 0.08, shadowRadius: 8` (iOS)
- Avatar: colored circle (from `AVATAR_COLORS[id % 6]`), initials from first+last name
- Score color: green if ≥80, amber if 60–79, red if <60
- Mini progress bar at bottom: custom, height 6, rounded, same color logic as score
- `TouchableOpacity` wrapper, `activeOpacity: 0.7`

---

### 6.3 Component: Avatar

**File:** `src/components/Avatar.tsx`

```typescript
// Colored circle, initials derived from name
// "Rahul Sharma" → "RS"
// Size: 44px on card, 64px on profile screen
```

---

### 6.4 Screen: Athlete Profile

**File:** `src/screens/ProfileScreen.tsx`  
**Points:** 25 pts  
**Route:** Navigated to from AthleteCard press, receives `athleteId`

#### Layout:
```
┌──────────────────────────────┐
│  ← Back         [Add/Remove] │  ← Header with shortlist button
├──────────────────────────────┤
│  [ Large Avatar ]            │
│  Rahul Sharma                │
│  Football · Striker · Age 22 │
├──────────────────────────────┤
│  Bio                         │
│  "Playing since age 12..."   │
├──────────────────────────────┤
│  Stats                       │
│  Speed      88  [████████░░] │
│  Stamina    76  [███████░░░] │
│  Accuracy   91  [█████████░] │
│  Dribbling  83  [████████░░] │
├──────────────────────────────┤
│  Readiness Score             │
│  [████████████████████░░░░]  │
│         87 / 100             │
├──────────────────────────────┤
│  [ Add to Shortlist ]        │  ← Full width button, color changes
└──────────────────────────────┘
```

#### Athlete Lookup:
```typescript
// In component
const { athleteId } = route.params;
const athlete = athletes.find(a => a.id === athleteId);
```

#### Stats Section:
- Each stat is a `StatRow` component
- `StatRow` props: `label: string`, `value: number`
- Shows label, number, and mini progress bar in one row

#### Readiness Score / Progress Bar:
- Custom built: two `View` elements
```typescript
// Outer: full width, gray background, rounded
// Inner: width = `${score}%`, accent color, rounded
<View style={styles.progressOuter}>
  <View style={[styles.progressInner, { width: `${score}%` }]} />
</View>
```
- Height: 14px on profile (larger than card)
- Score label centered below

#### Shortlist Button:
- NOT shortlisted → `"+ Add to Shortlist"`, `backgroundColor: theme.colors.primary`
- IS shortlisted → `"✓ Remove from Shortlist"`, `backgroundColor: theme.colors.danger`
- Reads state from `useShortlist` hook — always live, never stale
- Pressing triggers `toggleShortlist(athlete)` from hook

#### Back Navigation:
- React Navigation's default back button — no custom implementation needed
- Profile screen should NOT pass shortlist state via params — read from hook directly to prevent stale state

---

### 6.5 Screen: Shortlist

**File:** `src/screens/ShortlistScreen.tsx`  
**Points:** 25 pts  
**Route:** Bottom tab

#### Layout (with data):
```
┌──────────────────────────────┐
│  Header: "Shortlist"         │
├──────────────────────────────┤
│  3 Athletes · Avg Score: 82  │  ← Recalculates live
├──────────────────────────────┤
│  [ AthleteCard ] ← swipe     │  ← Swipe left to reveal delete
│  [ AthleteCard ] ← swipe     │
│  [ AthleteCard ] ← swipe     │
└──────────────────────────────┘
```

#### Layout (empty):
```
┌──────────────────────────────┐
│  Shortlist                   │
├──────────────────────────────┤
│                              │
│          🏆                  │
│   No athletes shortlisted    │
│   Go discover some talent!   │
│                              │
│   [ Browse Athletes ]        │  ← Optional: navigates to Discover tab
└──────────────────────────────┘
```

#### Stats Bar:
```typescript
const avgScore = shortlist.length > 0
  ? Math.round(shortlist.reduce((sum, a) => sum + a.score, 0) / shortlist.length)
  : 0;
```

#### Swipe-to-Delete Implementation:
```
Library: react-native-gesture-handler + react-native-reanimated
Pattern:
- Wrap each card in a swipeable row
- Swipe left reveals red "Delete" action panel
- Confirm deletion removes from shortlist and AsyncStorage
```

**Implementation approach:**
```typescript
import Swipeable from 'react-native-gesture-handler/Swipeable';

const renderRightActions = (athleteId: string) => (
  <TouchableOpacity style={styles.deleteAction} onPress={() => removeFromShortlist(athleteId)}>
    <Text style={styles.deleteText}>Remove</Text>
  </TouchableOpacity>
);

<Swipeable renderRightActions={() => renderRightActions(athlete.id)}>
  <AthleteCard athlete={athlete} onPress={() => {}} />
</Swipeable>
```

---

## 7. Hooks

### 7.1 `useShortlist` (`src/hooks/useShortlist.ts`)

**This is the most important hook. All AsyncStorage logic lives here.**

```typescript
interface UseShortlistReturn {
  shortlist: Athlete[];
  isShortlisted: (id: string) => boolean;
  addToShortlist: (athlete: Athlete) => Promise<void>;
  removeFromShortlist: (id: string) => Promise<void>;
  toggleShortlist: (athlete: Athlete) => Promise<void>;
  isLoading: boolean;
}
```

**Behavior:**
- On mount: reads from AsyncStorage key `'@scoutiq_shortlist'`
- `addToShortlist`: appends to array, writes full array back to AsyncStorage
- `removeFromShortlist`: filters out by id, writes back
- `toggleShortlist`: checks `isShortlisted`, calls add or remove accordingly
- `isLoading`: true while initial AsyncStorage read is in progress

**AsyncStorage pattern:**
```typescript
const STORAGE_KEY = '@scoutiq_shortlist';

const loadShortlist = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveShortlist = async (list: Athlete[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};
```

---

### 7.2 `useDebounce` (`src/hooks/useDebounce.ts`)

```typescript
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
```

**Usage in DiscoverScreen:**
```typescript
const [searchText, setSearchText] = useState('');
const debouncedSearch = useDebounce(searchText, 300);

// Only filter when debouncedSearch changes, not on every keystroke
```

---

## 8. Navigation

**File:** `src/navigation/AppNavigator.tsx`

### Structure:
```
NavigationContainer
└── BottomTabNavigator
    ├── Tab: "Discover"  (icon: compass)
    │   └── DiscoverStack (NativeStackNavigator)
    │       ├── Screen: "Feed"     → DiscoverScreen
    │       └── Screen: "Profile"  → ProfileScreen
    └── Tab: "Shortlist"  (icon: bookmark)
        └── Screen: "Shortlist"  → ShortlistScreen
```

### Header Styling (consistent across all screens):
```typescript
const screenOptions = {
  headerStyle: { backgroundColor: theme.colors.surface },
  headerTintColor: theme.colors.text,
  headerTitleStyle: { fontWeight: '700', fontSize: theme.fontSizes.lg },
  headerShadowVisible: false,
};
```

### Tab Bar Styling:
```typescript
tabBarStyle: {
  backgroundColor: theme.colors.surface,
  borderTopColor: theme.colors.border,
  height: 60,
  paddingBottom: 8,
},
tabBarActiveTintColor: theme.colors.primary,
tabBarInactiveTintColor: theme.colors.textSecondary,
```

### Shortlist Tab Badge:
```typescript
tabBarBadge: shortlist.length > 0 ? shortlist.length : undefined
// Shows count on Shortlist tab icon
```

---

## 9. Component Inventory

| Component | File | Used In | Props |
|---|---|---|---|
| `AthleteCard` | components/ | Discover, Shortlist | `athlete`, `onPress` |
| `ProgressBar` | components/ | AthleteCard, Profile | `value` (0–100), `height`, `color?` |
| `FilterChip` | components/ | Discover | `label`, `active`, `onPress` |
| `Avatar` | components/ | AthleteCard, Profile | `name`, `size`, `color` |
| `EmptyState` | components/ | Discover, Shortlist | `icon`, `title`, `subtitle`, `action?` |
| `StatRow` | components/ | Profile | `label`, `value` |

---

## 10. Edge Cases & States

| Scenario | Handling |
|---|---|
| Search returns 0 results | EmptyState: "No athletes found" |
| Shortlist is empty | EmptyState: "No athletes shortlisted" |
| Sport filter + search = 0 results | EmptyState shown |
| App restarted | Shortlist loaded from AsyncStorage |
| Athlete shortlisted → view Profile | Button shows "Remove from Shortlist" |
| Remove from Shortlist tab → go to Profile | Button correctly shows "Add to Shortlist" |
| AsyncStorage read in progress | `isLoading` true, show ActivityIndicator on Shortlist tab |
| Single result | "Showing 1 result" (not "1 results") |

---

## 11. 24-Hour Build Timeline

| Time Block | Task | Deliverable |
|---|---|---|
| **0:00 – 0:30** | Expo init, install all deps, folder structure | Boilerplate running on Expo Go |
| **0:30 – 1:00** | `types/index.ts` + `athletes.json` (15 athletes) | Data layer complete |
| **1:00 – 1:30** | `theme.ts` + `AppNavigator.tsx` | Navigation shell, tabs visible |
| **1:30 – 2:00** | `Avatar.tsx` + `ProgressBar.tsx` + `FilterChip.tsx` | Reusable atoms done |
| **2:00 – 4:00** | `AthleteCard.tsx` + `DiscoverScreen.tsx` (feed only, no search yet) | Scrollable feed working |
| **4:00 – 5:00** | `useDebounce.ts` + Search bar on Discover | Search working with debounce |
| **5:00 – 5:30** | Filter chips on Discover | Sport filter working |
| **5:30 – 6:00** | EmptyState on Discover | Empty state covered |
| **6:00 – 8:30** | `ProfileScreen.tsx` (stats, progress bar, bio) | Profile screen complete (no shortlist yet) |
| **8:30 – 9:00** | `useShortlist.ts` (AsyncStorage hook) | Hook complete and tested |
| **9:00 – 9:30** | Wire shortlist button on ProfileScreen | Add/Remove working |
| **9:30 – 11:00** | `ShortlistScreen.tsx` (list + stats bar + empty state) | Shortlist tab complete |
| **11:00 – 12:30** | Swipe-to-delete on Shortlist | Gesture handler working |
| **12:30 – 13:00** | Tab badge for shortlist count | Polish detail done |
| **13:00 – 16:00** | **FULL TEST PASS** — test every edge case, restart app to verify AsyncStorage | All features verified |
| **16:00 – 19:00** | UI polish — spacing, colors, shadows, consistency pass | Visual polish done |
| **19:00 – 21:00** | iOS + Android testing via Expo Go | Cross-platform verified |
| **21:00 – 23:00** | README.md — setup steps, decisions, what's incomplete | Submission doc complete |
| **23:00 – 24:00** | Buffer — bug fixes, final push to GitHub | **Submitted ✓** |

---

## 12. README Requirements

Your README must cover exactly these sections:

### 12.1 How to Run Locally
```markdown
## Setup
1. Clone the repo
2. `npm install`
3. `npx expo start`
4. Scan QR with Expo Go (iOS/Android)
```

### 12.2 Key Decisions
- Score formula used and why
- Why `useShortlist` hook over Context/Redux
- Why swipe-to-delete was chosen over a button
- How search + filter interact (AND logic)

### 12.3 What's Incomplete & Why
- List anything you didn't finish
- Explain the tradeoff honestly (time vs complexity)

### 12.4 One Thing I'd Do Differently
- Be honest — e.g. "I'd add React Context to share shortlist state more cleanly"

### 12.5 AI Tools Used
- List which tools (Claude, Copilot, etc.) and what you used them for

---

## 13. Grading Checklist

Use this before submitting:

### Feature Completeness (40 pts)
- [ ] FlatList with correct keyExtractor
- [ ] Filter chips — All / Football / Basketball / Athletics
- [ ] Search with 300ms debounce
- [ ] Result count below search bar
- [ ] Empty state on Discover
- [ ] Profile screen with full stats
- [ ] Custom progress bar (no external lib)
- [ ] Add/Remove shortlist button with live state
- [ ] Shortlist tab with total count + avg score
- [ ] AsyncStorage — survives app restart ← **test this**
- [ ] Swipe-to-delete on Shortlist
- [ ] Empty state on Shortlist
- [ ] Bottom tab navigator
- [ ] Stack navigator for Feed → Profile

### Code Quality (25 pts)
- [ ] No `any` types — all interfaces defined
- [ ] Custom hooks for shared logic
- [ ] Reusable components (no duplicate code)
- [ ] Consistent folder structure

### UI/UX Polish (20 pts)
- [ ] Consistent header across all screens
- [ ] Avatar with initials on cards
- [ ] Score color (green/amber/red)
- [ ] Cards have shadow/elevation
- [ ] No broken states anywhere
- [ ] Smooth tab + stack transitions

### README (15 pts)
- [ ] Setup instructions work
- [ ] Decisions documented
- [ ] Incomplete items listed honestly
- [ ] AI tools mentioned

---

## 14. Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Swipe-to-delete setup broken | Medium | If stuck >1 hour, fallback to Remove button and note in README |
| AsyncStorage not persisting | Low | Test at Hour 9, not Hour 23 |
| TypeScript errors blocking build | Medium | Set up tsconfig correctly at Hour 0 |
| Stale shortlist state on Profile | Medium | Read from hook directly, never from route params |
| Looks broken on Android | Medium | Test on Android emulator by Hour 19 |

---

*PRD Version 1.0 — ScoutIQ 24-Hour Build*

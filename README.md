# ScoutIQ ⚡
A modern sports talent scouting application built with React Native, Expo, and TypeScript — helping scouts discover, evaluate, and shortlist promising athletes.

## Features
- **Dashboard (Home)**: High-level overview of scout database stats, database metrics (Avg Readiness, Total Database), and a scrollable shelf of high-performing "Featured Prospects".
- **Discover Feed**: Real-time search with a 300ms debounce, dynamic result counting, and sport-specific filtering chips (Football, Basketball, Athletics).
- **Athlete Profiles**: Deep-dive athlete detail cards presenting stats breakdowns via interactive progress bars, biographical info, and readiness indicators.
- **Persistent Shortlist**: Track your saved prospects in a persistent list with swipe-to-delete support.
- **Dynamic Image Avatars**: Premium custom avatars mapped to each athlete's gender and sport combinations (Football, Basketball, Athletics).

## Pages & Routes (Navigation Structure)
The application leverages a bottom-tab navigator with nested stack navigators for a smooth mobile experience:

| Tab / Screen | Route/Name | Description |
|---|---|---|
| **Home Tab** | `Home` | Landing dashboard with key stats and featured prospects |
| **Discover Tab** | `Discover` | Nested Stack: Discover & Profile navigation |
| ├── *Discover Feed* | `Feed` | Searchable, filterable list of all athletes |
| ├── *Athlete Detail* | `Profile` | Detailed view of athlete stats and bio (shared stack) |
| **Shortlist Tab** | `Shortlist` | Saved athlete list with swipe-to-delete actions |

## Tech Stack
- **Framework**: React Native (Expo SDK 54)
- **Navigation**: React Navigation v7 (Bottom Tabs + Native Stack)
- **Persistence**: `@react-native-async-storage/async-storage`
- **Gestures**: `react-native-gesture-handler` + `react-native-reanimated`
- **Icons**: `@expo/vector-icons` (Ionicons)
- **Build Tool**: Metro Bundler
- **Language**: TypeScript (strict mode)

## Requirements
- Node.js >= 18.x
- npm >= 9.x
- Expo Go app installed on iOS and/or Android device for testing

## Setup & Environment Setup
To get started with this project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AryanBatra16/ScoutIQ.git
   cd ScoutIQ
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Scan QR Code**:
   Scan the generated QR code in your terminal using the Expo Go app (Android) or Camera app (iOS) to test on a physical device.

## Usage
- **Start the dev server**:
  ```bash
  npm run dev
  ```
- **Build for production (Web)**:
  ```bash
  npm run build:web
  ```
- **Run TypeScript check**:
  ```bash
  npm run typecheck
  ```
- **Lint the codebase**:
  ```bash
  npm run lint
  ```

## Key Decisions

### Score Formula Used and Why
The athlete **Readiness Score** is a derived metric representing the average of all sport-specific stats for that athlete:
```
score = Math.round(
  Object.values(athlete.stats).reduce((sum, val) => sum + val, 0) /
  Object.values(athlete.stats).length
)
```
This formula is pre-calculated and stored in `athletes.json` for performance optimization. It was selected because it provides scouts with a normalized, single-number rating to immediately assess and compare talent across different sports and positions.

### Why `useShortlist` Hook Over Context/Redux
A custom React hook (`useShortlist.ts`) was chosen to manage shortlist state. Since this app's state is local and lightweight, Redux would introduce unnecessary boilerplate. Using a custom hook with standard state updates synced to `AsyncStorage` provides clean separation of concerns and immediate live state propagation, while avoiding the overhead of React Context rerenders.

### Why Swipe-to-Delete Was Chosen Over a Button
Swipe-to-delete aligns with standard iOS/Android UX paradigms. It leaves the screen uncluttered by keeping destructive actions tucked away, preventing accidental clicks while giving the interface a premium, native feel.

### How Search + Filter Interact (AND Logic)
Search and filter logic are coupled together using `AND` logic:
```typescript
let result = athletes;
if (activeFilter !== 'All') {
  result = result.filter((a) => a.sport === activeFilter);
}
if (debouncedSearch.length > 0) {
  const lower = debouncedSearch.toLowerCase();
  result = result.filter((a) => a.name.toLowerCase().includes(lower));
}
```
An athlete must match the selected sport *and* match the debounced text search to be displayed. This ensures scouts can search within a specific sport without resetting their query.

## File Structure
```
ScoutIQ/
├── assets/
│   └── avatars/                      # Custom sport & gender avatar PNGs
├── src/
│   ├── components/
│   │   ├── AthleteCard.tsx           # Feed card (name, sport, score, progress bar)
│   │   ├── Avatar.tsx                # Visual avatar image (with initials fallback)
│   │   ├── EmptyState.tsx            # Reusable empty state (icon + title + subtitle)
│   │   ├── FilterChip.tsx            # Sport filter pill button
│   │   ├── ProgressBar.tsx           # Custom, lightweight progress bar (no libs)
│   │   └── StatRow.tsx               # Metric breakdown row for profile
│   ├── screens/
│   │   ├── HomeScreen.tsx            # Landing dashboard & featured list
│   │   ├── DiscoverScreen.tsx        # Searchable discovery list
│   │   ├── ProfileScreen.tsx         # Complete athlete details view
│   │   └── ShortlistScreen.tsx       # Saved list with swipe-to-delete
│   ├── navigation/
│   │   └── AppNavigator.tsx          # Tab & Stack navigator setup
│   ├── hooks/
│   │   ├── useShortlist.ts           # AsyncStorage sync hook
│   │   └── useDebounce.ts            # 300ms input debouncing hook
│   ├── data/
│   │   └── athletes.json             # Mock database of 15 athletes
│   ├── types/
│   │   └── index.ts                  # Shared TypeScript types
│   └── constants/
│       └── theme.ts                  # Styling tokens & metrics
├── App.tsx                           # Application entry point
├── app.json                          # Expo configuration
├── babel.config.js                   # Babel / Reanimated plugin setup
├── eslint.config.js                  # Linter settings
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript settings
└── README.md                         # Documentation
```

## What's Incomplete & Why
- **Real-time API sync**: The data is entirely local. Connecting it to a backend or a cloud database was postponed to keep the focus on local persistence and the 24-hour delivery target.
- **Sorting options**: Ability to sort the list (e.g. by highest score, age, or alphabetically) is currently missing. Filter and search were prioritized due to constraints of the solo timeline.

## One Thing I'd Do Differently
If given more time, I would introduce a global Context provider for the shortlist state. This would avoid passing the `shortlistProps` hook reference down screen stacks in `AppNavigator.tsx`, improving routing architecture modularity.

## AI Tools Used
- **Antigravity (Google DeepMind)**: Assisted in debugging the React Navigation v7 tab navigation container issues, resolved TypeScript compile errors on bottom navigation safe areas, and helped enrich AsyncStorage objects with master database references to resolve missing avatar fields.

---
Built by Aryan Batra

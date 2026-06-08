export const theme = {
  colors: {
    primary: '#7C3AED',         // Purple Accent
    primaryLight: '#EEEDFE',    // Very light purple tint
    background: '#FAF6EE',      // Warm Cream screen background
    surface: '#FFFFFF',         // Card surfaces
    border: '#E6E2D8',          // Light warm border
    text: '#1E293B',            // Dark Slate primary text
    textSecondary: '#64748B',   // Slate secondary text
    textInverse: '#FFFFFF',     // White text
    success: '#0D9488',         // Teal/Green success
    warning: '#F59E0B',         // Amber warning
    danger: '#EF4444',          // Red danger
    scoreTrack: '#E6E2D8',      // Progress track color
    brandDark: '#1A252C',       // Dark Slate — used for CTA banners & toasts
    headerBg: '#FFFFFF',        // Light header / tab bar background
    headerBorder: '#EDE8DF',    // Subtle warm divider line
    headerText: '#1E293B',      // Dark text on light header
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  fontSizes: { xs: 11, sm: 13, md: 15, lg: 18, xl: 22, xxl: 28 },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  borderRadius: { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 },
  shadow: {
    card: {
      shadowColor: '#1A252C',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
  },
};

export const AVATAR_COLORS = [
  '#7C3AED', // Purple
  '#0D9488', // Teal
  '#F97316', // Orange
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#64748B', // Slate
];

export const SPORT_COLORS: Record<string, string> = {
  Football: '#7C3AED',   // Purple
  Basketball: '#0D9488', // Teal
  Athletics: '#F97316',  // Orange
};

export const SPORT_EMOJIS: Record<string, string> = {
  Football: '⚽',
  Basketball: '🏀',
  Athletics: '🏃',
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return theme.colors.success;
  if (score >= 60) return theme.colors.warning;
  return theme.colors.danger;
};

export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const getAvatarColor = (id: string): string => {
  const index = parseInt(id, 10) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

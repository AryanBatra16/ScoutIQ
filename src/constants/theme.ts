export const theme = {
  colors: {
    primary: '#6C63FF',
    primaryLight: '#EEF0FF',
    background: '#F7F8FC',
    surface: '#FFFFFF',
    border: '#E5E7EB',
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    textInverse: '#FFFFFF',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    scoreTrack: '#E5E7EB',
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
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
  },
};

export const AVATAR_COLORS = [
  '#6C63FF',
  '#F59E0B',
  '#10B981',
  '#EF4444',
  '#3B82F6',
  '#8B5CF6',
];

export const SPORT_COLORS: Record<string, string> = {
  Football: '#10B981',
  Basketball: '#F97316',
  Athletics: '#3B82F6',
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

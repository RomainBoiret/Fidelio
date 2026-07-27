import { Platform } from 'react-native';

/**
 * Modern blue–mauve wallet.
 * Cool mist surfaces, deep indigo heroes, soft mauve accents.
 */
export const Colors = {
  light: {
    text: '#14122A',
    textSecondary: '#5C5878',
    textMuted: '#8A86A4',
    background: '#F3F2F8',
    backgroundElevated: '#FFFFFF',
    surface: '#EAE8F3',
    surfaceStrong: '#DDDAEA',
    border: 'rgba(40, 36, 80, 0.08)',
    borderStrong: 'rgba(40, 36, 80, 0.14)',
    accent: '#5B6CFF',
    accentDeep: '#2A2560',
    accentSoft: 'rgba(91, 108, 255, 0.12)',
    accentText: '#3F48C7',
    accentSecondary: '#9B7CFF',
    success: '#2FAE7A',
    danger: '#E25555',
    shadow: 'rgba(42, 37, 96, 0.12)',
  },
  dark: {
    text: '#F4F3FA',
    textSecondary: '#B4B0CC',
    textMuted: '#8581A0',
    background: '#0E0C1A',
    backgroundElevated: '#17142A',
    surface: '#1F1B36',
    surfaceStrong: '#2A2544',
    border: 'rgba(244, 243, 250, 0.08)',
    borderStrong: 'rgba(244, 243, 250, 0.14)',
    accent: '#8B9BFF',
    accentDeep: '#12102A',
    accentSoft: 'rgba(139, 155, 255, 0.16)',
    accentText: '#B8C0FF',
    accentSecondary: '#B79CFF',
    success: '#4ADE9B',
    danger: '#FF7B7B',
    shadow: 'rgba(0, 0, 0, 0.45)',
  },
} as const;

export type ThemeColors = (typeof Colors)[keyof typeof Colors];
export type ThemeColor = keyof ThemeColors;

const webFont =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export const Fonts = Platform.select({
  web: {
    display: webFont,
    displayBold: webFont,
    body: webFont,
    bodyMedium: webFont,
    bodyBold: webFont,
  },
  default: {
    display: 'Outfit_600SemiBold',
    displayBold: 'Outfit_700Bold',
    body: 'DMSans_400Regular',
    bodyMedium: 'DMSans_500Medium',
    bodyBold: 'DMSans_700Bold',
  },
})!;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const Radius = {
  sm: 14,
  md: 20,
  lg: 26,
  xl: 34,
  full: 999,
} as const;

export const Shadow = {
  card: {
    shadowColor: '#2A2560',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 22,
    elevation: 4,
  },
  floating: {
    shadowColor: '#2A2560',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 10,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 100, android: 88, default: 88 }) ?? 88;
export const MaxContentWidth = 560;

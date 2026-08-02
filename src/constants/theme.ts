import { Platform } from 'react-native';

/**
 * Soft productivity aesthetic.
 * Electric blue accents, white cards, breezy grey canvas.
 */
export const Colors = {
  light: {
    text: '#1C1F2A',
    textSecondary: '#6B7285',
    textMuted: '#9AA1B2',
    background: '#F3F5FA',
    backgroundElevated: '#FFFFFF',
    surface: '#EAEFF8',
    surfaceStrong: '#DDE5F4',
    border: 'rgba(28, 31, 42, 0.06)',
    borderStrong: 'rgba(28, 31, 42, 0.12)',
    accent: '#3B6BFF',
    accentDeep: '#2F5AE6',
    accentSoft: 'rgba(59, 107, 255, 0.12)',
    accentText: '#3B6BFF',
    accentSecondary: '#7B8CFF',
    cream: '#FFFFFF',
    ink: '#1C1F2A',
    onHero: '#1C1F2A',
    success: '#3DBE8B',
    danger: '#FF5C6C',
    shadow: 'rgba(40, 55, 120, 0.1)',
    pastelPink: '#FFE4E8',
    pastelPurple: '#EDE7FF',
    pastelGreen: '#E3F8EF',
    pastelBlue: '#E5EDFF',
  },
  dark: {
    text: '#F4F6FB',
    textSecondary: '#B4B9C9',
    textMuted: '#858B9C',
    background: '#11141C',
    backgroundElevated: '#1A1F2B',
    surface: '#242A38',
    surfaceStrong: '#2E3546',
    border: 'rgba(244, 246, 251, 0.08)',
    borderStrong: 'rgba(244, 246, 251, 0.14)',
    accent: '#6B8CFF',
    accentDeep: '#3B6BFF',
    accentSoft: 'rgba(107, 140, 255, 0.18)',
    accentText: '#9BB0FF',
    accentSecondary: '#8FA0FF',
    cream: '#FFFFFF',
    ink: '#F4F6FB',
    onHero: '#F4F6FB',
    success: '#4ADE9B',
    danger: '#FF7B8A',
    shadow: 'rgba(0, 0, 0, 0.4)',
    pastelPink: '#3A2430',
    pastelPurple: '#2C2640',
    pastelGreen: '#1F332C',
    pastelBlue: '#1F2A40',
  },
} as const;

export type ThemeColors = (typeof Colors)[keyof typeof Colors];
export type ThemeColor = keyof ThemeColors;

const webFont = '"Plus Jakarta Sans", system-ui, sans-serif';

export const Fonts = Platform.select({
  web: {
    display: webFont,
    displayBold: webFont,
    body: webFont,
    bodyMedium: webFont,
    bodyBold: webFont,
  },
  default: {
    display: 'PlusJakartaSans_600SemiBold',
    displayBold: 'PlusJakartaSans_700Bold',
    body: 'PlusJakartaSans_400Regular',
    bodyMedium: 'PlusJakartaSans_500Medium',
    bodyBold: 'PlusJakartaSans_700Bold',
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
  xl: 32,
  full: 999,
} as const;

export const Shadow = {
  card: {
    shadowColor: '#283778',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 3,
  },
  floating: {
    shadowColor: '#283778',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 10,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 100, android: 88, default: 88 }) ?? 88;
export const MaxContentWidth = 560;

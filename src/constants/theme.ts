import { Platform } from 'react-native';

/**
 * Fidelio — ethereal glass wallet
 * Mist lavender, cool frost, cobalt accent. Soft depth without heavy chrome.
 */
export const Colors = {
  light: {
    text: '#1A1C2E',
    textSecondary: '#5A5D6E',
    textMuted: '#8B8FA3',
    background: '#E8EAF6',
    backgroundElevated: 'rgba(255,255,255,0.72)',
    surface: 'rgba(255,255,255,0.42)',
    surfaceStrong: 'rgba(255,255,255,0.62)',
    border: 'rgba(255, 255, 255, 0.55)',
    borderStrong: 'rgba(255, 255, 255, 0.72)',
    accent: '#3B6BFF',
    accentDeep: '#2A52E8',
    accentSoft: 'rgba(59, 107, 255, 0.12)',
    accentText: '#3B6BFF',
    accentSecondary: '#6B8CFF',
    cream: '#F7F8FF',
    ink: '#1A1C2E',
    onHero: '#1A1C2E',
    success: '#2F8F6B',
    danger: '#C4453A',
    shadow: 'rgba(55, 70, 140, 0.12)',
    ticket: 'rgba(255,255,255,0.55)',
    ticketEdge: 'rgba(255,255,255,0.65)',
    stamp: '#3B6BFF',
    stampSoft: '#E4E8FF',
    gold: '#A8894E',
    goldSoft: 'rgba(168, 137, 78, 0.12)',
    stone: '#D2D6EA',
    pastelPink: '#EDE6F4',
    pastelPurple: '#DDD8F2',
    pastelGreen: '#E6EEE9',
    pastelBlue: '#C9D4F5',
  },
  dark: {
    text: '#F4F2EC',
    textSecondary: '#B0AAA0',
    textMuted: '#8A857C',
    background: '#131210',
    backgroundElevated: '#1C1B18',
    surface: '#26241F',
    surfaceStrong: '#322F29',
    border: 'rgba(244, 242, 236, 0.08)',
    borderStrong: 'rgba(244, 242, 236, 0.14)',
    accent: '#7B91FF',
    accentDeep: '#3D5AFE',
    accentSoft: 'rgba(123, 145, 255, 0.16)',
    accentText: '#A8B6FF',
    accentSecondary: '#9AACFF',
    cream: '#1C1B18',
    ink: '#F4F2EC',
    onHero: '#F4F2EC',
    success: '#4ADE9B',
    danger: '#E5736A',
    shadow: 'rgba(0, 0, 0, 0.45)',
    ticket: '#1C1B18',
    ticketEdge: '#322F29',
    stamp: '#7B91FF',
    stampSoft: '#1E2438',
    gold: '#C9A86A',
    goldSoft: 'rgba(201, 168, 106, 0.16)',
    stone: '#322F29',
    pastelPink: '#2E2622',
    pastelPurple: '#2A2730',
    pastelGreen: '#232B26',
    pastelBlue: '#222636',
  },
} as const;

export type ThemeColors = (typeof Colors)[keyof typeof Colors];

const webSans = '"Plus Jakarta Sans", system-ui, sans-serif';

/** One family — editorial through scale & weight, not costume serif. */
export const Fonts = Platform.select({
  web: {
    display: webSans,
    displayBold: webSans,
    body: webSans,
    bodyMedium: webSans,
    bodyBold: webSans,
  },
  default: {
    display: 'PlusJakartaSans_700Bold',
    displayBold: 'PlusJakartaSans_800ExtraBold',
    body: 'PlusJakartaSans_400Regular',
    bodyMedium: 'PlusJakartaSans_500Medium',
    bodyBold: 'PlusJakartaSans_700Bold',
  },
})!;

/** Web needs explicit weights — family name alone stays Regular. */
export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

export const Type = {
  kicker: {
    fontSize: 12,
    letterSpacing: 1.4,
    lineHeight: 16,
    textTransform: 'uppercase' as const,
    fontFamily: Fonts.bodyMedium,
    fontWeight: FontWeight.medium,
  },
  display: {
    fontSize: 34,
    letterSpacing: -1.1,
    lineHeight: 40,
    fontFamily: Fonts.displayBold,
    fontWeight: FontWeight.heavy,
  },
  title: {
    fontSize: 22,
    letterSpacing: -0.55,
    lineHeight: 28,
    fontFamily: Fonts.displayBold,
    fontWeight: FontWeight.heavy,
  },
  body: {
    fontSize: 15,
    letterSpacing: -0.1,
    lineHeight: 22,
    fontFamily: Fonts.body,
    fontWeight: FontWeight.regular,
  },
  caption: {
    fontSize: 13,
    letterSpacing: 0.1,
    lineHeight: 18,
    fontFamily: Fonts.body,
    fontWeight: FontWeight.regular,
  },
} as const;

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
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 999,
} as const;

export const Shadow = Platform.select({
  web: {
    floating: {
      boxShadow: '0 16px 40px rgba(59, 107, 255, 0.35)',
    },
    ticket: {
      boxShadow: '0 12px 36px rgba(70, 90, 160, 0.12)',
    },
  },
  default: {
    floating: {
      shadowColor: '#3B6BFF',
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.35,
      shadowRadius: 24,
      elevation: 10,
    },
    ticket: {
      shadowColor: '#465AA0',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 18,
      elevation: 3,
    },
  },
})!;

/** Frosted glass helpers (web CSS). */
export const Glass = {
  webShadow: Platform.OS === 'web'
    ? ({ boxShadow: '0 10px 36px rgba(70, 90, 160, 0.10)' } as const)
    : ({} as const),
} as const;

export const Motion = {
  enter: 440,
  editorial: 560,
  spring: {
    soft: { damping: 18, stiffness: 220, mass: 0.85 },
    snappy: { damping: 16, stiffness: 320, mass: 0.7 },
  },
} as const;

export const MaxContentWidth = 560;

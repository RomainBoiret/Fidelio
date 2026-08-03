import { Platform } from 'react-native';

/**
 * Fidelio — soft contemporary gallery
 * Warm paper, calm ink, rare cobalt. Identity without costume museum.
 */
export const Colors = {
  light: {
    text: '#1A1916',
    textSecondary: '#6B6760',
    textMuted: '#9A958C',
    background: '#F6F5F1',
    backgroundElevated: '#FFFFFF',
    surface: '#EEECE6',
    surfaceStrong: '#E4E1DA',
    border: 'rgba(26, 25, 22, 0.07)',
    borderStrong: 'rgba(26, 25, 22, 0.12)',
    accent: '#3D5AFE',
    accentDeep: '#2F48E0',
    accentSoft: 'rgba(61, 90, 254, 0.1)',
    accentText: '#3D5AFE',
    accentSecondary: '#6B82FF',
    cream: '#FFFFFF',
    ink: '#1A1916',
    onHero: '#1A1916',
    success: '#2F8F6B',
    danger: '#C4453A',
    shadow: 'rgba(26, 25, 22, 0.07)',
    ticket: '#FFFFFF',
    ticketEdge: '#E4E1DA',
    stamp: '#3D5AFE',
    stampSoft: '#EEF0FF',
    gold: '#A8894E',
    goldSoft: 'rgba(168, 137, 78, 0.12)',
    stone: '#E4E1DA',
    pastelPink: '#F0E8E4',
    pastelPurple: '#EAE8F0',
    pastelGreen: '#E6EEE9',
    pastelBlue: '#E8ECF8',
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
export type ThemeColor = keyof ThemeColors;

const webSans = '"Plus Jakarta Sans", system-ui, sans-serif';

/** One family — editorial through scale & weight, not costume serif. */
export const Fonts = Platform.select({
  web: {
    display: webSans,
    displayBold: webSans,
    serif: webSans,
    body: webSans,
    bodyMedium: webSans,
    bodyBold: webSans,
  },
  default: {
    display: 'PlusJakartaSans_700Bold',
    displayBold: 'PlusJakartaSans_800ExtraBold',
    serif: 'PlusJakartaSans_700Bold',
    body: 'PlusJakartaSans_400Regular',
    bodyMedium: 'PlusJakartaSans_500Medium',
    bodyBold: 'PlusJakartaSans_700Bold',
  },
})!;

export const Type = {
  label: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
  titleSerif: {
    fontSize: 32,
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  titleSerifMd: {
    fontSize: 24,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
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

/** Soft architectural — not razor corners, not pills. */
export const Radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  ticket: 18,
  full: 999,
} as const;

export const Shadow = Platform.select({
  web: {
    card: {
      boxShadow: '0 8px 24px rgba(26, 25, 22, 0.05)',
    },
    floating: {
      boxShadow: '0 12px 32px rgba(26, 25, 22, 0.1)',
    },
    ticket: {
      boxShadow: '0 16px 40px rgba(26, 25, 22, 0.07)',
    },
    artwork: {
      boxShadow: '0 20px 48px rgba(26, 25, 22, 0.08)',
    },
  },
  default: {
    card: {
      shadowColor: '#1A1916',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.05,
      shadowRadius: 14,
      elevation: 2,
    },
    floating: {
      shadowColor: '#1A1916',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 8,
    },
    ticket: {
      shadowColor: '#1A1916',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.07,
      shadowRadius: 22,
      elevation: 3,
    },
    artwork: {
      shadowColor: '#1A1916',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.08,
      shadowRadius: 28,
      elevation: 4,
    },
  },
})!;

export const Motion = {
  quick: 140,
  press: 150,
  card: 280,
  enter: 340,
  editorial: 400,
  easing: {
    out: 'cubic-out' as const,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 96, android: 88, default: 88 }) ?? 88;
export const MaxContentWidth = 560;
export const FrameInset = 0;
export const NavBarHeight = 64;

/** @deprecated */
export const TicketNotch = 11;

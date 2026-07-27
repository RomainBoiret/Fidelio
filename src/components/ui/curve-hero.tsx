import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeInDown,
  useReducedMotion,
} from 'react-native-reanimated';

import { WaveEdge } from '@/components/ui/wave-edge';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  brand?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  height?: number;
  children?: React.ReactNode;
};

export function CurveHero({
  brand = 'Fidelio',
  eyebrow,
  title,
  subtitle,
  right,
  height = 300,
  children,
}: Props) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.accentDeep }]}>
      <View style={styles.atmosphere} pointerEvents="none">
        <View style={[styles.glowA, { backgroundColor: colors.accent }]} />
        <View style={[styles.glowB, { backgroundColor: colors.accentSecondary }]} />
        <View style={[styles.glowC, { backgroundColor: '#7A8BFF' }]} />
      </View>

      <Animated.View
        entering={
          reduceMotion
            ? undefined
            : FadeInDown.duration(700).easing(Easing.out(Easing.cubic))
        }
        style={[
          styles.hero,
          {
            paddingTop: insets.top + Spacing.md,
            minHeight: height,
          },
        ]}
      >
        <View style={styles.topRow}>
          <Text style={[styles.brand, { fontFamily: Fonts.displayBold }]}>{brand}</Text>
          {right}
        </View>

        <View style={styles.copy}>
          {eyebrow ? (
            <Text style={[styles.eyebrow, { fontFamily: Fonts.bodyMedium }]}>{eyebrow}</Text>
          ) : null}
          <Text style={[styles.title, { fontFamily: Fonts.displayBold }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { fontFamily: Fonts.body }]}>{subtitle}</Text>
          ) : null}
          {children}
        </View>
      </Animated.View>
      <WaveEdge fill={colors.background} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
  },
  atmosphere: {
    ...StyleSheet.absoluteFill,
  },
  glowA: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 999,
    top: -90,
    right: -70,
    opacity: 0.42,
    ...(Platform.OS === 'web' ? ({ filter: 'blur(48px)' } as object) : null),
  },
  glowB: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    bottom: 20,
    left: -80,
    opacity: 0.28,
    ...(Platform.OS === 'web' ? ({ filter: 'blur(40px)' } as object) : null),
  },
  glowC: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 999,
    top: 90,
    left: 80,
    opacity: 0.18,
    ...(Platform.OS === 'web' ? ({ filter: 'blur(28px)' } as object) : null),
  },
  hero: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 28,
    letterSpacing: -0.8,
  },
  copy: {
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  eyebrow: {
    color: 'rgba(255,255,255,0.64)',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.9,
    maxWidth: 300,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.74)',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 280,
  },
});

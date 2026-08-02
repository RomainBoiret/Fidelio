import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeInDown,
  useReducedMotion,
} from 'react-native-reanimated';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  brand?: string;
  eyebrow?: string;
  title: string;
  /** Optional fragment highlighted in a blue pill inside the title row. */
  highlight?: string;
  subtitle?: string;
  right?: React.ReactNode;
  height?: number;
  children?: React.ReactNode;
};

/**
 * Light, airy header — productivity-app style (no dark hero block).
 */
export function CurveHero({
  brand = 'Fidelio',
  eyebrow,
  title,
  highlight,
  subtitle,
  right,
  height = 200,
  children,
}: Props) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]}>
      <View style={styles.atmosphere} pointerEvents="none">
        <View style={[styles.blobA, { backgroundColor: colors.accent }]} />
        <View style={[styles.blobB, { backgroundColor: colors.accentSecondary }]} />
      </View>

      <Animated.View
        entering={
          reduceMotion
            ? undefined
            : FadeInDown.duration(560).easing(Easing.out(Easing.cubic))
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
          <View style={styles.brandRow}>
            <View style={[styles.logo, { backgroundColor: colors.accent }]}>
              <MaterialCommunityIcons name="wallet-outline" size={18} color="#FFFFFF" />
            </View>
            <Text style={[styles.brand, { color: colors.text, fontFamily: Fonts.displayBold }]}>
              {brand}
            </Text>
          </View>
          {right}
        </View>

        <View style={styles.copy}>
          {eyebrow ? (
            <Text style={[styles.eyebrow, { color: colors.textSecondary, fontFamily: Fonts.bodyMedium }]}>
              {eyebrow}
            </Text>
          ) : null}

          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text, fontFamily: Fonts.displayBold }]}>
              {title}
              {highlight ? ' ' : ''}
            </Text>
            {highlight ? (
              <View style={[styles.pill, { backgroundColor: colors.accent }]}>
                <Text style={[styles.pillText, { fontFamily: Fonts.bodyBold }]}>{highlight}</Text>
              </View>
            ) : null}
          </View>

          {subtitle ? (
            <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: Fonts.body }]}>
              {subtitle}
            </Text>
          ) : null}
          {children}
        </View>
      </Animated.View>
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
  blobA: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    top: -90,
    right: -70,
    opacity: 0.1,
  },
  blobB: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    top: 40,
    left: -50,
    opacity: 0.08,
  },
  hero: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 18,
    letterSpacing: -0.3,
  },
  copy: {
    gap: Spacing.sm,
  },
  eyebrow: {
    fontSize: 14,
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.6,
  },
  pill: {
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 300,
  },
});

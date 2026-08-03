import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeInDown,
  useReducedMotion,
} from 'react-native-reanimated';

import { MiniBarcode } from '@/components/brand/mini-barcode';
import { Fonts, Motion, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  brand?: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  right?: React.ReactNode;
  height?: number;
  children?: React.ReactNode;
};

/**
 * Fidelio header: brand mark + ticket motif atmosphere + clear hierarchy.
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
      <View style={[styles.atmosphere, { pointerEvents: 'none' }]}>
        <View style={[styles.ticketGhostA, { backgroundColor: colors.accentSoft }]} />
        <View
          style={[
            styles.ticketGhostB,
            { backgroundColor: colors.backgroundElevated, borderColor: colors.ticketEdge },
          ]}
        />
        <View style={styles.barcodeFloat}>
          <MiniBarcode width={64} height={16} color={colors.accent} />
        </View>
      </View>

      <Animated.View
        entering={
          reduceMotion
            ? undefined
            : FadeInDown.duration(Motion.enter).easing(
                Platform.OS === 'web' ? Easing.linear : Easing.out(Easing.cubic),
              )
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
              <MaterialCommunityIcons name="ticket-confirmation" size={18} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[styles.brand, { color: colors.text, fontFamily: Fonts.displayBold }]}>
                {brand}
              </Text>
              <Text
                style={[styles.brandTag, { color: colors.textMuted, fontFamily: Fonts.bodyMedium }]}
              >
                loyalty wallet
              </Text>
            </View>
          </View>
          {right}
        </View>

        <View style={styles.copy}>
          {eyebrow ? (
            <Text
              style={[styles.eyebrow, { color: colors.textSecondary, fontFamily: Fonts.bodyMedium }]}
            >
              {eyebrow}
            </Text>
          ) : null}

          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: colors.text, fontFamily: Fonts.displayBold }]}>
              {title}
            </Text>
            {highlight ? (
              <View style={[styles.stamp, { backgroundColor: colors.stampSoft }]}>
                <View style={[styles.stampDot, { backgroundColor: colors.accent }]} />
                <Text style={[styles.stampText, { color: colors.accent, fontFamily: Fonts.bodyBold }]}>
                  {highlight}
                </Text>
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
  ticketGhostA: {
    position: 'absolute',
    width: 140,
    height: 88,
    borderRadius: Radius.ticket,
    top: -18,
    right: -28,
    transform: [{ rotate: '12deg' }],
  },
  ticketGhostB: {
    position: 'absolute',
    width: 110,
    height: 70,
    borderRadius: Radius.ticket,
    top: 54,
    right: 8,
    borderWidth: 1,
    transform: [{ rotate: '-8deg' }],
    opacity: 0.7,
  },
  barcodeFloat: {
    position: 'absolute',
    left: 18,
    bottom: 18,
    opacity: 0.18,
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
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 20,
    letterSpacing: -0.4,
  },
  brandTag: {
    fontSize: 11,
    marginTop: 1,
  },
  copy: {
    gap: Spacing.sm,
  },
  eyebrow: {
    fontSize: 14,
  },
  titleBlock: {
    gap: Spacing.sm,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.7,
    maxWidth: 300,
  },
  stamp: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  stampDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stampText: {
    fontSize: 13,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 300,
  },
});

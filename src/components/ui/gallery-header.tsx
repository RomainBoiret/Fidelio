import * as React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeInDown,
  useReducedMotion,
} from 'react-native-reanimated';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { GalleryMark } from '@/components/brand/gallery-mark';
import { GlassSurface } from '@/components/ui/glass-surface';
import { Fonts, FontWeight, Motion, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  title?: string;
  subtitle?: string;
  pieceCount?: number;
  onAdd?: () => void;
  onBack?: () => void;
  right?: React.ReactNode;
};

/** Glass masthead — brand, title, soft count. */
export function GalleryHeader({
  title = 'Fidelio',
  subtitle,
  pieceCount = 0,
  onAdd,
  onBack,
  right,
}: Props) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: 'transparent',
          paddingTop: insets.top + Spacing.lg,
        },
      ]}
    >
      <Animated.View
        entering={
          reduceMotion
            ? undefined
            : FadeInDown.duration(Motion.enter).easing(
                Platform.OS === 'web' ? Easing.linear : Easing.out(Easing.cubic),
              )
        }
      >
        <View style={styles.topRow}>
          <View style={styles.brandRow}>
            {onBack ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Go back"
                onPress={onBack}
                hitSlop={8}
              >
                <GlassSurface tone="chrome" radius={Radius.md} style={styles.iconBtn}>
                  <View style={styles.iconBtnInner}>
                    <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
                  </View>
                </GlassSurface>
              </Pressable>
            ) : null}
            <GalleryMark size={34} withWordmark />
          </View>
          {right ??
            (onAdd ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add card"
                onPress={onAdd}
                hitSlop={8}
              >
                <GlassSurface tone="chrome" radius={Radius.md} style={styles.iconBtn}>
                  <View style={styles.iconBtnInner}>
                    <MaterialCommunityIcons name="plus" size={22} color={colors.ink} />
                  </View>
                </GlassSurface>
              </Pressable>
            ) : null)}
        </View>

        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              {
                color: colors.ink,
                fontFamily: Fonts.displayBold,
                fontWeight: FontWeight.heavy,
              },
            ]}
            accessibilityRole="header"
          >
            {title}
          </Text>
          {pieceCount > 0 ? (
            <View style={[styles.countChip, { backgroundColor: colors.accentSoft }]}>
              <Text
                style={[
                  styles.countText,
                  {
                    color: colors.accentText,
                    fontFamily: Fonts.bodyMedium,
                    fontWeight: FontWeight.medium,
                  },
                ]}
              >
                {String(pieceCount).padStart(2, '0')}
              </Text>
            </View>
          ) : null}
        </View>

        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: Fonts.body }]}>
            {subtitle}
          </Text>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
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
    gap: Spacing.md,
    flexShrink: 1,
  },
  iconBtn: {
    width: 44,
    height: 44,
  },
  iconBtnInner: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 32,
    letterSpacing: -0.9,
    lineHeight: 38,
  },
  countChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  countText: {
    fontSize: 13,
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320,
  },
});

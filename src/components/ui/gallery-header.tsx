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
import { Fonts, Motion, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  title?: string;
  subtitle?: string;
  pieceCount?: number;
  onAdd?: () => void;
  right?: React.ReactNode;
};

/** Calm masthead — brand, title, soft count. */
export function GalleryHeader({
  title = 'Your Gallery',
  subtitle = 'Cards ready when you need them.',
  pieceCount = 0,
  onAdd,
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
          backgroundColor: colors.background,
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
          <GalleryMark size={34} withWordmark />
          {right ??
            (onAdd ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add card"
                onPress={onAdd}
                hitSlop={8}
                style={[
                  styles.addBtn,
                  {
                    backgroundColor: colors.backgroundElevated,
                    borderColor: colors.border,
                    minWidth: 44,
                    minHeight: 44,
                  },
                ]}
              >
                <MaterialCommunityIcons name="plus" size={22} color={colors.ink} />
              </Pressable>
            ) : null)}
        </View>

        <View style={styles.titleRow}>
          <Text
            style={[styles.title, { color: colors.ink, fontFamily: Fonts.displayBold }]}
            accessibilityRole="header"
          >
            {title}
          </Text>
          {pieceCount > 0 ? (
            <View style={[styles.countChip, { backgroundColor: colors.surface }]}>
              <Text style={[styles.countText, { color: colors.textSecondary, fontFamily: Fonts.bodyMedium }]}>
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
  addBtn: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: Radius.sm,
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
    fontSize: 30,
    letterSpacing: -0.7,
    lineHeight: 36,
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
    maxWidth: 300,
  },
});

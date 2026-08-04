import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { GlassSurface } from '@/components/ui/glass-surface';
import { categoryLabel } from '@/domain/categories';
import { maskCode, relativeUseLabel } from '@/domain/gallery';
import type { LoyaltyCard } from '@/domain/types';
import { Fonts, FontWeight, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  card: LoyaltyCard;
  index: number;
  stacked?: boolean;
};

const enterEasing = Easing.out(Easing.cubic);

function storeInitial(name: string) {
  const letter = name.trim().charAt(0);
  return letter ? letter.toUpperCase() : 'F';
}

/**
 * Pixel-match frosted pass from the Fidelio glass mockup.
 * Layout: accent | monogram | title + meta (code | pill · time) | info
 */
export function WalletPass({ card, index, stacked = true }: Props) {
  const colors = useTheme();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const accent = card.accentColor ?? colors.accent;
  const initial = storeInitial(card.storeName);
  const scale = useSharedValue(1);

  const passMotion = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pressIn = React.useCallback(() => {
    if (reduceMotion) return;
    scale.value = withSpring(0.985, { damping: 22, stiffness: 260, mass: 0.7 });
  }, [reduceMotion, scale]);

  const pressOut = React.useCallback(() => {
    if (reduceMotion) return;
    scale.value = withSpring(1, { damping: 18, stiffness: 200, mass: 0.8 });
  }, [reduceMotion, scale]);

  const onPresent = React.useCallback(() => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/card/${card.id}/present`);
  }, [card.id, router]);

  const onDetails = React.useCallback(() => {
    router.push(`/card/${card.id}`);
  }, [card.id, router]);

  return (
    <Animated.View
      entering={
        reduceMotion || !stacked
          ? undefined
          : FadeInUp.delay(Math.min(index, 8) * 40)
              .duration(360)
              .easing(enterEasing)
      }
      style={[
        styles.wrap,
        stacked && index > 0 ? styles.overlap : null,
        { zIndex: index + 1 },
        passMotion,
      ]}
    >
      <GlassSurface
        tone="pass"
        radius={20}
        intensity={22}
        style={[styles.passShell, Shadow.ticket]}
        contentStyle={styles.passInner}
      >
        <View style={[styles.accentBar, { backgroundColor: accent }]} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Present ${card.storeName} at checkout`}
          onPress={onPresent}
          onPressIn={pressIn}
          onPressOut={pressOut}
          style={styles.body}
        >
          <View style={[styles.monogram, { backgroundColor: accent }]}>
            <Text
              style={[
                styles.monogramText,
                { fontFamily: Fonts.displayBold, fontWeight: FontWeight.heavy },
              ]}
            >
              {initial}
            </Text>
          </View>

          <View style={styles.copy}>
            <Text
              style={[
                styles.store,
                {
                  color: colors.ink,
                  fontFamily: Fonts.displayBold,
                  fontWeight: FontWeight.heavy,
                },
              ]}
              numberOfLines={1}
            >
              {card.storeName}
            </Text>

            <View style={styles.metaRow}>
              <Text
                style={[
                  styles.metaText,
                  {
                    color: colors.textMuted,
                    fontFamily: Fonts.body,
                    fontWeight: FontWeight.regular,
                  },
                ]}
                numberOfLines={1}
              >
                {maskCode(card.codeValue)}
              </Text>

              <Text style={[styles.pipe, { color: colors.borderStrong }]}>|</Text>

              <View style={[styles.pill, { backgroundColor: colors.accentSoft }]}>
                <Text
                  style={[
                    styles.pillText,
                    {
                      color: colors.accentText,
                      fontFamily: Fonts.bodyMedium,
                      fontWeight: FontWeight.medium,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {categoryLabel(card.categoryId)}
                </Text>
              </View>

              <Text
                style={[
                  styles.metaText,
                  {
                    color: colors.textMuted,
                    fontFamily: Fonts.body,
                    fontWeight: FontWeight.regular,
                  },
                ]}
              >
                {' · '}
                {relativeUseLabel(card.lastOpenedAt ?? card.updatedAt)}
              </Text>
            </View>
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Edit ${card.storeName}`}
          onPress={onDetails}
          hitSlop={10}
          style={[styles.infoBtn, { backgroundColor: colors.surface }]}
        >
          <MaterialCommunityIcons
            name="information-outline"
            size={18}
            color={colors.textSecondary}
          />
        </Pressable>
      </GlassSurface>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  overlap: {
    marginTop: -36,
  },
  passShell: {
    width: '100%',
  },
  passInner: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 76,
    overflow: 'hidden',
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingLeft: 12,
    paddingRight: 8,
    minHeight: 76,
  },
  monogram: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    color: '#FFFFFF',
    fontSize: 16,
    letterSpacing: -0.35,
  },
  copy: {
    flex: 1,
    gap: 5,
    minWidth: 0,
  },
  store: {
    fontSize: 16,
    letterSpacing: -0.35,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'nowrap',
  },
  metaText: {
    fontSize: 12,
    letterSpacing: 0.1,
    lineHeight: 16,
    flexShrink: 1,
  },
  pipe: {
    fontSize: 12,
    lineHeight: 16,
  },
  pill: {
    borderRadius: Radius.full,
    paddingHorizontal: 9,
    paddingVertical: 2,
    maxWidth: 130,
  },
  pillText: {
    fontSize: 11,
    letterSpacing: 0.05,
    lineHeight: 15,
  },
  infoBtn: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  useReducedMotion,
} from 'react-native-reanimated';

import { PressableScale } from '@/components/motion/pressable-scale';
import { cardInitials, formatBarcodeLabel } from '@/domain/card';
import type { LoyaltyCard } from '@/domain/types';
import { Fonts, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  card: LoyaltyCard;
  index?: number;
};

const PASTELS = ['pastelPink', 'pastelPurple', 'pastelGreen', 'pastelBlue'] as const;

function CardTileComponent({ card, index = 0 }: Props) {
  const colors = useTheme();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const pastelKey = PASTELS[index % PASTELS.length]!;
  const pastelBg = colors[pastelKey];
  const accent = card.accentColor ?? colors.accent;

  const onOpen = React.useCallback(() => {
    router.push(`/card/${card.id}`);
  }, [card.id, router]);

  const onPresent = React.useCallback(() => {
    router.push(`/card/${card.id}/present`);
  }, [card.id, router]);

  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInUp.delay(Math.min(index, 6) * 50)
              .duration(420)
              .easing(Easing.out(Easing.cubic))
      }
    >
      <View
        style={[
          styles.card,
          Shadow.card,
          {
            backgroundColor: colors.backgroundElevated,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <PressableScale
          accessibilityRole="link"
          accessibilityLabel={card.title}
          onPress={onOpen}
          style={styles.mainHit}
        >
          <View style={[styles.avatar, { backgroundColor: pastelBg }]}>
            <Text style={[styles.avatarText, { color: accent, fontFamily: Fonts.bodyBold }]}>
              {cardInitials(card.title, card.storeName)}
            </Text>
          </View>
          <View style={styles.copy}>
            <Text
              style={[styles.title, { color: colors.text, fontFamily: Fonts.displayBold }]}
              numberOfLines={1}
            >
              {card.title}
            </Text>
            <Text
              style={[styles.meta, { color: colors.textSecondary, fontFamily: Fonts.body }]}
              numberOfLines={1}
            >
              {card.storeName} · {formatBarcodeLabel(card.codeFormat)}
            </Text>
          </View>
        </PressableScale>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Show ${card.title} at checkout`}
          onPress={onPresent}
          hitSlop={8}
          style={[styles.presentBtn, { backgroundColor: colors.accent }]}
        >
          <MaterialCommunityIcons name="barcode" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </Animated.View>
  );
}

export const CardTile = React.memo(CardTileComponent);

const styles = StyleSheet.create({
  card: {
    minHeight: 92,
    borderRadius: Radius.xl,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  mainHit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    letterSpacing: 0.2,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    letterSpacing: -0.2,
  },
  meta: {
    fontSize: 13,
  },
  presentBtn: {
    width: 46,
    height: 46,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

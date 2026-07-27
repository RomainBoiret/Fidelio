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

function CardTileComponent({ card, index = 0 }: Props) {
  const colors = useTheme();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
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
          : FadeInUp.delay(Math.min(index, 6) * 60)
              .duration(480)
              .easing(Easing.out(Easing.cubic))
      }
    >
      <View
        style={[
          styles.card,
          Shadow.card,
          {
            backgroundColor: colors.backgroundElevated,
            borderColor: colors.border,
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
          <View style={[styles.avatar, { backgroundColor: accent }]}>
            <Text style={[styles.avatarText, { fontFamily: Fonts.bodyBold }]}>
              {cardInitials(card.title, card.storeName)}
            </Text>
          </View>
          <View style={styles.copy}>
            <Text
              style={[styles.kicker, { color: colors.textMuted, fontFamily: Fonts.bodyMedium }]}
              numberOfLines={1}
            >
              {card.storeName} · {formatBarcodeLabel(card.codeFormat)}
            </Text>
            <Text
              style={[styles.title, { color: colors.text, fontFamily: Fonts.displayBold }]}
              numberOfLines={1}
            >
              {card.title}
            </Text>
          </View>
        </PressableScale>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Show ${card.title} at checkout`}
          onPress={onPresent}
          hitSlop={8}
          style={[styles.presentBtn, { backgroundColor: colors.accentSoft }]}
        >
          <MaterialCommunityIcons name="barcode" size={22} color={colors.accentText} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

export const CardTile = React.memo(CardTileComponent);

const styles = StyleSheet.create({
  card: {
    minHeight: 84,
    borderRadius: Radius.lg,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.sm,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  mainHit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    letterSpacing: 0.4,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 17,
    letterSpacing: -0.3,
  },
  presentBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

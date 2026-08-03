import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  useReducedMotion,
} from 'react-native-reanimated';

import { PressableScale } from '@/components/motion/pressable-scale';
import { formatBarcodeLabel } from '@/domain/card';
import { collectionLabel, formatCollectionNo, relativeUseLabel } from '@/domain/gallery';
import type { LoyaltyCard } from '@/domain/types';
import { Fonts, Motion, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  card: LoyaltyCard;
  index?: number;
  catalogueNo?: number;
};

const enterEasing =
  Platform.OS === 'web' ? Easing.linear : Easing.out(Easing.cubic);

function CardTileComponent({ card, index = 0, catalogueNo }: Props) {
  const colors = useTheme();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const accent = card.accentColor ?? colors.accent;
  const no = formatCollectionNo(catalogueNo ?? index + 1);

  const onOpen = React.useCallback(() => {
    router.push(`/card/${card.id}`);
  }, [card.id, router]);

  const onPresent = React.useCallback(() => {
    if (Platform.OS !== 'web') {
      void Haptics.selectionAsync();
    }
    router.push(`/card/${card.id}/present`);
  }, [card.id, router]);

  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInUp.delay(Math.min(index, 6) * 45)
              .duration(Motion.card)
              .easing(enterEasing)
      }
    >
      <View
        style={[
          styles.card,
          Shadow.card,
          {
            backgroundColor: colors.backgroundElevated,
            ...(Platform.OS === 'web' ? null : { shadowColor: colors.shadow }),
          },
        ]}
      >
        <View style={[styles.swatch, { backgroundColor: accent }]} />

        <PressableScale
          accessibilityRole="link"
          accessibilityLabel={`${card.title}, ${card.storeName}, ${collectionLabel(catalogueNo ?? index + 1)}`}
          onPress={onOpen}
          style={styles.mainHit}
        >
          <View style={styles.copy}>
            <Text style={[styles.no, { color: colors.textMuted, fontFamily: Fonts.bodyMedium }]}>
              {no}
            </Text>
            <Text
              style={[styles.store, { color: colors.ink, fontFamily: Fonts.displayBold }]}
              numberOfLines={1}
            >
              {card.storeName}
            </Text>
            <Text
              style={[styles.title, { color: colors.textSecondary, fontFamily: Fonts.body }]}
              numberOfLines={1}
            >
              {card.title} · {formatBarcodeLabel(card.codeFormat)}
            </Text>
            <Text style={[styles.meta, { color: colors.textMuted, fontFamily: Fonts.body }]}>
              {relativeUseLabel(card.updatedAt)}
            </Text>
          </View>
        </PressableScale>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Present ${card.title} at checkout`}
          onPress={onPresent}
          hitSlop={8}
          style={[
            styles.presentBtn,
            {
              backgroundColor: colors.stampSoft,
              minWidth: 44,
              minHeight: 44,
            },
          ]}
        >
          <MaterialCommunityIcons name="barcode" size={18} color={colors.accent} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

export const CardTile = React.memo(CardTileComponent);

const styles = StyleSheet.create({
  card: {
    minHeight: 88,
    borderRadius: Radius.md,
    paddingRight: Spacing.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    overflow: 'hidden',
  },
  swatch: {
    width: 6,
    alignSelf: 'stretch',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  mainHit: {
    flex: 1,
    paddingLeft: Spacing.sm,
  },
  copy: {
    gap: 2,
  },
  no: {
    fontSize: 11,
    letterSpacing: 0.8,
  },
  store: {
    fontSize: 16,
    letterSpacing: -0.3,
  },
  title: {
    fontSize: 13,
    lineHeight: 18,
  },
  meta: {
    fontSize: 12,
    marginTop: 2,
  },
  presentBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

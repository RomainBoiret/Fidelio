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
  withTiming,
} from 'react-native-reanimated';

import { ArtworkFrame } from '@/components/brand/artwork-frame';
import { ArtworkPlane } from '@/components/brand/artwork-plane';
import { GalleryLabel } from '@/components/brand/gallery-label';
import { PressableScale } from '@/components/motion/pressable-scale';
import { formatBarcodeLabel } from '@/domain/card';
import {
  addedYear,
  collectionLabel,
  formatCollectionNo,
  maskCode,
  relativeUseLabel,
} from '@/domain/gallery';
import type { LoyaltyCard } from '@/domain/types';
import { Fonts, Motion, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  card: LoyaltyCard;
  catalogueNo?: number;
};

const enterEasing =
  Platform.OS === 'web' ? Easing.linear : Easing.out(Easing.cubic);

/** Featured piece — artwork flush on top, label + CTA below. */
export function FeaturedCard({ card, catalogueNo = 1 }: Props) {
  const colors = useTheme();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const accent = card.accentColor ?? colors.accent;
  const scanX = useSharedValue(-48);
  const no = formatCollectionNo(catalogueNo);

  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: scanX.value }],
    opacity: scanX.value < 280 ? 0.7 : 0,
  }));

  const onPresent = React.useCallback(() => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (!reduceMotion) {
      scanX.value = -48;
      // eslint-disable-next-line react-hooks/immutability -- shared value write
      scanX.value = withTiming(320, {
        duration: Motion.card,
        easing: enterEasing,
      });
    }
    setTimeout(() => {
      router.push(`/card/${card.id}/present`);
    }, reduceMotion ? 0 : 140);
  }, [card.id, reduceMotion, router, scanX]);

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInUp.duration(Motion.editorial).easing(enterEasing)}
      style={styles.wrap}
    >
      <View
        style={[
          styles.panel,
          Shadow.artwork,
          {
            backgroundColor: colors.backgroundElevated,
            ...(Platform.OS === 'web' ? null : { shadowColor: colors.shadow }),
          },
        ]}
      >
        <PressableScale
          accessibilityRole="link"
          accessibilityLabel={`${card.title} at ${card.storeName}, ${collectionLabel(catalogueNo)}`}
          onPress={() => router.push(`/card/${card.id}`)}
        >
          <ArtworkFrame accentColor={accent} height={168} flush>
            <ArtworkPlane accentColor={accent} seed={card.storeName} />
            {!reduceMotion ? (
              <Animated.View
                style={[styles.scanLine, { backgroundColor: '#FFFFFF' }, scanStyle]}
              />
            ) : null}
          </ArtworkFrame>
        </PressableScale>

        <View style={styles.body}>
          <GalleryLabel
            storeName={card.storeName}
            title={card.title}
            year={addedYear(card.createdAt)}
            formatLabel={formatBarcodeLabel(card.codeFormat)}
            collectionNo={`No. ${no}`}
            status="Ready"
            lastUsed={relativeUseLabel(card.updatedAt)}
            maskedId={maskCode(card.codeValue)}
          />

          <View style={styles.actions}>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={`Present ${card.title} at checkout`}
              onPress={onPresent}
              style={styles.ctaHit}
            >
              <View style={[styles.cta, { backgroundColor: colors.accent }]}>
                <Text style={[styles.ctaText, { fontFamily: Fonts.bodyBold }]}>
                  Present at checkout
                </Text>
                <MaterialCommunityIcons name="arrow-right" size={18} color="#FFFFFF" />
              </View>
            </PressableScale>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Edit ${card.title}`}
              onPress={() => router.push(`/card/${card.id}`)}
              hitSlop={8}
              style={[
                styles.editBtn,
                {
                  backgroundColor: colors.surface,
                  minWidth: 44,
                  minHeight: 44,
                },
              ]}
            >
              <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: Spacing.xl,
  },
  panel: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 32,
    opacity: 0.2,
  },
  body: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  ctaHit: {
    flex: 1,
  },
  cta: {
    minHeight: 48,
    borderRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: -0.1,
  },
  editBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

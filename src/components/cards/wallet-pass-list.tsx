import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, { Easing, FadeInUp, useReducedMotion } from 'react-native-reanimated';

import { WalletPass } from '@/components/cards/wallet-pass';
import type { LoyaltyCard } from '@/domain/types';
import { Spacing } from '@/constants/theme';

type Props = {
  cards: LoyaltyCard[];
  paddingBottom?: number;
};

/**
 * Exact mockup list — frosted passes with generous gap, no 3D carousel.
 */
export function WalletPassList({ cards, paddingBottom = 100 }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <ScrollView
      style={styles.list}
      contentContainerStyle={[styles.content, { paddingBottom }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {cards.map((card, index) => (
        <Animated.View
          key={card.id}
          entering={
            reduceMotion
              ? undefined
              : FadeInUp.delay(Math.min(index, 6) * 40)
                  .duration(340)
                  .easing(Easing.out(Easing.cubic))
          }
          style={styles.row}
        >
          <WalletPass card={card} index={index} stacked={false} />
        </Animated.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    zIndex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 4,
    gap: 14,
  },
  row: {
    width: '100%',
  },
});

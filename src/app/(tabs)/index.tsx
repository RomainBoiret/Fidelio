import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { FeaturedCard } from '@/components/cards/featured-card';
import { CardTile } from '@/components/cards/card-tile';
import { FadeIn } from '@/components/motion/fade-in';
import { PressableScale } from '@/components/motion/pressable-scale';
import { EmptyGallery } from '@/components/brand/empty-gallery';
import { GalleryHeader } from '@/components/ui/gallery-header';
import { Screen } from '@/components/ui/screen';
import { useCards } from '@/data/store/cards-context';
import {
  favoriteCards,
  mostRecentCard,
  recentlyAdded,
} from '@/domain/filter-cards';
import { catalogueIndex } from '@/domain/gallery';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Daily home — recent card + quick checkout in one or two taps. */
export default function HomeScreen() {
  const colors = useTheme();
  const router = useRouter();
  const { cards, loading, error, refresh } = useCards();

  const recent = mostRecentCard(cards);
  const favorites = favoriteCards(cards).slice(0, 4);
  const added = recentlyAdded(cards, 3);

  return (
    <Screen withTabInset padded={false} edges={['left', 'right']}>
      <GalleryHeader
        title={greetingForNow()}
        subtitle={
          cards.length === 0
            ? 'Add a loyalty card to get started.'
            : `${cards.length} card${cards.length === 1 ? '' : 's'} ready for checkout.`
        }
        pieceCount={cards.length}
        onAdd={() => router.navigate('/add')}
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={styles.sheet}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
        ) : error ? (
          <View style={styles.center}>
            <Text style={{ color: colors.danger, fontFamily: Fonts.body }}>{error}</Text>
            <Pressable onPress={() => void refresh()}>
              <Text style={{ color: colors.accent, fontFamily: Fonts.bodyMedium }}>Try again</Text>
            </Pressable>
          </View>
        ) : cards.length === 0 ? (
          <FadeIn>
            <View style={[styles.emptyCard, { backgroundColor: colors.backgroundElevated }]}>
              <EmptyGallery size={148} />
              <Text style={[styles.emptyTitle, { color: colors.ink, fontFamily: Fonts.displayBold }]}>
                Your gallery is waiting.
              </Text>
              <Text style={[styles.emptyBody, { color: colors.textSecondary, fontFamily: Fonts.body }]}>
                Scan a barcode or add a card manually — then present it at checkout in one tap.
              </Text>
              <View style={styles.emptyActions}>
                <PressableScale onPress={() => router.push('/scan')} accessibilityLabel="Scan a card">
                  <View style={[styles.primaryCta, { backgroundColor: colors.accent }]}>
                    <Text style={{ color: '#FFF', fontFamily: Fonts.bodyBold }}>Scan a card</Text>
                  </View>
                </PressableScale>
                <PressableScale
                  onPress={() => router.push('/card/new')}
                  accessibilityLabel="Add manually"
                >
                  <View style={[styles.secondaryCta, { backgroundColor: colors.surface }]}>
                    <Text style={{ color: colors.ink, fontFamily: Fonts.bodyMedium }}>
                      Add manually
                    </Text>
                  </View>
                </PressableScale>
              </View>
            </View>
          </FadeIn>
        ) : (
          <>
            <View style={styles.quickRow}>
              <PressableScale
                accessibilityLabel="Scan a card"
                onPress={() => router.push('/scan')}
                style={styles.quickHit}
              >
                <View style={[styles.quickBtn, { backgroundColor: colors.accentSoft }]}>
                  <MaterialCommunityIcons name="barcode-scan" size={20} color={colors.accent} />
                  <Text style={{ color: colors.accent, fontFamily: Fonts.bodyBold, fontSize: 13 }}>
                    Scan
                  </Text>
                </View>
              </PressableScale>
              {recent ? (
                <PressableScale
                  accessibilityLabel={`Present ${recent.title} at checkout`}
                  onPress={() => router.push(`/card/${recent.id}/present`)}
                  style={styles.quickHit}
                >
                  <View style={[styles.quickBtn, { backgroundColor: colors.accent }]}>
                    <MaterialCommunityIcons name="barcode" size={20} color="#FFF" />
                    <Text style={{ color: '#FFF', fontFamily: Fonts.bodyBold, fontSize: 13 }}>
                      Present at checkout
                    </Text>
                  </View>
                </PressableScale>
              ) : null}
            </View>

            {recent ? (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: colors.textMuted, fontFamily: Fonts.bodyMedium }]}>
                  Ready now
                </Text>
                <FeaturedCard
                  card={recent}
                  catalogueNo={catalogueIndex(cards, recent.id)}
                />
              </View>
            ) : null}

            {favorites.length > 0 ? (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: colors.textMuted, fontFamily: Fonts.bodyMedium }]}>
                  Favorites
                </Text>
                <View style={styles.stack}>
                  {favorites.map((card, index) => (
                    <CardTile
                      key={card.id}
                      card={card}
                      index={index}
                      catalogueNo={catalogueIndex(cards, card.id)}
                    />
                  ))}
                </View>
              </View>
            ) : null}

            {added.length > 0 ? (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: colors.textMuted, fontFamily: Fonts.bodyMedium }]}>
                  Recently added
                </Text>
                <View style={styles.stack}>
                  {added.map((card, index) => (
                    <CardTile
                      key={card.id}
                      card={card}
                      index={index}
                      catalogueNo={catalogueIndex(cards, card.id)}
                    />
                  ))}
                </View>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 140,
    gap: Spacing.lg,
  },
  center: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingTop: 40,
  },
  quickRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickHit: {
    flex: 1,
  },
  quickBtn: {
    minHeight: 48,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  section: {
    gap: Spacing.md,
  },
  sectionLabel: {
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  stack: {
    gap: Spacing.md,
  },
  emptyCard: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: 24,
    letterSpacing: -0.5,
  },
  emptyBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  emptyActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  primaryCta: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    minHeight: 44,
    justifyContent: 'center',
  },
  secondaryCta: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    minHeight: 44,
    justifyContent: 'center',
  },
});

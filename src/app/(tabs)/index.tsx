import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CardTile } from '@/components/cards/card-tile';
import { FadeIn } from '@/components/motion/fade-in';
import { PressableScale } from '@/components/motion/pressable-scale';
import { CurveHero } from '@/components/ui/curve-hero';
import { IconButton } from '@/components/ui/icon-button';
import { Screen } from '@/components/ui/screen';
import { useCards } from '@/data/store/cards-context';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

export default function CardsScreen() {
  const colors = useTheme();
  const router = useRouter();
  const { cards, loading, error, refresh } = useCards();

  return (
    <Screen withTabInset padded={false} edges={['left', 'right']}>
      <CurveHero
        eyebrow={greetingForNow()}
        title="Tes cartes, prêtes en caisse"
        subtitle="Scan, range, retrouve — même hors ligne."
        height={290}
        right={
          <IconButton
            name="plus"
            tone="secondary"
            onPress={() => router.push('/card/new')}
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'transparent' }}
          />
        }
      />

      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.accentText} />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={{ color: colors.danger, fontFamily: Fonts.body }}>{error}</Text>
            <Pressable onPress={() => void refresh()}>
              <Text style={{ color: colors.accentText, fontFamily: Fonts.bodyMedium }}>
                Réessayer
              </Text>
            </Pressable>
          </View>
        ) : cards.length === 0 ? (
          <FadeIn delay={120}>
            <View style={styles.empty}>
              <Text style={[styles.emptyKicker, { color: colors.accentText, fontFamily: Fonts.bodyMedium }]}>
                Coffre vide
              </Text>
              <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: Fonts.displayBold }]}>
                Ajoute ta première carte
              </Text>
              <Text
                style={[styles.emptyBody, { color: colors.textSecondary, fontFamily: Fonts.body }]}
              >
                Scanne un code en magasin, ou saisis-le à la main.
              </Text>
              <View style={styles.emptyActions}>
                <PressableScale onPress={() => router.push('/scan')}>
                  <View style={[styles.primaryCta, { backgroundColor: colors.accent }]}>
                    <Text style={{ color: '#FFF', fontFamily: Fonts.bodyBold }}>Scanner</Text>
                  </View>
                </PressableScale>
                <PressableScale onPress={() => router.push('/card/new')}>
                  <View
                    style={[
                      styles.secondaryCta,
                      { borderColor: colors.borderStrong, backgroundColor: colors.backgroundElevated },
                    ]}
                  >
                    <Text style={{ color: colors.text, fontFamily: Fonts.bodyMedium }}>
                      Saisie manuelle
                    </Text>
                  </View>
                </PressableScale>
              </View>
            </View>
          </FadeIn>
        ) : (
          <>
            <FadeIn delay={80}>
              <Text
                style={[styles.sectionTitle, { color: colors.text, fontFamily: Fonts.displayBold }]}
              >
                {cards.length} carte{cards.length > 1 ? 's' : ''}
              </Text>
            </FadeIn>
            <FlatList
              data={cards}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
              renderItem={({ item, index }) => <CardTile card={item} index={index} />}
              onRefresh={() => void refresh()}
              refreshing={loading}
              showsVerticalScrollIndicator={false}
              initialNumToRender={8}
              maxToRenderPerBatch={8}
              windowSize={7}
              removeClippedSubviews
            />
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    marginTop: -6,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    letterSpacing: -0.3,
    marginBottom: Spacing.lg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingBottom: 120,
  },
  empty: {
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  emptyKicker: {
    fontSize: 13,
    letterSpacing: 0.4,
  },
  emptyTitle: {
    fontSize: 28,
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  emptyBody: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 300,
    marginBottom: Spacing.md,
  },
  emptyActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  primaryCta: {
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
  },
  secondaryCta: {
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    borderWidth: 1,
  },
  list: {
    paddingBottom: 140,
  },
});

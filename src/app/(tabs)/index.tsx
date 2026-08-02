import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CardTile } from '@/components/cards/card-tile';
import { FadeIn } from '@/components/motion/fade-in';
import { PressableScale } from '@/components/motion/pressable-scale';
import { CurveHero } from '@/components/ui/curve-hero';
import { IconButton } from '@/components/ui/icon-button';
import { Screen } from '@/components/ui/screen';
import { useCards } from '@/data/store/cards-context';
import { filterCards } from '@/domain/filter-cards';
import { Fonts, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function CardsScreen() {
  const colors = useTheme();
  const router = useRouter();
  const { cards, loading, error, refresh } = useCards();
  const [query, setQuery] = React.useState('');

  const filtered = filterCards(cards, query);
  const hasQuery = query.trim().length > 0;
  const highlight =
    cards.length === 0
      ? undefined
      : `${cards.length} card${cards.length === 1 ? '' : 's'}`;

  return (
    <Screen withTabInset padded={false} edges={['left', 'right']}>
      <CurveHero
        eyebrow={greetingForNow()}
        title={cards.length === 0 ? "Let's add your first card" : "Let's checkout with your"}
        highlight={highlight}
        subtitle="Scan, store, and flash them at the register — even offline."
        height={210}
        right={
          <IconButton
            name="plus"
            tone="accent"
            onPress={() => router.push('/card/new')}
          />
        }
      />

      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={{ color: colors.danger, fontFamily: Fonts.body }}>{error}</Text>
            <Pressable onPress={() => void refresh()}>
              <Text style={{ color: colors.accent, fontFamily: Fonts.bodyMedium }}>
                Try again
              </Text>
            </Pressable>
          </View>
        ) : cards.length === 0 ? (
          <FadeIn delay={100}>
            <View
              style={[
                styles.emptyCard,
                Shadow.card,
                { backgroundColor: colors.backgroundElevated, shadowColor: colors.shadow },
              ]}
            >
              <View style={[styles.emptyIcon, { backgroundColor: colors.pastelBlue }]}>
                <MaterialCommunityIcons name="wallet-outline" size={28} color={colors.accent} />
              </View>
              <Text
                style={[styles.emptyTitle, { color: colors.text, fontFamily: Fonts.displayBold }]}
              >
                Empty vault
              </Text>
              <Text
                style={[styles.emptyBody, { color: colors.textSecondary, fontFamily: Fonts.body }]}
              >
                Scan a loyalty card in store, or enter the code by hand.
              </Text>
              <View style={styles.emptyActions}>
                <PressableScale onPress={() => router.push('/scan')}>
                  <View style={[styles.primaryCta, { backgroundColor: colors.accent }]}>
                    <Text style={{ color: '#FFF', fontFamily: Fonts.bodyBold }}>Scan a card</Text>
                  </View>
                </PressableScale>
                <PressableScale onPress={() => router.push('/card/new')}>
                  <View style={[styles.secondaryCta, { backgroundColor: colors.pastelBlue }]}>
                    <Text style={{ color: colors.accent, fontFamily: Fonts.bodyMedium }}>
                      Manual entry
                    </Text>
                  </View>
                </PressableScale>
              </View>
            </View>
          </FadeIn>
        ) : (
          <>
            <FadeIn delay={40}>
              <View
                style={[
                  styles.search,
                  Shadow.card,
                  {
                    backgroundColor: colors.backgroundElevated,
                    shadowColor: colors.shadow,
                  },
                ]}
              >
                <MaterialCommunityIcons name="magnify" size={20} color={colors.textMuted} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search cards or stores"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  style={[
                    styles.searchInput,
                    { color: colors.text, fontFamily: Fonts.body },
                  ]}
                  accessibilityLabel="Search cards"
                />
                {hasQuery ? (
                  <Pressable
                    onPress={() => setQuery('')}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Clear search"
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={18}
                      color={colors.textMuted}
                    />
                  </Pressable>
                ) : null}
              </View>
            </FadeIn>

            <View style={styles.sectionRow}>
              <Text
                style={[styles.sectionTitle, { color: colors.text, fontFamily: Fonts.displayBold }]}
              >
                {hasQuery ? 'Results' : 'Your cards'}
              </Text>
            </View>

            {filtered.length === 0 ? (
              <Text style={[styles.noResults, { color: colors.textMuted, fontFamily: Fonts.body }]}>
                No matches. Try another name or code.
              </Text>
            ) : (
              <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
                renderItem={({ item, index }) => <CardTile card={item} index={index} />}
                onRefresh={() => void refresh()}
                refreshing={loading}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                initialNumToRender={8}
                maxToRenderPerBatch={8}
                windowSize={7}
                removeClippedSubviews
              />
            )}
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 52,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
  sectionRow: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    letterSpacing: -0.3,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingBottom: 120,
  },
  emptyCard: {
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    letterSpacing: -0.3,
  },
  emptyBody: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 280,
  },
  emptyActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  primaryCta: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
  },
  secondaryCta: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
  },
  noResults: {
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    paddingBottom: 140,
  },
});

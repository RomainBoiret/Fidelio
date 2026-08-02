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
import { Fonts, Radius, Spacing } from '@/constants/theme';
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

  return (
    <Screen withTabInset padded={false} edges={['left', 'right']}>
      <CurveHero
        eyebrow={greetingForNow()}
        title="Your cards, ready at checkout"
        subtitle="Scan, store, find - even offline."
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
                Try again
              </Text>
            </Pressable>
          </View>
        ) : cards.length === 0 ? (
          <FadeIn delay={120}>
            <View style={styles.empty}>
              <Text style={[styles.emptyKicker, { color: colors.accentText, fontFamily: Fonts.bodyMedium }]}>
                Empty vault
              </Text>
              <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: Fonts.displayBold }]}>
                Add your first card
              </Text>
              <Text
                style={[styles.emptyBody, { color: colors.textSecondary, fontFamily: Fonts.body }]}
              >
                Scan a code in store, or enter it by hand.
              </Text>
              <View style={styles.emptyActions}>
                <PressableScale onPress={() => router.push('/scan')}>
                  <View style={[styles.primaryCta, { backgroundColor: colors.accent }]}>
                    <Text style={{ color: '#FFF', fontFamily: Fonts.bodyBold }}>Scan</Text>
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
                  {
                    backgroundColor: colors.backgroundElevated,
                    borderColor: colors.border,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="magnify"
                  size={20}
                  color={colors.textMuted}
                />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search name, store, or code"
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

            <FadeIn delay={80}>
              <Text
                style={[styles.sectionTitle, { color: colors.text, fontFamily: Fonts.displayBold }]}
              >
                {hasQuery
                  ? `${filtered.length} result${filtered.length === 1 ? '' : 's'}`
                  : `${cards.length} card${cards.length === 1 ? '' : 's'}`}
              </Text>
            </FadeIn>

            {filtered.length === 0 ? (
              <View style={styles.noResults}>
                <Text
                  style={[
                    styles.noResultsTitle,
                    { color: colors.text, fontFamily: Fonts.display },
                  ]}
                >
                  No matches
                </Text>
                <Text
                  style={[
                    styles.noResultsBody,
                    { color: colors.textSecondary, fontFamily: Fonts.body },
                  ]}
                >
                  Try another name, store, or code fragment.
                </Text>
              </View>
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
    marginTop: -6,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 48,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
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
  noResults: {
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  noResultsTitle: {
    fontSize: 18,
    letterSpacing: -0.2,
  },
  noResultsBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    paddingBottom: 140,
  },
});

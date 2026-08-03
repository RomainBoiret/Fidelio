import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { CardTile } from '@/components/cards/card-tile';
import { GalleryHeader } from '@/components/ui/gallery-header';
import { Screen } from '@/components/ui/screen';
import { useCards } from '@/data/store/cards-context';
import { CARD_CATEGORIES } from '@/domain/categories';
import {
  applyCardsFilter,
  filterCards,
  sortCardsAlpha,
  type CardsFilter,
} from '@/domain/filter-cards';
import { catalogueIndex } from '@/domain/gallery';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SortMode = 'recent' | 'alpha';

/** Full loyalty card library — search, filters, list. */
export default function CardsScreen() {
  const colors = useTheme();
  const router = useRouter();
  const { cards, loading, error, refresh } = useCards();
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<CardsFilter>('all');
  const [sort, setSort] = React.useState<SortMode>('recent');

  const filtered = React.useMemo(() => {
    let list = filterCards(cards, query);
    list = applyCardsFilter(list, filter);
    if (sort === 'alpha') list = sortCardsAlpha(list);
    return list;
  }, [cards, query, filter, sort]);

  const chips: { id: CardsFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'recent', label: 'Recent' },
    ...CARD_CATEGORIES.map((c) => ({ id: c.id as CardsFilter, label: c.label })),
  ];

  return (
    <Screen withTabInset padded={false} edges={['left', 'right']}>
      <GalleryHeader
        title="My cards"
        subtitle="Search, filter, and open any card in your collection."
        pieceCount={cards.length}
        onAdd={() => router.navigate('/add')}
      />

      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.search,
            { backgroundColor: colors.backgroundElevated, borderColor: colors.border },
          ]}
        >
          <MaterialCommunityIcons name="magnify" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by store or card"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            style={[styles.searchInput, { color: colors.text, fontFamily: Fonts.body }]}
            accessibilityLabel="Search cards"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {chips.map((chip) => {
            const active = filter === chip.id;
            return (
              <Pressable
                key={chip.id}
                onPress={() => setFilter(chip.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.ink : colors.backgroundElevated,
                    borderColor: colors.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text
                  style={{
                    color: active ? colors.backgroundElevated : colors.textSecondary,
                    fontFamily: Fonts.bodyMedium,
                    fontSize: 13,
                  }}
                >
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sortRow}>
          <Text style={{ color: colors.textMuted, fontFamily: Fonts.body, fontSize: 13 }}>
            {filtered.length} result{filtered.length === 1 ? '' : 's'}
          </Text>
          <Pressable
            onPress={() => setSort((s) => (s === 'alpha' ? 'recent' : 'alpha'))}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Toggle sort"
          >
            <Text style={{ color: colors.accent, fontFamily: Fonts.bodyMedium, fontSize: 13 }}>
              {sort === 'alpha' ? 'A–Z' : 'Most used'}
            </Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 24 }} />
        ) : error ? (
          <Text style={{ color: colors.danger, fontFamily: Fonts.body }}>{error}</Text>
        ) : filtered.length === 0 ? (
          <Text style={{ color: colors.textMuted, fontFamily: Fonts.body, marginTop: 12 }}>
            No cards match these filters.
          </Text>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
            renderItem={({ item, index }) => (
              <CardTile
                card={item}
                index={index}
                catalogueNo={catalogueIndex(cards, item.id)}
              />
            )}
            onRefresh={() => void refresh()}
            refreshing={loading}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={Platform.OS !== 'web'}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 48,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
  chips: {
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: StyleSheet.hairlineWidth,
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  list: {
    paddingBottom: 140,
  },
});

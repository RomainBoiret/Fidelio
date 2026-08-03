import Constants from 'expo-constants';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  useReducedMotion,
} from 'react-native-reanimated';

import { GalleryHeader } from '@/components/ui/gallery-header';
import { Screen } from '@/components/ui/screen';
import { useCards } from '@/data/store/cards-context';
import { CARD_CATEGORIES, categoryById } from '@/domain/categories';
import { favoriteCards } from '@/domain/filter-cards';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function appVersion() {
  return (
    Constants.expoConfig?.version ??
    Constants.nativeAppVersion ??
    '0.1.0'
  );
}

function monthOpens(cards: ReturnType<typeof useCards>['cards']) {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const stamp = start.toISOString();
  return cards.filter((c) => (c.lastOpenedAt ?? '') >= stamp).length;
}

function topCategory(cards: ReturnType<typeof useCards>['cards']) {
  const counts = new Map<string, number>();
  for (const card of cards) {
    if (!card.categoryId) continue;
    counts.set(card.categoryId, (counts.get(card.categoryId) ?? 0) + 1);
  }
  let best: string | null = null;
  let n = 0;
  for (const [id, count] of counts) {
    if (count > n) {
      best = id;
      n = count;
    }
  }
  return best ? categoryById(best)?.label ?? best : '—';
}

/** Profile — vault info, light stats, about. */
export default function SettingsScreen() {
  const colors = useTheme();
  const reduceMotion = useReducedMotion();
  const { cards, loading } = useCards();
  const favorites = favoriteCards(cards).length;
  const opens = monthOpens(cards);

  const stats = [
    { title: 'Cards', body: loading ? '…' : String(cards.length) },
    { title: 'Favorites', body: loading ? '…' : String(favorites) },
    { title: 'Opens this month', body: loading ? '…' : String(opens) },
    { title: 'Top category', body: loading ? '…' : topCategory(cards) },
  ];

  const info = [
    {
      title: 'Local vault',
      body: 'Cards stay on this device. Cloud sync is planned later.',
    },
    {
      title: 'Categories',
      body: CARD_CATEGORIES.map((c) => c.label).join(' · '),
    },
    {
      title: 'Version',
      body: `Fidelio ${appVersion()} · ${Platform.OS}`,
    },
    {
      title: 'Coming next',
      body: 'Notifications, export, photo import, and optional sync.',
    },
  ];

  return (
    <Screen withTabInset scroll padded={false} edges={['left', 'right']}>
      <GalleryHeader
        title="Profile"
        subtitle="Your collection stats and app settings."
        pieceCount={cards.length}
      />

      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        <Text style={[styles.section, { color: colors.textMuted, fontFamily: Fonts.bodyMedium }]}>
          Stats
        </Text>
        <View style={styles.statsGrid}>
          {stats.map((item, index) => (
            <Animated.View
              key={item.title}
              entering={
                reduceMotion
                  ? undefined
                  : FadeInUp.delay(40 + index * 40)
                      .duration(360)
                      .easing(
                        Platform.OS === 'web' ? Easing.linear : Easing.out(Easing.cubic),
                      )
              }
              style={[styles.statCard, { backgroundColor: colors.backgroundElevated }]}
            >
              <Text style={[styles.statValue, { color: colors.ink, fontFamily: Fonts.displayBold }]}>
                {item.body}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textMuted, fontFamily: Fonts.body }]}>
                {item.title}
              </Text>
            </Animated.View>
          ))}
        </View>

        <Text
          style={[
            styles.section,
            { color: colors.textMuted, fontFamily: Fonts.bodyMedium, marginTop: Spacing.lg },
          ]}
        >
          About
        </Text>
        {info.map((item, index) => (
          <Animated.View
            key={item.title}
            entering={
              reduceMotion
                ? undefined
                : FadeInUp.delay(120 + index * 50)
                    .duration(360)
                    .easing(
                      Platform.OS === 'web' ? Easing.linear : Easing.out(Easing.cubic),
                    )
            }
          >
            <View style={[styles.card, { backgroundColor: colors.backgroundElevated }]}>
              <Text style={[styles.cardLabel, { color: colors.textMuted, fontFamily: Fonts.bodyMedium }]}>
                {item.title}
              </Text>
              <Text style={[styles.cardBody, { color: colors.text, fontFamily: Fonts.body }]}>
                {item.body}
              </Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    paddingBottom: 140,
  },
  section: {
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statCard: {
    width: '47%',
    flexGrow: 1,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    gap: 4,
    minWidth: 140,
  },
  statValue: {
    fontSize: 22,
    letterSpacing: -0.4,
  },
  statLabel: {
    fontSize: 13,
  },
  card: {
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: 6,
  },
  cardLabel: {
    fontSize: 12,
    letterSpacing: 0.3,
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 22,
  },
});

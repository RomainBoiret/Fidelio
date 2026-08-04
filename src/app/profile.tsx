import Constants from 'expo-constants';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeInUp,
  useReducedMotion,
} from 'react-native-reanimated';

import { GalleryMark } from '@/components/brand/gallery-mark';
import { WalletAtmosphere } from '@/components/brand/wallet-atmosphere';
import { GlassSurface } from '@/components/ui/glass-surface';
import { useCards } from '@/data/store/cards-context';
import { CARD_CATEGORIES, categoryById } from '@/domain/categories';
import { favoriteCards } from '@/domain/filter-cards';
import { Fonts, FontWeight, Motion, Radius, Spacing } from '@/constants/theme';
import { useSafeBack } from '@/hooks/use-safe-back';
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

type AboutRow = {
  title: string;
  body: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

/** Profile — vault identity, calm metrics, about. */
export default function ProfileScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const goBack = useSafeBack('/');
  const { cards, loading } = useCards();
  const favorites = favoriteCards(cards).length;
  const opens = monthOpens(cards);
  const top = topCategory(cards);

  const metrics = [
    { label: 'Cards', value: loading ? '…' : String(cards.length) },
    { label: 'Favorites', value: loading ? '…' : String(favorites) },
    { label: 'Opens', value: loading ? '…' : String(opens) },
  ];

  const about: AboutRow[] = [
    {
      title: 'Local vault',
      body: 'Cards stay on this device. Cloud sync is planned later.',
      icon: 'shield-lock-outline',
    },
    {
      title: 'Categories',
      body: CARD_CATEGORIES.map((c) => c.label).join(' · '),
      icon: 'shape-outline',
    },
    {
      title: 'Coming next',
      body: 'Notifications, export, photo import, and optional sync.',
      icon: 'lightbulb-outline',
    },
  ];

  const enter = (delay: number) =>
    reduceMotion
      ? undefined
      : FadeInUp.delay(delay)
          .duration(Motion.enter)
          .easing(Easing.out(Easing.cubic))
          .springify()
          .damping(18)
          .stiffness(170);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <WalletAtmosphere intensity="soft" />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + Spacing.md,
            paddingBottom: insets.bottom + Spacing.xxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={goBack}
            hitSlop={8}
          >
            <GlassSurface tone="chrome" radius={Radius.md} style={styles.iconBtn}>
              <View style={styles.iconBtnInner}>
                <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
              </View>
            </GlassSurface>
          </Pressable>
          <GalleryMark size={34} withWordmark />
          <View style={styles.iconBtnSpacer} />
        </View>

        <Animated.View entering={enter(40)} style={styles.intro}>
          <Text style={[styles.kicker, { color: colors.accent, fontFamily: Fonts.bodyMedium }]}>
            Your wallet
          </Text>
          <Text style={[styles.title, { color: colors.ink, fontFamily: Fonts.displayBold }]}>
            Profile
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: Fonts.body }]}>
            Collection pulse and how Fidelio keeps your passes.
          </Text>
        </Animated.View>

        <Animated.View entering={enter(80)}>
          <GlassSurface
            tone="light"
            radius={Radius.xl}
            style={styles.hero}
            contentStyle={styles.heroInner}
          >
            <View style={[styles.heroRail, { backgroundColor: colors.accent }]} />
            <View style={styles.heroBody}>
              <View style={styles.heroTop}>
                <View
                  style={[
                    styles.heroMark,
                    { backgroundColor: colors.isDark ? '#EEF0FA' : colors.ink },
                  ]}
                >
                  <Text
                    style={[
                      styles.heroF,
                      {
                        color: colors.isDark ? '#12141F' : '#FFFFFF',
                        fontFamily: Fonts.displayBold,
                        fontWeight: FontWeight.heavy,
                      },
                    ]}
                  >
                    F
                  </Text>
                </View>
                <View style={styles.heroCopy}>
                  <Text
                    style={[
                      styles.heroTitle,
                      {
                        color: colors.ink,
                        fontFamily: Fonts.displayBold,
                        fontWeight: FontWeight.heavy,
                      },
                    ]}
                  >
                    Local vault
                  </Text>
                  <Text style={[styles.heroSub, { color: colors.textSecondary, fontFamily: Fonts.body }]}>
                    Private to this device · no account needed
                  </Text>
                </View>
              </View>

              <View style={[styles.metrics, { borderTopColor: colors.border }]}>
                {metrics.map((item, index) => (
                  <View
                    key={item.label}
                    style={[
                      styles.metric,
                      index < metrics.length - 1
                        ? { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.border }
                        : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.metricValue,
                        {
                          color: colors.ink,
                          fontFamily: Fonts.displayBold,
                          fontWeight: FontWeight.heavy,
                        },
                      ]}
                    >
                      {item.value}
                    </Text>
                    <Text style={[styles.metricLabel, { color: colors.textMuted, fontFamily: Fonts.body }]}>
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>

              <GlassSurface tone="clear" radius={Radius.sm} contentStyle={styles.topCat}>
                <View style={styles.topCatRow}>
                  <Text style={[styles.topCatLabel, { color: colors.textMuted, fontFamily: Fonts.bodyMedium }]}>
                    Top category
                  </Text>
                  <Text style={[styles.topCatValue, { color: colors.ink, fontFamily: Fonts.bodyBold }]}>
                    {loading ? '…' : top}
                  </Text>
                </View>
              </GlassSurface>
            </View>
          </GlassSurface>
        </Animated.View>

        <Animated.View entering={enter(140)} style={styles.sectionBlock}>
          <Text style={[styles.section, { color: colors.textMuted, fontFamily: Fonts.bodyMedium }]}>
            About
          </Text>
          <GlassSurface tone="light" radius={Radius.xl}>
            {about.map((item, index) => (
              <View
                key={item.title}
                style={[
                  styles.row,
                  index < about.length - 1
                    ? { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }
                    : null,
                ]}
              >
                <View style={[styles.rowIcon, { backgroundColor: colors.accentSoft }]}>
                  <MaterialCommunityIcons name={item.icon} size={20} color={colors.accent} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={[styles.rowTitle, { color: colors.ink, fontFamily: Fonts.bodyBold }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.rowBody, { color: colors.textSecondary, fontFamily: Fonts.body }]}>
                    {item.body}
                  </Text>
                </View>
              </View>
            ))}
          </GlassSurface>
        </Animated.View>

        <Text style={[styles.version, { color: colors.textMuted, fontFamily: Fonts.body }]}>
          Fidelio {appVersion()} · {Platform.OS}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: Spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  iconBtn: {
    width: 44,
    height: 44,
  },
  iconBtnInner: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnSpacer: {
    width: 44,
    height: 44,
  },
  intro: {
    gap: 6,
    marginBottom: Spacing.xl,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 34,
    letterSpacing: -0.9,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 300,
  },
  hero: {
    marginBottom: Spacing.xl,
  },
  heroInner: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  heroRail: {
    width: 8,
  },
  heroBody: {
    flex: 1,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  heroMark: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroF: {
    fontSize: 22,
  },
  heroCopy: {
    flex: 1,
    gap: 2,
  },
  heroTitle: {
    fontSize: 18,
    letterSpacing: -0.3,
  },
  heroSub: {
    fontSize: 13,
    lineHeight: 18,
  },
  metrics: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.lg,
  },
  metric: {
    flex: 1,
    gap: 2,
    paddingRight: Spacing.sm,
  },
  metricValue: {
    fontSize: 26,
    letterSpacing: -0.6,
  },
  metricLabel: {
    fontSize: 12,
  },
  topCat: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  topCatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  topCatLabel: {
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  topCatValue: {
    fontSize: 15,
  },
  sectionBlock: {
    gap: Spacing.md,
  },
  section: {
    fontSize: 12,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'flex-start',
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCopy: {
    flex: 1,
    gap: 4,
    paddingTop: 2,
  },
  rowTitle: {
    fontSize: 15,
  },
  rowBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  version: {
    marginTop: Spacing.xl,
    textAlign: 'center',
    fontSize: 12,
  },
});

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyGallery } from '@/components/brand/empty-gallery';
import { GalleryMark } from '@/components/brand/gallery-mark';
import { WalletAtmosphere } from '@/components/brand/wallet-atmosphere';
import { WalletPassList } from '@/components/cards/wallet-pass-list';
import { FadeIn } from '@/components/motion/fade-in';
import { PressableScale } from '@/components/motion/pressable-scale';
import { GlassSurface } from '@/components/ui/glass-surface';
import { useCards } from '@/data/store/cards-context';
import { filterCards } from '@/domain/filter-cards';
import { Fonts, FontWeight, Motion, Radius, Shadow, Spacing, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Single-screen wallet — frosted passes, FAB add, no tabs.
 */
export default function WalletScreen() {
  const colors = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { cards, loading, error, refresh } = useCards();
  const [query, setQuery] = React.useState('');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const fabBob = useSharedValue(0);
  const fabScale = useSharedValue(1);

  const filtered = filterCards(cards, query);

  React.useEffect(() => {
    if (reduceMotion) {
      fabBob.value = 0;
      return;
    }
    fabBob.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [fabBob, reduceMotion]);

  const fabMotion = useAnimatedStyle(() => ({
    transform: [
      { translateY: fabBob.value * -5 },
      { scale: fabScale.value },
    ],
  }));

  const enterHeader =
    reduceMotion
      ? undefined
      : FadeInDown.delay(30)
          .duration(Motion.enter)
          .easing(Easing.out(Easing.cubic));

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <WalletAtmosphere intensity="rich" />

      <Animated.View
        entering={enterHeader}
        style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
      >
        <GalleryMark size={34} withWordmark />
        <View style={styles.headerActions}>
          <PressableScale
            accessibilityLabel={searchOpen ? 'Close search' : 'Search cards'}
            onPress={() => {
              setSearchOpen((v) => !v);
              if (searchOpen) setQuery('');
            }}
          >
            <GlassSurface tone="chrome" radius={Radius.md} style={styles.iconBtn}>
              <View style={styles.iconBtnInner}>
                <MaterialCommunityIcons
                  name={searchOpen ? 'close' : 'magnify'}
                  size={22}
                  color={colors.ink}
                />
              </View>
            </GlassSurface>
          </PressableScale>
          <PressableScale
            accessibilityLabel="Profile"
            onPress={() => router.push('/profile')}
          >
            <GlassSurface tone="chrome" radius={Radius.md} style={styles.iconBtn}>
              <View style={styles.iconBtnInner}>
                <MaterialCommunityIcons name="account-outline" size={22} color={colors.ink} />
              </View>
            </GlassSurface>
          </PressableScale>
        </View>
      </Animated.View>

      {searchOpen ? (
        <FadeIn delay={40} duration={320} direction="zoom">
          <View style={styles.searchWrap}>
            <GlassSurface tone="chrome" radius={Radius.md} style={styles.searchGlass}>
              <View style={styles.search}>
                <MaterialCommunityIcons name="magnify" size={18} color={colors.textMuted} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Find a store or card"
                  placeholderTextColor={colors.textMuted}
                  autoFocus
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  style={[
                    styles.searchInput,
                    {
                      color: colors.text,
                      fontFamily: Fonts.body,
                      fontWeight: FontWeight.regular,
                    },
                  ]}
                  accessibilityLabel="Search cards"
                />
              </View>
            </GlassSurface>
          </View>
        </FadeIn>
      ) : (
        <FadeIn delay={70} direction="down">
          <View style={styles.intro}>
            <Text style={[styles.kicker, { color: colors.accent }]}>Wallet</Text>
            <Text style={[styles.headline, { color: colors.ink }]}>Your passes</Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>
              {cards.length === 0
                ? 'Add a loyalty card to start your wallet.'
                : `Swipe passes · tap to present · ${cards.length} saved`}
            </Text>
          </View>
        </FadeIn>
      )}

      {loading ? (
        <View style={styles.scroll}>
          <ActivityIndicator color={colors.accent} style={{ marginTop: 48 }} />
        </View>
      ) : error ? (
        <View style={[styles.scroll, styles.center]}>
          <Text style={{ color: colors.danger, fontFamily: Fonts.body }}>{error}</Text>
          <Pressable onPress={() => void refresh()}>
            <Text style={{ color: colors.accent, fontFamily: Fonts.bodyMedium }}>Try again</Text>
          </Pressable>
        </View>
      ) : filtered.length === 0 && query ? (
        <View style={[styles.scroll, styles.sheet]}>
          <Text style={[styles.emptyHint, { color: colors.textMuted, fontFamily: Fonts.body }]}>
            No passes match “{query}”.
          </Text>
        </View>
      ) : cards.length === 0 ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.sheet, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
        >
          <FadeIn delay={120} direction="zoom">
            <GlassSurface tone="light" radius={Radius.xl} style={styles.emptyCard}>
              <EmptyGallery size={148} />
              <Text style={[styles.emptyTitle, { color: colors.ink }]}>
                Nothing here yet.
              </Text>
              <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
                Scan a barcode or add a card — then tap it at checkout.
              </Text>
              <PressableScale
                accessibilityLabel="Add a card"
                onPress={() => router.push('/add')}
              >
                <View style={[styles.primaryCta, { backgroundColor: colors.accent }]}>
                  <Text
                    style={{
                      color: '#FFF',
                      fontFamily: Fonts.bodyBold,
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      letterSpacing: -0.1,
                    }}
                  >
                    Add a card
                  </Text>
                </View>
              </PressableScale>
            </GlassSurface>
          </FadeIn>
        </ScrollView>
      ) : (
        <WalletPassList
          cards={filtered}
          paddingBottom={insets.bottom + 110}
        />
      )}

      <View
        pointerEvents="box-none"
        style={[styles.fabWrap, { bottom: Math.max(insets.bottom, 18) }]}
      >
        <Animated.View style={[styles.fabHalo, fabMotion]}>
          <View
            style={[
              styles.fabHaloRing,
              {
                backgroundColor: colors.fabHalo,
                borderColor: colors.glassBorder,
                ...(Platform.OS === 'web'
                  ? ({
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      boxShadow: colors.isDark
                        ? '0 12px 32px rgba(0, 0, 0, 0.35)'
                        : '0 12px 32px rgba(70, 90, 160, 0.12)',
                    } as object)
                  : null),
              },
            ]}
          />
          <AnimatedPressable
            accessibilityRole="button"
            accessibilityLabel="Add a card"
            onPress={() => router.push('/add')}
            onPressIn={() => {
              if (!reduceMotion) {
                fabScale.value = withSpring(0.9, Motion.spring.snappy);
              }
            }}
            onPressOut={() => {
              if (!reduceMotion) {
                fabScale.value = withSpring(1, Motion.spring.soft);
              }
            }}
            style={[
              styles.fab,
              Shadow.floating,
              {
                backgroundColor: colors.accent,
                ...(Platform.OS === 'web' ? null : { shadowColor: colors.accent }),
              },
            ]}
          >
            <MaterialCommunityIcons name="plus" size={28} color={colors.onAccent} />
          </AnimatedPressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    zIndex: 2,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
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
  intro: {
    zIndex: 2,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: 6,
  },
  kicker: {
    ...Type.kicker,
    letterSpacing: 1.6,
  },
  headline: {
    ...Type.display,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -1.2,
  },
  sub: {
    ...Type.body,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 340,
  },
  searchWrap: {
    zIndex: 2,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  searchGlass: {
    width: '100%',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 48,
    paddingHorizontal: Spacing.lg,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    letterSpacing: -0.1,
    paddingVertical: 12,
  },
  scroll: {
    flex: 1,
    zIndex: 1,
  },
  sheet: {
    paddingHorizontal: Spacing.xl,
  },
  center: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingTop: 40,
  },
  emptyHint: {
    marginTop: Spacing.xl,
    ...Type.caption,
  },
  emptyCard: {
    padding: Spacing.xl,
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  emptyTitle: {
    ...Type.title,
    fontSize: 26,
    lineHeight: 32,
  },
  emptyBody: {
    ...Type.body,
  },
  primaryCta: {
    alignSelf: 'flex-start',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    minHeight: 44,
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  fabWrap: {
    position: 'absolute',
    right: 16,
    zIndex: 3,
  },
  fabHalo: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabHaloRing: {
    ...StyleSheet.absoluteFill,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

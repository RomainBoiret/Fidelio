import Constants from 'expo-constants';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  useReducedMotion,
} from 'react-native-reanimated';

import { CurveHero } from '@/components/ui/curve-hero';
import { Screen } from '@/components/ui/screen';
import { useCards } from '@/data/store/cards-context';
import { Fonts, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type InfoItem = {
  title: string;
  body: string;
};

function appVersion() {
  return (
    Constants.expoConfig?.version ??
    Constants.nativeAppVersion ??
    '0.1.0'
  );
}

function storageLabel() {
  return Platform.OS === 'web'
    ? 'Browser localStorage on this device'
    : 'SQLite vault on this device';
}

export default function SettingsScreen() {
  const colors = useTheme();
  const reduceMotion = useReducedMotion();
  const { cards, loading } = useCards();

  const items: InfoItem[] = [
    {
      title: 'Vault',
      body: loading
        ? 'Loading your cards…'
        : `${cards.length} card${cards.length === 1 ? '' : 's'} · ${storageLabel()}`,
    },
    {
      title: 'App version',
      body: `Fidelio ${appVersion()} · ${Platform.OS}`,
    },
    {
      title: 'Account & sync',
      body: 'Supabase Auth + pull/push will land in a later milestone.',
    },
    {
      title: 'Categories',
      body: 'Organize groceries, restaurants, sports… without digging.',
    },
  ];

  return (
    <Screen withTabInset scroll padded={false} edges={['left', 'right']}>
      <CurveHero
        eyebrow="Settings"
        title="Your vault"
        subtitle="Local-first today. Sync and categories are next."
        height={250}
      />

      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        {items.map((item, index) => (
          <Animated.View
            key={item.title}
            entering={
              reduceMotion
                ? undefined
                : FadeInUp.delay(80 + index * 70)
                    .duration(460)
                    .easing(Easing.out(Easing.cubic))
            }
          >
            <View
              style={[
                styles.card,
                Shadow.card,
                {
                  backgroundColor: colors.backgroundElevated,
                  borderColor: colors.border,
                  shadowColor: colors.shadow,
                },
              ]}
            >
              <View style={[styles.dot, { backgroundColor: colors.accent }]} />
              <View style={styles.copy}>
                <Text style={[styles.cardTitle, { color: colors.text, fontFamily: Fonts.display }]}>
                  {item.title}
                </Text>
                <Text
                  style={[styles.cardBody, { color: colors.textSecondary, fontFamily: Fonts.body }]}
                >
                  {item.body}
                </Text>
              </View>
            </View>
          </Animated.View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: {
    marginTop: -6,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    paddingBottom: 140,
  },
  card: {
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    marginTop: 7,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 17,
    letterSpacing: -0.2,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
  },
});

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
  tone: 'pastelBlue' | 'pastelPurple' | 'pastelGreen';
};

function appVersion() {
  return (
    Constants.expoConfig?.version ??
    Constants.nativeAppVersion ??
    '0.1.0'
  );
}

export default function SettingsScreen() {
  const colors = useTheme();
  const reduceMotion = useReducedMotion();
  const { cards, loading } = useCards();

  const items: InfoItem[] = [
    {
      title: 'Local vault',
      body: loading
        ? 'Loading…'
        : `${cards.length} card${cards.length === 1 ? '' : 's'} stored on this device.`,
      tone: 'pastelBlue',
    },
    {
      title: 'Version',
      body: `Fidelio ${appVersion()} · ${Platform.OS}`,
      tone: 'pastelPurple',
    },
    {
      title: 'Coming next',
      body: 'Categories, smarter search, and cloud sync.',
      tone: 'pastelGreen',
    },
  ];

  return (
    <Screen withTabInset scroll padded={false} edges={['left', 'right']}>
      <CurveHero
        eyebrow="Profile"
        title="Your vault"
        subtitle="Everything stays local for now."
        height={180}
      />

      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        {items.map((item, index) => (
          <Animated.View
            key={item.title}
            entering={
              reduceMotion
                ? undefined
                : FadeInUp.delay(60 + index * 60)
                    .duration(420)
                    .easing(Easing.out(Easing.cubic))
            }
          >
            <View
              style={[
                styles.card,
                Shadow.card,
                {
                  backgroundColor: colors[item.tone],
                  shadowColor: colors.shadow,
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: colors.text, fontFamily: Fonts.displayBold }]}>
                {item.title}
              </Text>
              <Text
                style={[styles.cardBody, { color: colors.textSecondary, fontFamily: Fonts.body }]}
              >
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
  card: {
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    letterSpacing: -0.2,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
  },
});

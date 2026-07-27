import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  useReducedMotion,
} from 'react-native-reanimated';

import { CurveHero } from '@/components/ui/curve-hero';
import { Screen } from '@/components/ui/screen';
import { Fonts, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const ITEMS = [
  {
    title: 'Local storage',
    body: 'Your cards already live in SQLite on this device.',
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

export default function SettingsScreen() {
  const colors = useTheme();
  const reduceMotion = useReducedMotion();

  return (
    <Screen withTabInset scroll padded={false} edges={['left', 'right']}>
      <CurveHero
        eyebrow="Settings"
        title="More is coming"
        subtitle="Auth, cloud sync and categories - for now everything stays local."
        height={250}
      />

      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        {ITEMS.map((item, index) => (
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

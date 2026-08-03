import { useRouter } from 'expo-router';
import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { GalleryHeader } from '@/components/ui/gallery-header';
import { Screen } from '@/components/ui/screen';
import { useCards } from '@/data/store/cards-context';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Method = {
  title: string;
  body: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  href: '/scan' | '/card/new';
  primary?: boolean;
};

const METHODS: Method[] = [
  {
    title: 'Scan barcode',
    body: 'Point the camera at the loyalty barcode strip.',
    icon: 'barcode-scan',
    href: '/scan',
    primary: true,
  },
  {
    title: 'Scan QR code',
    body: 'Also works for QR loyalty passes.',
    icon: 'qrcode-scan',
    href: '/scan',
  },
  {
    title: 'Enter manually',
    body: 'Type the store name and card number yourself.',
    icon: 'keyboard-outline',
    href: '/card/new',
  },
];

/** Add hub — scan or manual entry. */
export default function AddScreen() {
  const colors = useTheme();
  const router = useRouter();
  const { cards } = useCards();

  return (
    <Screen withTabInset padded={false} edges={['left', 'right']}>
      <GalleryHeader
        title="Add a card"
        subtitle="Scan a code or enter the details — then confirm before saving."
        pieceCount={cards.length}
      />

      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        {METHODS.map((method) => (
          <Pressable
            key={method.title}
            accessibilityRole="button"
            accessibilityLabel={method.title}
            onPress={() => router.push(method.href)}
            style={[
              styles.card,
              {
                backgroundColor: method.primary
                  ? colors.accent
                  : colors.backgroundElevated,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor: method.primary
                    ? 'rgba(255,255,255,0.18)'
                    : colors.accentSoft,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={method.icon}
                size={24}
                color={method.primary ? '#FFFFFF' : colors.accent}
              />
            </View>
            <View style={styles.copy}>
              <Text
                style={{
                  color: method.primary ? '#FFFFFF' : colors.ink,
                  fontFamily: Fonts.displayBold,
                  fontSize: 17,
                }}
              >
                {method.title}
              </Text>
              <Text
                style={{
                  color: method.primary ? 'rgba(255,255,255,0.85)' : colors.textSecondary,
                  fontFamily: Fonts.body,
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: 4,
                }}
              >
                {method.body}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={method.primary ? '#FFFFFF' : colors.textMuted}
            />
          </Pressable>
        ))}

        <Text style={[styles.note, { color: colors.textMuted, fontFamily: Fonts.body }]}>
          Photo import and brand templates are coming next. For now, scan or type works best.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    paddingBottom: 140,
  },
  card: {
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 88,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
  },
  note: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: Spacing.sm,
  },
});

import { useRouter, type Href } from 'expo-router';
import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { GalleryHeader } from '@/components/ui/gallery-header';
import { WalletAtmosphere } from '@/components/brand/wallet-atmosphere';
import { GlassSurface } from '@/components/ui/glass-surface';
import { Screen } from '@/components/ui/screen';
import { useCards } from '@/data/store/cards-context';
import { Fonts, FontWeight, Radius, Shadow, Spacing } from '@/constants/theme';
import { useSafeBack } from '@/hooks/use-safe-back';
import { useTheme } from '@/hooks/use-theme';

type Method = {
  title: string;
  body: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  href: Href;
  primary?: boolean;
};

const METHODS: Method[] = [
  {
    title: 'Scan barcode',
    body: 'Point the camera at the loyalty barcode strip.',
    icon: 'barcode-scan',
    href: '/scan?mode=barcode',
    primary: true,
  },
  {
    title: 'Scan QR code',
    body: 'Open the square scanner for QR loyalty passes.',
    icon: 'qrcode-scan',
    href: '/scan?mode=qr',
  },
  {
    title: 'Enter manually',
    body: 'Type the store name and card number yourself.',
    icon: 'keyboard-outline',
    href: '/card/new',
  },
];

/** Add hub — glass methods over mist atmosphere. */
export default function AddScreen() {
  const colors = useTheme();
  const router = useRouter();
  const goBack = useSafeBack('/');
  const { cards } = useCards();

  return (
    <View style={[styles.root, { backgroundColor: '#E8EAF6' }]}>
      <WalletAtmosphere intensity="rich" />
      <Screen padded={false} edges={['left', 'right']} transparent>
        <GalleryHeader
          title="Add a card"
          subtitle="Scan a code or enter the details — then confirm before saving."
          pieceCount={cards.length}
          onBack={goBack}
        />

        <View style={styles.sheet}>
          {METHODS.map((method) =>
            method.primary ? (
              <Pressable
                key={method.title}
                accessibilityRole="button"
                accessibilityLabel={method.title}
                onPress={() => router.push(method.href)}
                style={[styles.cardPrimary, Shadow.floating, { backgroundColor: colors.accent }]}
              >
                <View style={styles.iconWrapPrimary}>
                  <MaterialCommunityIcons name={method.icon} size={24} color="#FFFFFF" />
                </View>
                <View style={styles.copy}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontFamily: Fonts.displayBold,
                      fontWeight: FontWeight.heavy,
                      fontSize: 17,
                      letterSpacing: -0.3,
                    }}
                  >
                    {method.title}
                  </Text>
                  <Text style={styles.bodyPrimary}>{method.body}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={22} color="#FFFFFF" />
              </Pressable>
            ) : (
              <Pressable
                key={method.title}
                accessibilityRole="button"
                accessibilityLabel={method.title}
                onPress={() => router.push(method.href)}
              >
                <GlassSurface
                  tone="pass"
                  radius={Radius.lg}
                  style={Shadow.ticket}
                  contentStyle={styles.cardInner}
                >
                  <View style={[styles.iconWrap, { backgroundColor: colors.accentSoft }]}>
                    <MaterialCommunityIcons name={method.icon} size={24} color={colors.accent} />
                  </View>
                  <View style={styles.copy}>
                    <Text
                      style={{
                        color: colors.ink,
                        fontFamily: Fonts.displayBold,
                        fontWeight: FontWeight.heavy,
                        fontSize: 17,
                        letterSpacing: -0.3,
                      }}
                    >
                      {method.title}
                    </Text>
                    <Text
                      style={{
                        color: colors.textSecondary,
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
                    color={colors.textMuted}
                  />
                </GlassSurface>
              </Pressable>
            ),
          )}

          <Text style={[styles.note, { color: colors.textMuted, fontFamily: Fonts.body }]}>
            Photo import and brand templates are coming next. For now, scan or type works best.
          </Text>
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  sheet: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    gap: 14,
    paddingBottom: Spacing.xxl,
  },
  cardPrimary: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 88,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    minHeight: 88,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapPrimary: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  copy: {
    flex: 1,
  },
  bodyPrimary: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  note: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: Spacing.sm,
  },
});

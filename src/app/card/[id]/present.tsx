import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams } from 'expo-router';
import * as Brightness from 'expo-brightness';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoyaltyBarcode } from '@/components/cards/loyalty-barcode';
import { useCards } from '@/data/store/cards-context';
import { formatBarcodeLabel } from '@/domain/card';
import { displayKind } from '@/domain/barcode-display';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useSafeBack } from '@/hooks/use-safe-back';
import { useTheme } from '@/hooks/use-theme';

function paramId(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

const KEEP_AWAKE_TAG = 'fidelio-checkout';

/**
 * Full-screen checkout — max-contrast code, landscape barcode for linear formats.
 */
export default function CardPresentScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = paramId(params.id);
  const goBack = useSafeBack(id ? `/card/${id}` : '/');
  const insets = useSafeAreaInsets();
  const colors = useTheme();
  const { getCardById, markOpened } = useCards();
  const card = id ? getCardById(id) : undefined;
  const accent = card?.accentColor ?? colors.accent;
  const isQr = card ? displayKind(card.codeFormat) === 'qr' : false;

  React.useEffect(() => {
    if (id) void markOpened(id);
  }, [id, markOpened]);

  React.useEffect(() => {
    let previous: number | null = null;
    let active = true;

    void (async () => {
      try {
        await activateKeepAwakeAsync(KEEP_AWAKE_TAG);
      } catch {
        // web / unsupported
      }

      if (Platform.OS === 'web') return;

      try {
        const { status } = await Brightness.requestPermissionsAsync();
        if (!active || status !== 'granted') return;
        previous = await Brightness.getBrightnessAsync();
        await Brightness.setBrightnessAsync(1);
      } catch {
        // permission denied - still usable
      }
    })();

    return () => {
      active = false;
      void deactivateKeepAwake(KEEP_AWAKE_TAG);
      if (previous != null && Platform.OS !== 'web') {
        void Brightness.setBrightnessAsync(previous).catch(() => undefined);
      }
    };
  }, []);

  if (!card) {
    return (
      <View
        style={[
          styles.root,
          {
            backgroundColor: '#E8EAF6',
            paddingTop: insets.top + Spacing.lg,
            paddingHorizontal: Spacing.xl,
          },
        ]}
      >
        <StatusBar style="dark" />
        <Text style={[styles.missing, { color: colors.ink, fontFamily: Fonts.displayBold }]}>
          Card not found
        </Text>
        <Pressable
          onPress={goBack}
          style={[styles.closeHit, styles.closeGlass]}
        >
          <MaterialCommunityIcons name="close" size={22} color={colors.ink} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: '#E8EAF6' }]}>
      <StatusBar style="dark" />

      <View style={[styles.accentRail, { backgroundColor: accent }]} />

      <View
        style={[
          styles.top,
          {
            paddingTop: insets.top + Spacing.md,
            paddingLeft: Spacing.xl + 10,
          },
        ]}
      >
        <View style={styles.topCopy}>
          <Text style={[styles.kicker, { color: colors.accent, fontFamily: Fonts.bodyMedium }]}>
            Checkout
          </Text>
          <Text
            style={[styles.store, { color: colors.ink, fontFamily: Fonts.displayBold }]}
            numberOfLines={1}
          >
            {card.storeName}
          </Text>
          <Text
            style={[styles.meta, { color: colors.textSecondary, fontFamily: Fonts.body }]}
            numberOfLines={1}
          >
            {card.title} · {formatBarcodeLabel(card.codeFormat)}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={goBack}
          style={[styles.closeHit, styles.closeGlass]}
          hitSlop={12}
        >
          <MaterialCommunityIcons name="close" size={22} color={colors.ink} />
        </Pressable>
      </View>

      <View style={styles.stage}>
        <View style={styles.stageInner}>
          <LoyaltyBarcode
            value={card.codeValue}
            format={card.codeFormat}
            landscape={!isQr}
            showValue
          />
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <View style={[styles.hintPill, styles.hintGlass]}>
          <MaterialCommunityIcons
            name={isQr ? 'qrcode-scan' : 'phone-rotate-landscape'}
            size={18}
            color={colors.textSecondary}
          />
          <Text style={[styles.hint, { color: colors.textSecondary, fontFamily: Fonts.body }]}>
            {isQr
              ? 'Center the QR on the reader · max brightness'
              : 'Hold sideways toward the reader · max brightness'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  accentRail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  topCopy: {
    flex: 1,
    gap: 4,
    paddingRight: Spacing.sm,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  store: {
    fontSize: 26,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  meta: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeHit: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeGlass: {
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.5)',
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        } as object)
      : null),
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  stageInner: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.85)',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    ...Platform.select({
      web: { boxShadow: '0 16px 40px rgba(70, 90, 160, 0.12)' },
      default: {
        shadowColor: '#465AA0',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 4,
      },
    }),
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    maxWidth: 360,
  },
  hintGlass: {
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.7)',
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        } as object)
      : null),
  },
  hint: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  missing: {
    fontSize: 22,
    letterSpacing: -0.4,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
});

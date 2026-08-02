import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Brightness from 'expo-brightness';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoyaltyBarcode } from '@/components/cards/loyalty-barcode';
import { useCards } from '@/data/store/cards-context';
import { formatBarcodeLabel } from '@/domain/card';
import { Fonts, Spacing } from '@/constants/theme';

function paramId(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

const KEEP_AWAKE_TAG = 'fidelio-checkout';

/**
 * Full-screen checkout mode - max contrast barcode for the cashier scanner.
 */
export default function CardPresentScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = paramId(params.id);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getCardById } = useCards();
  const card = id ? getCardById(id) : undefined;

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
      <View style={[styles.root, { paddingTop: insets.top + Spacing.lg }]}>
        <Text style={styles.missing}>Card not found</Text>
        <Pressable onPress={() => router.back()} style={styles.closeHit}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={[styles.top, { paddingTop: insets.top + Spacing.md }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.store} numberOfLines={1}>
            {card.storeName}
          </Text>
          <Text style={styles.title} numberOfLines={1}>
            {card.title}
          </Text>
          <Text style={styles.format}>{formatBarcodeLabel(card.codeFormat)}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={() => router.back()}
          style={styles.closeHit}
          hitSlop={12}
        >
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>

      <View style={styles.stage}>
        <LoyaltyBarcode value={card.codeValue} format={card.codeFormat} height={160} />
      </View>

      <Text style={[styles.hint, { paddingBottom: insets.bottom + Spacing.lg }]}>
        Point the screen at the reader · max brightness
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  store: {
    color: '#6B7285',
    fontSize: 13,
    fontFamily: Fonts.bodyMedium,
  },
  title: {
    color: '#1C1F2A',
    fontSize: 22,
    fontFamily: Fonts.displayBold,
    letterSpacing: -0.3,
    marginTop: 2,
  },
  format: {
    color: '#9AA1B2',
    fontSize: 12,
    fontFamily: Fonts.body,
    marginTop: 4,
  },
  closeHit: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#3B6BFF',
  },
  closeText: {
    color: '#FFFFFF',
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    backgroundColor: '#FFFFFF',
  },
  hint: {
    textAlign: 'center',
    color: '#6B7285',
    fontSize: 13,
    fontFamily: Fonts.body,
    paddingHorizontal: Spacing.xl,
  },
  missing: {
    color: '#1C1F2A',
    fontSize: 18,
    fontFamily: Fonts.display,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
});

import { CameraView } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useIsFocused, useRouter } from 'expo-router';
import * as React from 'react';
import { Linking, Platform, StyleSheet, Text, View } from 'react-native';

import { ScanCameraPanel } from '@/components/scan/scan-camera-panel';
import { Button } from '@/components/ui/button';
import { CurveHero } from '@/components/ui/curve-hero';
import { Screen } from '@/components/ui/screen';
import { SoftCard } from '@/components/ui/soft-card';
import { useCards } from '@/data/store/cards-context';
import { labelsFromScan, LOYALTY_BARCODE_TYPES, mapBarcodeType } from '@/domain/scan';
import { Fonts, Spacing } from '@/constants/theme';
import { useScanPermissions } from '@/hooks/use-scan-permissions';
import { useTheme } from '@/hooks/use-theme';

export default function ScanScreen() {
  const colors = useTheme();
  const router = useRouter();
  const isFocused = useIsFocused();
  const { cards, addCard } = useCards();
  const [permission, requestPermission] = useScanPermissions();
  const [locked, setLocked] = React.useState(false);
  const [status, setStatus] = React.useState('Align the barcode in the band');
  const [systemScanning, setSystemScanning] = React.useState(false);
  const lockedRef = React.useRef(false);

  const showCamera = isFocused && !!permission?.granted && !systemScanning;
  const canUseSystemScanner =
    Platform.OS !== 'web' && CameraView.isModernBarcodeScannerAvailable;

  React.useEffect(() => {
    if (!isFocused) {
      lockedRef.current = false;
      setLocked(false);
      setStatus('Align the barcode in the band');
      setSystemScanning(false);
      if (Platform.OS === 'ios') {
        void CameraView.dismissScanner().catch(() => undefined);
      }
    }
  }, [isFocused]);

  const handlePayload = React.useCallback(
    async ({ data, type }: { data: string; type: string }) => {
      if (lockedRef.current || !data.trim()) return;
      lockedRef.current = true;
      setLocked(true);
      setStatus('Code captured…');

      try {
        if (Platform.OS !== 'web') {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        const code = data.trim();
        const existing = cards.find((c) => c.codeValue === code);
        if (existing) {
          setStatus('Card already saved');
          router.push(`/card/${existing.id}`);
          return;
        }

        const labels = labelsFromScan(code, type);
        const card = await addCard({
          title: labels.title,
          storeName: labels.storeName,
          codeValue: code,
          codeFormat: mapBarcodeType(type),
        });
        setStatus('Card created');
        router.push(`/card/${card.id}`);
      } catch {
        setStatus('Failed - try again');
        lockedRef.current = false;
        setLocked(false);
      } finally {
        setTimeout(() => {
          lockedRef.current = false;
          setLocked(false);
          setStatus('Align the barcode in the band');
          setSystemScanning(false);
        }, 1600);
      }
    },
    [addCard, cards, router],
  );

  React.useEffect(() => {
    if (!canUseSystemScanner) return;
    const sub = CameraView.onModernBarcodeScanned((result) => {
      void handlePayload({ data: result.data, type: result.type });
      void CameraView.dismissScanner().catch(() => undefined);
    });
    return () => sub.remove();
  }, [canUseSystemScanner, handlePayload]);

  async function openSystemScanner() {
    if (!canUseSystemScanner) return;
    try {
      setSystemScanning(true);
      setStatus('System scanner…');
      await CameraView.launchScanner({
        barcodeTypes: LOYALTY_BARCODE_TYPES,
        isGuidanceEnabled: true,
        isHighlightingEnabled: true,
      });
    } catch {
      setSystemScanning(false);
      setStatus('System scanner unavailable');
    }
  }

  if (!permission) {
    return (
      <Screen withTabInset padded={false} edges={['left', 'right']}>
        <CurveHero eyebrow="Scan" title="Getting ready…" height={160} />
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen withTabInset padded={false} edges={['left', 'right']}>
        <CurveHero
          eyebrow="Camera"
          title="Allow scanning"
          subtitle="Fidelio reads QR and barcodes to create your card."
          height={180}
        />
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <Button label="Allow camera" onPress={() => void requestPermission()} />
          {!permission.canAskAgain ? (
            <Button
              label="Open settings"
              variant="ghost"
              onPress={() => void Linking.openSettings()}
            />
          ) : null}
        </View>
      </Screen>
    );
  }

  return (
    <Screen withTabInset padded={false} edges={['left', 'right']}>
      <CurveHero
        eyebrow="Quick scan"
        title="Aim at the barcode"
        subtitle="The black strip at the bottom of the card — not the QR."
        height={170}
      />

      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        <ScanCameraPanel
          active={showCamera}
          locked={locked}
          accentColor={colors.accent}
          statusLabel={status}
          onBarcode={handlePayload}
        />

        <SoftCard style={styles.hintCard}>
          <Text style={[styles.hintTitle, { color: colors.text, fontFamily: Fonts.display }]}>
            Tip
          </Text>
          <Text style={[styles.hintBody, { color: colors.textSecondary, fontFamily: Fonts.body }]}>
            Place the barcode strip in the frame, flat, about 10–15 cm away, without glare.
          </Text>

          {canUseSystemScanner ? (
            <Button
              label="Open system scanner"
              onPress={() => void openSystemScanner()}
              style={{ marginTop: Spacing.md }}
            />
          ) : null}

          <Button
            label="Manual entry"
            variant="ghost"
            onPress={() => router.push('/card/new')}
            style={{ marginTop: Spacing.sm }}
          />
        </SoftCard>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
    paddingBottom: 140,
  },
  hintCard: {
    gap: 4,
  },
  hintTitle: {
    fontSize: 18,
  },
  hintBody: {
    fontSize: 14,
    lineHeight: 20,
  },
});

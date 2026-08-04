import { CameraView } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused, useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ScanCameraPanel } from '@/components/scan/scan-camera-panel';
import { WalletAtmosphere } from '@/components/brand/wallet-atmosphere';
import { Button } from '@/components/ui/button';
import { useCards } from '@/data/store/cards-context';
import { formatCollectionNo } from '@/domain/gallery';
import {
  barcodeTypesForMode,
  labelsFromScan,
  mapBarcodeType,
  parseScanMode,
  scanCopy,
} from '@/domain/scan';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useSafeBack } from '@/hooks/use-safe-back';
import { useScanPermissions } from '@/hooks/use-scan-permissions';
import { useTheme } from '@/hooks/use-theme';

/** Full-screen mobile scanner — QR square or barcode strip. */
export default function ScanScreen() {
  const colors = useTheme();
  const router = useRouter();
  const goBack = useSafeBack('/add');
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode = parseScanMode(params.mode);
  const copy = scanCopy(mode);
  const { cards, addCard } = useCards();
  const [permission, requestPermission] = useScanPermissions();
  const [locked, setLocked] = React.useState(false);
  const [status, setStatus] = React.useState(copy.hint);
  const [systemScanning, setSystemScanning] = React.useState(false);
  const lockedRef = React.useRef(false);

  const showCamera = isFocused && !!permission?.granted && !systemScanning;
  const canUseSystemScanner =
    Platform.OS !== 'web' && CameraView.isModernBarcodeScannerAvailable;

  React.useEffect(() => {
    setStatus(copy.hint);
  }, [copy.hint]);

  React.useEffect(() => {
    if (!isFocused) {
      lockedRef.current = false;
      setLocked(false);
      setStatus(copy.hint);
      setSystemScanning(false);
      if (Platform.OS === 'ios') {
        void CameraView.dismissScanner().catch(() => undefined);
      }
    }
  }, [isFocused, copy.hint]);

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
          setStatus('Already in your wallet');
          router.replace(`/card/${existing.id}`);
          return;
        }

        const labels = labelsFromScan(code, type);
        const card = await addCard({
          title: labels.title,
          storeName: labels.storeName,
          codeValue: code,
          codeFormat: mapBarcodeType(type),
        });
        const nextNo = formatCollectionNo(cards.length + 1);
        setStatus(`Card added · No. ${nextNo}`);
        router.replace(`/card/${card.id}`);
      } catch {
        setStatus('Failed — try again');
        lockedRef.current = false;
        setLocked(false);
      } finally {
        setTimeout(() => {
          lockedRef.current = false;
          setLocked(false);
          setStatus(copy.hint);
          setSystemScanning(false);
        }, 1600);
      }
    },
    [addCard, cards, copy.hint, router],
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
        barcodeTypes: barcodeTypesForMode(mode),
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
      <View style={[styles.root, { backgroundColor: '#0A0A0A', paddingTop: insets.top }]}>
        <StatusBar style="light" />
        <Text style={[styles.boot, { fontFamily: Fonts.body }]}>Getting the camera ready…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <WalletAtmosphere intensity="soft" />
        <View
          style={[
            styles.permission,
            { paddingTop: insets.top + Spacing.lg },
          ]}
        >
          <StatusBar style={colors.isDark ? 'light' : 'dark'} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={goBack}
            style={[
              styles.closeLight,
              {
                borderColor: colors.glassBorder,
                backgroundColor: colors.glassChrome,
              },
            ]}
          >
            <MaterialCommunityIcons name="close" size={22} color={colors.ink} />
          </Pressable>
          <Text style={[styles.permTitle, { color: colors.ink, fontFamily: Fonts.displayBold }]}>
            Allow camera
          </Text>
          <Text style={[styles.permBody, { color: colors.textSecondary, fontFamily: Fonts.body }]}>
            Fidelio needs the camera to scan {mode === 'qr' ? 'QR codes' : 'barcodes'} onto your wallet.
          </Text>
          <Button label="Allow camera" onPress={() => void requestPermission()} />
          {!permission.canAskAgain ? (
            <Button
              label="Open settings"
              variant="ghost"
              onPress={() => void Linking.openSettings()}
            />
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScanCameraPanel
        active={showCamera}
        locked={locked}
        mode={mode}
        accentColor={colors.accent}
        statusLabel={status}
        onBarcode={handlePayload}
      />

      <View
        pointerEvents="box-none"
        style={[styles.topBar, { paddingTop: insets.top + Spacing.sm }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={goBack}
          hitSlop={8}
          style={styles.closeDark}
        >
          <MaterialCommunityIcons name="close" size={22} color="#FFFFFF" />
        </Pressable>

        <View style={styles.titleBlock}>
          <Text style={[styles.title, { fontFamily: Fonts.displayBold }]}>{copy.title}</Text>
          <Text style={[styles.subtitle, { fontFamily: Fonts.body }]} numberOfLines={2}>
            {copy.tip}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Enter manually"
          onPress={() => router.push('/card/new')}
          hitSlop={8}
          style={styles.closeDark}
        >
          <MaterialCommunityIcons name="keyboard-outline" size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      {canUseSystemScanner ? (
        <View
          pointerEvents="box-none"
          style={[styles.systemWrap, { bottom: insets.bottom + 88 }]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open system scanner"
            onPress={() => void openSystemScanner()}
            style={styles.systemBtn}
          >
            <Text style={{ color: '#FFF', fontFamily: Fonts.bodyMedium, fontSize: 13 }}>
              System scanner
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  boot: {
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: 48,
    fontSize: 15,
  },
  permission: {
    flex: 1,
    zIndex: 1,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  closeLight: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  permTitle: {
    fontSize: 28,
    letterSpacing: -0.6,
  },
  permBody: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  closeDark: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    paddingTop: 6,
    gap: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    letterSpacing: -0.3,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  systemWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  systemBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
});

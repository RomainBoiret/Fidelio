import {
  CameraView,
  type BarcodeScanningResult,
  type BarcodeType,
} from 'expo-camera';
import * as React from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import {
  barcodeTypesForMode,
  type ScanMode,
} from '@/domain/scan';
import { Fonts, Spacing } from '@/constants/theme';

type Props = {
  active: boolean;
  locked: boolean;
  mode: ScanMode;
  accentColor: string;
  statusLabel?: string;
  onBarcode: (payload: { data: string; type: string }) => void;
};

const WINDOW = Dimensions.get('window');
const QR_SIZE = Math.min(WINDOW.width - 72, 280);

/**
 * Native camera scanner — fullscreen, mode-aware viewfinder.
 * QR → square frame. Barcode → wide horizontal band.
 */
export function ScanCameraPanel({
  active,
  locked,
  mode,
  accentColor,
  statusLabel,
  onBarcode,
}: Props) {
  const insets = useSafeAreaInsets();
  const [torch, setTorch] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const lockedRef = React.useRef(locked);
  const onBarcodeRef = React.useRef(onBarcode);
  const types = barcodeTypesForMode(mode);
  const isQr = mode === 'qr';
  const defaultStatus = isQr
    ? 'Center the QR code in the square'
    : 'Align the barcode strip in the frame';

  React.useEffect(() => {
    lockedRef.current = locked;
  }, [locked]);

  React.useEffect(() => {
    onBarcodeRef.current = onBarcode;
  }, [onBarcode]);

  React.useEffect(() => {
    if (!active) {
      setTorch(false);
      setReady(false);
    }
  }, [active]);

  const handleScan = React.useCallback((result: BarcodeScanningResult) => {
    if (lockedRef.current) return;
    const data = typeof result.data === 'string' ? result.data.trim() : '';
    if (!data) return;
    onBarcodeRef.current({ data, type: String(result.type) });
  }, []);

  if (!active) {
    return (
      <View style={[styles.root, styles.idle]}>
        <Text style={[styles.idleText, { fontFamily: Fonts.body }]}>Camera paused</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView
        style={styles.camera}
        facing="back"
        mode="picture"
        enableTorch={torch}
        barcodeScannerSettings={{
          barcodeTypes: types as BarcodeType[],
        }}
        onBarcodeScanned={handleScan}
        onCameraReady={() => setReady(true)}
        onMountError={() => setReady(false)}
      />

      {isQr ? (
        <QrFinder accentColor={accentColor} size={QR_SIZE} />
      ) : (
        <BarcodeFinder accentColor={accentColor} />
      )}

      <View
        style={[
          styles.footer,
          styles.boxNone,
          { paddingBottom: Math.max(insets.bottom, Spacing.lg) + Spacing.sm },
        ]}
      >
        <Text style={[styles.status, { fontFamily: Fonts.bodyMedium }]}>
          {locked ? 'Code captured…' : ready ? (statusLabel ?? defaultStatus) : 'Opening camera…'}
        </Text>

        {Platform.OS !== 'web' ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={torch ? 'Turn off torch' : 'Turn on torch'}
            onPress={() => setTorch((v) => !v)}
            style={[
              styles.torchBtn,
              { backgroundColor: torch ? accentColor : 'rgba(255,255,255,0.18)' },
            ]}
          >
            <MaterialCommunityIcons
              name={torch ? 'flashlight' : 'flashlight-off'}
              size={22}
              color="#FFFFFF"
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function QrFinder({ accentColor, size }: { accentColor: string; size: number }) {
  return (
    <View style={[styles.finderLayer, styles.noPointer]} pointerEvents="none">
      <View style={styles.dimFlex} />
      <View style={styles.qrMidRow}>
        <View style={styles.dimFlex} />
        <View style={[styles.qrFrame, { width: size, height: size }]}>
          <View style={[styles.corner, styles.tl, { borderColor: accentColor }]} />
          <View style={[styles.corner, styles.tr, { borderColor: accentColor }]} />
          <View style={[styles.corner, styles.bl, { borderColor: accentColor }]} />
          <View style={[styles.corner, styles.br, { borderColor: accentColor }]} />
        </View>
        <View style={styles.dimFlex} />
      </View>
      <View style={styles.dimFlex} />
    </View>
  );
}

function BarcodeFinder({ accentColor }: { accentColor: string }) {
  return (
    <View style={[styles.finderLayer, styles.noPointer]} pointerEvents="none">
      <View style={[styles.dimFlex, { flex: 1.15 }]} />
      <View style={styles.bandRow}>
        <View style={styles.dimSide} />
        <View style={[styles.band, { borderColor: accentColor }]}>
          <View style={[styles.corner, styles.tl, { borderColor: accentColor }]} />
          <View style={[styles.corner, styles.tr, { borderColor: accentColor }]} />
          <View style={[styles.corner, styles.bl, { borderColor: accentColor }]} />
          <View style={[styles.corner, styles.br, { borderColor: accentColor }]} />
        </View>
        <View style={styles.dimSide} />
      </View>
      <View style={[styles.dimFlex, { flex: 1.15 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  camera: {
    ...StyleSheet.absoluteFill,
  },
  idle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  idleText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  finderLayer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
  },
  dimFlex: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
  },
  qrMidRow: {
    flexDirection: 'row',
    height: QR_SIZE,
  },
  qrFrame: {
    backgroundColor: 'transparent',
  },
  bandRow: {
    height: 118,
    flexDirection: 'row',
  },
  dimSide: {
    width: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
  },
  band: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderWidth: 4,
  },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 4 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 4 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 4 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 4 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  status: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  torchBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPointer: {
    pointerEvents: 'none',
  },
  boxNone: {
    pointerEvents: 'box-none',
  },
});

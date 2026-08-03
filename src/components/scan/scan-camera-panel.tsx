import {
  CameraView,
  type BarcodeScanningResult,
  type BarcodeType,
} from 'expo-camera';
import * as React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { LOYALTY_BARCODE_TYPES } from '@/domain/scan';
import { Fonts, Spacing } from '@/constants/theme';

type Props = {
  active: boolean;
  locked: boolean;
  accentColor: string;
  statusLabel?: string;
  onBarcode: (payload: { data: string; type: string }) => void;
};

/**
 * Native camera preview scanner.
 * Keep `onBarcodeScanned` always attached - toggling it off breaks detection.
 */
export function ScanCameraPanel({
  active,
  locked,
  accentColor,
  statusLabel = 'Align the barcode in the frame',
  onBarcode,
}: Props) {
  const [torch, setTorch] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const lockedRef = React.useRef(locked);
  const onBarcodeRef = React.useRef(onBarcode);

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
      <View style={[styles.viewport, styles.idle]}>
        <Text style={[styles.idleText, { fontFamily: Fonts.body }]}>Camera paused</Text>
      </View>
    );
  }

  return (
    <View style={styles.viewport}>
      <CameraView
        style={styles.camera}
        facing="back"
        mode="picture"
        enableTorch={torch}
        barcodeScannerSettings={{
          barcodeTypes: LOYALTY_BARCODE_TYPES as BarcodeType[],
        }}
        onBarcodeScanned={handleScan}
        onCameraReady={() => setReady(true)}
        onMountError={() => setReady(false)}
      />

      <View style={[styles.dimTop, styles.noPointer]} />
      <View style={[styles.dimBottom, styles.noPointer]} />
      <View style={[styles.band, styles.noPointer, { borderColor: accentColor }]}>
        <View style={[styles.corner, styles.tl, { borderColor: accentColor }]} />
        <View style={[styles.corner, styles.tr, { borderColor: accentColor }]} />
        <View style={[styles.corner, styles.bl, { borderColor: accentColor }]} />
        <View style={[styles.corner, styles.br, { borderColor: accentColor }]} />
      </View>

      <View style={[styles.overlayBottom, styles.boxNone]}>
        <Text style={[styles.status, { fontFamily: Fonts.bodyMedium }]}>
          {locked ? 'Code captured…' : ready ? statusLabel : 'Opening camera…'}
        </Text>

        {Platform.OS !== 'web' ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={torch ? 'Turn off torch' : 'Turn on torch'}
            onPress={() => setTorch((v) => !v)}
            style={[
              styles.torchBtn,
              { backgroundColor: torch ? accentColor : 'rgba(0,0,0,0.45)' },
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

const styles = StyleSheet.create({
  viewport: {
    height: 460,
    backgroundColor: '#081516',
    overflow: 'hidden',
    borderRadius: 20,
  },
  camera: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  idle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  idleText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  dimTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '36%',
    backgroundColor: 'rgba(8, 21, 22, 0.45)',
  },
  dimBottom: {
    position: 'absolute',
    bottom: 56,
    left: 0,
    right: 0,
    height: '28%',
    backgroundColor: 'rgba(8, 21, 22, 0.45)',
  },
  band: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: '36%',
    height: '28%',
    borderWidth: 2,
    borderRadius: 12,
  },
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderWidth: 3,
  },
  tl: { top: -1, left: -1, borderRightWidth: 0, borderBottomWidth: 0 },
  tr: { top: -1, right: -1, borderLeftWidth: 0, borderBottomWidth: 0 },
  bl: { bottom: -1, left: -1, borderRightWidth: 0, borderTopWidth: 0 },
  br: { bottom: -1, right: -1, borderLeftWidth: 0, borderTopWidth: 0 },
  overlayBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    backgroundColor: 'rgba(8, 21, 22, 0.5)',
  },
  status: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  torchBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
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

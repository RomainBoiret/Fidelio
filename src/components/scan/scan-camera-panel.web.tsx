import * as React from 'react';
import { createElement } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import type { ScanMode } from '@/domain/scan';
import { Fonts, Spacing } from '@/constants/theme';

type Props = {
  active: boolean;
  locked: boolean;
  mode: ScanMode;
  accentColor: string;
  statusLabel?: string;
  onBarcode: (payload: { data: string; type: string }) => void;
};

const WEB_TO_EXPO: Record<string, string> = {
  aztec: 'aztec',
  codabar: 'codabar',
  code_39: 'code39',
  code_93: 'code93',
  code_128: 'code128',
  data_matrix: 'datamatrix',
  ean_8: 'ean8',
  ean_13: 'ean13',
  itf: 'itf14',
  pdf417: 'pdf417',
  qr_code: 'qr',
  upc_a: 'upc_a',
  upc_e: 'upc_e',
};

const BARCODE_FORMATS = [
  'code_128',
  'code_39',
  'code_93',
  'ean_13',
  'ean_8',
  'upc_a',
  'upc_e',
  'codabar',
  'itf',
  'pdf417',
];

const QR_FORMATS = ['qr_code', 'aztec', 'data_matrix'];

const WINDOW = Dimensions.get('window');
const QR_SIZE = Math.min(WINDOW.width - 72, 280);

type Detector = {
  detect: (source: CanvasImageSource) => Promise<
    Array<{ format: string; rawValue: string }>
  >;
};

function formatsForMode(mode: ScanMode) {
  return mode === 'qr' ? QR_FORMATS : BARCODE_FORMATS;
}

function pickBestHit(
  results: Array<{ format: string; rawValue: string }>,
  mode: ScanMode,
) {
  const valid = results.filter((r) => r.rawValue?.trim());
  if (valid.length === 0) return null;
  if (mode === 'qr') {
    return (
      valid.find((r) => r.format === 'qr_code') ??
      valid.find((r) => QR_FORMATS.includes(r.format)) ??
      valid[0]!
    );
  }
  return (
    valid.find((r) => r.format !== 'qr_code') ??
    valid[0]!
  );
}

/**
 * Web scanner — square crop for QR, wide band for 1D barcodes.
 */
export function ScanCameraPanel({
  active,
  locked,
  mode,
  accentColor,
  statusLabel,
  onBarcode,
}: Props) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const lockedRef = React.useRef(locked);
  const onBarcodeRef = React.useRef(onBarcode);
  const modeRef = React.useRef(mode);
  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
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
    modeRef.current = mode;
  }, [mode]);

  React.useEffect(() => {
    if (!active) {
      stopStream();
      setReady(false);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function start() {
      try {
        setError(null);

        if (!navigator.mediaDevices?.getUserMedia) {
          setError('Camera unavailable in this browser.');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) {
          setError('Video not mounted.');
          return;
        }

        video.srcObject = stream;
        await video.play();
        setReady(true);

        const detector = await createDetector(modeRef.current);

        const tick = async () => {
          if (cancelled) return;
          const v = videoRef.current;
          const canvas = canvasRef.current;
          const currentMode = modeRef.current;

          try {
            if (
              v &&
              canvas &&
              !lockedRef.current &&
              v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
              v.videoWidth > 0
            ) {
              const ctx = canvas.getContext('2d', { willReadFrequently: true });
              if (ctx) {
                if (currentMode === 'qr') {
                  const side = Math.floor(Math.min(v.videoWidth, v.videoHeight) * 0.62);
                  const sx = Math.floor((v.videoWidth - side) / 2);
                  const sy = Math.floor((v.videoHeight - side) / 2);
                  const scale = 1.4;
                  canvas.width = Math.floor(side * scale);
                  canvas.height = Math.floor(side * scale);
                  ctx.imageSmoothingEnabled = true;
                  ctx.drawImage(v, sx, sy, side, side, 0, 0, canvas.width, canvas.height);
                } else {
                  const bandH = Math.floor(v.videoHeight * 0.28);
                  const bandY = Math.floor((v.videoHeight - bandH) / 2);
                  const scale = 1.6;
                  canvas.width = Math.floor(v.videoWidth * scale);
                  canvas.height = Math.floor(bandH * scale);
                  ctx.imageSmoothingEnabled = false;
                  ctx.drawImage(
                    v,
                    0,
                    bandY,
                    v.videoWidth,
                    bandH,
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                  );

                  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
                  const data = image.data;
                  for (let i = 0; i < data.length; i += 4) {
                    const gray =
                      data[i]! * 0.299 + data[i + 1]! * 0.587 + data[i + 2]! * 0.114;
                    const boosted = gray < 128 ? gray * 0.75 : Math.min(255, gray * 1.25);
                    data[i] = boosted;
                    data[i + 1] = boosted;
                    data[i + 2] = boosted;
                  }
                  ctx.putImageData(image, 0, 0);
                }

                const results = await detector.detect(canvas);
                const hit = pickBestHit(results, currentMode);
                if (hit) {
                  onBarcodeRef.current({
                    data: hit.rawValue.trim(),
                    type: WEB_TO_EXPO[hit.format] ?? hit.format,
                  });
                }
              }
            }
          } catch {
            // skip bad frame
          }

          timer = setTimeout(() => {
            void tick();
          }, 160);
        };

        void tick();
      } catch (err) {
        if (cancelled) return;
        setReady(false);
        setError(
          err instanceof Error
            ? err.message
            : 'Could not open the camera.',
        );
      }
    }

    void start();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      stopStream();
    };
  }, [active, mode]);

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  return (
    <View style={styles.root}>
      {createElement('video', {
        ref: videoRef,
        autoPlay: true,
        muted: true,
        playsInline: true,
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        },
      })}
      {createElement('canvas', {
        ref: canvasRef,
        style: { display: 'none' },
      })}

      {isQr ? (
        <View style={[styles.finderLayer, styles.noPointer]} pointerEvents="none">
          <View style={styles.dimFlex} />
          <View style={styles.qrMidRow}>
            <View style={styles.dimFlex} />
            <View style={[styles.qrFrame, { width: QR_SIZE, height: QR_SIZE }]}>
              <View style={[styles.corner, styles.tl, { borderColor: accentColor }]} />
              <View style={[styles.corner, styles.tr, { borderColor: accentColor }]} />
              <View style={[styles.corner, styles.bl, { borderColor: accentColor }]} />
              <View style={[styles.corner, styles.br, { borderColor: accentColor }]} />
            </View>
            <View style={styles.dimFlex} />
          </View>
          <View style={styles.dimFlex} />
        </View>
      ) : (
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
      )}

      <View style={[styles.footer, styles.noPointer]}>
        <Text style={[styles.status, { fontFamily: Fonts.bodyMedium }]}>
          {error
            ? error
            : locked
              ? 'Code captured…'
              : ready
                ? (statusLabel ?? defaultStatus)
                : 'Opening camera…'}
        </Text>
      </View>
    </View>
  );
}

async function createDetector(mode: ScanMode): Promise<Detector> {
  const preferred = formatsForMode(mode);
  const Native = (
    globalThis as unknown as {
      BarcodeDetector?: {
        new (opts: { formats: string[] }): Detector;
        getSupportedFormats?: () => Promise<readonly string[]>;
      };
    }
  ).BarcodeDetector;

  if (Native) {
    let formats = preferred;
    try {
      if (typeof Native.getSupportedFormats === 'function') {
        const supported = await Native.getSupportedFormats();
        formats = preferred.filter((f) => supported.includes(f));
      }
      if (formats.length === 0) formats = mode === 'qr' ? ['qr_code'] : ['code_128', 'ean_13'];
    } catch {
      formats = preferred;
    }
    return new Native({ formats });
  }

  const mod = await import('barcode-detector');
  const Fallback = mod.BarcodeDetector as unknown as new (opts: {
    formats: string[];
  }) => Detector;
  return new Fallback({ formats: preferred });
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    position: 'relative',
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
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  status: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  noPointer: {
    pointerEvents: 'none',
  },
});

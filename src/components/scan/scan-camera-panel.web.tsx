import * as React from 'react';
import { createElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';

type Props = {
  active: boolean;
  locked: boolean;
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

/** 1D first - that is the checkout code on loyalty cards. */
const PREFERRED_FORMATS = [
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
  'qr_code',
];

type Detector = {
  detect: (source: CanvasImageSource) => Promise<
    Array<{ format: string; rawValue: string }>
  >;
};

function pickBestHit(results: Array<{ format: string; rawValue: string }>) {
  const valid = results.filter((r) => r.rawValue?.trim());
  if (valid.length === 0) return null;
  // Prefer linear barcodes over QR when both are visible on the card.
  return (
    valid.find((r) => r.format !== 'qr_code') ??
    valid[0]!
  );
}

/**
 * Web scanner tuned for loyalty **barcodes** (Code128 / EAN…), not QR.
 * Crops a wide horizontal band - matches 1D barcode geometry.
 */
export function ScanCameraPanel({
  active,
  locked,
  accentColor,
  statusLabel = 'Align the barcode in the frame',
  onBarcode,
}: Props) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const lockedRef = React.useRef(locked);
  const onBarcodeRef = React.useRef(onBarcode);
  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [frames, setFrames] = React.useState(0);

  React.useEffect(() => {
    lockedRef.current = locked;
  }, [locked]);

  React.useEffect(() => {
    onBarcodeRef.current = onBarcode;
  }, [onBarcode]);

  React.useEffect(() => {
    if (!active) {
      stopStream();
      setReady(false);
      setFrames(0);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let frameCount = 0;

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

        const detector = await createDetector();

        const tick = async () => {
          if (cancelled) return;
          const v = videoRef.current;
          const canvas = canvasRef.current;

          try {
            if (
              v &&
              canvas &&
              !lockedRef.current &&
              v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
              v.videoWidth > 0
            ) {
              // Wide horizontal crop (~28% height, centered) - ideal for 1D barcodes.
              const bandH = Math.floor(v.videoHeight * 0.28);
              const bandY = Math.floor((v.videoHeight - bandH) / 2);
              const scale = 1.6;
              canvas.width = Math.floor(v.videoWidth * scale);
              canvas.height = Math.floor(bandH * scale);

              const ctx = canvas.getContext('2d', { willReadFrequently: true });
              if (ctx) {
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

                // Mild contrast boost helps Code128 on plastic cards.
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

                const results = await detector.detect(canvas);
                frameCount += 1;
                if (frameCount % 6 === 0) setFrames(frameCount);

                const hit = pickBestHit(results);
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
  }, [active]);

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  return (
    <View style={styles.viewport}>
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

      {/* Wide barcode guide */}
      <View style={[styles.dimTop, styles.noPointer]} />
      <View style={[styles.dimBottom, styles.noPointer]} />
      <View style={[styles.band, styles.noPointer, { borderColor: accentColor }]}>
        <View style={[styles.corner, styles.tl, { borderColor: accentColor }]} />
        <View style={[styles.corner, styles.tr, { borderColor: accentColor }]} />
        <View style={[styles.corner, styles.bl, { borderColor: accentColor }]} />
        <View style={[styles.corner, styles.br, { borderColor: accentColor }]} />
      </View>

      <View style={[styles.overlayBottom, styles.noPointer]}>
        <Text style={[styles.status, { fontFamily: Fonts.bodyMedium }]}>
          {error
            ? error
            : locked
              ? 'Code captured…'
              : ready
                ? `${statusLabel}${frames > 0 ? ` · ${frames}` : ''}`
                : 'Opening camera…'}
        </Text>
      </View>
    </View>
  );
}

async function createDetector(): Promise<Detector> {
  const Native = (
    globalThis as unknown as {
      BarcodeDetector?: {
        new (opts: { formats: string[] }): Detector;
        getSupportedFormats?: () => Promise<readonly string[]>;
      };
    }
  ).BarcodeDetector;

  if (Native) {
    let formats = PREFERRED_FORMATS;
    try {
      if (typeof Native.getSupportedFormats === 'function') {
        const supported = await Native.getSupportedFormats();
        formats = PREFERRED_FORMATS.filter((f) => supported.includes(f));
      }
      if (formats.length === 0) formats = ['code_128', 'ean_13'];
    } catch {
      formats = ['code_128', 'code_39', 'ean_13'];
    }
    return new Native({ formats });
  }

  const mod = await import('barcode-detector');
  const Fallback = mod.BarcodeDetector as unknown as new (opts: {
    formats: string[];
  }) => Detector;
  return new Fallback({ formats: PREFERRED_FORMATS });
}

const styles = StyleSheet.create({
  viewport: {
    height: 460,
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: '#081516',
    position: 'relative',
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
    bottom: 52,
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
    backgroundColor: 'rgba(8, 21, 22, 0.55)',
  },
  status: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  noPointer: {
    pointerEvents: 'none',
  },
});

import * as React from 'react';
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import QRCode from 'react-native-qrcode-svg';

import {
  displayKind,
  encodeLinearBarcode,
} from '@/domain/barcode-display';
import type { BarcodeFormat } from '@/domain/types';
import { Fonts } from '@/constants/theme';

type Props = {
  value: string;
  format: BarcodeFormat;
  /** Max width of the graphic area (portrait / QR). */
  maxWidth?: number;
  height?: number;
  showValue?: boolean;
  /**
   * Rotate linear barcode 90° — long bars along the phone height
   * so the cashier can scan with the phone held sideways.
   */
  landscape?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Renders a scannable loyalty code: linear barcode (JsBarcode) or QR.
 */
export function LoyaltyBarcode({
  value,
  format,
  maxWidth,
  height = 140,
  showValue = true,
  landscape = false,
  style,
}: Props) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const kind = displayKind(format);

  if (!value.trim()) {
    return <Text style={styles.error}>No code to display.</Text>;
  }

  if (kind === 'qr') {
    const size = Math.min(maxWidth ?? windowWidth - 64, 280);
    return (
      <View style={[styles.wrap, style]}>
        <View style={[styles.qrPad, { width: size + 28, height: size + 28 }]}>
          <QRCode value={value.trim()} size={size} backgroundColor="#FFFFFF" color="#000000" />
        </View>
        {showValue ? <Text style={styles.value}>{value.trim()}</Text> : null}
      </View>
    );
  }

  try {
    const encoded = encodeLinearBarcode(value, format);
    const modules = encoded.data.length;

    if (landscape) {
      // Long axis ≈ screen height; bar thickness ≈ ~42% of width.
      const barLength = Math.min(windowHeight * 0.58, windowHeight - 240);
      const barThickness = Math.min(windowWidth * 0.4, 160);
      const moduleWidth = Math.max(1.4, barLength / modules);
      const svgWidth = modules * moduleWidth;
      const pad = 20;
      const slotW = barThickness + pad * 2;
      const slotH = barLength + pad * 2;

      return (
        <View style={[styles.wrap, style]}>
          <View style={[styles.landscapeSlot, { width: slotW, height: slotH }]}>
            <View
              style={[
                styles.landscapeRotate,
                {
                  width: svgWidth + pad,
                  height: barThickness + pad,
                  left: (slotW - (svgWidth + pad)) / 2,
                  top: (slotH - (barThickness + pad)) / 2,
                  transform: [{ rotate: '90deg' }],
                },
              ]}
            >
              <View style={styles.barcodePad}>
                <Svg width={svgWidth} height={barThickness}>
                  {renderBars(encoded.data, moduleWidth, barThickness)}
                </Svg>
              </View>
            </View>
          </View>
          {showValue ? (
            <Text style={styles.valueLandscape} selectable>
              {encoded.text}
            </Text>
          ) : null}
        </View>
      );
    }

    const width = Math.min(maxWidth ?? windowWidth - 48, windowWidth - 32);
    const moduleWidth = Math.max(1.5, width / modules);
    const svgWidth = modules * moduleWidth;

    return (
      <View style={[styles.wrap, style]}>
        <View style={[styles.barcodePad, { width: svgWidth + 24 }]}>
          <Svg width={svgWidth} height={height}>
            {renderBars(encoded.data, moduleWidth, height)}
          </Svg>
        </View>
        {showValue ? (
          <Text style={styles.value} selectable>
            {encoded.text}
          </Text>
        ) : null}
      </View>
    );
  } catch (err) {
    return (
      <View style={[styles.wrap, style]}>
        <Text style={styles.error}>
          {err instanceof Error ? err.message : 'Invalid barcode.'}
        </Text>
        <Text style={styles.value} selectable>
          {value.trim()}
        </Text>
      </View>
    );
  }
}

function renderBars(data: string, moduleWidth: number, height: number) {
  const bars: React.ReactNode[] = [];
  let x = 0;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i] === '1') {
      bars.push(
        <Rect
          key={`b-${i}`}
          x={x}
          y={0}
          width={moduleWidth}
          height={height}
          fill="#000000"
        />,
      );
    }
    x += moduleWidth;
  }
  return bars;
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  barcodePad: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  landscapeSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    position: 'relative',
  },
  landscapeRotate: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPad: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  value: {
    color: '#1A1C2E',
    fontSize: 17,
    letterSpacing: 1.4,
    fontFamily: Fonts.bodyBold,
    textAlign: 'center',
  },
  valueLandscape: {
    color: '#1A1C2E',
    fontSize: 15,
    letterSpacing: 1.6,
    fontFamily: Fonts.bodyMedium,
    textAlign: 'center',
    marginTop: 4,
  },
  error: {
    color: '#C4453A',
    fontSize: 14,
    fontFamily: Fonts.body,
    textAlign: 'center',
  },
});

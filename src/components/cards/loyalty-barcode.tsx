import * as React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
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
  /** Max width of the graphic area. */
  maxWidth?: number;
  height?: number;
  showValue?: boolean;
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
}: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.min(maxWidth ?? windowWidth - 48, windowWidth - 32);

  const kind = displayKind(format);

  if (!value.trim()) {
    return (
      <Text style={styles.error}>No code to display.</Text>
    );
  }

  if (kind === 'qr') {
    const size = Math.min(width, 280);
    return (
      <View style={styles.wrap}>
        <View style={[styles.qrPad, { width: size + 24, height: size + 24 }]}>
          <QRCode value={value.trim()} size={size} backgroundColor="#FFFFFF" color="#000000" />
        </View>
        {showValue ? <Text style={styles.value}>{value.trim()}</Text> : null}
      </View>
    );
  }

  try {
    const encoded = encodeLinearBarcode(value, format);
    const modules = encoded.data.length;
    const moduleWidth = Math.max(1.5, width / modules);
    const svgWidth = modules * moduleWidth;

    const bars: React.ReactNode[] = [];
    let x = 0;
    for (let i = 0; i < encoded.data.length; i += 1) {
      const bit = encoded.data[i];
      if (bit === '1') {
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

    return (
      <View style={styles.wrap}>
        <View style={[styles.barcodePad, { width: svgWidth + 24 }]}>
          <Svg width={svgWidth} height={height}>
            {bars}
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
      <View style={styles.wrap}>
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

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  barcodePad: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  qrPad: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  value: {
    color: '#111111',
    fontSize: 18,
    letterSpacing: 1.2,
    fontFamily: Fonts.bodyBold,
    textAlign: 'center',
  },
  error: {
    color: '#B00020',
    fontSize: 14,
    fontFamily: Fonts.body,
    textAlign: 'center',
  },
});

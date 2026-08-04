import type { BarcodeType } from 'expo-camera';

import type { BarcodeFormat } from '@/domain/types';

/** Scanner mode — viewfinder shape and accepted code formats. */
export type ScanMode = 'barcode' | 'qr';

/** Linear / strip barcodes on loyalty cards. */
export const BARCODE_SCAN_TYPES: BarcodeType[] = [
  'code128',
  'code39',
  'ean13',
  'ean8',
  'upc_a',
  'upc_e',
  'codabar',
  'itf14',
  'pdf417',
];

/** Square 2D codes (QR scanner). */
export const QR_SCAN_TYPES: BarcodeType[] = ['qr', 'aztec', 'datamatrix'];

export function barcodeTypesForMode(mode: ScanMode): BarcodeType[] {
  return mode === 'qr' ? QR_SCAN_TYPES : BARCODE_SCAN_TYPES;
}

export function parseScanMode(value: string | string[] | undefined): ScanMode {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === 'qr' ? 'qr' : 'barcode';
}

export function scanCopy(mode: ScanMode) {
  if (mode === 'qr') {
    return {
      title: 'Scan QR code',
      hint: 'Center the QR code in the square',
      tip: 'Hold steady about 15–20 cm away. Avoid glare on the pass.',
    };
  }
  return {
    title: 'Scan barcode',
    hint: 'Align the barcode strip in the frame',
    tip: 'Hold the barcode flat, about 10–15 cm away, without glare.',
  };
}

export function mapBarcodeType(type: string): BarcodeFormat {
  switch (type) {
    case 'qr':
      return 'qr';
    case 'ean13':
      return 'ean13';
    case 'ean8':
      return 'ean8';
    case 'code128':
      return 'code128';
    case 'code39':
      return 'code39';
    case 'upc_a':
      return 'upc_a';
    case 'upc_e':
      return 'upc_e';
    case 'itf14':
    case 'itf':
      return 'itf14';
    case 'codabar':
      return 'codabar';
    case 'pdf417':
      return 'pdf417';
    case 'aztec':
      return 'aztec';
    default:
      return 'unknown';
  }
}

export function labelsFromScan(data: string, type: string) {
  const format = mapBarcodeType(type);
  if (format === 'qr') {
    try {
      const url = new URL(data);
      const host = url.hostname.replace(/^www\./, '') || 'QR';
      return {
        title: 'Loyalty card',
        storeName: host,
      };
    } catch {
      return { title: 'Loyalty card', storeName: 'QR store' };
    }
  }
  return {
    title: 'Loyalty card',
    storeName: 'New store',
  };
}

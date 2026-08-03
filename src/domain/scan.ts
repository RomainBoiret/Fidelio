import type { BarcodeType } from 'expo-camera';

import type { BarcodeFormat } from '@/domain/types';

/**
 * Loyalty card formats - 1D barcodes first (the real checkout id).
 * QR last: often a link / something else.
 */
export const LOYALTY_BARCODE_TYPES: BarcodeType[] = [
  'code128',
  'code39',
  'ean13',
  'ean8',
  'upc_a',
  'upc_e',
  'codabar',
  'itf14',
  'pdf417',
  'qr',
  'aztec',
  'datamatrix',
];

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

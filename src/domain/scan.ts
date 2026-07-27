import type { BarcodeType } from 'expo-camera';

import type { BarcodeFormat } from '@/domain/types';

/**
 * Formats cartes fidélité — code-barres 1D en priorité (le vrai identifiant caisse).
 * QR en dernier : souvent un lien / autre chose.
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
      return {
        title: 'Carte scannée',
        storeName: url.hostname.replace(/^www\./, '') || 'QR',
      };
    } catch {
      return { title: 'Carte QR', storeName: 'Magasin scanné' };
    }
  }
  return {
    title: 'Carte scannée',
    storeName: 'Magasin scanné',
  };
}

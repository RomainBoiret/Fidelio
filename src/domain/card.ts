import type { BarcodeFormat } from '@/domain/types';

const FORMAT_LABELS: Record<BarcodeFormat, string> = {
  qr: 'QR',
  ean13: 'EAN-13',
  ean8: 'EAN-8',
  code128: 'Code 128',
  code39: 'Code 39',
  upc_a: 'UPC-A',
  upc_e: 'UPC-E',
  pdf417: 'PDF417',
  aztec: 'Aztec',
  unknown: 'Code',
};

export function formatBarcodeLabel(format: BarcodeFormat): string {
  return FORMAT_LABELS[format];
}

export function normalizeStoreName(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function cardInitials(title: string, storeName: string): string {
  const source = (storeName || title).trim();
  if (!source) return 'F';
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
}

export const CARD_ACCENTS = [
  '#5B6CFF',
  '#7A6CFF',
  '#9B7CFF',
  '#4F7CFF',
  '#6E5CE0',
  '#8B6CFF',
] as const;

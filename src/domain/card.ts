import type { BarcodeFormat } from '@/domain/types';

const FORMAT_LABELS: Record<BarcodeFormat, string> = {
  qr: 'QR',
  ean13: 'EAN-13',
  ean8: 'EAN-8',
  code128: 'Code 128',
  code39: 'Code 39',
  upc_a: 'UPC-A',
  upc_e: 'UPC-E',
  itf14: 'ITF-14',
  codabar: 'Codabar',
  pdf417: 'PDF417',
  aztec: 'Aztec',
  unknown: 'Code',
};

export function formatBarcodeLabel(format: BarcodeFormat): string {
  return FORMAT_LABELS[format];
}

/**
 * Best-effort format guess for manual entry (digits-only retail codes).
 * Falls back to Code 128 for mixed/alphanumeric payloads.
 */
export function guessBarcodeFormat(value: string): BarcodeFormat {
  const trimmed = value.trim();
  if (!trimmed) return 'unknown';

  if (/^\d{13}$/.test(trimmed)) return 'ean13';
  if (/^\d{12}$/.test(trimmed)) return 'upc_a';
  if (/^\d{8}$/.test(trimmed)) return 'ean8';
  if (/^\d{14}$/.test(trimmed)) return 'itf14';
  if (/^\d{6,8}$/.test(trimmed)) return 'upc_e';

  return 'code128';
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
  '#1A3A6B',
  '#C45C3A',
  '#2F8F6B',
  '#5C4A7A',
  '#8A7A5C',
  '#315CFF',
] as const;

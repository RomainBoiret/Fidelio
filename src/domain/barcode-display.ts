import barcodes from '@/lib/jsbarcode-barcodes';

import type { BarcodeFormat } from '@/domain/types';

type EncoderCtor = new (
  data: string,
  options: object,
) => {
  valid: () => boolean;
  encode: () => unknown;
};

type BarcodeMap = Record<string, EncoderCtor>;


export type JsBarcodeFormat =
  | 'CODE128'
  | 'CODE39'
  | 'EAN13'
  | 'EAN8'
  | 'UPC'
  | 'UPCE'
  | 'ITF14'
  | 'codabar';

const FORMAT_MAP: Record<BarcodeFormat, JsBarcodeFormat | 'QR'> = {
  qr: 'QR',
  code128: 'CODE128',
  code39: 'CODE39',
  ean13: 'EAN13',
  ean8: 'EAN8',
  upc_a: 'UPC',
  upc_e: 'UPCE',
  itf14: 'ITF14',
  codabar: 'codabar',
  pdf417: 'CODE128',
  aztec: 'QR',
  unknown: 'CODE128',
};

export function displayKind(format: BarcodeFormat): 'qr' | 'linear' {
  return FORMAT_MAP[format] === 'QR' ? 'qr' : 'linear';
}

export function jsBarcodeFormatFor(format: BarcodeFormat): JsBarcodeFormat {
  const mapped = FORMAT_MAP[format];
  return mapped === 'QR' ? 'CODE128' : mapped;
}

type Encoded = {
  data: string;
  text: string;
  formatUsed: JsBarcodeFormat;
};

function flattenEncodeResult(result: unknown, fallbackText: string) {
  if (Array.isArray(result)) {
    const data = result
      .map((part) =>
        part && typeof part === 'object' && 'data' in part ? String(part.data) : '',
      )
      .join('');
    const textPart = result.find(
      (part) => part && typeof part === 'object' && 'text' in part && (part as { text?: string }).text,
    ) as { text?: string } | undefined;
    return { data, text: textPart?.text || fallbackText };
  }
  if (result && typeof result === 'object' && 'data' in result) {
    const row = result as { data: string; text?: string };
    return { data: String(row.data), text: row.text || fallbackText };
  }
  return { data: '', text: fallbackText };
}

/** Encode value for SVG bars. Falls back to CODE128 when the strict format rejects the payload. */
export function encodeLinearBarcode(
  value: string,
  format: BarcodeFormat,
): Encoded {
  const trimmed = value.trim();
  const preferred = jsBarcodeFormatFor(format);
  const attempts: JsBarcodeFormat[] = [...new Set([preferred, 'CODE128' as const])];

  let lastError: Error | null = null;

  for (const attempt of attempts) {
    try {
      const Encoder = (barcodes as BarcodeMap)[attempt];
      if (!Encoder) continue;

      const encoder = new Encoder(trimmed, {
        text: trimmed,
        format: attempt,
      });

      if (!encoder.valid()) {
        lastError = new Error(`Invalid ${attempt} format for this value.`);
        continue;
      }

      const flat = flattenEncodeResult(encoder.encode(), trimmed);
      if (!flat.data) {
        lastError = new Error('Empty encoding.');
        continue;
      }

      return {
        data: flat.data,
        text: flat.text,
        formatUsed: attempt,
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError ?? new Error('Could not generate the barcode.');
}

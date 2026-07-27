// Deep CJS entry — Metro resolves this more reliably than `jsbarcode/js/barcodes`.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mod = require('jsbarcode/bin/barcodes') as {
  default?: Record<string, unknown>;
} & Record<string, unknown>;

export default (mod.default ?? mod) as Record<
  string,
  new (
    data: string,
    options: object,
  ) => {
    valid: () => boolean;
    encode: () => unknown;
  }
>;

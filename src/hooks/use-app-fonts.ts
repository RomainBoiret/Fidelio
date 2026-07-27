/**
 * Default (Metro picks .native / .web when present).
 * Web stub - see use-app-fonts.web.ts via renaming:
 * We keep this as the web-safe default so SSR/web never pulls font packages.
 */
export function useAppFonts() {
  return true;
}

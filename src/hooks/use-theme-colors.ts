import { useTheme } from '@/hooks/use-theme';
import type { ThemeColors } from '@/constants/theme';

export function useThemeColors(): ThemeColors {
  return useTheme();
}

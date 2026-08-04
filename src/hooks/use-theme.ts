import { Colors, type ColorSchemeName, type ThemeColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type AppTheme = ThemeColors & {
  scheme: ColorSchemeName;
  isDark: boolean;
};

/** Active palette — follows the OS light/dark setting. */
export function useTheme(): AppTheme {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const palette = Colors[isDark ? 'dark' : 'light'];
  return {
    ...palette,
    scheme: isDark ? 'dark' : 'light',
    isDark,
  };
}

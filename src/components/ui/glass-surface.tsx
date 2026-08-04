import { BlurView } from 'expo-blur';
import * as React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Glass, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Tone = 'light' | 'clear' | 'chrome' | 'pass';

type Props = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  tone?: Tone;
  intensity?: number;
  radius?: number;
};

/**
 * Frosted glass — BlurView on native, backdrop-filter on web.
 * Light/dark fills follow the system theme.
 */
export function GlassSurface({
  children,
  style,
  contentStyle,
  tone = 'light',
  intensity,
  radius = Radius.md,
}: Props) {
  const colors = useTheme();

  const tones = colors.isDark
    ? {
        light: { fill: colors.glassFill, border: colors.glassBorder, blur: 36 },
        clear: { fill: 'rgba(255,255,255,0.05)', border: colors.border, blur: 44 },
        chrome: { fill: colors.glassChrome, border: colors.borderStrong, blur: 48 },
        pass: { fill: colors.glassPass, border: colors.glassBorder, blur: 28 },
      }
    : {
        light: { fill: colors.glassFill, border: colors.glassBorder, blur: 32 },
        clear: { fill: 'rgba(255,255,255,0.26)', border: 'rgba(255,255,255,0.45)', blur: 40 },
        chrome: { fill: colors.glassChrome, border: colors.borderStrong, blur: 44 },
        pass: { fill: colors.glassPass, border: colors.glassBorder, blur: 20 },
      };

  const t = tones[tone];
  const blur = intensity ?? t.blur;
  const webShadow = colors.isDark ? Glass.webShadowDark : Glass.webShadowLight;

  if (Platform.OS === 'web') {
    const webGlass = {
      borderRadius: radius,
      borderColor: t.border,
      backgroundColor: t.fill,
      backdropFilter: `saturate(175%) blur(${blur}px)`,
      WebkitBackdropFilter: `saturate(175%) blur(${blur}px)`,
    } as ViewStyle;

    return (
      <View style={[styles.shell, webShadow, webGlass, style]}>
        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.shell,
        {
          borderRadius: radius,
          borderColor: t.border,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <BlurView
        intensity={blur}
        tint={colors.isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <View
        pointerEvents="none"
        style={[styles.nativeVeil, { backgroundColor: t.fill }]}
      />
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  nativeVeil: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    zIndex: 1,
    flexGrow: 1,
  },
});

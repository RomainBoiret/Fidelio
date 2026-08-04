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

type Tone = 'light' | 'clear' | 'chrome' | 'pass';

type Props = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  tone?: Tone;
  intensity?: number;
  radius?: number;
};

const TONE = {
  light: {
    fill: 'rgba(255, 255, 255, 0.42)',
    border: 'rgba(255, 255, 255, 0.58)',
    blur: 32,
  },
  clear: {
    fill: 'rgba(255, 255, 255, 0.26)',
    border: 'rgba(255, 255, 255, 0.45)',
    blur: 40,
  },
  chrome: {
    fill: 'rgba(255, 255, 255, 0.55)',
    border: 'rgba(255, 255, 255, 0.7)',
    blur: 44,
  },
  pass: {
    fill: 'rgba(255, 255, 255, 0.4)',
    border: 'rgba(255, 255, 255, 0.72)',
    blur: 20,
  },
} as const;

/**
 * Frosted glass — BlurView on native, backdrop-filter on web.
 */
export function GlassSurface({
  children,
  style,
  contentStyle,
  tone = 'light',
  intensity,
  radius = Radius.md,
}: Props) {
  const t = TONE[tone];
  const blur = intensity ?? t.blur;

  if (Platform.OS === 'web') {
    const webGlass = {
      borderRadius: radius,
      borderColor: t.border,
      backgroundColor: t.fill,
      backdropFilter: `saturate(175%) blur(${blur}px)`,
      WebkitBackdropFilter: `saturate(175%) blur(${blur}px)`,
    } as ViewStyle;

    return (
      <View style={[styles.shell, Glass.webShadow, webGlass, style]}>
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
        tint="light"
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

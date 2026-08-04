import * as React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { GlassSurface } from '@/components/ui/glass-surface';
import { Radius, Shadow, Spacing } from '@/constants/theme';

type Props = {
  children: React.ReactNode;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Frosted glass panel — shared card surface across the app. */
export function SoftCard({ children, style, padded = true }: Props) {
  return (
    <GlassSurface
      tone="pass"
      radius={Radius.lg}
      style={[styles.card, Shadow.ticket]}
      contentStyle={[padded ? styles.padded : null, style]}
    >
      {children}
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  padded: {
    padding: Spacing.lg,
  },
});

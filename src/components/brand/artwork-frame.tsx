import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';

type Props = {
  children: ReactNode;
  accentColor?: string;
  height?: number;
  /** Flush to card edges (no side inset). */
  flush?: boolean;
};

/** Rounded artwork window — no gray double-frame. */
export function ArtworkFrame({ children, height = 200, flush = false }: Props) {
  return (
    <View
      style={[
        styles.inner,
        flush ? styles.flush : null,
        { height },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  inner: {
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  flush: {
    borderRadius: 0,
  },
});

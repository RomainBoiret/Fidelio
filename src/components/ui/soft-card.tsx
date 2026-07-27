import * as React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = ViewProps & {
  children: React.ReactNode;
  padded?: boolean;
};

export function SoftCard({ children, style, padded = true, ...rest }: Props) {
  const colors = useTheme();

  return (
    <View
      style={[
        styles.card,
        Shadow.card,
        {
          backgroundColor: colors.backgroundElevated,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
        padded && styles.padded,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  padded: {
    padding: Spacing.lg,
  },
});

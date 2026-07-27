import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export function ScreenHeader({ eyebrow, title, subtitle, right }: Props) {
  const colors = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        {eyebrow ? (
          <Text
            style={[
              styles.eyebrow,
              { color: colors.accentText, fontFamily: Fonts.bodyMedium },
            ]}
          >
            {eyebrow}
          </Text>
        ) : null}
        <Text style={[styles.title, { color: colors.text, fontFamily: Fonts.displayBold }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[styles.subtitle, { color: colors.textSecondary, fontFamily: Fonts.body }]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  copy: {
    flex: 1,
    gap: 6,
  },
  eyebrow: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 280,
  },
});

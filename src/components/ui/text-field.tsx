import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = TextInputProps & {
  label: string;
  hint?: string;
};

export function TextField({ label, hint, style, ...rest }: Props) {
  const colors = useTheme();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.textSecondary, fontFamily: Fonts.bodyMedium }]}>
        {label}
      </Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.backgroundElevated,
            borderColor: colors.border,
            fontFamily: Fonts.body,
          },
          style,
        ]}
        {...rest}
      />
      {hint ? (
        <Text style={[styles.hint, { color: colors.textMuted, fontFamily: Fonts.body }]}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.3,
    marginLeft: 2,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 4,
  },
});

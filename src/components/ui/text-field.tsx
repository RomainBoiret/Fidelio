import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { Fonts, FontWeight, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = TextInputProps & {
  label: string;
  hint?: string;
};

/** Glass-styled text field. */
export function TextField({ label, hint, style, ...rest }: Props) {
  const colors = useTheme();

  return (
    <View style={styles.wrap}>
      <Text
        style={[
          styles.label,
          {
            color: colors.textMuted,
            fontFamily: Fonts.bodyMedium,
            fontWeight: FontWeight.medium,
          },
        ]}
      >
        {label}
      </Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            color: colors.ink,
            borderColor: 'rgba(255,255,255,0.7)',
            backgroundColor:
              Platform.OS === 'web'
                ? 'rgba(255,255,255,0.42)'
                : 'rgba(255,255,255,0.72)',
            fontFamily: Fonts.body,
            fontWeight: FontWeight.regular,
            ...(Platform.OS === 'web'
              ? ({
                  backdropFilter: 'saturate(160%) blur(16px)',
                  WebkitBackdropFilter: 'saturate(160%) blur(16px)',
                } as object)
              : null),
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
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginLeft: 2,
  },
  input: {
    minHeight: 52,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
    letterSpacing: -0.1,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 4,
  },
});

import * as React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = PressableProps & {
  label: string;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'primary',
  style,
  disabled,
  onPress,
  ...rest
}: Props) {
  const colors = useTheme();

  const background =
    variant === 'primary'
      ? colors.accent
      : variant === 'secondary'
        ? colors.surface
        : variant === 'danger'
          ? colors.danger
          : 'transparent';

  const textColor =
    variant === 'primary' || variant === 'danger'
      ? '#FFFFFF'
      : colors.ink;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) =>
        StyleSheet.flatten([
          styles.base,
          {
            backgroundColor: background,
            borderColor: variant === 'ghost' ? colors.borderStrong : 'transparent',
            borderWidth: variant === 'ghost' ? 1 : 0,
            opacity: disabled ? 0.45 : pressed ? 0.92 : 1,
            transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
          },
          style,
        ])
      }
      {...rest}
    >
      <Text style={[styles.label, { color: textColor, fontFamily: Fonts.bodyBold }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  label: {
    fontSize: 15,
    letterSpacing: -0.1,
  },
});

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as React from 'react';
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Radius, Shadow } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = PressableProps & {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  tone?: 'neutral' | 'accent' | 'secondary';
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  name,
  tone = 'neutral',
  size = 22,
  style,
  onPressIn,
  onPressOut,
  ...rest
}: Props) {
  const colors = useTheme();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const background =
    tone === 'accent'
      ? colors.accent
      : tone === 'secondary'
        ? colors.surface
        : colors.backgroundElevated;

  const iconColor =
    tone === 'accent' ? '#FFFFFF' : colors.text;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPressIn={(e) => {
        if (!reduceMotion) {
          scale.value = withSpring(0.9, { damping: 14, stiffness: 380 });
        }
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        if (!reduceMotion) {
          scale.value = withSpring(1, { damping: 12, stiffness: 220 });
        }
        onPressOut?.(e);
      }}
      style={[
        styles.btn,
        Shadow.card,
        {
          backgroundColor: background,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
        animatedStyle,
        style,
      ]}
      {...rest}
    >
      <MaterialCommunityIcons name={name} size={size} color={iconColor} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 46,
    height: 46,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});

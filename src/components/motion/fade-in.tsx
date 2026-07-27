import * as React from 'react';
import { Platform, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useReducedMotion,
} from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  direction?: 'up' | 'down';
};

/** Soft entrance. Skipped on web to protect FCP / TBT. */
export function FadeIn({
  children,
  delay = 0,
  duration = 520,
  style,
  direction = 'up',
}: Props) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion || Platform.OS === 'web') {
    return <Animated.View style={style}>{children}</Animated.View>;
  }

  const entering =
    direction === 'down'
      ? FadeInDown.delay(delay).duration(duration).easing(Easing.out(Easing.cubic))
      : FadeInUp.delay(delay).duration(duration).easing(Easing.out(Easing.cubic));

  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}

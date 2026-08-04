import * as React from 'react';
import { Platform, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useReducedMotion,
} from 'react-native-reanimated';

import { Motion } from '@/constants/theme';

type Props = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  direction?: 'up' | 'down' | 'zoom';
};

/** Soft modern entrance — fade + lift / zoom. */
export function FadeIn({
  children,
  delay = 0,
  duration,
  style,
  direction = 'up',
}: Props) {
  const reduceMotion = useReducedMotion();
  const ms = duration ?? (Platform.OS === 'web' ? Motion.enter : Motion.editorial);

  if (reduceMotion) {
    return <Animated.View style={style}>{children}</Animated.View>;
  }

  const easing = Platform.OS === 'web' ? Easing.out(Easing.cubic) : Easing.out(Easing.cubic);

  const entering =
    direction === 'zoom'
      ? ZoomIn.delay(delay).duration(ms).easing(easing)
      : direction === 'down'
        ? FadeInDown.delay(delay).duration(ms).easing(easing)
        : FadeInUp.delay(delay).duration(ms).easing(easing);

  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}

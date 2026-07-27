import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { Fonts } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  progress: number; // 0..1
  label?: string;
  size?: number;
  trackColor?: string;
  fillColor?: string;
  textColor?: string;
};

export function ProgressRing({
  progress,
  label,
  size = 54,
  trackColor = 'rgba(255,255,255,0.28)',
  fillColor = '#FFFFFF',
  textColor = '#FFFFFF',
}: Props) {
  const reduceMotion = useReducedMotion();
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const anim = useSharedValue(clamped);
  const cx = size / 2;
  const cy = size / 2;

  React.useEffect(() => {
    anim.value = reduceMotion
      ? clamped
      : withTiming(clamped, { duration: 700, easing: Easing.out(Easing.cubic) });
  }, [anim, clamped, reduceMotion]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - anim.value),
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        {/* SVG transform attr (not RN originX) — avoids web `transform-origin` DOM warning */}
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={fillColor}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </Svg>
      {label ? (
        <Text style={[styles.label, { color: textColor, fontFamily: Fonts.bodyBold }]}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
  },
});

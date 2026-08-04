import * as React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

type Props = {
  intensity?: 'soft' | 'rich';
};

type DriftOrbProps = {
  width: number;
  height: number;
  color: string;
  opacity: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  dx: number;
  dy: number;
  duration: number;
  delay?: number;
  pulse?: boolean;
};

function DriftOrb({
  width,
  height,
  color,
  opacity,
  top,
  left,
  right,
  bottom,
  dx,
  dy,
  duration,
  delay = 0,
  pulse = false,
}: DriftOrbProps) {
  const reduceMotion = useReducedMotion();
  const t = useSharedValue(0);

  React.useEffect(() => {
    if (reduceMotion) {
      t.value = 0;
      return;
    }
    t.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      ),
    );
  }, [delay, duration, reduceMotion, t]);

  const style = useAnimatedStyle(() => {
    const p = t.value;
    return {
      opacity: pulse ? opacity * (0.82 + p * 0.28) : opacity,
      transform: [
        { translateX: p * dx },
        { translateY: p * dy },
        { scale: pulse ? 1 + p * 0.05 : 1 },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          width,
          height,
          borderRadius: Math.max(width, height) / 2,
          backgroundColor: color,
          top,
          left,
          right,
          bottom,
        },
        style,
      ]}
    />
  );
}

/**
 * Soft ethereal mist matching the glass mockup — lavender / blue / white blooms.
 */
export function WalletAtmosphere({ intensity = 'rich' }: Props) {
  const { width: W, height: H } = useWindowDimensions();
  const uid = React.useId().replace(/:/g, '');
  const rich = intensity === 'rich';
  const reduceMotion = useReducedMotion();
  const veil = useSharedValue(0);

  React.useEffect(() => {
    if (reduceMotion) {
      veil.value = 0;
      return;
    }
    veil.value = withRepeat(
      withTiming(1, {
        duration: 18000,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [reduceMotion, veil]);

  const veilStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: veil.value * 10 },
      { scale: 1 + veil.value * 0.012 },
    ],
  }));

  return (
    <View pointerEvents="none" style={styles.root} accessibilityElementsHidden>
      <View style={[styles.base, { backgroundColor: '#E8EAF6' }]} />

      <Animated.View style={[StyleSheet.absoluteFill, veilStyle]}>
        <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id={`veil-${uid}`} x1="0.15" y1="0" x2="0.85" y2="1">
              <Stop offset="0%" stopColor="#F5F6FC" stopOpacity={1} />
              <Stop offset="35%" stopColor="#E4E8F8" stopOpacity={rich ? 0.95 : 0.7} />
              <Stop offset="65%" stopColor="#D5D0EC" stopOpacity={rich ? 0.55 : 0.35} />
              <Stop offset="100%" stopColor="#E6E9F6" stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={W} height={H} fill={`url(#veil-${uid})`} />
        </Svg>
      </Animated.View>

      {/* Large frosted white blob — upper left */}
      <DriftOrb
        width={W * 1.15}
        height={W * 1.15}
        color="rgba(255,255,255,0.85)"
        opacity={rich ? 0.9 : 0.55}
        top={-W * 0.48}
        left={-W * 0.38}
        dx={16}
        dy={12}
        duration={14000}
        pulse
      />
      {/* Soft blue glass pane — upper right */}
      <DriftOrb
        width={W * 0.95}
        height={W * 0.95}
        color="rgba(180, 200, 255, 0.55)"
        opacity={rich ? 0.7 : 0.4}
        top={-W * 0.2}
        right={-W * 0.42}
        dx={-20}
        dy={16}
        duration={16000}
        delay={300}
        pulse
      />
      {/* Lavender bloom — mid */}
      <DriftOrb
        width={W * 0.9}
        height={W * 0.9}
        color="rgba(200, 185, 235, 0.65)"
        opacity={rich ? 0.55 : 0.32}
        top={H * 0.28}
        left={-W * 0.42}
        dx={24}
        dy={-12}
        duration={17000}
        delay={600}
      />
      {/* Pale cyan glass — right mid */}
      <DriftOrb
        width={W * 0.8}
        height={W * 0.8}
        color="rgba(190, 215, 250, 0.5)"
        opacity={rich ? 0.5 : 0.28}
        top={H * 0.4}
        right={-W * 0.35}
        dx={-14}
        dy={18}
        duration={15000}
        delay={450}
      />
      {/* Soft bottom wash */}
      <DriftOrb
        width={W * 1.2}
        height={W}
        color="rgba(210, 215, 240, 0.7)"
        opacity={rich ? 0.45 : 0.28}
        bottom={-W * 0.45}
        left={-W * 0.15}
        dx={12}
        dy={-16}
        duration={19000}
        delay={200}
      />

      {/* Thin luminous curves */}
      <Animated.View style={[StyleSheet.absoluteFill, veilStyle]}>
        <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
          <Path
            d={`M ${-40} ${H * 0.2} C ${W * 0.25} ${H * 0.08} ${W * 0.55} ${H * 0.28} ${W + 40} ${H * 0.12}`}
            stroke="rgba(255,255,255,0.7)"
            strokeWidth={1.4}
            fill="none"
          />
          <Path
            d={`M ${-30} ${H * 0.22} C ${W * 0.28} ${H * 0.1} ${W * 0.58} ${H * 0.3} ${W + 30} ${H * 0.14}`}
            stroke="rgba(100,140,255,0.22)"
            strokeWidth={1}
            fill="none"
          />
          <Path
            d={`M ${W * 0.0} ${H * 0.7} C ${W * 0.4} ${H * 0.52} ${W * 0.7} ${H * 0.78} ${W + 40} ${H * 0.62}`}
            stroke="rgba(255,255,255,0.45)"
            strokeWidth={1.2}
            fill="none"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  base: {
    ...StyleSheet.absoluteFill,
  },
  orb: {
    position: 'absolute',
  },
});

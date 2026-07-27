import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

function StaticBlob({
  color,
  style,
}: {
  color: string;
  style: object;
}) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.blob, style, { backgroundColor: color }]}
    />
  );
}

function DriftingBlob({
  color,
  style,
  dx,
  dy,
  duration,
  delay,
}: {
  color: string;
  style: object;
  dx: number;
  dy: number;
  duration: number;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);

  React.useEffect(() => {
    if (reduceMotion) return;
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, duration, progress, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: progress.value * dx },
      { translateY: progress.value * dy },
      { scale: 1 + progress.value * 0.06 },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.blob, style, { backgroundColor: color }, animatedStyle]}
    />
  );
}

/** Soft ambient blobs. Static on web to keep main-thread light for Lighthouse. */
export function AmbientBackground() {
  const colors = useTheme();

  return (
    <Animated.View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Platform.OS === 'web' ? (
        <>
          <StaticBlob color={colors.blobA} style={styles.blobA} />
          <StaticBlob color={colors.blobB} style={styles.blobB} />
          <StaticBlob color={colors.blobC} style={styles.blobC} />
        </>
      ) : (
        <>
          <DriftingBlob
            color={colors.blobA}
            style={styles.blobA}
            dx={-18}
            dy={22}
            duration={7000}
            delay={0}
          />
          <DriftingBlob
            color={colors.blobB}
            style={styles.blobB}
            dx={24}
            dy={-16}
            duration={9000}
            delay={400}
          />
          <DriftingBlob
            color={colors.blobC}
            style={styles.blobC}
            dx={-12}
            dy={-20}
            duration={8000}
            delay={800}
          />
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobA: {
    width: 280,
    height: 280,
    top: -80,
    right: -90,
  },
  blobB: {
    width: 220,
    height: 220,
    top: 180,
    left: -110,
  },
  blobC: {
    width: 180,
    height: 180,
    bottom: 120,
    right: -40,
  },
});

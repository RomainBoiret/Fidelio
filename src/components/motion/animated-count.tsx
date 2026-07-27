import * as React from 'react';
import { StyleSheet, Text, type TextStyle, type StyleProp } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { Fonts } from '@/constants/theme';

type Props = {
  value: number;
  color: string;
  style?: StyleProp<TextStyle>;
};

/** Tweens the displayed integer when the count changes. */
export function AnimatedCount({ value, color, style }: Props) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = React.useState(value);
  const displayRef = React.useRef(value);
  const frame = React.useRef<number | null>(null);

  React.useEffect(() => {
    displayRef.current = display;
  }, [display]);

  React.useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const from = displayRef.current;
    const to = value;
    if (from === to) return;

    const start = Date.now();
    const duration = 480;

    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, [value, reduceMotion]);

  return (
    <Text style={[{ color, fontFamily: Fonts.displayBold }, styles.count, style]}>
      {display}
    </Text>
  );
}

const styles = StyleSheet.create({
  count: {
    fontSize: 28,
    letterSpacing: -0.5,
  },
});

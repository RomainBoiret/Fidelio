import { StyleSheet, Text, View } from 'react-native';

import { Fonts, FontWeight, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  size?: number;
  withWordmark?: boolean;
};

/** Soft F mark — rounded square, cobalt dot. */
export function GalleryMark({ size = 36, withWordmark = false }: Props) {
  const colors = useTheme();
  const mark = Math.max(28, size);
  const frameBg = colors.isDark ? '#EEF0FA' : colors.ink;
  const frameFg = colors.isDark ? '#12141F' : '#FFFFFF';

  return (
    <View style={styles.row} accessibilityRole="image" accessibilityLabel="Fidelio">
      <View
        style={[
          styles.frame,
          {
            width: mark,
            height: mark,
            backgroundColor: frameBg,
          },
        ]}
      >
        <Text
          style={[
            styles.f,
            {
              color: frameFg,
              fontFamily: Fonts.displayBold,
              fontWeight: FontWeight.heavy,
              fontSize: mark * 0.42,
              lineHeight: mark * 0.5,
            },
          ]}
        >
          F
        </Text>
        <View
          style={[
            styles.accent,
            {
              backgroundColor: colors.accent,
              width: mark * 0.16,
              height: mark * 0.16,
              borderRadius: 2,
            },
          ]}
        />
      </View>
      {withWordmark ? (
        <Text
          style={[
            styles.word,
            {
              color: colors.ink,
              fontFamily: Fonts.displayBold,
              fontWeight: FontWeight.heavy,
            },
          ]}
        >
          Fidelio
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  frame: {
    borderRadius: Radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  f: {
    fontWeight: '800',
  },
  accent: {
    position: 'absolute',
    bottom: 5,
    left: 5,
  },
  word: {
    fontSize: 19,
    letterSpacing: -0.55,
  },
});

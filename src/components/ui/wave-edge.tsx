import Svg, { Path } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';

type Props = {
  fill: string;
  height?: number;
  flip?: boolean;
};

/** Soft scoop between hero and content sheet. */
export function WaveEdge({ fill, height = 36, flip = false }: Props) {
  return (
    <View
      style={[styles.wrap, { height }, flip && styles.flip]}
      pointerEvents="none"
    >
      <Svg width="100%" height={height} viewBox="0 0 390 36" preserveAspectRatio="none">
        <Path
          d="M0 10 C95 34 150 0 220 12 C290 24 340 34 390 8 L390 36 L0 36 Z"
          fill={fill}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginTop: -1,
  },
  flip: {
    transform: [{ rotate: '180deg' }],
  },
});

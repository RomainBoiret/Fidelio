import Svg, { Path } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';

type Props = {
  fill: string;
  height?: number;
  flip?: boolean;
};

/** Soft transition between hero and content. */
export function WaveEdge({ fill, height = 28, flip = false }: Props) {
  return (
    <View
      style={[styles.wrap, { height }, flip && styles.flip]}
      pointerEvents="none"
    >
      <Svg width="100%" height={height} viewBox="0 0 390 28" preserveAspectRatio="none">
        <Path
          d="M0 10 C100 28 160 2 230 12 C300 22 350 26 390 8 L390 28 L0 28 Z"
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

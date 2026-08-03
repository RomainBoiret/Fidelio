import { StyleSheet, View } from 'react-native';

type Props = {
  accentColor: string;
  seed?: string;
};

/**
 * Soft color field per store — restrained, not collage.
 */
export function ArtworkPlane({ accentColor, seed = 'F' }: Props) {
  const n = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const shift = (n % 5) * 4;

  return (
    <View style={[styles.plane, { backgroundColor: accentColor }]}>
      <View
        style={[
          styles.glow,
          {
            backgroundColor: '#FFFFFF',
            opacity: 0.14,
            top: -36 + shift,
            right: -48 + shift,
          },
        ]}
      />
      <View
        style={[
          styles.soft,
          {
            backgroundColor: '#FFFFFF',
            opacity: 0.1,
            bottom: 20,
            left: 16 + shift,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  plane: {
    flex: 1,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  soft: {
    position: 'absolute',
    width: 100,
    height: 72,
    borderRadius: 18,
  },
});

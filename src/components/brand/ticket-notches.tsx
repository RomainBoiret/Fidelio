import { StyleSheet, View } from 'react-native';

import { TicketNotch } from '@/constants/theme';

type Props = {
  backgroundColor: string;
  edgeColor?: string;
};

/**
 * Side punch-outs that turn a rounded card into a loyalty ticket.
 * Circles match the page background to "cut" the silhouette.
 */
export function TicketNotches({ backgroundColor, edgeColor }: Props) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.layer]}>
      <View
        style={[
          styles.notch,
          styles.left,
          { backgroundColor, borderColor: edgeColor ?? 'transparent' },
        ]}
      />
      <View
        style={[
          styles.notch,
          styles.right,
          { backgroundColor, borderColor: edgeColor ?? 'transparent' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    pointerEvents: 'none',
  },
  notch: {
    position: 'absolute',
    width: TicketNotch * 2,
    height: TicketNotch * 2,
    borderRadius: TicketNotch,
    top: '42%',
    marginTop: -TicketNotch,
    borderWidth: StyleSheet.hairlineWidth,
  },
  left: {
    left: -TicketNotch,
  },
  right: {
    right: -TicketNotch,
  },
});

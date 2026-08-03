import { StyleSheet, View } from 'react-native';

import { Decorative } from '@/components/brand/decorative';

type Props = {
  color: string;
};

/** Subtle dashed perforation between ticket header and body. */
export function TicketPerforation({ color }: Props) {
  return (
    <Decorative style={styles.row}>
      {Array.from({ length: 18 }).map((_, i) => (
        <View key={i} style={[styles.dash, { backgroundColor: color }]} />
      ))}
    </Decorative>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 1,
    overflow: 'hidden',
  },
  dash: {
    width: 6,
    height: 1.5,
    borderRadius: 1,
    opacity: 0.55,
  },
});

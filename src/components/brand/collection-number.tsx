import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  number: number | string;
  vertical?: boolean;
  label?: string;
};

/** Catalogue number — e.g. 004 or vertical spine mark. */
export function CollectionNumber({ number, vertical = false, label }: Props) {
  const colors = useTheme();
  const value = typeof number === 'number' ? String(number).padStart(3, '0') : number;

  if (vertical) {
    return (
      <View style={styles.vertical} accessibilityLabel={label ?? `Collection number ${value}`}>
        <Text style={[styles.vLabel, { color: colors.textMuted, fontFamily: Fonts.bodyMedium }]}>
          NO.
        </Text>
        <Text style={[styles.vNum, { color: colors.ink, fontFamily: Fonts.bodyBold }]}>{value}</Text>
      </View>
    );
  }

  return (
    <View style={styles.row} accessibilityLabel={label ?? `Collection number ${value}`}>
      <Text style={[styles.label, { color: colors.textMuted, fontFamily: Fonts.bodyMedium }]}>
        COLLECTION NO.
      </Text>
      <Text style={[styles.num, { color: colors.ink, fontFamily: Fonts.bodyBold }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  label: {
    ...Type.label,
    fontSize: 10,
  },
  num: {
    fontSize: 14,
    letterSpacing: 1,
  },
  vertical: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  vLabel: {
    fontSize: 9,
    letterSpacing: 2,
  },
  vNum: {
    fontSize: 13,
    letterSpacing: 2,
    transform: [{ rotate: '90deg' }],
  },
});

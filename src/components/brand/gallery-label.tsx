import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  storeName: string;
  title: string;
  year?: string;
  formatLabel?: string;
  collectionNo?: string;
  status?: string;
  lastUsed?: string;
  maskedId?: string;
  compact?: boolean;
};

/**
 * Wall label — store is the piece title; card type stays secondary.
 */
export function GalleryLabel({
  storeName,
  title,
  year,
  formatLabel,
  collectionNo,
  status,
  lastUsed,
  maskedId,
  compact = false,
}: Props) {
  const colors = useTheme();

  const meta = [title, formatLabel, year ? String(year) : null, collectionNo]
    .filter(Boolean)
    .join(' · ');
  const foot = [status, lastUsed ? `Used ${lastUsed}` : null, maskedId]
    .filter(Boolean)
    .join('  ·  ');

  return (
    <View style={styles.wrap} accessibilityRole="summary">
      <Text
        style={[
          styles.store,
          {
            color: colors.ink,
            fontFamily: Fonts.displayBold,
            fontSize: compact ? 18 : 22,
            lineHeight: compact ? 24 : 28,
          },
        ]}
        numberOfLines={2}
      >
        {storeName}
      </Text>
      {meta ? (
        <Text
          style={[styles.meta, { color: colors.textSecondary, fontFamily: Fonts.body }]}
          numberOfLines={2}
        >
          {meta}
        </Text>
      ) : null}
      {foot && !compact ? (
        <Text style={[styles.foot, { color: colors.textMuted, fontFamily: Fonts.body }]}>
          {foot}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  store: {
    letterSpacing: -0.4,
  },
  meta: {
    fontSize: 14,
    lineHeight: 20,
  },
  foot: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
});

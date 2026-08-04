import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { GlassSurface } from '@/components/ui/glass-surface';
import { PressableScale } from '@/components/motion/pressable-scale';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  tone?: 'neutral' | 'accent' | 'secondary';
  size?: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** Chrome glass icon button. */
export function IconButton({
  name,
  tone = 'neutral',
  size = 20,
  style,
  onPress,
  accessibilityLabel,
}: Props) {
  const colors = useTheme();
  const iconColor = tone === 'accent' ? colors.accent : colors.ink;

  return (
    <PressableScale
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={style}
    >
      <GlassSurface tone="chrome" radius={Radius.md} style={styles.btn}>
        <View style={styles.inner}>
          <MaterialCommunityIcons name={name} size={size} color={iconColor} />
        </View>
      </GlassSurface>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 44,
    height: 44,
  },
  inner: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

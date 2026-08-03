import type { ReactNode } from 'react';
import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Hide decorative visuals from AT; web-safe (aria-hidden). */
export function Decorative({ children, style }: Props) {
  if (Platform.OS === 'web') {
    return (
      <View style={style} {...({ 'aria-hidden': true } as object)}>
        {children}
      </View>
    );
  }

  return (
    <View
      style={style}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {children}
    </View>
  );
}

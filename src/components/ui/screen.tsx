import * as React from 'react';
import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = ViewProps & {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  /** Let parent atmosphere show through. */
  transparent?: boolean;
  /** Override safe-area edges. Use `['left','right']` under GalleryHeader so the masthead bleeds under status bar. */
  edges?: Edge[];
};

export function Screen({
  children,
  scroll = false,
  padded = true,
  transparent = false,
  edges = ['top', 'left', 'right'],
  style,
  ...rest
}: Props) {
  const colors = useTheme();

  const content = (
    <View
      style={[
        styles.inner,
        scroll ? styles.innerScroll : styles.innerFill,
        padded && styles.padded,
        { paddingBottom: Spacing.xl },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.safe,
        { backgroundColor: transparent ? 'transparent' : colors.background },
      ]}
      edges={edges}
    >
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    zIndex: 1,
  },
  innerFill: {
    flex: 1,
  },
  innerScroll: {
    flexGrow: 1,
  },
  padded: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
});

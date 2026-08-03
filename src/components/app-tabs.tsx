import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import TopTabs from 'expo-router/js-top-tabs';
import type { MaterialTopTabBarProps } from 'expo-router/js-top-tabs';
import * as React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScanFrameIcon } from '@/components/brand/scan-frame-icon';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const BAR_HEIGHT = 64;
const HIT = 44;

type IconBtnProps = {
  focused: boolean;
  activeBg?: string;
  inactiveBg?: string;
  onPress: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  accessibilityLabel: string;
  children: React.ReactNode;
};

function IconBtn({
  focused,
  activeBg,
  inactiveBg,
  onPress,
  onLongPress,
  accessibilityLabel,
  children,
}: IconBtnProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 16, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 240 });
      }}
      hitSlop={6}
      style={styles.hit}
    >
      <Animated.View
        style={[
          styles.iconBtn,
          animatedStyle,
          {
            backgroundColor: focused
              ? (activeBg ?? 'transparent')
              : (inactiveBg ?? 'transparent'),
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

/** Home · Cards · Add · Profile */
function MainTabBar({ state, navigation }: MaterialTopTabBarProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'light' ? 'light' : 'dark'];
  const insets = useSafeAreaInsets();
  const idle = colors.textSecondary;
  const focusedName = state.routes[state.index]?.name;

  const routeByName = React.useMemo(() => {
    const map = new Map<string, (typeof state.routes)[number]>();
    for (const route of state.routes) map.set(route.name, route);
    return map;
  }, [state.routes]);

  const goTo = React.useCallback(
    (routeName: string, routeKey: string, isFocused: boolean) => {
      const event = navigation.emit({
        type: 'tabPress',
        target: routeKey,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(routeName);
      }
    },
    [navigation],
  );

  const renderNav = (
    name: string,
    label: string,
    icon: (focused: boolean) => React.ReactNode,
    opts?: { activeBg?: string; inactiveBg?: string },
  ) => {
    const route = routeByName.get(name);
    if (!route) return null;
    const focused = focusedName === name;
    return (
      <IconBtn
        key={name}
        focused={focused}
        activeBg={opts?.activeBg ?? (focused ? colors.surface : undefined)}
        inactiveBg={opts?.inactiveBg}
        accessibilityLabel={label}
        onPress={() => goTo(route.name, route.key, focused)}
        onLongPress={() => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        }}
      >
        {icon(focused)}
      </IconBtn>
    );
  };

  return (
    <View pointerEvents="box-none" style={[styles.barWrap, { bottom: Math.max(insets.bottom, 14) }]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.backgroundElevated,
            borderColor: colors.border,
            ...(Platform.OS === 'web' ? null : { shadowColor: colors.shadow }),
          },
          Shadow.floating,
        ]}
      >
        {renderNav('index', 'Home', (focused) => (
          <MaterialCommunityIcons
            name={focused ? 'home' : 'home-outline'}
            color={focused ? colors.ink : idle}
            size={24}
          />
        ))}

        {renderNav('cards', 'My cards', (focused) => (
          <MaterialCommunityIcons
            name={focused ? 'view-grid' : 'view-grid-outline'}
            color={focused ? colors.ink : idle}
            size={22}
          />
        ))}

        {renderNav(
          'add',
          'Add a card',
          (focused) => (
            <ScanFrameIcon
              size={20}
              color={focused ? '#FFFFFF' : colors.accent}
              active={focused}
            />
          ),
          {
            activeBg: colors.accent,
            inactiveBg: colors.accentSoft,
          },
        )}

        {renderNav('settings', 'Profile', (focused) => (
          <MaterialCommunityIcons
            name={focused ? 'account' : 'account-outline'}
            color={focused ? colors.ink : idle}
            size={22}
          />
        ))}
      </View>
    </View>
  );
}

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'light' ? 'light' : 'dark'];

  return (
    <TopTabs
      tabBar={(props: MaterialTopTabBarProps) => <MainTabBar {...props} />}
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: Platform.OS !== 'web',
        animationEnabled: true,
        lazy: true,
        lazyPreloadDistance: 1,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <TopTabs.Screen name="index" options={{ title: 'Home' }} />
      <TopTabs.Screen name="cards" options={{ title: 'My cards' }} />
      <TopTabs.Screen name="add" options={{ title: 'Add' }} />
      <TopTabs.Screen name="settings" options={{ title: 'Profile' }} />
    </TopTabs>
  );
}

const styles = StyleSheet.create({
  barWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  bar: {
    height: BAR_HEIGHT,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hit: {
    minWidth: HIT,
    minHeight: HIT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: HIT,
    height: HIT,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

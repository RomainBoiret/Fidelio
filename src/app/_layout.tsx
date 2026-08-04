import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { CardsProvider } from '@/data/store/cards-context';
import { useAppFonts } from '@/hooks/use-app-fonts';
import { useTheme } from '@/hooks/use-theme';

const isWeb = Platform.OS === 'web';

/**
 * Snappy navigation — short durations, modern fade/push presets.
 */
const NAV = {
  push: isWeb ? 180 : 240,
  modal: isWeb ? 200 : 260,
  takeover: isWeb ? 150 : 200,
  home: isWeb ? 160 : 220,
} as const;

const pushAnimation = isWeb ? 'fade' : 'simple_push';
const modalAnimation = isWeb ? 'fade' : 'fade_from_bottom';
const takeoverAnimation = 'fade';

function RootNavigator() {
  const colors = useTheme();

  return (
    <>
      <StatusBar style={colors.isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: pushAnimation,
          animationDuration: NAV.push,
          gestureEnabled: true,
          fullScreenGestureEnabled: !isWeb,
          animationMatchesGesture: true,
          title: 'Fidelio',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Fidelio',
            animation: 'fade',
            animationDuration: NAV.home,
          }}
        />
        <Stack.Screen
          name="add"
          options={{
            title: 'Add a card',
            presentation: 'modal',
            animation: modalAnimation,
            animationDuration: NAV.modal,
            gestureEnabled: true,
            gestureDirection: 'vertical',
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            title: 'Profile',
            presentation: 'modal',
            animation: modalAnimation,
            animationDuration: NAV.modal,
            gestureEnabled: true,
            gestureDirection: 'vertical',
          }}
        />
        <Stack.Screen
          name="scan"
          options={{
            title: 'Scan',
            presentation: 'fullScreenModal',
            animation: takeoverAnimation,
            animationDuration: NAV.takeover,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="card/new"
          options={{
            title: 'New card',
            presentation: 'modal',
            animation: modalAnimation,
            animationDuration: NAV.modal,
            gestureEnabled: true,
            gestureDirection: 'vertical',
          }}
        />
        <Stack.Screen
          name="card/[id]/index"
          options={{
            title: 'Card details',
            animation: pushAnimation,
            animationDuration: NAV.push,
            gestureEnabled: true,
            fullScreenGestureEnabled: !isWeb,
          }}
        />
        <Stack.Screen
          name="card/[id]/present"
          options={{
            title: 'Checkout code',
            presentation: 'fullScreenModal',
            animation: takeoverAnimation,
            animationDuration: NAV.takeover,
            gestureEnabled: true,
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useAppFonts();

  return (
    <CardsProvider>
      <Head>
        <title>Fidelio - Loyalty cards</title>
        <meta
          name="description"
          content="Fidelio stores your loyalty cards: scan, local vault, quick checkout access - even offline."
        />
      </Head>
      <RootNavigator />
    </CardsProvider>
  );
}

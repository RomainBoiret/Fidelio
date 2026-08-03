import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { Platform, useColorScheme } from 'react-native';

import { CardsProvider } from '@/data/store/cards-context';
import { Colors } from '@/constants/theme';
import { useAppFonts } from '@/hooks/use-app-fonts';

export default function RootLayout() {
  useAppFonts();

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];
  const isWeb = Platform.OS === 'web';

  return (
    <CardsProvider>
      <Head>
        <title>Fidelio - Loyalty cards</title>
        <meta
          name="description"
          content="Fidelio stores your loyalty cards: scan, local vault, quick checkout access - even offline."
        />
      </Head>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: isWeb ? 'none' : 'slide_from_right',
          animationDuration: 280,
          gestureEnabled: !isWeb,
          fullScreenGestureEnabled: !isWeb,
          title: 'Fidelio',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ title: 'Fidelio', animation: 'fade' }} />
        <Stack.Screen
          name="scan"
          options={{
            title: 'Scan',
            presentation: 'modal',
            animation: isWeb ? 'none' : 'slide_from_bottom',
            animationDuration: 300,
            gestureEnabled: !isWeb,
          }}
        />
        <Stack.Screen
          name="card/new"
          options={{
            title: 'New card',
            presentation: 'modal',
            animation: isWeb ? 'none' : 'slide_from_bottom',
            animationDuration: 320,
            gestureEnabled: !isWeb,
          }}
        />
        <Stack.Screen
          name="card/[id]/index"
          options={{
            title: 'Card details',
            animation: isWeb ? 'none' : 'slide_from_right',
            animationDuration: 280,
            gestureEnabled: !isWeb,
            fullScreenGestureEnabled: !isWeb,
          }}
        />
        <Stack.Screen
          name="card/[id]/present"
          options={{
            title: 'Checkout code',
            presentation: 'fullScreenModal',
            animation: isWeb ? 'none' : 'fade',
            animationDuration: 220,
            gestureEnabled: !isWeb,
          }}
        />
      </Stack>
    </CardsProvider>
  );
}

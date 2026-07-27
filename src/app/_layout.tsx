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

  return (
    <CardsProvider>
      <Head>
        <title>Fidelio - Loyalty cards</title>
        <meta
          name="description"
          content="Fidelio stores your loyalty cards: scan, local vault, quick checkout access - even offline."
        />
      </Head>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: Platform.OS === 'web' ? 'none' : 'fade_from_bottom',
          title: 'Fidelio',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ title: 'Fidelio' }} />
        <Stack.Screen
          name="card/new"
          options={{
            title: 'New card',
            presentation: 'modal',
            animation: Platform.OS === 'web' ? 'none' : 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="card/[id]/index" options={{ title: 'Card details' }} />
        <Stack.Screen
          name="card/[id]/present"
          options={{
            title: 'Checkout code',
            presentation: 'fullScreenModal',
            animation: Platform.OS === 'web' ? 'none' : 'fade',
          }}
        />
      </Stack>
    </CardsProvider>
  );
}

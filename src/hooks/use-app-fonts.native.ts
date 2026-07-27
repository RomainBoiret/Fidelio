import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts,
} from '@expo-google-fonts/outfit';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

/** Native: load brand fonts, then hide splash. */
export function useAppFonts() {
  const [loaded] = useFonts({
    Outfit_600SemiBold,
    Outfit_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  React.useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [loaded]);

  return loaded;
}

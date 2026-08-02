import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

/** Native: load brand fonts, then hide splash. */
export function useAppFonts() {
  const [loaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  React.useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [loaded]);

  return loaded;
}

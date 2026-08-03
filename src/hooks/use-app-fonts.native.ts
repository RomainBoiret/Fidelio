import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
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
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  React.useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [loaded]);

  return loaded;
}

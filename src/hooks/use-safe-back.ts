import { useRouter, type Href } from 'expo-router';
import * as React from 'react';

/** Safe back — avoids the "GO_BACK was not handled" warning when history is empty. */
export function useSafeBack(fallback: Href = '/') {
  const router = useRouter();

  return React.useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(fallback);
  }, [router, fallback]);
}

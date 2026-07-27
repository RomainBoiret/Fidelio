import { useCameraPermissions } from 'expo-camera';

export function useScanPermissions() {
  return useCameraPermissions();
}

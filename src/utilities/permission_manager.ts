import { Linking, Platform } from 'react-native';
import {
  openSettings,
  Permission,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';

type PermissionType =
  | 'camera'
  | 'location'
  | 'location-always'
  | 'microphone'
  | 'photos'
  | 'bluetooth';

const PERMISSION_MAP: Record<PermissionType, Permission> = {
  camera: Platform.select({
    android: PERMISSIONS.ANDROID.CAMERA,
    ios: PERMISSIONS.IOS.CAMERA,
  }) as Permission,

  location: Platform.select({
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  }) as Permission,

  'location-always': Platform.select({
    android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
  }) as Permission,

  microphone: Platform.select({
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
    ios: PERMISSIONS.IOS.MICROPHONE,
  }) as Permission,

  photos: Platform.select({
    android: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  }) as Permission,

  bluetooth: Platform.select({
    android: PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    ios: PERMISSIONS.IOS.BLUETOOTH,
  }) as Permission,
};

export const requestAppPermission = async (
  type: PermissionType,
  {
    onBlocked,
    onDenied,
    onGranted,
  }: {
    onBlocked?: () => void;
    onDenied?: () => void;
    onGranted?: () => void;
  } = {},
) => {
  const permission = PERMISSION_MAP[type];

  const result = await request(permission);

  switch (result) {
    case RESULTS.GRANTED:
      onGranted?.();
      return 'granted';

    case RESULTS.DENIED:
      onDenied?.();
      return 'denied';

    case RESULTS.BLOCKED:
      onBlocked?.();
      return 'blocked';

    default:
      return result;
  }
};

export const openPermissionSettings = async () => {
  if (Platform.OS === 'android') {
    // Android can open permissions page directly
    await Linking.openSettings();
  } else {
    // iOS can only open app settings
    await openSettings();
  }
};

import * as Notifications from 'expo-notifications';
import { Platform, Vibration } from 'react-native';

// Configure notification behavior safely
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (e) {
  console.warn('Notifications handler initialization failed:', e);
}

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (error) {
    console.warn('Notification permission error:', error);
    return false;
  }
}

export async function triggerTableReadyNotification(
  restaurantName = 'The Daily Bean',
  queueNumber = 'A12'
) {
  // 1. Device vibration pattern
  if (Platform.OS !== 'web') {
    Vibration.vibrate([0, 300, 150, 300]);
  }

  // 2. Schedule immediate notification
  try {
    const hasPermission = await requestNotificationPermissions();
    if (hasPermission) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Your Table is Ready!',
          body: `Table ${queueNumber} at ${restaurantName} is reserved for you! Please arrive within 10:00 minutes.`,
          sound: true,
          data: { route: '/restaurant/table-ready' },
        },
        trigger: null, // immediate
      });
    }
  } catch (err) {
    console.warn('Local notification trigger failed:', err);
  }
}

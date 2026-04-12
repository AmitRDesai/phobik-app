import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const AFFIRMATION_REMINDER_ID = 'daily-affirmation-reminder';

/** Must be called early in app lifecycle */
export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
  return status === 'granted';
}

/** Schedule a daily notification at 9 AM to remind user to set their affirmation */
export async function scheduleDailyAffirmationReminder() {
  // Cancel existing first to avoid duplicates
  await cancelDailyAffirmationReminder();

  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    identifier: AFFIRMATION_REMINDER_ID,
    content: {
      title: 'Set your daily affirmation',
      body: 'Take a moment to choose an affirmation that resonates with you today.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 0,
    },
  });
}

export async function cancelDailyAffirmationReminder() {
  await Notifications.cancelScheduledNotificationAsync(AFFIRMATION_REMINDER_ID);
}

const ENERGY_REMINDER_ID = 'daily-energy-reminder';

/** Schedule a daily notification at 9:30 AM to remind user to log their energy */
export async function scheduleDailyEnergyReminder() {
  await cancelDailyEnergyReminder();

  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    identifier: ENERGY_REMINDER_ID,
    content: {
      title: 'Log your energy level',
      body: 'Take a moment to check in with your energy across all four pillars.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 30,
    },
  });
}

export async function cancelDailyEnergyReminder() {
  await Notifications.cancelScheduledNotificationAsync(ENERGY_REMINDER_ID);
}

const EMPATHY_CHALLENGE_REMINDER_ID = 'empathy-challenge-reminder';

/** Schedule a one-shot notification at 9 AM tomorrow to remind the user their next empathy day is available */
export async function scheduleEmpathyChallengeReminder(nextDayNumber: number) {
  await cancelEmpathyChallengeReminder();

  const granted = await requestNotificationPermissions();
  if (!granted) return;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  await Notifications.scheduleNotificationAsync({
    identifier: EMPATHY_CHALLENGE_REMINDER_ID,
    content: {
      title: 'Your next empathy day is ready',
      body: `Day ${nextDayNumber} of your 7-Day Empathy Challenge is now available.`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: tomorrow,
    },
  });
}

export async function cancelEmpathyChallengeReminder() {
  await Notifications.cancelScheduledNotificationAsync(
    EMPATHY_CHALLENGE_REMINDER_ID,
  );
}

/**
 * Get the Expo push token for this device.
 * Returns null if not a physical device or permissions denied.
 */
export async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  const granted = await requestNotificationPermissions();
  if (!granted) return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;
  if (!projectId) {
    console.error('[Push] No EAS project ID found');
    return null;
  }

  const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
  return data;
}

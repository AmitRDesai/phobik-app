import * as Notifications from 'expo-notifications';

const AFFIRMATION_REMINDER_ID = 'daily-affirmation-reminder';

/** Must be called early in app lifecycle */
export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
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

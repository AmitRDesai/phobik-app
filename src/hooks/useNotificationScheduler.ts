import {
  cancelDailyAffirmationReminder,
  scheduleDailyAffirmationReminder,
} from '@/lib/notifications';
import { useNotificationSettings } from '@/modules/settings/hooks/useNotificationSettings';
import { useEffect } from 'react';

/**
 * Schedules or cancels the daily affirmation reminder notification
 * based on the user's dailyReminders setting.
 *
 * Call this once from the root layout when the user is authenticated.
 */
export function useNotificationScheduler() {
  const { data: settings } = useNotificationSettings();
  const dailyReminders = settings.dailyReminders;

  useEffect(() => {
    if (dailyReminders) {
      scheduleDailyAffirmationReminder().catch(console.error);
    } else {
      cancelDailyAffirmationReminder().catch(console.error);
    }
  }, [dailyReminders]);
}

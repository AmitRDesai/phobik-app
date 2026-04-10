import {
  cancelDailyAffirmationReminder,
  scheduleDailyAffirmationReminder,
} from '@/lib/notifications';
import { dailyRemindersAtom } from '@/modules/settings/store/notifications';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

/**
 * Schedules or cancels the daily affirmation reminder notification
 * based on the user's dailyReminders setting.
 *
 * Call this once from the root layout when the user is authenticated.
 */
export function useNotificationScheduler() {
  const dailyReminders = useAtomValue(dailyRemindersAtom);

  useEffect(() => {
    if (dailyReminders) {
      scheduleDailyAffirmationReminder().catch(console.error);
    } else {
      cancelDailyAffirmationReminder().catch(console.error);
    }
  }, [dailyReminders]);
}

import {
  cancelDailyAffirmationReminder,
  cancelDailyEnergyReminder,
  cancelEmpathyChallengeReminder,
  scheduleDailyAffirmationReminder,
  scheduleDailyEnergyReminder,
} from '@/lib/notifications';
import { useNotificationSettings } from '@/modules/settings/hooks/useNotificationSettings';
import { useEffect } from 'react';

/**
 * Schedules or cancels daily reminder notifications
 * based on the user's notification settings.
 *
 * Call this once from the root layout when the user is authenticated.
 */
export function useNotificationScheduler() {
  const { data: settings } = useNotificationSettings();
  const dailyReminders = settings.dailyReminders;
  const checkInReminders = settings.checkInReminders;
  const challengeNotifications = settings.challengeNotifications;

  useEffect(() => {
    if (dailyReminders) {
      scheduleDailyAffirmationReminder().catch(console.error);
    } else {
      cancelDailyAffirmationReminder().catch(console.error);
    }
  }, [dailyReminders]);

  useEffect(() => {
    if (checkInReminders) {
      scheduleDailyEnergyReminder().catch(console.error);
    } else {
      cancelDailyEnergyReminder().catch(console.error);
    }
  }, [checkInReminders]);

  // Cancel empathy challenge reminder if user disables challenge notifications
  useEffect(() => {
    if (!challengeNotifications) {
      cancelEmpathyChallengeReminder().catch(console.error);
    }
  }, [challengeNotifications]);
}

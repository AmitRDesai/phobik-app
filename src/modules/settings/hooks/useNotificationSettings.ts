import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';

export type NotificationSettings = {
  dailyReminders: boolean;
  checkInReminders: boolean;
  challengeNotifications: boolean;
};

const DEFAULT_SETTINGS: NotificationSettings = {
  dailyReminders: true,
  checkInReminders: true,
  challengeNotifications: true,
};

/** Read current notification settings (defaults to all `true` when no row exists) */
export function useNotificationSettings() {
  const userId = useUserId();

  const { data, isLoading, error } = useQuery({
    queryKey: ['notification-settings', userId],
    query: db
      .selectFrom('notification_settings')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .limit(1),
    enabled: !!userId,
  });

  const settings = useMemo<NotificationSettings>(() => {
    const row = data?.[0];
    if (!row) return DEFAULT_SETTINGS;
    return {
      dailyReminders: Boolean(row.daily_reminders),
      checkInReminders: Boolean(row.check_in_reminders),
      challengeNotifications: Boolean(row.challenge_notifications),
    };
  }, [data]);

  return { data: settings, isLoading, error };
}

/** Upsert notification settings (partial update) */
export function useUpdateNotificationSettings() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: Partial<NotificationSettings>) => {
      if (!userId) throw new Error('Not authenticated');

      const now = new Date().toISOString();

      const existing = await db
        .selectFrom('notification_settings')
        .select('id')
        .where('user_id', '=', userId)
        .executeTakeFirst();

      if (existing) {
        const set: Record<string, unknown> = { updated_at: now };
        if (input.dailyReminders !== undefined)
          set.daily_reminders = input.dailyReminders ? 1 : 0;
        if (input.checkInReminders !== undefined)
          set.check_in_reminders = input.checkInReminders ? 1 : 0;
        if (input.challengeNotifications !== undefined)
          set.challenge_notifications = input.challengeNotifications ? 1 : 0;

        await db
          .updateTable('notification_settings')
          .set(set)
          .where('user_id', '=', userId)
          .execute();
      } else {
        await db
          .insertInto('notification_settings')
          .values({
            id: uuid(),
            user_id: userId,
            daily_reminders: (input.dailyReminders ?? true) ? 1 : 0,
            check_in_reminders: (input.checkInReminders ?? true) ? 1 : 0,
            challenge_notifications:
              (input.challengeNotifications ?? true) ? 1 : 0,
            created_at: now,
            updated_at: now,
          })
          .execute();
      }
    },
  });
}

import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toJSON } from '@/lib/powersync/utils';
import { useMutation } from '@tanstack/react-query';

export function useSaveCalendarPrefs() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: {
      calendarConnected: boolean;
      selectedCalendarIds: string[];
      checkInTiming?: string | null;
      supportTone?: string | null;
    }) => {
      if (!userId) throw new Error('Not authenticated');

      const now = new Date().toISOString();

      const existing = await db
        .selectFrom('calendar_preferences')
        .select('id')
        .where('user_id', '=', userId)
        .executeTakeFirst();

      if (existing) {
        await db
          .updateTable('calendar_preferences')
          .set({
            calendar_connected: input.calendarConnected ? 1 : 0,
            selected_calendar_ids: toJSON(input.selectedCalendarIds),
            check_in_timing: input.checkInTiming ?? null,
            support_tone: input.supportTone ?? null,
            updated_at: now,
          })
          .where('user_id', '=', userId)
          .execute();
      } else {
        await db
          .insertInto('calendar_preferences')
          .values({
            id: uuid(),
            user_id: userId,
            calendar_connected: input.calendarConnected ? 1 : 0,
            selected_calendar_ids: toJSON(input.selectedCalendarIds),
            check_in_timing: input.checkInTiming ?? null,
            support_tone: input.supportTone ?? null,
            created_at: now,
            updated_at: now,
          })
          .execute();
      }
    },
  });
}

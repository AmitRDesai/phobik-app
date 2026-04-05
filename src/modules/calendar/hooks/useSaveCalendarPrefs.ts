import { uuid } from '@/lib/crypto';
import { useLocalMutation } from '@/lib/powersync/useLocalMutation';
import { useUserId } from '@/lib/powersync/useUserId';
import { toJSON } from '@/lib/powersync/utils';
import { usePowerSync } from '@powersync/react';
import { useCallback } from 'react';

export function useSaveCalendarPrefs() {
  const powersync = usePowerSync();
  const userId = useUserId();

  const fn = useCallback(
    async (input: {
      calendarConnected: boolean;
      selectedCalendarIds: string[];
      checkInTiming?: string | null;
      supportTone?: string | null;
    }) => {
      if (!userId) throw new Error('Not authenticated');

      const now = new Date().toISOString();
      const id = uuid();

      // Upsert: try update first, insert if no rows affected
      const existing = await powersync.getOptional<{ id: string }>(
        'SELECT id FROM calendar_preferences WHERE user_id = ?',
        [userId],
      );

      if (existing) {
        await powersync.execute(
          'UPDATE calendar_preferences SET calendar_connected = ?, selected_calendar_ids = ?, check_in_timing = ?, support_tone = ?, updated_at = ? WHERE user_id = ?',
          [
            input.calendarConnected ? 1 : 0,
            toJSON(input.selectedCalendarIds),
            input.checkInTiming ?? null,
            input.supportTone ?? null,
            now,
            userId,
          ],
        );
      } else {
        await powersync.execute(
          `INSERT INTO calendar_preferences (id, user_id, calendar_connected, selected_calendar_ids, check_in_timing, support_tone, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            userId,
            input.calendarConnected ? 1 : 0,
            toJSON(input.selectedCalendarIds),
            input.checkInTiming ?? null,
            input.supportTone ?? null,
            now,
            now,
          ],
        );
      }
    },
    [powersync, userId],
  );

  return useLocalMutation(fn);
}

import { uuid } from '@/lib/crypto';
import { useLocalMutation } from '@/lib/powersync/useLocalMutation';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel, toJSON } from '@/lib/powersync/utils';
import { usePowerSync, useQuery } from '@powersync/react';
import { useCallback, useMemo } from 'react';

const ENTRY_JSON = { tags: true } as const;

export function useJournalEntriesForDate(date: string) {
  const userId = useUserId();
  const { data, isLoading, error } = useQuery(
    'SELECT * FROM journal_entry WHERE user_id = ? AND entry_date = ? ORDER BY created_at DESC',
    [userId ?? '', date],
  );

  const transformed = useMemo(
    () => data?.map((r) => toCamel(r, ENTRY_JSON)),
    [data],
  );
  return { data: transformed, isLoading, isPending: isLoading, error };
}

export function useEntryDatesForMonth(month: number, year: number) {
  const userId = useUserId();
  const monthStr = String(month).padStart(2, '0');
  const prefix = `${year}-${monthStr}%`;
  const { data, isLoading, error } = useQuery<{ entry_date: string }>(
    'SELECT DISTINCT entry_date FROM journal_entry WHERE user_id = ? AND entry_date LIKE ?',
    [userId ?? '', prefix],
  );

  const transformed = useMemo(() => data?.map((r) => r.entry_date), [data]);
  return { data: transformed, isLoading, isPending: isLoading, error };
}

export function useJournalEntry(id: string | undefined) {
  const { data, isLoading, error } = useQuery(
    'SELECT * FROM journal_entry WHERE id = ?',
    [id ?? ''],
  );

  const entry = useMemo(
    () => (data?.[0] ? toCamel(data[0], ENTRY_JSON) : null),
    [data],
  );
  return { data: entry, isLoading, isPending: isLoading, error };
}

export function useCreateEntry() {
  const powersync = usePowerSync();
  const userId = useUserId();

  const fn = useCallback(
    async (input: {
      feeling?: string | null;
      need?: string | null;
      content: string;
      title?: string | null;
      tags?: string[];
      entryDate: string;
    }) => {
      if (!userId) throw new Error('Not authenticated');

      const id = uuid();
      const now = new Date().toISOString();
      const contentOneLine = input.content.replace(/\n+/g, ' ').trim();
      const title =
        input.title ||
        (contentOneLine.length > 50
          ? contentOneLine.slice(0, 50).trim() + '...'
          : contentOneLine) ||
        null;

      await powersync.execute(
        `INSERT INTO journal_entry (id, user_id, feeling, need, content, title, tags, entry_date, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          userId,
          input.feeling ?? null,
          input.need ?? null,
          input.content,
          title,
          toJSON(input.tags ?? []),
          input.entryDate,
          now,
          now,
        ],
      );

      return { id };
    },
    [powersync, userId],
  );

  return useLocalMutation(fn);
}

export function useUpdateEntry() {
  const powersync = usePowerSync();
  const userId = useUserId();

  const fn = useCallback(
    async (input: {
      id: string;
      feeling?: string | null;
      need?: string | null;
      content?: string;
      title?: string | null;
      tags?: string[];
    }) => {
      if (!userId) throw new Error('Not authenticated');

      const sets: string[] = ['updated_at = ?'];
      const params: (string | null)[] = [new Date().toISOString()];

      if (input.feeling !== undefined) {
        sets.push('feeling = ?');
        params.push(input.feeling ?? null);
      }
      if (input.need !== undefined) {
        sets.push('need = ?');
        params.push(input.need ?? null);
      }
      if (input.content !== undefined) {
        sets.push('content = ?');
        params.push(input.content);
      }
      if (input.title !== undefined) {
        sets.push('title = ?');
        params.push(input.title ?? null);
      }
      if (input.tags !== undefined) {
        sets.push('tags = ?');
        params.push(toJSON(input.tags));
      }

      params.push(input.id, userId);

      await powersync.execute(
        `UPDATE journal_entry SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`,
        params,
      );
    },
    [powersync, userId],
  );

  return useLocalMutation(fn);
}

export function useDeleteEntry() {
  const powersync = usePowerSync();
  const userId = useUserId();

  const fn = useCallback(
    async (input: { id: string }) => {
      if (!userId) throw new Error('Not authenticated');

      await powersync.execute(
        'DELETE FROM journal_entry WHERE id = ? AND user_id = ?',
        [input.id, userId],
      );
    },
    [powersync, userId],
  );

  return useLocalMutation(fn);
}

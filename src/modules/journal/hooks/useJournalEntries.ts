import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { parseJSON, toCamel, toJSON } from '@/lib/powersync/utils';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';

const ENTRY_JSON = { tags: true } as const;

export function useJournalEntriesForDate(date: string) {
  const userId = useUserId();

  const { data, isLoading, error } = useQuery({
    queryKey: ['journal-entries', userId, date],
    query: db
      .selectFrom('journal_entry')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .where('entry_date', '=', date)
      .orderBy('created_at', 'desc'),
    enabled: !!userId,
  });

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

  const { data, isLoading, error } = useQuery({
    queryKey: ['journal-entry-dates', userId, month, year],
    query: db
      .selectFrom('journal_entry')
      .select('entry_date')
      .distinct()
      .where('user_id', '=', userId ?? '')
      .where('entry_date', 'like', prefix),
    enabled: !!userId,
  });

  const transformed = useMemo(() => data?.map((r) => r.entry_date), [data]);
  return { data: transformed, isLoading, isPending: isLoading, error };
}

export function useJournalEntry(id: string | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['journal-entry', id],
    query: db
      .selectFrom('journal_entry')
      .selectAll()
      .where('id', '=', id ?? ''),
    enabled: !!id,
  });

  const entry = useMemo(
    () => (data?.[0] ? toCamel(data[0], ENTRY_JSON) : null),
    [data],
  );
  return { data: entry, isLoading, isPending: isLoading, error };
}

export function useCreateEntry() {
  const userId = useUserId();
  const { heartRate, hrv, heartRateAt, hrvAt } = useLatestBiometrics();

  return useMutation({
    mutationFn: async (input: {
      feeling?: string | null;
      need?: string | null;
      content: string;
      title?: string | null;
      tags?: string[];
      entryDate: string;
    }) => {
      if (!userId) throw new Error('Not authenticated');

      const contentOneLine = input.content.replace(/\n+/g, ' ').trim();
      const title =
        input.title ||
        (contentOneLine.length > 50
          ? contentOneLine.slice(0, 50).trim() + '...'
          : contentOneLine) ||
        null;

      const id = uuid();
      const now = new Date().toISOString();

      // Snapshot biometrics only when the most recent sample is fresh
      // (within 30 min) so a stale reading doesn't get attached to a new
      // entry hours later.
      const FRESH_MS = 30 * 60 * 1000;
      const isFresh = (at: Date | null) =>
        at != null && Date.now() - at.getTime() < FRESH_MS;
      const hrAtEntry = isFresh(heartRateAt) ? (heartRate ?? null) : null;
      const hrvAtEntry = isFresh(hrvAt) ? (hrv ?? null) : null;

      await db
        .insertInto('journal_entry')
        .values({
          id,
          user_id: userId,
          feeling: input.feeling ?? null,
          need: input.need ?? null,
          content: input.content,
          title,
          tags: toJSON(input.tags ?? []),
          entry_date: input.entryDate,
          hr_at_entry: hrAtEntry,
          hrv_at_entry: hrvAtEntry,
          created_at: now,
          updated_at: now,
        })
        .execute();

      return { id };
    },
  });
}

export function useUpdateEntry() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: {
      id: string;
      feeling?: string | null;
      need?: string | null;
      content?: string;
      title?: string | null;
      tags?: string[];
    }) => {
      if (!userId) throw new Error('Not authenticated');

      let query = db
        .updateTable('journal_entry')
        .set('updated_at', new Date().toISOString())
        .where('id', '=', input.id)
        .where('user_id', '=', userId);

      if (input.feeling !== undefined)
        query = query.set('feeling', input.feeling ?? null);
      if (input.need !== undefined)
        query = query.set('need', input.need ?? null);
      if (input.content !== undefined)
        query = query.set('content', input.content);
      if (input.title !== undefined)
        query = query.set('title', input.title ?? null);
      if (input.tags !== undefined)
        query = query.set('tags', toJSON(input.tags));

      await query.execute();
    },
  });
}

export function useDeleteEntry() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: { id: string }) => {
      if (!userId) throw new Error('Not authenticated');

      await db
        .deleteFrom('journal_entry')
        .where('id', '=', input.id)
        .where('user_id', '=', userId)
        .execute();
    },
  });
}

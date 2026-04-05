import { uuid } from '@/lib/crypto';
import { useLocalMutation } from '@/lib/powersync/useLocalMutation';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel, toJSON } from '@/lib/powersync/utils';
import { usePowerSync, useQuery } from '@powersync/react';
import { useCallback, useMemo } from 'react';

const LETTER_JSON = { content: true } as const;

export function useCreateLetter() {
  const powersync = usePowerSync();
  const userId = useUserId();

  const fn = useCallback(
    async (input: {
      content: {
        step1: string;
        step2: string;
        step3: string;
        step4: string;
        step5: string;
      };
      coreAct: string;
      title?: string;
    }) => {
      if (!userId) throw new Error('Not authenticated');

      const id = uuid();
      const now = new Date();
      const entryDate = now.toISOString().slice(0, 10);
      const autoTitle = [
        input.content.step4,
        input.content.step5,
        input.content.step1,
      ]
        .map((s) => s.trim())
        .find((s) => s.length > 0);
      const title =
        input.title || (autoTitle ? autoTitle.slice(0, 50) : 'Untitled');
      const isoNow = now.toISOString();

      await powersync.execute(
        `INSERT INTO gentle_letter (id, user_id, title, core_act, content, entry_date, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          userId,
          title,
          input.coreAct,
          toJSON(input.content),
          entryDate,
          isoNow,
          isoNow,
        ],
      );

      return { id };
    },
    [powersync, userId],
  );

  return useLocalMutation(fn);
}

export function useListLetters() {
  const userId = useUserId();
  const { data, ...rest } = useQuery(
    'SELECT * FROM gentle_letter WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
    [userId ?? ''],
  );

  const transformed = useMemo(
    () => data?.map((r) => toCamel(r, LETTER_JSON)),
    [data],
  );
  return { data: transformed, ...rest };
}

export function useLettersForDate(date: string | null) {
  const userId = useUserId();
  const { data, ...rest } = useQuery(
    'SELECT * FROM gentle_letter WHERE user_id = ? AND entry_date = ? ORDER BY created_at DESC',
    [userId ?? '', date ?? ''],
  );

  const transformed = useMemo(
    () => data?.map((r) => toCamel(r, LETTER_JSON)),
    [data],
  );
  return { data: transformed, ...rest };
}

export function useGetLetter(id: string | undefined) {
  const { data, ...rest } = useQuery(
    'SELECT * FROM gentle_letter WHERE id = ?',
    [id ?? ''],
  );

  const letter = useMemo(
    () => (data?.[0] ? toCamel(data[0], LETTER_JSON) : null),
    [data],
  );
  return { data: letter, ...rest };
}

export function useLetterDatesForMonth(month: number, year: number) {
  const userId = useUserId();
  const monthStr = String(month).padStart(2, '0');
  const prefix = `${year}-${monthStr}%`;
  const { data, ...rest } = useQuery<{ entry_date: string }>(
    'SELECT DISTINCT entry_date FROM gentle_letter WHERE user_id = ? AND entry_date LIKE ?',
    [userId ?? '', prefix],
  );

  return { data: data?.map((r) => r.entry_date), ...rest };
}

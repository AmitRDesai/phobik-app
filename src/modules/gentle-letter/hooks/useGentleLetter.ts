import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel, toJSON } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';

const LETTER_JSON = { content: true } as const;

export function useCreateLetter() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: {
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

      await db
        .insertInto('gentle_letter')
        .values({
          id,
          user_id: userId,
          title,
          core_act: input.coreAct,
          content: toJSON(input.content),
          entry_date: entryDate,
          created_at: isoNow,
          updated_at: isoNow,
        })
        .execute();

      return { id };
    },
  });
}

export function useListLetters() {
  const userId = useUserId();

  const { data, ...rest } = useQuery({
    queryKey: ['gentle-letters', userId],
    query: db
      .selectFrom('gentle_letter')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .orderBy('created_at', 'desc')
      .limit(20),
    enabled: !!userId,
  });

  const transformed = useMemo(
    () => data?.map((r) => toCamel(r, LETTER_JSON)),
    [data],
  );
  return { data: transformed, ...rest };
}

export function useLettersForDate(date: string | null) {
  const userId = useUserId();

  const { data, ...rest } = useQuery({
    queryKey: ['gentle-letters-date', userId, date],
    query: db
      .selectFrom('gentle_letter')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .where('entry_date', '=', date ?? '')
      .orderBy('created_at', 'desc'),
    enabled: !!userId && !!date,
  });

  const transformed = useMemo(
    () => data?.map((r) => toCamel(r, LETTER_JSON)),
    [data],
  );
  return { data: transformed, ...rest };
}

export function useGetLetter(id: string | undefined) {
  const { data, ...rest } = useQuery({
    queryKey: ['gentle-letter', id],
    query: db
      .selectFrom('gentle_letter')
      .selectAll()
      .where('id', '=', id ?? ''),
    enabled: !!id,
  });

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

  const { data, ...rest } = useQuery({
    queryKey: ['gentle-letter-dates', userId, month, year],
    query: db
      .selectFrom('gentle_letter')
      .select('entry_date')
      .distinct()
      .where('user_id', '=', userId ?? '')
      .where('entry_date', 'like', prefix),
    enabled: !!userId,
  });

  return { data: data?.map((r) => r.entry_date), ...rest };
}

import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { parseJSON, toJSON } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';

export type EbookProgress = {
  purchased: boolean;
  introSeen: boolean;
  lastChapterId: number | null;
  completedChapters: number[];
};

const DEFAULT_PROGRESS: EbookProgress = {
  purchased: false,
  introSeen: false,
  lastChapterId: null,
  completedChapters: [],
};

/** Read current ebook progress (defaults when no row exists) */
export function useEbookProgress() {
  const userId = useUserId();

  const { data, isLoading, error } = useQuery({
    queryKey: ['ebook-progress', userId],
    query: db
      .selectFrom('ebook_progress')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .limit(1),
    enabled: !!userId,
  });

  const progress = useMemo<EbookProgress>(() => {
    const row = data?.[0];
    if (!row) return DEFAULT_PROGRESS;
    return {
      purchased: Boolean(row.purchased),
      introSeen: Boolean(row.intro_seen),
      lastChapterId: row.last_chapter_id ?? null,
      completedChapters:
        parseJSON<number[]>(row.completed_chapters as string) ?? [],
    };
  }, [data]);

  return { data: progress, isLoading, error };
}

/** Upsert ebook progress (partial update — only provided fields are changed) */
export function useUpdateEbookProgress() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: Partial<EbookProgress>) => {
      if (!userId) throw new Error('Not authenticated');

      const now = new Date().toISOString();

      const existing = await db
        .selectFrom('ebook_progress')
        .select('id')
        .where('user_id', '=', userId)
        .executeTakeFirst();

      if (existing) {
        const set: Record<string, unknown> = { updated_at: now };
        if (input.purchased !== undefined)
          set.purchased = input.purchased ? 1 : 0;
        if (input.introSeen !== undefined)
          set.intro_seen = input.introSeen ? 1 : 0;
        if (input.lastChapterId !== undefined)
          set.last_chapter_id = input.lastChapterId;
        if (input.completedChapters !== undefined)
          set.completed_chapters = toJSON(input.completedChapters);

        await db
          .updateTable('ebook_progress')
          .set(set)
          .where('user_id', '=', userId)
          .execute();
      } else {
        await db
          .insertInto('ebook_progress')
          .values({
            id: uuid(),
            user_id: userId,
            purchased: (input.purchased ?? false) ? 1 : 0,
            intro_seen: (input.introSeen ?? false) ? 1 : 0,
            last_chapter_id: input.lastChapterId ?? null,
            completed_chapters: toJSON(input.completedChapters ?? []),
            created_at: now,
            updated_at: now,
          })
          .execute();
      }
    },
  });
}

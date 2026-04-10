import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useJournalTags() {
  const userId = useUserId();

  const { data, isLoading, error } = useQuery({
    queryKey: ['journal-tags', userId],
    query: db
      .selectFrom('journal_tag')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .orderBy('name'),
    enabled: !!userId,
  });

  const transformed = useMemo(() => data?.map((r) => toCamel(r)), [data]);
  return { data: transformed, isLoading, isPending: isLoading, error };
}

export function useCreateTag() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: { name: string; color?: string | null }) => {
      if (!userId) throw new Error('Not authenticated');

      const id = uuid();
      await db
        .insertInto('journal_tag')
        .values({
          id,
          user_id: userId,
          name: input.name,
          color: input.color ?? null,
          created_at: new Date().toISOString(),
        })
        .execute();

      return { id };
    },
  });
}

export function useDeleteTag() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: { id: string }) => {
      if (!userId) throw new Error('Not authenticated');

      await db
        .deleteFrom('journal_tag')
        .where('id', '=', input.id)
        .where('user_id', '=', userId)
        .execute();
    },
  });
}

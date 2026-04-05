import { uuid } from '@/lib/crypto';
import { useLocalMutation } from '@/lib/powersync/useLocalMutation';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel } from '@/lib/powersync/utils';
import { usePowerSync, useQuery } from '@powersync/react';
import { useCallback, useMemo } from 'react';

export function useJournalTags() {
  const userId = useUserId();
  const { data, isLoading, error } = useQuery(
    'SELECT * FROM journal_tag WHERE user_id = ? ORDER BY name',
    [userId ?? ''],
  );

  const transformed = useMemo(() => data?.map((r) => toCamel(r)), [data]);
  return { data: transformed, isLoading, isPending: isLoading, error };
}

export function useCreateTag() {
  const powersync = usePowerSync();
  const userId = useUserId();

  const fn = useCallback(
    async (input: { name: string; color?: string | null }) => {
      if (!userId) throw new Error('Not authenticated');

      const id = uuid();
      await powersync.execute(
        'INSERT INTO journal_tag (id, user_id, name, color, created_at) VALUES (?, ?, ?, ?, ?)',
        [id, userId, input.name, input.color ?? null, new Date().toISOString()],
      );
      return { id };
    },
    [powersync, userId],
  );

  return useLocalMutation(fn);
}

export function useDeleteTag() {
  const powersync = usePowerSync();
  const userId = useUserId();

  const fn = useCallback(
    async (input: { id: string }) => {
      if (!userId) throw new Error('Not authenticated');

      await powersync.execute(
        'DELETE FROM journal_tag WHERE id = ? AND user_id = ?',
        [input.id, userId],
      );
    },
    [powersync, userId],
  );

  return useLocalMutation(fn);
}

import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { SOUND_JSON, type SoundRecord, type SoundSource } from './types';

/** Watch a single generated sound/song row (reactive, offline-first). */
export function useSound(id: string | undefined) {
  const { data, isLoading, isError, error, status } = useQuery({
    queryKey: ['sound', id],
    query: db
      .selectFrom('song')
      .selectAll()
      .where('id', '=', id ?? ''),
    enabled: !!id,
  });

  const sound = data?.[0]
    ? (toCamel(data[0], SOUND_JSON) as unknown as SoundRecord)
    : null;
  return { data: sound, isLoading, isError, error, status };
}

/** Watch the current user's sounds, optionally filtered by feature `source`. */
export function useListSounds(opts?: { source?: SoundSource; limit?: number }) {
  const userId = useUserId();
  const source = opts?.source;

  let query = db
    .selectFrom('song')
    .selectAll()
    .where('user_id', '=', userId ?? '');
  if (source) query = query.where('source', '=', source);
  query = query.orderBy('created_at', 'desc').limit(opts?.limit ?? 50);

  const { data, isLoading, isError, error, status } = useQuery({
    queryKey: ['sounds', userId, source ?? 'all'],
    query,
    enabled: !!userId,
  });

  const sounds =
    data?.map((r) => toCamel(r, SOUND_JSON) as unknown as SoundRecord) ?? null;
  return { data: sounds, isLoading, isError, error, status };
}

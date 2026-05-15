import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMemo } from 'react';

const SONG_JSON = { analysis_tags: true } as const;

export interface SongRecord {
  id: string;
  userId: string;
  prompt: string;
  style: string | null;
  status: 'draft' | 'generating' | 'ready' | 'failed';
  generationStage: 'queued' | 'text' | 'first' | 'complete' | null;
  providerJobId: string | null;
  audioKey: string | null;
  artworkKey: string | null;
  title: string | null;
  compositionNumber: number | null;
  durationSeconds: number | null;
  analysisTags: string[] | null;
  isFavorite: number;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useSong(id: string | undefined) {
  const { data, ...rest } = useQuery({
    queryKey: ['song', id],
    query: db
      .selectFrom('song')
      .selectAll()
      .where('id', '=', id ?? ''),
    enabled: !!id,
  });

  const song = useMemo(
    () =>
      data?.[0] ? (toCamel(data[0], SONG_JSON) as unknown as SongRecord) : null,
    [data],
  );
  return { data: song, ...rest };
}

export function useListSongs() {
  const userId = useUserId();

  const { data, ...rest } = useQuery({
    queryKey: ['songs', userId],
    query: db
      .selectFrom('song')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .orderBy('created_at', 'desc')
      .limit(50),
    enabled: !!userId,
  });

  const songs = useMemo(
    () =>
      data?.map((r) => toCamel(r, SONG_JSON) as unknown as SongRecord) ?? null,
    [data],
  );
  return { data: songs, ...rest };
}

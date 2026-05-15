import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Skeleton } from '@/components/ui/Skeleton';
import { TextField } from '@/components/ui/TextField';
import { accentFor, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { uuid } from '@/lib/crypto';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { SongListRow } from '../components/SongListRow';
import { useDeleteSong } from '../hooks/useDeleteSong';
import { useGenerateSong } from '../hooks/useGenerateSong';
import { useListSongs, type SongRecord } from '../hooks/useSong';

type LibraryFilter = 'all' | 'favorites' | 'failed';

const FILTER_OPTIONS: { label: string; value: LibraryFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Favorites', value: 'favorites' },
  { label: 'Failed', value: 'failed' },
];

export default function ExpressYourselfLibrary() {
  const router = useRouter();
  const scheme = useScheme();
  const { data: songs, isLoading } = useListSongs();
  const generateMutation = useGenerateSong();
  const deleteMutation = useDeleteSong();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<LibraryFilter>('all');

  const filtered = useMemo(() => {
    const base = songs ?? [];
    let list: SongRecord[];
    if (filter === 'favorites') {
      list = base.filter((s) => s.status === 'ready' && s.isFavorite);
    } else if (filter === 'failed') {
      list = base.filter((s) => s.status === 'failed');
    } else {
      list = base.filter((s) => s.status === 'ready');
    }
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((s) =>
      [s.title, s.prompt]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q)),
    );
  }, [songs, filter, query]);

  const counts = useMemo(() => {
    const base = songs ?? [];
    return {
      ready: base.filter((s) => s.status === 'ready').length,
      favorites: base.filter((s) => s.status === 'ready' && s.isFavorite)
        .length,
      failed: base.filter((s) => s.status === 'failed').length,
    };
  }, [songs]);

  const handleRetry = async (failed: SongRecord) => {
    const choice = await dialog.info({
      title: 'Try this one again?',
      message: 'We’ll start a new generation with the same poem and style.',
      buttons: [
        { label: 'Retry', value: 'confirm', variant: 'primary' },
        { label: 'Cancel', value: 'cancel', variant: 'secondary' },
      ],
    });
    if (choice !== 'confirm') return;
    const newId = uuid();
    try {
      await generateMutation.mutateAsync({
        id: newId,
        prompt: failed.prompt,
        style: failed.style ?? '',
      });
      // Clean up the failed row so the library doesn't keep showing it.
      await deleteMutation.mutateAsync({ id: failed.id });
      router.push(`/practices/express-yourself/generating?id=${newId}`);
    } catch (err) {
      void dialog.error({
        title: 'Could not retry',
        message: err instanceof Error ? err.message : 'Try again in a moment.',
      });
    }
  };

  const subtitleText = (() => {
    if (filter === 'favorites') {
      return counts.favorites === 0
        ? 'Tap the heart on any song to keep it here.'
        : `${counts.favorites} favorited.`;
    }
    if (filter === 'failed') {
      return counts.failed === 0
        ? 'No failed generations.'
        : `${counts.failed} couldn’t finish. Retry any of them.`;
    }
    return counts.ready === 0
      ? 'Songs you generate will show up here.'
      : `${counts.ready} ${counts.ready === 1 ? 'song' : 'songs'} in your library.`;
  })();

  return (
    <Screen
      variant="default"
      scroll
      header={
        <Header variant="back" title="Your Songs" subtitle={subtitleText} />
      }
      contentClassName="gap-4 pb-10"
    >
      <TextField
        type="text"
        value={query}
        onChangeText={setQuery}
        placeholder="Search by title or message"
        icon={
          <MaterialIcons
            name="search"
            size={18}
            color={foregroundFor(scheme, 0.55)}
          />
        }
      />

      <SegmentedControl<LibraryFilter>
        options={FILTER_OPTIONS}
        selected={filter}
        onSelect={setFilter}
        variant="tinted"
      />

      {isLoading && filtered.length === 0 ? (
        <View className="gap-3">
          <Skeleton shape="rect" className="h-16 rounded-2xl" />
          <Skeleton shape="rect" className="h-16 rounded-2xl" />
          <Skeleton shape="rect" className="h-16 rounded-2xl" />
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState
          size="md"
          tone="pink"
          title={
            query
              ? 'No matches'
              : filter === 'favorites'
                ? 'No favorites yet'
                : filter === 'failed'
                  ? 'Nothing failed'
                  : 'No songs yet'
          }
          description={
            query
              ? 'Try a different search term.'
              : filter === 'favorites'
                ? 'Tap the heart on a song to add it here.'
                : filter === 'failed'
                  ? 'Failed generations would show up here.'
                  : 'Write a poem or letter and we’ll turn it into a custom song.'
          }
          icon={(color) => (
            <MaterialIcons name="library-music" size={36} color={color} />
          )}
          action={
            filter === 'all' && !query ? (
              <Button
                onPress={() =>
                  router.push('/practices/express-yourself/compose')
                }
                prefixIcon={
                  <MaterialIcons name="edit" size={16} color="white" />
                }
              >
                Start Writing
              </Button>
            ) : undefined
          }
        />
      ) : (
        <View className="gap-3">
          {filtered.map((s) =>
            s.status === 'failed' ? (
              <Card key={s.id} variant="flat" size="sm">
                <View className="flex-row items-center gap-3">
                  <IconChip size="md" shape="rounded" tone="orange">
                    {(c) => (
                      <MaterialIcons name="error-outline" size={20} color={c} />
                    )}
                  </IconChip>
                  <View className="flex-1 gap-0.5">
                    <Text size="sm" weight="semibold" numberOfLines={1}>
                      {s.title?.trim() || 'Untitled song'}
                    </Text>
                    <Text size="xs" tone="secondary" numberOfLines={2}>
                      {s.errorMessage ?? 'Generation did not finish.'}
                    </Text>
                  </View>
                  <Button
                    size="xs"
                    variant="secondary"
                    onPress={() => handleRetry(s)}
                    loading={
                      generateMutation.isPending &&
                      generateMutation.variables?.id === s.id
                    }
                    prefixIcon={
                      <MaterialIcons
                        name="refresh"
                        size={14}
                        color={accentFor(scheme, 'pink')}
                      />
                    }
                  >
                    Retry
                  </Button>
                </View>
              </Card>
            ) : (
              <SongListRow
                key={s.id}
                song={s}
                onPress={() =>
                  router.push(`/practices/express-yourself/ready/${s.id}`)
                }
              />
            ),
          )}
        </View>
      )}
    </Screen>
  );
}

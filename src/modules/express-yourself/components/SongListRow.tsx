import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { accentFor, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { dialog } from '@/utils/dialog';
import { toast } from '@/utils/toast';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { EditTitleDialog } from './EditTitleDialog';
import { useDeleteSong } from '../hooks/useDeleteSong';
import type { SongRecord } from '../hooks/useSong';
import { usePlaybackUrl } from '../hooks/usePlaybackUrl';
import { useUpsertSong } from '../hooks/useUpsertSong';

const ARTWORK_SIZE = 56;
const ARTWORK_RADIUS = 14;

function formatDuration(seconds: number | null): string {
  if (!seconds || seconds <= 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso.slice(0, 10);
  }
}

export interface SongListRowProps {
  song: SongRecord;
  onPress: () => void;
  className?: string;
}

/**
 * Visual structure mirrors `AudioPlayer variant="card"` (artwork + stacked
 * title/subtitle). Tap anywhere on the row to play; tap the trailing "…"
 * chip to open the rename / delete menu.
 */
export function SongListRow({ song, onPress, className }: SongListRowProps) {
  const scheme = useScheme();
  const { data: playback } = usePlaybackUrl(
    song.status === 'ready' ? song.id : undefined,
  );
  const upsertMutation = useUpsertSong();
  const deleteMutation = useDeleteSong();

  const artworkUri = playback?.artworkUrl ?? undefined;
  const subtitle = `${formatDate(song.createdAt)} · ${formatDuration(song.durationSeconds)}`;
  const title = song.title?.trim() || 'Untitled Song';

  const handleMenu = async () => {
    const choice = await dialog.info({
      title,
      message: 'Choose an action for this song.',
      buttons: [
        { label: 'Rename', value: 'rename', variant: 'primary' },
        { label: 'Delete', value: 'delete', variant: 'destructive' },
        { label: 'Cancel', value: 'cancel', variant: 'secondary' },
      ],
    });

    if (choice === 'rename') {
      const nextTitle = (await dialog.open({
        component: EditTitleDialog as never,
        props: { initialTitle: title },
      })) as string | undefined;
      if (typeof nextTitle === 'string' && nextTitle !== title) {
        upsertMutation.mutate(
          { id: song.id, title: nextTitle },
          {
            onSuccess: () => toast.success('Renamed'),
            onError: () =>
              void dialog.error({
                title: 'Could not rename',
                message: 'Try again in a moment.',
              }),
          },
        );
      }
      return;
    }

    if (choice === 'delete') {
      const confirm = await dialog.error({
        title: 'Delete this song?',
        message: 'This will remove it from your library permanently.',
        buttons: [
          { label: 'Delete', value: 'confirm', variant: 'destructive' },
          { label: 'Cancel', value: 'cancel', variant: 'secondary' },
        ],
      });
      if (confirm === 'confirm') {
        deleteMutation.mutate(
          { id: song.id },
          {
            onSuccess: () => toast.success('Deleted'),
            onError: () =>
              void dialog.error({
                title: 'Could not delete',
                message: 'Try again in a moment.',
              }),
          },
        );
      }
    }
  };

  return (
    <Card variant="flat" size="sm" className={className} onPress={onPress}>
      <View className="flex-row items-center gap-3">
        {artworkUri ? (
          <Image
            source={{ uri: artworkUri }}
            style={{
              width: ARTWORK_SIZE,
              height: ARTWORK_SIZE,
              borderRadius: ARTWORK_RADIUS,
            }}
            contentFit="cover"
          />
        ) : (
          <View
            className="items-center justify-center bg-foreground/10"
            style={{
              width: ARTWORK_SIZE,
              height: ARTWORK_SIZE,
              borderRadius: ARTWORK_RADIUS,
            }}
          >
            <Ionicons
              name="musical-notes"
              size={22}
              color={foregroundFor(scheme, 0.45)}
            />
          </View>
        )}
        <View className="flex-1 gap-1">
          <Text size="sm" weight="semibold" numberOfLines={1}>
            {title}
          </Text>
          <Text size="xs" tone="secondary" numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        {song.isFavorite ? (
          <MaterialIcons
            name="favorite"
            size={16}
            color={accentFor(scheme, 'pink')}
          />
        ) : null}
        <IconChip
          size="sm"
          shape="circle"
          onPress={handleMenu}
          accessibilityLabel="Song options"
        >
          {(c) => <MaterialIcons name="more-horiz" size={18} color={c} />}
        </IconChip>
      </View>
    </Card>
  );
}

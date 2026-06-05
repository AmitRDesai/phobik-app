import expressImg from '@/assets/images/sound-studio/express-analyzing.jpg';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/constants/colors';
import {
  useDeleteSound,
  useListSounds,
  usePlaybackUrl,
  useSound,
  useUpsertSound,
} from '@/hooks/sound-generation';
import { dialog } from '@/utils/dialog';
import { toast } from '@/utils/toast';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { AI_STUDIO_SOURCE } from '../lib/ai-studio';

export default function AiStudioPlayback() {
  const router = useRouter();
  const { id, celebrate } = useLocalSearchParams<{
    id: string;
    celebrate?: string;
  }>();
  const isFresh = celebrate === '1';

  const { data: sound } = useSound(id);
  const { data: playback } = usePlaybackUrl(id);
  const { data: creations } = useListSounds({ source: AI_STUDIO_SOURCE });
  const upsertMutation = useUpsertSound();
  const deleteMutation = useDeleteSound();

  const source = playback?.url ? { uri: playback.url } : null;
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (!status.playing) return;
    const tag = 'ai-studio-playback';
    void activateKeepAwakeAsync(tag);
    return () => {
      void deactivateKeepAwake(tag);
    };
  }, [status.playing]);

  const duration = sound?.durationSeconds ?? status.duration ?? 0;
  const progress =
    duration > 0 ? Math.min(1, status.currentTime / duration) : 0;

  const togglePlay = () => {
    if (status.playing) player.pause();
    else player.play();
  };

  const toggleFavorite = () => {
    if (!sound || !id) return;
    const next = sound.isFavorite ? 0 : 1;
    upsertMutation.mutate({ id, isFavorite: next === 1 });
    toast.success(next ? 'Saved to favorites' : 'Removed from favorites');
  };

  const handleDelete = async () => {
    if (!id) return;
    const choice = await dialog.error({
      title: 'Delete this sound?',
      message: 'This permanently removes it from your creations.',
      buttons: [
        { label: 'Delete', value: 'confirm', variant: 'destructive' },
        { label: 'Keep', value: 'cancel', variant: 'secondary' },
      ],
    });
    if (choice !== 'confirm') return;
    await deleteMutation.mutateAsync({ id });
    router.replace('/sound-studio');
  };

  const otherCreations = (creations ?? []).filter(
    (c) => c.status === 'ready' && c.id !== id,
  );

  return (
    <Screen
      scroll
      fade={isFresh}
      header={<Header variant="back" title="AI Studio" />}
      sticky={
        <Button
          variant="secondary"
          onPress={() => router.replace('/sound-studio/ai/write')}
          icon={<MaterialIcons name="bolt" size={18} color="white" />}
          fullWidth
        >
          New Studio Session
        </Button>
      }
      contentClassName="gap-6 pb-6"
    >
      {/* Hero copy */}
      <View>
        <Text weight="extrabold" className="text-[32px] leading-tight">
          {isFresh ? 'Ready to hear ' : 'Your '}
          <GradientText className="text-[32px] font-extrabold leading-tight">
            {isFresh ? 'your sound?' : 'creation'}
          </GradientText>
        </Text>
        {sound?.prompt?.trim() ? (
          <Text size="sm" tone="secondary" className="mt-3" numberOfLines={3}>
            “{sound.prompt.trim()}”
          </Text>
        ) : null}
      </View>

      <AudioPlayer
        variant="hero"
        title={sound?.title ?? 'Your Sound'}
        subtitle={
          sound?.compositionNumber
            ? `Creation No. ${sound.compositionNumber}`
            : undefined
        }
        artwork={playback?.artworkUrl ?? expressImg}
        progress={progress}
        duration={duration}
        playing={status.playing}
        loading={!source}
        onTogglePlay={togglePlay}
        onSeek={(seconds) => player.seekTo(seconds)}
        onSkipBack={() => player.seekTo(Math.max(0, status.currentTime - 10))}
        onSkipForward={() =>
          player.seekTo(Math.min(duration, status.currentTime + 30))
        }
        tone="pink"
      />

      {/* Actions */}
      <View className="flex-row items-start justify-center gap-12 pt-1">
        <View className="items-center gap-2">
          <IconChip
            size="lg"
            shape="circle"
            tone={sound?.isFavorite ? 'pink' : undefined}
            onPress={toggleFavorite}
            accessibilityLabel={sound?.isFavorite ? 'Unfavorite' : 'Favorite'}
          >
            {(c) => (
              <MaterialIcons
                name={sound?.isFavorite ? 'favorite' : 'favorite-border'}
                size={22}
                color={c}
              />
            )}
          </IconChip>
          <Text size="xs" tone={sound?.isFavorite ? 'accent' : 'secondary'}>
            {sound?.isFavorite ? 'Favorited' : 'Favorite'}
          </Text>
        </View>
        <View className="items-center gap-2">
          <IconChip
            size="lg"
            shape="circle"
            onPress={handleDelete}
            disabled={deleteMutation.isPending}
            accessibilityLabel="Delete"
          >
            {(c) => <MaterialIcons name="delete-outline" size={22} color={c} />}
          </IconChip>
          <Text size="xs" tone="secondary">
            Delete
          </Text>
        </View>
      </View>

      {/* Your Creations */}
      {otherCreations.length > 0 ? (
        <View>
          <Text
            size="xs"
            treatment="caption"
            tone="secondary"
            weight="bold"
            className="mb-3"
          >
            Your Creations
          </Text>
          <View className="gap-2">
            {otherCreations.map((c) => (
              <Card
                key={c.id}
                onPress={() =>
                  router.replace(`/sound-studio/ai/playback?id=${c.id}`)
                }
                className="flex-row items-center gap-3 p-3"
              >
                <IconChip size="md" shape="rounded" tone="pink">
                  {(color) => (
                    <MaterialIcons name="graphic-eq" size={18} color={color} />
                  )}
                </IconChip>
                <View className="flex-1">
                  <Text size="sm" weight="bold" numberOfLines={1}>
                    {c.title ?? 'Untitled'}
                  </Text>
                  <Text size="xs" tone="secondary">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <MaterialIcons
                  name="play-arrow"
                  size={20}
                  color={colors.primary.pink}
                />
              </Card>
            ))}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

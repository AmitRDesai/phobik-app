import expressYourselfImg from '@/assets/images/express-yourself/waves-artwork.jpg';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { InfoCallout } from '@/components/ui/InfoCallout';
import { Screen } from '@/components/ui/Screen';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { SongListRow } from '../components/SongListRow';
import { useListSongs } from '../hooks/useSong';

const RECENT_LIMIT = 3;

export default function ExpressYourselfIntro() {
  const router = useRouter();
  const { data: songs } = useListSongs();
  const ready = useMemo(
    () => (songs ?? []).filter((s) => s.status === 'ready'),
    [songs],
  );
  const recent = ready.slice(0, RECENT_LIMIT);
  const inFlight = useMemo(
    () => (songs ?? []).find((s) => s.status === 'generating') ?? null,
    [songs],
  );
  /** Latest unsubmitted draft — the user has typed but hasn't tapped Generate yet. */
  const draft = useMemo(
    () => (songs ?? []).find((s) => s.status === 'draft') ?? null,
    [songs],
  );

  return (
    <Screen
      variant="default"
      scroll
      header={<Header variant="back" title="Express Yourself" />}
      contentClassName="gap-6 pb-10"
    >
      <Image
        source={expressYourselfImg}
        style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 24 }}
        contentFit="cover"
      />

      <Badge
        tone="pink"
        size="sm"
        className="self-start"
        icon={(c) => <MaterialIcons name="favorite" size={11} color={c} />}
      >
        Relationships
      </Badge>

      <View>
        <Text size="display" weight="bold">
          Express
        </Text>
        <GradientText className="text-[44px] font-bold leading-none">
          Yourself
        </GradientText>
      </View>

      <Text size="md" tone="secondary">
        Share your thoughts and feelings with a loved one by transforming them
        into a custom song. Write from the heart, and our AI will map the
        emotional resonance of your words to create a unique neuro-acoustic
        soundscape.
      </Text>

      {inFlight ? (
        <InfoCallout
          tone="pink"
          variant="tinted"
          title="A song is being created"
          description="Hang tight — we'll notify you when it's ready. Tap to follow along."
          icon={(c) => (
            <MaterialIcons name="auto-awesome" size={18} color={c} />
          )}
          action={
            <Button
              size="sm"
              onPress={() =>
                router.push(
                  `/practices/express-yourself/generating?id=${inFlight.id}`,
                )
              }
              prefixIcon={
                <MaterialIcons name="arrow-forward" size={14} color="white" />
              }
            >
              View Progress
            </Button>
          }
        />
      ) : null}

      <View className="flex-row gap-3">
        <Button
          onPress={() =>
            router.push(
              draft
                ? `/practices/express-yourself/compose?id=${draft.id}`
                : '/practices/express-yourself/compose',
            )
          }
          prefixIcon={
            <MaterialIcons
              name={draft ? 'edit-note' : 'edit'}
              size={18}
              color="white"
            />
          }
        >
          {draft ? 'Continue Writing' : 'Start Writing'}
        </Button>
        <Button
          variant="ghost"
          onPress={() =>
            dialog.info({
              title: 'About Express Yourself',
              message:
                'Write a poem or letter to someone you love. Our AI listens to the sentiment of your words and composes a unique song inspired by what you wrote — a sound gift you can share or keep.',
            })
          }
        >
          Learn More
        </Button>
      </View>

      <View className="flex-row gap-3 pt-2">
        <Card variant="flat" size="sm" className="flex-1 gap-1">
          <Text size="xs" treatment="caption" tone="accent">
            AI-Native
          </Text>
          <Text size="sm" tone="body">
            Emotional Mapping
          </Text>
        </Card>
        <Card variant="flat" size="sm" className="flex-1 gap-1">
          <Text size="xs" treatment="caption" tone="accent">
            Spatial
          </Text>
          <Text size="sm" tone="body">
            Audio Engine
          </Text>
        </Card>
      </View>

      {recent.length > 0 ? (
        <View className="gap-3 pt-2">
          <View className="flex-row items-center justify-between">
            <Text size="xs" treatment="caption" tone="accent">
              Recent Songs
            </Text>
            <Button
              variant="ghost"
              size="xs"
              onPress={() => router.push('/practices/express-yourself/library')}
            >
              {ready.length > RECENT_LIMIT
                ? `View All (${ready.length})`
                : 'View All'}
            </Button>
          </View>
          {recent.map((song) => (
            <SongListRow
              key={song.id}
              song={song}
              onPress={() =>
                router.push(`/practices/express-yourself/ready/${song.id}`)
              }
            />
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

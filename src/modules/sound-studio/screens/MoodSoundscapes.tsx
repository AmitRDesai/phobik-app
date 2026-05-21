import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { GradientText } from '@/components/ui/GradientText';
import { ImageScrim } from '@/components/ui/ImageScrim';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors, withAlpha } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PracticeScreenShell } from '@/modules/practices/components/PracticeScreenShell';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable } from 'react-native';

import { MOOD_BY_SLUG, type MoodMeta } from '../data/sound-studio';
import type { SoundscapeRow } from '../hooks/useSoundscapeHome';
import { useSoundscapeArtwork } from '../hooks/useSoundscapeArtwork';
import { useSoundscapesByMood } from '../hooks/useSoundscapesByMood';
import { formatDurationMs } from '../lib/format';
import { findManifestEntry, useAudioManifest } from '@/lib/audio/manifest';

export default function MoodSoundscapes() {
  const params = useLocalSearchParams<{ mood: string }>();
  const mood: MoodMeta | undefined = MOOD_BY_SLUG[params.mood ?? ''];

  if (!mood) {
    return <Redirect href="/sound-studio/curated" />;
  }

  return <MoodSoundscapesInner mood={mood} />;
}

function MoodSoundscapesInner({ mood }: { mood: MoodMeta }) {
  const router = useRouter();
  const accent = colors.primary.pink;
  const { data, isLoading, error } = useSoundscapesByMood(mood.id);
  const soundscapes = data ?? [];

  return (
    <PracticeScreenShell wordmark="Curated" scrollContentClassName="pb-16">
      <View className="mb-6 mt-4">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name={mood.icon} size={18} color={accent} />
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            style={{ color: accent }}
          >
            {mood.label}
          </Text>
        </View>
        <GradientText className="mt-3 text-[32px] font-extrabold leading-none">
          {mood.headline}
        </GradientText>
        <Text size="md" tone="body" className="mt-3 leading-relaxed">
          {mood.description}
        </Text>
      </View>

      {error ? (
        <Card variant="toned" tone="pink" size="md" className="mb-4">
          <Text size="sm" weight="semibold">
            Couldn’t reach the library
          </Text>
          <Text size="sm" tone="secondary" className="mt-1">
            {error.message}
          </Text>
        </Card>
      ) : null}

      {isLoading ? (
        <View className="gap-4">
          <Skeleton height={180} />
          <Skeleton height={180} />
          <Skeleton height={180} />
        </View>
      ) : soundscapes.length === 0 ? (
        <EmptyState
          tone="pink"
          icon={(color) => (
            <MaterialIcons name={mood.icon} size={32} color={color} />
          )}
          title="No soundscapes here yet"
          description="We’re tuning the library — check back soon."
        />
      ) : (
        <View className="gap-4">
          {soundscapes.map((row) => (
            <SoundscapeTrackCard
              key={row.slug}
              row={row}
              onPress={() =>
                router.push(`/sound-studio/curated/play/${row.slug}?autoplay=1`)
              }
            />
          ))}
        </View>
      )}
    </PracticeScreenShell>
  );
}

type SoundscapeTrackCardProps = {
  row: SoundscapeRow;
  onPress: () => void;
};

function SoundscapeTrackCard({ row, onPress }: SoundscapeTrackCardProps) {
  const artwork = useSoundscapeArtwork(row.audioAssetKey, row.mood);
  const { data: manifest } = useAudioManifest();
  const durationMs = findManifestEntry(manifest, row.audioAssetKey)?.durationMs;

  return (
    <Pressable onPress={onPress} className="active:scale-[0.98]">
      <View
        className="relative aspect-square overflow-hidden rounded-[32px]"
        style={{
          boxShadow: `0px 20px 40px -10px ${withAlpha(colors.primary.pink, 0.18)}`,
        }}
      >
        <Image
          source={artwork}
          style={{ position: 'absolute', inset: 0 }}
          contentFit="cover"
        />
        <ImageScrim direction="bottom" strength={0.92} start={0.3} />

        {durationMs != null ? (
          <View className="absolute right-5 top-5 flex-row items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5">
            <MaterialIcons name="schedule" size={12} color="white" />
            <Text size="xs" weight="semibold" className="text-white">
              {formatDurationMs(durationMs)}
            </Text>
          </View>
        ) : null}

        <View className="absolute inset-x-6 bottom-6 flex-row items-end justify-between gap-4">
          <View className="flex-1">
            {row.eyebrow ? (
              <Text
                size="xs"
                treatment="caption"
                weight="bold"
                className="text-white/75"
              >
                {row.eyebrow}
              </Text>
            ) : null}
            <Text
              size="h2"
              tone="inverse"
              weight="extrabold"
              className="mt-1 leading-tight"
              numberOfLines={2}
            >
              {row.title}
            </Text>
          </View>

          <View pointerEvents="none">
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 16px ${withAlpha(colors.primary.pink, 0.4)}`,
              }}
            >
              <Ionicons
                name="play"
                size={24}
                color="white"
                style={{ transform: [{ translateX: 2 }] }}
              />
            </LinearGradient>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

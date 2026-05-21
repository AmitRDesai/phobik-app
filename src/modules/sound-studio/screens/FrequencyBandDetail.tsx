import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ImageScrim } from '@/components/ui/ImageScrim';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors, withAlpha } from '@/constants/colors';
import { PracticeScreenShell } from '@/modules/practices/components/PracticeScreenShell';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable } from 'react-native';

import {
  BAND_BY_ID,
  MOOD_BY_ID,
  type FrequencyBandMeta,
  type SoundscapeBand,
} from '../data/sound-studio';
import type { SoundscapeRow } from '../hooks/useSoundscapeHome';
import { useSoundscapeArtwork } from '../hooks/useSoundscapeArtwork';
import { useSoundscapesByBand } from '../hooks/useSoundscapesByBand';
import { formatDurationMs } from '../lib/format';
import { findManifestEntry, useAudioManifest } from '@/lib/audio/manifest';

function isBand(value: string | undefined): value is SoundscapeBand {
  return value != null && value in BAND_BY_ID;
}

export default function FrequencyBandDetail() {
  const params = useLocalSearchParams<{ band: string }>();
  if (!isBand(params.band)) {
    return <Redirect href="/sound-studio/curated" />;
  }
  return <FrequencyBandDetailInner band={BAND_BY_ID[params.band]} />;
}

function FrequencyBandDetailInner({ band }: { band: FrequencyBandMeta }) {
  const router = useRouter();
  const { data, isLoading, error } = useSoundscapesByBand(band.id);
  const tracks: SoundscapeRow[] = data ?? [];

  return (
    <PracticeScreenShell wordmark="Frequency" scrollContentClassName="pb-16">
      <View
        className="mt-4 overflow-hidden rounded-[32px]"
        style={{
          boxShadow: `0px 20px 40px -10px ${withAlpha(colors.primary.pink, 0.18)}`,
        }}
      >
        <View className="relative h-64">
          <Image
            source={band.fallbackImage}
            style={{ position: 'absolute', inset: 0 }}
            contentFit="cover"
          />
          <ImageScrim direction="bottom" strength={0.92} start={0.25} />

          <View className="absolute right-5 top-5 flex-row items-center gap-2 rounded-full bg-black/45 px-3 py-1.5">
            <View
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: colors.primary.pink }}
            />
            <Text
              size="xs"
              weight="semibold"
              className="text-white"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {band.hzRange}
            </Text>
          </View>

          <View className="absolute inset-x-6 bottom-6">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name={band.icon} size={16} color="white" />
              <Text
                size="xs"
                treatment="caption"
                weight="bold"
                className="text-white/80"
              >
                {band.label}
              </Text>
            </View>
            <Text
              size="display"
              tone="inverse"
              weight="extrabold"
              className="mt-1 leading-tight"
              numberOfLines={2}
            >
              {band.headline}
            </Text>
          </View>
        </View>
      </View>

      <Text size="md" tone="body" className="mt-6 leading-relaxed">
        {band.description}
      </Text>

      <View className="mt-6">
        <Text size="xs" treatment="caption" tone="secondary">
          Best for
        </Text>
        <View className="mt-3 flex-row flex-wrap gap-2">
          {band.bestFor.map((entry) => (
            <View
              key={entry}
              className="rounded-full border border-foreground/10 bg-foreground/5 px-3.5 py-1.5"
            >
              <Text size="xs" weight="semibold" className="text-foreground/80">
                {entry}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-6 border-l-2 border-foreground/15 pl-4">
        <Text size="xs" treatment="caption" tone="secondary">
          The science
        </Text>
        <Text size="sm" tone="body" className="mt-2 leading-relaxed">
          {band.body}
        </Text>
      </View>

      <View className="mt-10 mb-3">
        <Text size="h3" weight="semibold">
          Featured soundscapes
        </Text>
        <Text size="sm" tone="secondary" className="mt-1">
          Tuned to the {band.label} range.
        </Text>
      </View>

      {error ? (
        <Card variant="toned" tone="pink" size="md">
          <Text size="sm" weight="semibold">
            Couldn’t reach the library
          </Text>
          <Text size="sm" tone="secondary" className="mt-1">
            {error.message}
          </Text>
        </Card>
      ) : null}

      {isLoading ? (
        <View className="gap-3">
          <Skeleton height={104} />
          <Skeleton height={104} />
          <Skeleton height={104} />
        </View>
      ) : tracks.length === 0 ? (
        <EmptyState
          tone="pink"
          icon={(color) => (
            <MaterialIcons name={band.icon} size={32} color={color} />
          )}
          title={`No ${band.label} tracks yet`}
          description="The library is still tuning. Check back soon."
        />
      ) : (
        <View className="gap-3">
          {tracks.map((row) => (
            <BandTrackRow
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

type BandTrackRowProps = {
  row: SoundscapeRow;
  onPress: () => void;
};

function BandTrackRow({ row, onPress }: BandTrackRowProps) {
  const artwork = useSoundscapeArtwork(row.audioAssetKey, row.mood);
  const moodLabel = MOOD_BY_ID[row.mood].label;
  const { data: manifest } = useAudioManifest();
  const durationMs = findManifestEntry(manifest, row.audioAssetKey)?.durationMs;

  return (
    <Pressable onPress={onPress} className="active:scale-[0.98]">
      <View className="flex-row items-center gap-4 rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-3">
        <View className="h-20 w-20 overflow-hidden rounded-2xl">
          <Image
            source={artwork}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        </View>
        <View className="flex-1">
          {row.eyebrow ? (
            <Text size="xs" treatment="caption" weight="bold" tone="secondary">
              {row.eyebrow}
            </Text>
          ) : null}
          <Text
            size="md"
            weight="semibold"
            numberOfLines={1}
            className="mt-0.5"
          >
            {row.title}
          </Text>
          <Text size="xs" tone="secondary" className="mt-0.5">
            {durationMs != null
              ? `${moodLabel} · ${formatDurationMs(durationMs)}`
              : moodLabel}
          </Text>
        </View>
        <View pointerEvents="none">
          <LinearGradient
            colors={[colors.primary.pink, colors.accent.yellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 12px ${withAlpha(colors.primary.pink, 0.35)}`,
            }}
          >
            <Ionicons
              name="play"
              size={18}
              color="white"
              style={{ transform: [{ translateX: 1 }] }}
            />
          </LinearGradient>
        </View>
      </View>
    </Pressable>
  );
}

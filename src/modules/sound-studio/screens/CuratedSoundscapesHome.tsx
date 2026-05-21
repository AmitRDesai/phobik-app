import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors, withAlpha } from '@/constants/colors';
import { PracticeScreenShell } from '@/modules/practices/components/PracticeScreenShell';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView } from 'react-native';

import { FREQUENCY_BANDS, MOODS, type MoodMeta } from '../data/sound-studio';
import { useSoundscapeHome } from '../hooks/useSoundscapeHome';

export default function CuratedSoundscapesHome() {
  const router = useRouter();
  const { groupedByMood, isLoading, error } = useSoundscapeHome();

  return (
    <PracticeScreenShell wordmark="Sound Studio" scrollContentClassName="pb-16">
      <View className="mb-6 mt-4">
        <Text size="xs" treatment="caption" tone="secondary">
          Curated Soundscapes
        </Text>
        <GradientText className="mt-3 text-[32px] font-extrabold leading-none">
          {'What do you\nneed right now?'}
        </GradientText>
        <Text size="md" tone="body" className="mt-3 leading-relaxed">
          A library of carefully tuned soundscapes — pick the mood and we’ll do
          the rest.
        </Text>
      </View>

      {error ? (
        <Card variant="toned" tone="pink" size="md" className="mb-4">
          <Text size="sm" weight="semibold">
            Couldn’t reach the soundscape library
          </Text>
          <Text size="sm" tone="secondary" className="mt-1">
            {error.message}
          </Text>
        </Card>
      ) : null}

      <View className="gap-4">
        {MOODS.map((mood) => {
          const tracks =
            groupedByMood.find((g) => g.mood === mood.id)?.soundscapes ?? [];
          const sampleCount = isLoading ? null : tracks.length;
          return (
            <MoodTile
              key={mood.id}
              mood={mood}
              sampleCount={sampleCount}
              onPress={() =>
                router.push(`/sound-studio/curated/mood/${mood.slug}`)
              }
            />
          );
        })}
      </View>

      <View className="mt-10 mb-3">
        <Text size="xs" treatment="caption" tone="secondary">
          Neural Frequencies
        </Text>
        <Text size="h3" weight="semibold" className="mt-2">
          The science underneath
        </Text>
        <Text size="sm" tone="body" className="mt-2 leading-relaxed">
          Tap a band to explore the soundscapes tuned to that brainwave state.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 4,
          paddingVertical: 24,
          gap: 12,
        }}
      >
        {FREQUENCY_BANDS.map((band) => (
          <FrequencyEducationCard
            key={band.id}
            band={band}
            onPress={() =>
              router.push(`/sound-studio/curated/frequency/${band.id}`)
            }
          />
        ))}
      </ScrollView>

      {isLoading ? (
        <View className="mt-10 gap-2">
          <Skeleton height={20} width="60%" />
          <Skeleton height={120} />
          <Skeleton height={120} />
        </View>
      ) : null}
    </PracticeScreenShell>
  );
}

type MoodTileProps = {
  mood: MoodMeta;
  sampleCount: number | null;
  onPress: () => void;
};

function MoodTile({ mood, sampleCount, onPress }: MoodTileProps) {
  const hasImage = mood.fallbackImage != null;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={mood.label}
      className="active:scale-[0.98]"
    >
      <View
        className="relative aspect-square overflow-hidden rounded-[32px]"
        style={{
          boxShadow: `0px 20px 40px -10px ${withAlpha(colors.primary.pink, 0.18)}`,
        }}
      >
        {hasImage ? (
          <>
            <Image
              source={mood.fallbackImage}
              style={{ position: 'absolute', inset: 0 }}
              contentFit="cover"
            />
            <LinearGradient
              colors={[
                'rgba(0,0,0,0.1)',
                'rgba(0,0,0,0.5)',
                'rgba(0,0,0,0.92)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ position: 'absolute', inset: 0 }}
            />
          </>
        ) : (
          <LinearGradient
            colors={[colors.primary.pink, colors.accent.yellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', inset: 0 }}
          />
        )}

        <View className="flex-1 justify-end p-6">
          <View
            className="mb-4 h-12 w-12 items-center justify-center rounded-full border border-foreground/15 bg-foreground/10"
            style={{
              boxShadow: `0 0 12px ${withAlpha(colors.primary.pink, 0.5)}`,
            }}
          >
            <MaterialIcons name={mood.icon} size={24} color="white" />
          </View>

          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            className="text-white/80"
          >
            {sampleCount == null ? 'Loading…' : `${sampleCount} soundscapes`}
          </Text>
          <Text
            size="h2"
            tone="inverse"
            weight="extrabold"
            className="mt-1 uppercase leading-tight"
          >
            {mood.label}
          </Text>
          <Text size="sm" tone="inverse" className="mt-2 leading-snug">
            {mood.description}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

type FrequencyEducationCardProps = {
  band: (typeof FREQUENCY_BANDS)[number];
  onPress: () => void;
};

function FrequencyEducationCard({
  band,
  onPress,
}: FrequencyEducationCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${band.label} band, ${band.hzRange}`}
      className="active:scale-[0.98]"
    >
      <View
        className="relative h-44 w-[220px] overflow-hidden rounded-[28px]"
        style={{
          boxShadow: `0px 6px 16px ${withAlpha(colors.primary.pink, 0.15)}`,
        }}
      >
        <Image
          source={band.fallbackImage}
          style={{ position: 'absolute', inset: 0 }}
          contentFit="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.45)', 'rgba(0,0,0,0.85)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ position: 'absolute', inset: 0 }}
        />
        <View className="absolute inset-0 p-5">
          <View className="flex-row items-start justify-between">
            <View
              className="h-11 w-11 items-center justify-center rounded-full"
              style={{ backgroundColor: withAlpha('#ffffff', 0.18) }}
            >
              <MaterialIcons name={band.icon} size={20} color="white" />
            </View>
            <View
              className="rounded-full px-2.5 py-1"
              style={{ backgroundColor: withAlpha('#ffffff', 0.2) }}
            >
              <Text
                size="xs"
                treatment="caption"
                weight="bold"
                className="text-white"
              >
                {band.hzRange}
              </Text>
            </View>
          </View>
          <View className="absolute inset-x-5 bottom-5">
            <Text
              size="xs"
              treatment="caption"
              weight="bold"
              className="text-white/80"
            >
              {band.label}
            </Text>
            <Text
              size="h3"
              weight="extrabold"
              className="mt-1 text-white leading-tight"
              numberOfLines={2}
            >
              {band.headline}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

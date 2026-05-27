import emotionSoundStudioImg from '@/assets/images/four-pillars/emotion-sound-studio.jpg';
import { Pressable } from '@/components/themed/Pressable';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { ImageScrim } from '@/components/ui/ImageScrim';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';
import { SectionTitle } from './SectionTitle';

export function MyVibeSection() {
  const router = useRouter();
  return (
    <View className="gap-4">
      <SectionTitle prefix="My" accent="Vibe" />
      <Card variant="raised" size="md">
        <Text size="md" tone="body">
          Choose from curated sound experiences or let AI turn your words,
          reflections, and stories into personalized songs.
        </Text>
      </Card>
      <Pressable
        onPress={() => router.push('/sound-studio')}
        className="overflow-hidden rounded-3xl active:opacity-90"
        accessibilityRole="button"
        accessibilityLabel="Open Sound Studio"
      >
        <View className="relative aspect-video">
          <Image
            source={emotionSoundStudioImg}
            className="h-full w-full"
            resizeMode="cover"
          />
          <ImageScrim direction="bottom" strength={0.85} start={0.3} />
          <View className="absolute bottom-0 left-0 right-0 p-5">
            <Text size="h3" weight="bold" className="text-white">
              SOUND STUDIO
            </Text>
            <Text
              size="xs"
              treatment="caption"
              weight="bold"
              className="mt-1 text-white/80"
            >
              Your story, your rhythm, your sound.
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

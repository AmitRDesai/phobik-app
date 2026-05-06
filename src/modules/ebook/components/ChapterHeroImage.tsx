import { colors } from '@/constants/colors';
import { Image, ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
interface ChapterHeroImageProps {
  source: ImageSource;
  caption?: string;
}

export function ChapterHeroImage({ source, caption }: ChapterHeroImageProps) {
  return (
    <View className="mb-8">
      <View
        className="relative overflow-hidden rounded-2xl border border-foreground/10"
        style={{ aspectRatio: 16 / 9 }}
      >
        <Image
          source={source}
          style={{ position: 'absolute', inset: 0 }}
          contentFit="cover"
        />
        <LinearGradient
          colors={['transparent', colors.background.charcoal]}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 1 }}
          style={{ position: 'absolute', inset: 0 }}
        />
      </View>
      {caption && (
        <Text className="mt-2 text-center text-xs italic text-foreground/40">
          {caption}
        </Text>
      )}
    </View>
  );
}

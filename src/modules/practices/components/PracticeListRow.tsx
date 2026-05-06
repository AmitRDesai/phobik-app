import { colors } from '@/constants/colors';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/themed/Text';
import { Pressable, View } from 'react-native';
const rowShadow = {
  borderRadius: 32,
  boxShadow: [
    {
      offsetX: 0,
      offsetY: 20,
      blurRadius: 40,
      spreadDistance: -10,
      color: `${colors.primary.pink}1A`,
    },
  ],
} as const;

type PracticeListRowProps = {
  image: ImageSource | number;
  title: string;
  meta?: string;
  tags?: string[];
  onPress: () => void;
};

export function PracticeListRow({
  image,
  title,
  meta,
  tags,
  onPress,
}: PracticeListRowProps) {
  return (
    <Pressable onPress={onPress} className="active:scale-[0.98]">
      <View className="rounded-[32px]" style={rowShadow}>
        <View className="relative aspect-square overflow-hidden rounded-[32px]">
          <Image
            source={image}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            contentFit="cover"
          />
          <LinearGradient
            colors={[
              'rgba(0,0,0,0.15)',
              'rgba(0,0,0,0.55)',
              'rgba(0,0,0,0.92)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ position: 'absolute', inset: 0 }}
          />
          <View className="flex-1 justify-end p-7">
            {tags && tags.length > 0 ? (
              <View className="mb-3 flex-row gap-2">
                {tags.map((tag, i) => {
                  const tone =
                    i % 2 === 0
                      ? 'bg-primary-pink/20 text-primary-pink'
                      : 'bg-accent-yellow/20 text-accent-yellow';
                  const [bg, text] = tone.split(' ');
                  return (
                    <View key={tag} className={`rounded-full px-3 py-1 ${bg}`}>
                      <Text
                        className={`text-[10px] font-bold uppercase tracking-widest ${text}`}
                      >
                        {tag}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : null}
            <Text className="text-2xl font-bold leading-tight text-foreground">
              {title}
            </Text>
            {meta ? (
              <Text className="mt-1.5 text-sm text-foreground/70">{meta}</Text>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

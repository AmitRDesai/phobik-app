import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { AccentPill } from '@/components/ui/AccentPill';
import { colors } from '@/constants/colors';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';

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
                {tags.map((tag, i) => (
                  <AccentPill
                    key={tag}
                    variant="tinted"
                    tone={i % 2 === 0 ? 'pink' : 'yellow'}
                    label={tag}
                  />
                ))}
              </View>
            ) : null}
            <Text size="h2" tone="inverse" className="leading-tight">
              {title}
            </Text>
            {meta ? (
              <Text size="sm" tone="inverse" className="mt-1.5 /70">
                {meta}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

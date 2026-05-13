import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Image } from 'expo-image';
import { Pressable } from 'react-native';

interface RhythmFlowCardProps {
  title: string;
  subtitle?: string;
  image: number;
  onPress?: () => void;
}

export function RhythmFlowCard({
  title,
  subtitle,
  image,
  onPress,
}: RhythmFlowCardProps) {
  return (
    <Pressable onPress={onPress} className="h-40 active:scale-[0.98]">
      <View className="flex-1 overflow-hidden rounded-3xl border border-foreground/[0.08]">
        <Image
          source={image}
          contentFit="cover"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
          }}
        />
        <View className="flex-1 justify-end p-4">
          <Text size="h3" tone="inverse" weight="bold" allowFontScaling={false}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              size="xs"
              tone="inverse"
              weight="bold"
              className="mt-0.5 uppercase tracking-widest /70"
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

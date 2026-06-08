import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { ImageScrim } from '@/components/ui/ImageScrim';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';

import { DAILY_PRACTICES } from '../data/dailyPractices';

export function DailyPracticeList() {
  const router = useRouter();

  return (
    <View className="gap-3">
      {DAILY_PRACTICES.map((practice) => (
        <Card
          key={practice.id}
          variant="raised"
          size="sm"
          onPress={() => router.push(practice.route)}
          accessibilityLabel={`${practice.title}, ${practice.durationLabel} ${practice.category}`}
          className="flex-row items-center gap-3 p-3"
        >
          <View className="relative size-14 overflow-hidden rounded-xl">
            <Image
              source={practice.image}
              resizeMode="cover"
              className="h-full w-full"
              accessibilityIgnoresInvertColors
            />
            <ImageScrim strength={0.4} />
          </View>
          <View className="flex-1 gap-0.5">
            <Text size="md" weight="bold" italic>
              {practice.title}
            </Text>
            <Text size="xs" treatment="caption" tone="secondary">
              {practice.durationLabel} · {practice.category}
            </Text>
          </View>
          <IconChip
            size="md"
            shape="circle"
            onPress={() => router.push(practice.route)}
            accessibilityLabel={`Play ${practice.title}`}
          >
            {(color) => <Ionicons name="play" size={18} color={color} />}
          </IconChip>
        </Card>
      ))}
    </View>
  );
}

import { useRouter } from 'expo-router';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';

import { CourageOptionCard } from '../components/CourageOptionCard';
import { COURAGE_OPTIONS } from '../data/courage-options';

export default function CourageOptions() {
  const router = useRouter();

  const handleOptionPress = (id: string) => {
    if (id === 'micro-challenges') {
      router.push('/practices/micro-challenges');
    } else if (id === 'mystery-challenge') {
      router.push('/practices/mystery-challenge');
    } else if (id === 'specialized-packs') {
      router.push('/practices/specialized-packs');
    } else if (id === 'self-check-ins') {
      router.push('/practices/self-check-ins');
    }
  };

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="Courage Practices" />}
      className="px-4"
    >
      <View className="px-2 pb-2 pt-2">
        <Text
          variant="caption"
          className="mb-1 text-primary-pink"
          style={{ paddingRight: 2.2 }}
        >
          Growth Hub
        </Text>
        <Text variant="h2">Choose your path</Text>
        <Text variant="sm" className="text-foreground/60">
          Every small action builds a stronger you.
        </Text>
      </View>

      <View className="mt-4 gap-4">
        {COURAGE_OPTIONS.map((option) => (
          <CourageOptionCard
            key={option.id}
            option={option}
            onPress={() => handleOptionPress(option.id)}
          />
        ))}
      </View>

      <View className="h-4" />
    </Screen>
  );
}

import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { CourageHeader } from '../components/CourageHeader';
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
    <View className="flex-1 bg-surface">
      <CourageHeader />
      <ScrollView
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-2 pt-2 pb-2">
          <Text className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary-pink">
            Growth Hub
          </Text>
          <Text className="text-2xl font-bold text-foreground">
            Choose your path
          </Text>
          <Text className="text-sm text-foreground/60">
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
      </ScrollView>
    </View>
  );
}

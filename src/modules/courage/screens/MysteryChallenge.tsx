import { useRouter } from 'expo-router';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { GradientText } from '@/components/ui/GradientText';
import { Screen } from '@/components/ui/Screen';

import { MysteryWheel } from '../components/MysteryWheel';
import type { MysteryType } from '../data/mystery-challenges';

export default function MysteryChallenge() {
  const router = useRouter();

  const handleSpinComplete = (type: MysteryType) => {
    router.push(`/practices/mystery-practice?type=${type}`);
  };

  return (
    <Screen
      variant="default"
      scroll
      header={
        <View className="px-6 py-2">
          <BackButton />
          <View className="pb-4 pt-4">
            <GradientText className="text-center text-4xl font-extrabold uppercase">
              {'Daily Mystery\nChallenge'}
            </GradientText>
            <Text variant="sm" className="mt-2 text-center text-foreground/60">
              Get a surprise by tapping the lotus
            </Text>
          </View>
        </View>
      }
      contentClassName="flex-grow items-center"
      className=""
    >
      <View className="my-4">
        <MysteryWheel onSpinComplete={handleSpinComplete} />
      </View>

      <View className="mt-8 pb-12">
        <Text variant="sm" className="text-center italic text-foreground/60">
          Small steps, big transformation.
        </Text>
      </View>
    </Screen>
  );
}

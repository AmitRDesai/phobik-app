import { BackButton } from '@/components/ui/BackButton';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/constants/colors';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

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
            <MaskedView
              maskElement={
                <Text className="text-center text-4xl font-extrabold uppercase tracking-tight">
                  Daily Mystery{'\n'}Challenge
                </Text>
              }
            >
              <LinearGradient
                colors={[colors.primary.pink, colors.accent.yellow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text className="text-center text-4xl font-extrabold uppercase tracking-tight opacity-0">
                  Daily Mystery{'\n'}Challenge
                </Text>
              </LinearGradient>
            </MaskedView>
            <Text className="mt-2 text-center text-sm text-foreground/60">
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
        <Text className="text-center text-sm italic text-foreground/60">
          Small steps, big transformation.
        </Text>
      </View>
    </Screen>
  );
}

import { BackButton } from '@/components/ui/BackButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MysteryWheel } from '../components/MysteryWheel';
import { getRandomMysteryType } from '../data/mystery-challenges';

export default function MysteryChallenge() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLotusPress = () => {
    const type = getRandomMysteryType();
    router.push(`/practices/mystery-practice?type=${type}`);
  };

  return (
    <View className="flex-1">
      <GlowBg
        centerX={0.5}
        centerY={0.3}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        intensity={0.8}
      />

      {/* Fixed header */}
      <View style={{ paddingTop: insets.top + 8 }}>
        <View className="w-full px-6">
          <BackButton />
        </View>

        <View className="px-6 pb-4 pt-4">
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
          <Text className="mt-2 text-center text-sm text-slate-400">
            Get a surprise by tapping the lotus
          </Text>
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerClassName="flex-grow items-center"
        showsVerticalScrollIndicator={false}
      >
        {/* Wheel */}
        <View className="my-4">
          <MysteryWheel onLotusPress={handleLotusPress} />
        </View>

        {/* Bottom motivational text */}
        <View className="mt-8 pb-12">
          <Text className="text-center text-sm italic text-slate-400">
            Small steps, big transformation.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

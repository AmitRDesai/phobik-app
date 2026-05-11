import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BlurView } from '@/components/ui/BlurView';
import { Button } from '@/components/ui/Button';
import { GradientButton } from '@/components/ui/GradientButton';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { OnboardingProgressBar } from '../components/OnboardingProgressBar';

export default function Welcome() {
  return (
    <Screen
      variant="onboarding"
      header={
        <View className="px-6 pt-4">
          <OnboardingProgressBar step={1} />
        </View>
      }
      sticky={
        <View className="items-center">
          <GradientButton
            onPress={() => router.push('/onboarding/life-stressors')}
          >
            Start
          </GradientButton>
          <Button
            variant="ghost"
            onPress={() => router.push('/onboarding/completion?skipped=true')}
            className="mt-2"
          >
            Skip for now
          </Button>
        </View>
      }
      className=""
    >
      <View className="flex-1 items-center justify-center px-8">
        {/* Circle illustration with glow behind */}
        <View className="mb-10 h-[200px] w-[200px] items-center justify-center">
          {/* Warm glow behind */}
          <View
            className="absolute h-[160px] w-[160px] rounded-full"
            style={{
              boxShadow: `0 0 50px ${withAlpha(colors.gradient['warm-orange'], 0.25)}`,
            }}
          />

          {/* Single amber ring with blur */}
          <View
            className="h-[128px] w-[128px] items-center justify-center overflow-hidden rounded-full"
            style={{
              borderWidth: 1.5,
              borderColor: withAlpha('#c8a064', 0.3),
              backgroundColor: withAlpha('#c8a064', 0.15),
            }}
          >
            <BlurView intensity={30} tint="dark" className="absolute inset-0" />
            <MaskedView
              maskElement={
                <MaterialIcons name="graphic-eq" size={60} color="black" />
              }
            >
              <LinearGradient
                colors={[
                  colors.primary.pink,
                  colors.gradient['warm-orange'],
                  colors.accent.yellow,
                ]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={{ width: 60, height: 60 }}
              />
            </MaskedView>
          </View>

          {/* Floating accent dots */}
          <View
            className="absolute items-center justify-center"
            style={{ right: 14, top: 16 }}
          >
            <View
              className="absolute h-[32px] w-[32px] rounded-full"
              style={{ backgroundColor: `${colors.accent.yellow}25` }}
            />
            <View
              className="absolute h-[20px] w-[20px] rounded-full"
              style={{ backgroundColor: `${colors.accent.yellow}50` }}
            />
            <View
              className="h-[10px] w-[10px] rounded-full"
              style={{ backgroundColor: colors.accent.yellow }}
            />
          </View>
          <View
            className="absolute h-[8px] w-[8px] rounded-full"
            style={{
              backgroundColor: colors.primary.pink,
              left: 18,
              bottom: 42,
              boxShadow: `0 0 6px ${colors.primary.pink}`,
            }}
          />
        </View>

        {/* Title */}
        <Text size="display" align="center" className="tracking-tight">
          Let&apos;s get to know{'\n'}your nervous system
        </Text>
        <Text size="lg" tone="secondary" align="center" className="mt-4">
          Phobik works best when it understands your unique stressors.
          We&apos;ll help you find your balance.
        </Text>
      </View>
    </Screen>
  );
}

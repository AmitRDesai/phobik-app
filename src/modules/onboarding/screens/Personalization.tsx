import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BlurView } from '@/components/ui/BlurView';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function Personalization() {
  return (
    <Screen
      transparent
      insetTop={false}
      sticky={
        <Button onPress={() => router.push('/onboarding/goals')} fullWidth>
          Continue
        </Button>
      }
      className="px-screen-x"
    >
      <View className="flex-1 items-center justify-center">
        <View className="mb-10 size-[200px] items-center justify-center">
          <View
            className="absolute size-[160px] rounded-full"
            style={{
              boxShadow: `0 0 50px ${withAlpha(colors.accent.orange, 0.25)}`,
            }}
          />
          <View
            className="size-[128px] items-center justify-center overflow-hidden rounded-full"
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
                  colors.accent.orange,
                  colors.accent.yellow,
                ]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={{ width: 60, height: 60 }}
              />
            </MaskedView>
          </View>
          <View
            className="absolute items-center justify-center"
            style={{ right: 14, top: 16 }}
          >
            <View
              className="absolute size-[20px] rounded-full"
              style={{ backgroundColor: `${colors.accent.yellow}50` }}
            />
            <View
              className="size-[10px] rounded-full"
              style={{ backgroundColor: colors.accent.yellow }}
            />
          </View>
          <View
            className="absolute size-[8px] rounded-full"
            style={{
              backgroundColor: colors.primary.pink,
              left: 18,
              bottom: 42,
              boxShadow: `0 0 6px ${colors.primary.pink}`,
            }}
          />
        </View>

        <Text size="display" align="center" className="tracking-tight">
          Let&apos;s make this personal
        </Text>
        <Text size="lg" tone="secondary" align="center" className="mt-4">
          Tell us a little about your goals, habits, and daily rhythm so we can
          personalize your experience.
        </Text>
      </View>
    </Screen>
  );
}

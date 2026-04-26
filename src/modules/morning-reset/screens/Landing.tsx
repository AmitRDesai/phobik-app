import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MorningResetHeader } from '../components/MorningResetHeader';
import {
  useActiveMorningResetSession,
  useUpdateMorningResetSession,
} from '../hooks/useMorningResetSession';

const HABITS = [
  { dot: 'pink', text: 'Wake → get natural light' },
  { dot: 'yellow', text: '2-3 min just breathe' },
  { dot: 'pink', text: '2-3 min journaling' },
  { dot: 'yellow', text: '5-10 min movement' },
  { dot: 'pink', text: '1-3 min cold shower' },
  { dot: 'yellow', text: 'Breakfast within 60-90 mins' },
  { dot: 'pink', text: 'Deep focus for 60-120 mins after breakfast' },
] as const;

export default function Landing() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, isLoading } = useActiveMorningResetSession();
  const updateSession = useUpdateMorningResetSession();

  if (isLoading || !session) return <LoadingScreen />;

  const handleBegin = async () => {
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'light_exposure',
    });
    router.push('/morning-reset/light-exposure');
  };

  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-charcoal"
        centerY={0.25}
        intensity={0.7}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />

      <MorningResetHeader showClose={false} />

      <ScrollFade fadeColor={colors.background.charcoal}>
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: FADE_HEIGHT + 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-10 mt-4 items-center">
            <Text className="mb-2 text-center text-3xl font-black leading-tight tracking-tight text-white">
              Your
            </Text>
            <MaskedView
              maskElement={
                <Text className="text-center text-5xl font-black leading-[1.05] tracking-tight">
                  Morning Reset
                </Text>
              }
            >
              <LinearGradient
                colors={[colors.primary.pink, colors.accent.yellow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text className="text-center text-5xl font-black leading-[1.05] tracking-tight opacity-0">
                  Morning Reset
                </Text>
              </LinearGradient>
            </MaskedView>
            <Text className="mt-6 px-2 text-center text-base leading-6 text-white/60">
              Your brain is both at its most sensitive and its most powerful in
              the first hours of your day.
            </Text>
          </View>

          <View className="mb-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <View className="mb-5 flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <MaterialIcons
                  name="auto-awesome"
                  size={20}
                  color={colors.accent.yellow}
                />
              </View>
              <Text className="text-2xl font-bold text-white">
                Your Morning Flow
              </Text>
            </View>
            <View className="gap-3">
              {HABITS.map((habit, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                >
                  <View
                    className={`h-2 w-2 rounded-full ${
                      habit.dot === 'pink'
                        ? 'bg-primary-pink'
                        : 'bg-accent-yellow'
                    }`}
                  />
                  <Text className="flex-1 text-[15px] font-medium text-white">
                    {habit.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </ScrollFade>

      <View
        className="px-6"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <GradientButton onPress={handleBegin} loading={updateSession.isPending}>
          Begin Flow
        </GradientButton>
      </View>
    </View>
  );
}

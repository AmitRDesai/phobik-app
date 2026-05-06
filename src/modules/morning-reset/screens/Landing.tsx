import { GradientButton } from '@/components/ui/GradientButton';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

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
  const scheme = useScheme();
  const { session, isLoading } = useActiveMorningResetSession();
  const updateSession = useUpdateMorningResetSession();

  if (isLoading || !session) return <LoadingScreen />;

  const yellow = accentFor(scheme, 'yellow');

  const handleBegin = async () => {
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'light_exposure',
    });
    router.push('/morning-reset/light-exposure');
  };

  return (
    <Screen
      variant="default"
      scroll
      header={<MorningResetHeader showClose={false} />}
      sticky={
        <GradientButton onPress={handleBegin} loading={updateSession.isPending}>
          Begin Flow
        </GradientButton>
      }
      className="px-6"
    >
      <View className="mb-10 mt-4 items-center">
        <Text className="mb-2 text-center text-3xl font-black leading-tight tracking-tight text-foreground">
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
        <Text className="mt-6 px-2 text-center text-base leading-6 text-foreground/60">
          Your brain is both at its most sensitive and its most powerful in the
          first hours of your day.
        </Text>
      </View>

      <View className="mb-6 rounded-3xl border border-foreground/10 bg-foreground/[0.04] p-6">
        <View className="mb-5 flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-2xl border border-foreground/10 bg-foreground/5">
            <MaterialIcons name="auto-awesome" size={20} color={yellow} />
          </View>
          <Text className="text-2xl font-bold text-foreground">
            Your Morning Flow
          </Text>
        </View>
        <View className="gap-3">
          {HABITS.map((habit, idx) => (
            <View
              key={idx}
              className="flex-row items-center gap-3 rounded-2xl border border-foreground/5 bg-foreground/[0.03] p-4"
            >
              <View
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor:
                    habit.dot === 'pink' ? colors.primary.pink : yellow,
                }}
              />
              <Text className="flex-1 text-[15px] font-medium text-foreground">
                {habit.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

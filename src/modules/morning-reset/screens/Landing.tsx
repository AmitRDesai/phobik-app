import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import {
  useActiveMorningResetSession,
  useUpdateMorningResetSession,
} from '../hooks/useMorningResetSession';

type HabitIcon = React.ComponentProps<typeof MaterialIcons>['name'];

const HABITS: { icon: HabitIcon; title: string; duration: string }[] = [
  { icon: 'wb-sunny', title: 'Get natural light', duration: 'First thing' },
  { icon: 'air', title: 'Just breathe', duration: '2–3 min' },
  { icon: 'edit-note', title: 'Journaling', duration: '2–3 min' },
  { icon: 'directions-run', title: 'Movement', duration: '5–10 min' },
  { icon: 'ac-unit', title: 'Cold shower', duration: '1–3 min' },
  { icon: 'restaurant', title: 'Breakfast', duration: 'Within 60–90 min' },
  { icon: 'psychology', title: 'Deep focus', duration: '60–120 min' },
];

export default function Landing() {
  const router = useRouter();
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
    <Screen
      scroll
      insetTop={false}
      header={
        <Header
          left={<BackButton />}
          center={
            <Text size="lg" weight="bold">
              Morning Flow
            </Text>
          }
        />
      }
      sticky={
        <View className="w-full items-center">
          <Button
            onPress={handleBegin}
            loading={updateSession.isPending}
            fullWidth
          >
            Begin Flow
          </Button>
        </View>
      }
      className="px-6"
    >
      <View className="mb-10 mt-4 items-center">
        <Text
          size="h1"
          align="center"
          weight="black"
          className="mb-2 leading-tight"
        >
          Your
        </Text>
        <GradientText className="text-center text-5xl font-black leading-[1.2]">
          Morning Reset
        </GradientText>
        <Text
          size="lg"
          tone="secondary"
          align="center"
          className="mt-6 px-2 leading-6"
        >
          Your brain is both at its most sensitive and its most powerful in the
          first hours of your day.
        </Text>
      </View>

      <Card variant="raised" size="lg" className="mb-6">
        <Text
          size="xs"
          treatment="caption"
          tone="secondary"
          weight="bold"
          className="mb-5 tracking-[0.25em]"
          style={{ paddingRight: 2.75 }}
        >
          Your Morning Flow
        </Text>
        <View className="gap-1">
          {HABITS.map((habit, idx) => (
            <View
              key={idx}
              className="flex-row items-center gap-4 rounded-xl py-2.5"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full border border-primary-pink/25 bg-primary-pink/10">
                <MaterialIcons
                  name={habit.icon}
                  size={18}
                  color={colors.primary.pink}
                />
              </View>
              <View className="flex-1">
                <Text size="md" weight="semibold">
                  {habit.title}
                </Text>
                <Text size="sm" tone="secondary" className="mt-0.5">
                  {habit.duration}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

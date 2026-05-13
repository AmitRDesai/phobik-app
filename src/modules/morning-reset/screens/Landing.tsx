import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/constants/colors';
import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { MaterialIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  STEP_ROUTES,
  buildStepPath,
  isTodayLocal,
} from '../data/flow-navigation';
import type { FlowStep } from '../data/types';
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

// Map a FlowStep to the nested Stack's route name (file basename).
function toRouteName(step: FlowStep): string {
  if (step === 'landing') return 'index';
  return STEP_ROUTES[step].replace(/^\/morning-reset\//, '');
}

export default function Landing() {
  const router = useRouter();
  const navigation = useNavigation();
  const userId = useUserId();
  const { session, isLoading } = useActiveMorningResetSession();
  const updateSession = useUpdateMorningResetSession();
  // State (not ref) so the render-time `showLoading` check reflects the
  // post-handled state — a ref would keep `isResumingPastLanding` true
  // forever (session.currentStep is never reset on back-nav), leaving
  // Landing stuck on the spinner when the user pops back to it.
  const [handled, setHandled] = useState(false);

  // Single mount-time handler: seed a fresh session if needed, OR
  // atomically rebuild the back-stack for a resumable same-day session.
  useEffect(() => {
    if (handled || isLoading || !userId) return;

    // Flip `handled` once up front; each branch below performs its
    // own side-effect without re-touching React state.
    setHandled(true);

    const hasResumable = !!session && isTodayLocal(session.startedAt);
    const isPastLanding = hasResumable && session!.currentStep !== 'landing';

    if (isPastLanding) {
      const path = buildStepPath(session!.currentStep);
      // Preserve Landing's existing key in the reset so React Navigation
      // doesn't remount this component — a remount resets `handled` and
      // the effect re-fires the reset, looping forever.
      const landingKey = navigation
        .getState()
        ?.routes.find((r) => r.name === 'index')?.key;
      const routes = path.map((step, i) => ({
        name: toRouteName(step),
        key: i === 0 ? landingKey : undefined,
      }));
      navigation.dispatch(
        CommonActions.reset({
          index: routes.length - 1,
          routes,
        }),
      );
      return;
    }

    if (hasResumable) {
      // Active today's session already pinned to landing — nothing to
      // do beyond marking the mount handled.
      return;
    }

    // Fresh start — abandon any stale row and seed a new one.
    (async () => {
      if (session) {
        await db
          .updateTable('morning_reset_session')
          .set({ status: 'abandoned', updated_at: new Date().toISOString() })
          .where('id', '=', session.id)
          .execute();
      }
      const id = uuid();
      const now = new Date().toISOString();
      await db
        .insertInto('morning_reset_session')
        .values({
          id,
          user_id: userId,
          status: 'in_progress',
          current_step: 'landing',
          started_at: now,
          created_at: now,
          updated_at: now,
        })
        .execute();
    })();
  }, [handled, isLoading, session, userId, navigation]);

  // Wait for the session bootstrap before showing the intro. Resume
  // case also stays in loading so the dispatch fires under cover —
  // both flows use Screen's `loading` prop so the variant bg is
  // continuous with the rest of the flow.
  //
  // `isResumingPastLanding` is gated by `!handled`: once the mount-time
  // dispatch has fired, subsequent re-renders of Landing (e.g. when the
  // user pops back to it from a step) should NOT show the spinner —
  // session.currentStep is never reset on back-nav, so without this
  // gate Landing would be permanently stuck on the loader.
  const hasResumable = !!session && isTodayLocal(session.startedAt);
  const isResumingPastLanding =
    hasResumable && session!.currentStep !== 'landing' && !handled;
  const showLoading = isLoading || !session || isResumingPastLanding;

  const handleBegin = async () => {
    if (!session) return;
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'light_exposure',
    });
    router.push('/morning-reset/light-exposure');
  };

  return (
    <Screen
      loading={showLoading}
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

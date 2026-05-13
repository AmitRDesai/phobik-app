import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';

import { PlayerOrb } from '../components/PlayerOrb';
import { getSupportOption } from '../data/supportOptions';
import type { FlowStep } from '../data/types';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

const BREATH_CUES = ['Inhale', 'Hold', 'Exhale', 'Rest'] as const;
const TOTAL_SECONDS = 12 * 60;

function formatTime(seconds: number) {
  const remaining = Math.max(0, TOTAL_SECONDS - seconds);
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function Player() {
  const router = useRouter();
  const scheme = useScheme();
  const transportIcon = foregroundFor(scheme, 0.5);
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [breathIndex, setBreathIndex] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const breathTimer = setInterval(() => {
      setBreathIndex((i) => (i + 1) % BREATH_CUES.length);
    }, 3500);
    const elapsedTimer = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => {
      clearInterval(breathTimer);
      clearInterval(elapsedTimer);
    };
  }, [playing]);

  const showLoading = isLoading || !session;

  const option = session?.supportOption
    ? getSupportOption(session.supportOption)
    : undefined;
  const progress = Math.min(1, elapsed / TOTAL_SECONDS);

  const handleContinue = async () => {
    if (!session) return;
    let next: FlowStep = 'reflection';
    let route = '/daily-flow/reflection';
    if (session.addOns?.bilateral) {
      next = 'bi_lateral_tutorial';
      route = '/daily-flow/bi-lateral-tutorial';
    } else if (session.addOns?.eft) {
      next = 'eft_guide';
      route = '/daily-flow/eft-guide';
    }
    await updateSession.mutateAsync({ id: session.id, currentStep: next });
    router.push(route as never);
  };

  return (
    <Screen loading={showLoading} transparent insetTop={false} className="">
      <View className="flex-1 items-center justify-center px-6">
        <PlayerOrb cue={BREATH_CUES[breathIndex] ?? 'Inhale'} />

        {session?.intention ? (
          <Text
            size="h2"
            align="center"
            className="mt-10 px-2 font-light leading-9 text-foreground/60"
          >
            &ldquo;{session.intention}&rdquo;
          </Text>
        ) : null}
      </View>

      <View className="gap-8 px-8 pb-10">
        <View className="h-[2px] w-full overflow-hidden rounded-full bg-foreground/10">
          <ProgressBar progress={progress} gradient />
        </View>

        <View className="flex-row items-center justify-between px-2">
          <Pressable className="p-2">
            <MaterialIcons name="fast-rewind" size={28} color={transportIcon} />
          </Pressable>

          <Pressable
            onPress={() => setPlaying((p) => !p)}
            style={{
              borderRadius: 32,
              boxShadow: `0 0 24px ${withAlpha(colors.primary.pink, 0.5)}`,
            }}
          >
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons
                name={playing ? 'pause' : 'play-arrow'}
                size={32}
                color={colors.background.charcoal}
              />
            </LinearGradient>
          </Pressable>

          <Pressable onPress={handleContinue} className="p-2">
            <MaterialIcons
              name="fast-forward"
              size={28}
              color={transportIcon}
            />
          </Pressable>
        </View>

        <Text
          size="xs"
          treatment="caption"
          align="center"
          weight="bold"
          className="tracking-[0.3em] text-foreground/45"
          style={{ paddingRight: 3.3 }}
        >
          Ritual: {option?.title ?? 'Session'} · {formatTime(elapsed)} left
        </Text>
      </View>
    </Screen>
  );
}

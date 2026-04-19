import { GlowBg } from '@/components/ui/GlowBg';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { DailyFlowHeader } from '../components/DailyFlowHeader';
import { DailyFlowProgressBar } from '../components/DailyFlowProgressBar';
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

  if (isLoading || !session) return <LoadingScreen />;

  const option = session.supportOption
    ? getSupportOption(session.supportOption)
    : undefined;
  const progress = Math.min(1, elapsed / TOTAL_SECONDS);

  const handleContinue = async () => {
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
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-charcoal"
        centerY={0.38}
        intensity={0.6}
        startColor={colors.primary.pink}
        endColor={colors.accent.purple}
      />
      <DailyFlowHeader wordmark />

      <View className="flex-1 items-center justify-center px-6">
        <PlayerOrb cue={BREATH_CUES[breathIndex] ?? 'Inhale'} />

        {session.intention ? (
          <Text className="mt-10 px-2 text-center text-2xl font-light italic leading-9 tracking-tight text-white/60">
            &ldquo;{session.intention}&rdquo;
          </Text>
        ) : null}
      </View>

      <View className="gap-8 px-8 pb-10">
        <View className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <DailyFlowProgressBar progress={progress} />
        </View>

        <View className="flex-row items-center justify-between px-2">
          <Pressable className="p-2">
            <MaterialIcons
              name="fast-rewind"
              size={28}
              color="rgba(255,255,255,0.5)"
            />
          </Pressable>

          <Pressable
            onPress={() => setPlaying((p) => !p)}
            style={{
              shadowColor: colors.primary.pink,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 24,
              elevation: 10,
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
              color="rgba(255,255,255,0.5)"
            />
          </Pressable>
        </View>

        <Text className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white/45">
          Ritual: {option?.title ?? 'Session'} · {formatTime(elapsed)} left
        </Text>
      </View>
    </View>
  );
}

import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AudioVisualizer } from '../components/AudioVisualizer';
import { HeartRateBadge } from '../components/HeartRateBadge';
import { ProgressRing } from '../components/ProgressRing';

interface SessionStep {
  count: number;
  sense: string;
  instruction: string;
  subInstruction: string;
  durationSec: number;
}

const STEPS: SessionStep[] = [
  {
    count: 5,
    sense: 'see',
    instruction: 'Now identify **5 things** you can see.',
    subInstruction: 'Look around and notice the details in your environment.',
    durationSec: 30,
  },
  {
    count: 4,
    sense: 'feel',
    instruction: 'Now identify **4 things** you can feel.',
    subInstruction: 'Notice textures and temperatures around you.',
    durationSec: 30,
  },
  {
    count: 3,
    sense: 'hear',
    instruction: 'Now identify **3 things** you can hear.',
    subInstruction: 'Listen closely to the sounds in your environment.',
    durationSec: 25,
  },
  {
    count: 2,
    sense: 'smell',
    instruction: 'Now identify **2 things** you can smell.',
    subInstruction: 'Breathe deeply and notice scents around you.',
    durationSec: 20,
  },
  {
    count: 1,
    sense: 'taste',
    instruction: 'Now identify **1 thing** you can taste.',
    subInstruction: 'Focus on any taste in your mouth right now.',
    durationSec: 15,
  },
];

const TOTAL_DURATION = STEPS.reduce((sum, s) => sum + s.durationSec, 0);

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function parseInstruction(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/);
  return parts.map((part, i) =>
    i % 2 === 1
      ? { text: part, gradient: true }
      : { text: part, gradient: false },
  );
}

export default function GroundingSession() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_DURATION);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep = STEPS[currentStepIndex];
  const elapsedInTotal = TOTAL_DURATION - timeRemaining;
  const progress = elapsedInTotal / TOTAL_DURATION;

  const handleComplete = useCallback(() => {
    router.replace('/practices/completion');
  }, [router]);

  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, handleComplete]);

  // Advance step based on elapsed time
  useEffect(() => {
    let accumulated = 0;
    for (let i = 0; i < STEPS.length; i++) {
      accumulated += STEPS[i].durationSec;
      if (elapsedInTotal < accumulated) {
        setCurrentStepIndex(i);
        return;
      }
    }
    setCurrentStepIndex(STEPS.length - 1);
  }, [elapsedInTotal]);

  const instructionParts = parseInstruction(currentStep.instruction);

  return (
    <Container safeAreaClass="bg-black">
      <View className="flex-1 bg-black">
        <GlowBg
          bgClassName="bg-black"
          centerX={0.5}
          centerY={0.5}
          intensity={1}
          radius={0.5}
          startColor={colors.primary.pink}
          endColor={colors.accent.yellow}
        />

        {/* Header */}
        <View className="z-10 flex-row items-center justify-between p-4 pb-2">
          <Pressable
            onPress={() => router.back()}
            className="h-12 w-12 items-center justify-start active:opacity-70"
          >
            <MaterialIcons
              name="close"
              size={24}
              color="white"
              style={{ marginTop: 10 }}
            />
          </Pressable>
          <Text className="flex-1 text-center text-lg font-bold leading-tight tracking-tight text-white">
            5-4-3-2-1 Session
          </Text>
          <View className="w-12 items-end">
            <HeartRateBadge />
          </View>
        </View>

        {/* Main content */}
        <View className="z-10 flex-1 items-center justify-center p-6">
          {/* Progress ring with center number */}
          <View className="relative mb-12 items-center justify-center">
            <ProgressRing progress={progress} />
            <View className="absolute items-center justify-center">
              <MaskedView
                maskElement={
                  <Text className="text-8xl font-bold leading-none tracking-tighter">
                    {currentStep.count}
                  </Text>
                }
              >
                <LinearGradient
                  colors={[colors.primary.pink, colors.accent.yellow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text className="text-8xl font-bold leading-none tracking-tighter opacity-0">
                    {currentStep.count}
                  </Text>
                </LinearGradient>
              </MaskedView>
              <View className="mt-4">
                <AudioVisualizer />
              </View>
            </View>
          </View>

          {/* Instruction text — fixed height to prevent layout shifts */}
          <View
            className="max-w-[280px] items-center gap-4"
            style={{ minHeight: 120 }}
          >
            <Text className="text-center text-2xl font-bold text-white">
              {instructionParts.map((part, i) =>
                part.gradient ? (
                  <MaskedView
                    key={i}
                    maskElement={
                      <Text className="text-2xl leading-loose font-bold">
                        {part.text}
                      </Text>
                    }
                  >
                    <LinearGradient
                      colors={[colors.primary.pink, colors.accent.yellow]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text className="text-2xl font-bold opacity-0">
                        {part.text}
                      </Text>
                    </LinearGradient>
                  </MaskedView>
                ) : (
                  <Text key={i}>{part.text}</Text>
                ),
              )}
            </Text>
            <Text className="text-center text-base leading-relaxed text-white/60">
              {currentStep.subInstruction}
            </Text>
          </View>
        </View>

        {/* Timer */}
        <View className="z-10 items-center gap-2 px-6 py-4">
          <Text className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Time Remaining
          </Text>
          <Text
            className="text-xl font-medium text-white"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formatTime(timeRemaining)}
          </Text>
        </View>

        {/* Pause button */}
        <View className="z-10 px-6 pb-6">
          <Pressable
            onPress={() => setIsPaused((p) => !p)}
            className="w-full items-center rounded-xl border border-white/[0.08] bg-white/[0.03] py-4 active:opacity-70"
          >
            <Text className="text-sm font-medium text-white/70">
              {isPaused ? 'Resume Session' : 'Pause Session'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Container>
  );
}

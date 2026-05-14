import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { PlaybackControls } from '@/components/ui/PlaybackControls';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Screen } from '@/components/ui/Screen';
import { useStreamedAudioPlayer } from '@/lib/audio/useStreamedAudioPlayer';
import { useKeepAwake } from 'expo-keep-awake';
import { useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';

import { AudioVisualizer } from '@/modules/practices/components/AudioVisualizer';
import { HeartRateBadge } from '../components/HeartRateBadge';
import { useSaveOnLeave } from '@/modules/practices/hooks/useSaveOnLeave';
import { formatTime } from '@/modules/practices/lib/format';
import { groundingSessionAtom } from '../store/grounding';

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
    durationSec: 24,
  },
  {
    count: 4,
    sense: 'feel',
    instruction: 'Now identify **4 things** you can feel.',
    subInstruction: 'Notice textures and temperatures around you.',
    durationSec: 24,
  },
  {
    count: 3,
    sense: 'hear',
    instruction: 'Now identify **3 things** you can hear.',
    subInstruction: 'Listen closely to the sounds in your environment.',
    durationSec: 24,
  },
  {
    count: 2,
    sense: 'smell',
    instruction: 'Now identify **2 things** you can smell.',
    subInstruction: 'Breathe deeply and notice scents around you.',
    durationSec: 24,
  },
  {
    count: 1,
    sense: 'taste',
    instruction: 'Now identify **1 thing** you can taste.',
    subInstruction: 'Focus on any taste in your mouth right now.',
    durationSec: 24,
  },
];

const TOTAL_DURATION = STEPS.reduce((sum, s) => sum + s.durationSec, 0);

const AUDIO_KEYS: Record<number, string> = {
  5: 'grounding-5',
  4: 'grounding-4',
  3: 'grounding-3',
  2: 'grounding-2',
  1: 'grounding-1',
};

function parseInstruction(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/);
  return parts.map((part, i) =>
    i % 2 === 1
      ? { text: part, gradient: true }
      : { text: part, gradient: false },
  );
}

export default function GroundingSession() {
  useKeepAwake();
  const router = useRouter();
  const savedState = useAtomValue(groundingSessionAtom);

  const [timeRemaining, setTimeRemaining] = useState(
    () => savedState?.timeRemaining ?? TOTAL_DURATION,
  );
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const elapsedInTotal = TOTAL_DURATION - timeRemaining;
  const progress = elapsedInTotal / TOTAL_DURATION;

  // Derive current step from elapsed time so we never `setState` in an effect
  const currentStepIndex = useMemo(() => {
    let accumulated = 0;
    for (let i = 0; i < STEPS.length; i++) {
      accumulated += STEPS[i].durationSec;
      if (elapsedInTotal < accumulated) return i;
    }
    return STEPS.length - 1;
  }, [elapsedInTotal]);
  const currentStep = STEPS[currentStepIndex];

  // Audio player — source resolves async per current step (cached on disk).
  // 100ms status updates keep the visualizer smooth.
  const { player, status, isReady } = useStreamedAudioPlayer(
    AUDIO_KEYS[currentStep.count],
    { volume: isMuted ? 0 : 1, player: { updateInterval: 100 } },
  );

  // Generate visualizer levels from audio playback position
  const audioLevels = useMemo(() => {
    if (!status.playing || isMuted) return null;
    const t = status.currentTime;
    return Array.from({ length: 6 }, (_, i) => {
      const v = Math.abs(Math.sin(t * (3 + i * 1.7) + i * 2.1));
      return v * 0.6 + 0.15;
    });
  }, [status.playing, status.currentTime, isMuted]);

  // Start playback once the current step's audio is ready.
  // `useStreamedAudioPlayer` swaps the player's source automatically when
  // `currentStep.count` changes, so we just respond to ready+pause state.
  useEffect(() => {
    if (!isReady) return;
    if (isPaused) {
      player.pause();
    } else {
      player.play();
    }
  }, [isReady, isPaused, player, currentStep.count]);

  const handleRestart = () => {
    setTimeRemaining(TOTAL_DURATION);
    setIsPaused(false);
    // currentStepIndex is derived from elapsedInTotal, so resetting time
    // resets the step. Source swaps automatically when currentStep.count
    // changes; the ready/pause effect above will resume playback.
  };

  // Save state on back navigation
  const setGroundingSession = useSetAtom(groundingSessionAtom);
  useSaveOnLeave({
    save: () => setGroundingSession({ currentStepIndex, timeRemaining }),
    canSave: timeRemaining > 0,
  });

  // Navigate to completion when timer reaches zero
  useEffect(() => {
    if (timeRemaining === 0) {
      setGroundingSession(null);
      router.replace({
        pathname: '/practices/completion',
        params: { practiceType: 'grounding', durationSeconds: '120' },
      });
    }
  }, [timeRemaining, setGroundingSession, router]);

  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  const instructionParts = parseInstruction(currentStep.instruction);

  return (
    <Screen
      header={
        <Header
          left={<BackButton icon="close" />}
          center={
            <Text size="lg" weight="bold">
              5-4-3-2-1 Session
            </Text>
          }
          right={<HeartRateBadge />}
        />
      }
      className="flex-1"
    >
      {/* Main content */}
      <View className="flex-1 items-center justify-center p-6">
        {/* Progress ring with center number */}
        <View className="relative mb-12 items-center justify-center">
          <ProgressRing progress={progress} gradient />
          <View className="absolute items-center justify-center">
            <GradientText className="text-8xl font-bold leading-none">
              {String(currentStep.count)}
            </GradientText>
            <View className="mt-4">
              <AudioVisualizer
                levels={audioLevels}
                isPlaying={status.playing && !isMuted}
              />
            </View>
          </View>
        </View>

        {/* Instruction text — fixed height to prevent layout shifts */}
        <View
          className="max-w-[280px] items-center gap-4"
          style={{ minHeight: 120 }}
        >
          <View className="flex-row flex-wrap items-center justify-center">
            {instructionParts.map((part, i) =>
              part.gradient ? (
                <GradientText
                  key={i}
                  className="text-2xl font-bold leading-tight"
                >
                  {part.text}
                </GradientText>
              ) : (
                <Text
                  key={i}
                  size="h2"
                  align="center"
                  className="leading-tight"
                >
                  {part.text}
                </Text>
              ),
            )}
          </View>
          <Text
            size="lg"
            tone="secondary"
            align="center"
            className="leading-relaxed"
          >
            {currentStep.subInstruction}
          </Text>
        </View>
      </View>

      {/* Timer */}
      <View className="items-center gap-2 px-6 py-4">
        <Text size="xs" treatment="caption" className="text-foreground/40">
          Time Remaining
        </Text>
        <Text
          size="lg"
          weight="medium"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {formatTime(timeRemaining)}
        </Text>
      </View>

      <PlaybackControls
        className="mb-8 justify-center gap-8"
        size="sm"
        isPaused={isPaused}
        onPauseToggle={() => setIsPaused((p) => !p)}
        isMuted={isMuted}
        onMuteToggle={() => setIsMuted((m) => !m)}
        onRestart={handleRestart}
      />
    </Screen>
  );
}

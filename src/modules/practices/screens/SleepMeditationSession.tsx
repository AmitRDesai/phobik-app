import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useKeepAwake } from 'expo-keep-awake';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { useSaveOnLeave } from '../hooks/useSaveOnLeave';
import {
  SleepMeditationDuration,
  sleepMeditationSessionAtom,
} from '../store/sleep-meditation';
import { formatTime } from '../utils/format';

// ── Audio files ──────────────────────────────────────────────────────────────

const AUDIO_FILES: Record<SleepMeditationDuration, number> = {
  full: require('@/assets/audio/practices/sleep-meditation/sleep-meditation-1.m4a'),
  '15min': require('@/assets/audio/practices/sleep-meditation/sleep-meditation-1-15min.m4a'),
  '30min': require('@/assets/audio/practices/sleep-meditation/sleep-meditation-1-30min.m4a'),
  '45min': require('@/assets/audio/practices/sleep-meditation/sleep-meditation-1-45min.m4a'),
};

const DURATION_LABELS: { key: SleepMeditationDuration; label: string }[] = [
  { key: 'full', label: 'Full' },
  { key: '15min', label: '15 Min' },
  { key: '30min', label: '30 Min' },
  { key: '45min', label: '45 Min' },
];

// ── Pulsing Aura Circle ─────────────────────────────────────────────────────

const SLEEP_MEDITATION_IMAGE = require('@/assets/images/practices/sleep-meditation.jpg');

function PulsingAura({ isPlaying }: { isPlaying: boolean }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    if (isPlaying) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.12, {
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        -1,
        false,
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.6, {
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.3, {
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        -1,
        false,
      );
    } else {
      scale.value = withTiming(1, { duration: 500 });
      opacity.value = withTiming(0.4, { duration: 500 });
    }
  }, [isPlaying]);

  const auraStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const AURA_SIZE = 300;

  return (
    <View
      className="items-center justify-center"
      style={{ width: AURA_SIZE, height: AURA_SIZE }}
    >
      {/* Radial gradient aura: pink center → yellow 60% → transparent */}
      <Animated.View
        className="absolute"
        style={[{ width: AURA_SIZE, height: AURA_SIZE }, auraStyle]}
      >
        <Svg width={AURA_SIZE} height={AURA_SIZE}>
          <Defs>
            <RadialGradient id="breathAura" cx="50%" cy="50%" r="50%">
              <Stop
                offset="0%"
                stopColor={colors.primary['pink-light']}
                stopOpacity="0.4"
              />
              <Stop
                offset="60%"
                stopColor={colors.accent.yellow}
                stopOpacity="0.15"
              />
              <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect
            x={0}
            y={0}
            width={AURA_SIZE}
            height={AURA_SIZE}
            fill="url(#breathAura)"
          />
        </Svg>
      </Animated.View>
      {/* Yellow ring around the image */}
      <View className="items-center justify-center rounded-full bg-accent-yellow/[0.06] p-6">
        {/* Center circle with image */}
        <Image
          source={SLEEP_MEDITATION_IMAGE}
          className="h-[190px] w-[190px] rounded-full border border-white/10"
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

// ── Main Session Screen ──────────────────────────────────────────────────────

export default function SleepMeditationSession() {
  useKeepAwake();
  const savedState = useAtomValue(sleepMeditationSessionAtom);
  const setSession = useSetAtom(sleepMeditationSessionAtom);

  const initialDuration = savedState?.selectedDuration ?? '15min';
  const initialTime = savedState?.currentTime ?? 0;

  const [selectedDuration, setSelectedDuration] =
    useState<SleepMeditationDuration>(initialDuration);
  const [hasStarted, setHasStarted] = useState(savedState !== null);

  // Audio player
  const player = useAudioPlayer(AUDIO_FILES[selectedDuration]);
  const status = useAudioPlayerStatus(player);

  // Seek to saved position on mount if resuming (don't auto-play)
  const didResumeRef = useRef(false);
  useEffect(() => {
    if (savedState && !didResumeRef.current && status.duration > 0) {
      didResumeRef.current = true;
      player.seekTo(initialTime);
    }
  }, [savedState, status.duration, player, initialTime]);

  // Handle duration change (allowed before playing or when paused)
  const handleDurationChange = (duration: SleepMeditationDuration) => {
    if (status.playing) return;
    setSelectedDuration(duration);
    player.replace(AUDIO_FILES[duration]);
    setHasStarted(false);
  };

  // Play/Pause toggle
  const handlePlayPause = () => {
    if (!hasStarted) {
      setHasStarted(true);
      player.play();
      return;
    }
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  // Skip forward/backward 10s
  const handleReplay10 = () => {
    const newTime = Math.max(0, status.currentTime - 10);
    player.seekTo(newTime);
  };

  const handleForward10 = () => {
    if (status.duration > 0) {
      const newTime = Math.min(status.duration, status.currentTime + 10);
      player.seekTo(newTime);
    }
  };

  // Save state on back navigation
  useSaveOnLeave({
    save: () =>
      setSession({ selectedDuration, currentTime: status.currentTime }),
    canSave: hasStarted && status.currentTime > 0 && status.duration > 0,
  });

  // Clear saved state when audio finishes
  useEffect(() => {
    if (
      hasStarted &&
      status.duration > 0 &&
      status.currentTime >= status.duration &&
      !status.playing
    ) {
      setSession(null);
    }
  }, [
    hasStarted,
    status.currentTime,
    status.duration,
    status.playing,
    setSession,
  ]);

  const elapsed = status.currentTime ?? 0;
  const duration = status.duration ?? 0;
  const remaining = Math.max(0, duration - elapsed);
  const progress = duration > 0 ? elapsed / duration : 0;

  return (
    <Container safeAreaClass="bg-background-dark">
      <View className="flex-1 bg-background-dark">
        <GlowBg
          bgClassName="bg-background-dark"
          centerX={0.2}
          centerY={0.3}
          intensity={0.12}
          radius={0.4}
          startColor={colors.primary.pink}
          endColor={colors.accent.yellow}
        />
        <GlowBg
          bgClassName="bg-transparent"
          centerX={0.8}
          centerY={0.7}
          intensity={0.08}
          radius={0.4}
          startColor={colors.accent.yellow}
          endColor={colors.primary.pink}
        />

        {/* Header */}
        <View className="z-20 flex-row items-center justify-between px-4 py-3">
          <BackButton />
          <Text className="text-[13px] font-semibold uppercase tracking-widest text-white/60">
            Sleep & Soundscape
          </Text>
          <View className="h-10 w-10" />
        </View>

        {/* Main content */}
        <View className="z-10 flex-1 items-center justify-center px-6">
          {/* Pulsing aura circle */}
          <PulsingAura isPlaying={status.playing} />

          {/* Title */}
          <View className="mt-8 items-center">
            <Text className="text-center text-3xl font-extrabold leading-tight tracking-tight text-white">
              Guided Sleep Meditation
            </Text>
            <Text className="mt-2 text-sm font-semibold uppercase tracking-widest text-primary-pink/90">
              Deep Rest Journey
            </Text>
          </View>

          {/* Duration selector pills */}
          <View className="mt-8 flex-row gap-3">
            {DURATION_LABELS.map(({ key, label }) => (
              <Pressable
                key={key}
                onPress={() => handleDurationChange(key)}
                disabled={status.playing}
                className={`rounded-full px-5 py-2.5 ${
                  selectedDuration === key
                    ? 'border border-accent-yellow/30 bg-white/10'
                    : 'border border-white/10 bg-white/5'
                } ${status.playing ? 'opacity-40' : ''}`}
              >
                <Text
                  className={`text-xs font-semibold uppercase tracking-widest ${
                    selectedDuration === key
                      ? 'text-accent-yellow'
                      : 'text-white/60'
                  }`}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Progress section */}
        <View className="z-20 px-8 pb-4">
          {/* Time labels */}
          <View className="mb-3 flex-row items-center justify-between">
            <Text
              className="text-[11px] font-bold text-white/30"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatTime(elapsed)}
            </Text>
            <View className="flex-row items-center gap-1.5 rounded-full border border-accent-yellow/20 bg-accent-yellow/10 px-3 py-1">
              <MaterialIcons
                name="timer"
                size={12}
                color={colors.accent.yellow}
              />
              <Text
                className="text-[10px] font-black uppercase tracking-wider text-accent-yellow"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {formatTime(remaining)} Remaining
              </Text>
            </View>
            <Text
              className="text-[11px] font-bold text-white/30"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatTime(duration)}
            </Text>
          </View>

          {/* Progress bar */}
          <View className="h-1 w-full overflow-hidden rounded-full bg-white/5">
            <View
              className="h-full rounded-full"
              style={{
                width: `${progress * 100}%`,
                backgroundColor: colors.accent.yellow,
                boxShadow: [
                  {
                    offsetX: 0,
                    offsetY: 0,
                    blurRadius: 15,
                    color: withAlpha(colors.accent.yellow, 0.4),
                  },
                ],
              }}
            />
          </View>
        </View>

        {/* Playback controls */}
        <View className="z-20 items-center px-8 pb-12 pt-4">
          <View className="w-full max-w-[320px] flex-row items-center justify-between px-4">
            {/* Replay 10s */}
            <Pressable
              onPress={handleReplay10}
              disabled={!hasStarted}
              className="active:scale-110"
              style={{ opacity: hasStarted ? 1 : 0.3 }}
            >
              <MaterialIcons
                name="replay-10"
                size={36}
                color={colors.accent.yellow}
              />
            </Pressable>

            {/* Play/Pause */}
            <Pressable
              onPress={handlePlayPause}
              className="items-center justify-center active:scale-95"
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.accent.yellow,
                boxShadow: [
                  {
                    offsetX: 0,
                    offsetY: 4,
                    blurRadius: 20,
                    color: withAlpha(colors.accent.yellow, 0.25),
                  },
                ],
              }}
            >
              <MaterialIcons
                name={
                  !hasStarted
                    ? 'play-arrow'
                    : status.playing
                      ? 'pause'
                      : 'play-arrow'
                }
                size={48}
                color={colors.background.dark}
              />
            </Pressable>

            {/* Forward 10s */}
            <Pressable
              onPress={handleForward10}
              disabled={!hasStarted}
              className="active:scale-110"
              style={{ opacity: hasStarted ? 1 : 0.3 }}
            >
              <MaterialIcons
                name="forward-10"
                size={36}
                color={colors.accent.yellow}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Container>
  );
}

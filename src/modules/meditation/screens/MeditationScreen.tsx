import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Badge } from '@/components/ui/Badge';
import { BiometricStatCard } from '@/components/ui/BiometricStatCard';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { useScheme } from '@/hooks/useTheme';
import { useStreamedAudioPlayer } from '@/lib/audio/useStreamedAudioPlayer';
import { audioVoiceAtom, type AudioVoice } from '@/lib/audio/voice';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { PracticeStackHeader } from '@/modules/practices/components/PracticeStackHeader';
import { useSaveOnLeave } from '@/modules/practices/hooks/useSaveOnLeave';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useKeepAwake } from 'expo-keep-awake';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';

import { getMeditation } from '../data/meditations';
import { meditationSessionsAtom } from '../store/sessions';

type MeditationScreenProps = {
  meditationId: string;
};

function formatTime(seconds: number): string {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Unified meditation screen — single template for every meditation.
 * Audio playback is driven by `useStreamedAudioPlayer`; meditations without
 * an `audioBaseKey` show a "Coming soon" dialog when the user taps Play.
 */
export function MeditationScreen({ meditationId }: MeditationScreenProps) {
  useKeepAwake();
  const router = useRouter();
  const scheme = useScheme();
  const controlIconColor = foregroundFor(scheme, 0.7);
  const meditation = getMeditation(meditationId);
  const [voicePref, setVoicePref] = useAtom(audioVoiceAtom);
  // Per-screen override (session-only). Tapping the toggle sets this; the
  // global preference stays untouched so other meditations still use it.
  const [overrideVoice, setOverrideVoice] = useState<AudioVoice | null>(null);
  const effectiveVoice: AudioVoice | null = overrideVoice ?? voicePref ?? null;

  // After the user picks a voice from the first-play dialog, we want
  // playback to begin as soon as the asset finishes downloading.
  const autoPlayWhenReadyRef = useRef(false);

  // Tracks whether playback has actually started at least once, so we don't
  // misfire completion when both currentTime and duration are 0 on mount.
  const hasStartedRef = useRef(false);
  const hasNavigatedToCompletionRef = useRef(false);

  // When the user swaps the narrator voice mid-session, we want playback to
  // resume at the current position on the new track instead of restarting.
  // Captured before the audioKey changes; consumed once the new source has
  // actually loaded into the player after player.replace().
  const seekOnReadyRef = useRef<{
    time: number;
    key: string;
    shouldPlay: boolean;
  } | null>(null);

  // Resume support: if the user backed out of this meditation mid-session
  // earlier, we restore their position once the audio loads. The saved entry
  // is cleared either by completing the meditation or by tapping the
  // "Restart" affordance.
  const sessions = useAtomValue(meditationSessionsAtom);
  const setSessions = useSetAtom(meditationSessionsAtom);
  const savedSession = sessions[meditationId];
  const didResumeRef = useRef(false);

  const { heartRate, hrv } = useLatestBiometrics();

  const audioKey =
    meditation?.audioBaseKey && effectiveVoice
      ? `${meditation.audioBaseKey}-${effectiveVoice}`
      : null;

  const { player, status, isReady, isDownloading, progress } =
    useStreamedAudioPlayer(audioKey);

  // Honor the deferred autoplay flag once the source is ready.
  useEffect(() => {
    if (autoPlayWhenReadyRef.current && isReady) {
      autoPlayWhenReadyRef.current = false;
      player.play();
    }
  }, [isReady, player]);

  // Restore saved playback position on mount once the audio is loaded.
  // We don't auto-play — the user taps play to continue from there. Mirrors
  // the SleepMeditationSession resume pattern.
  useEffect(() => {
    if (didResumeRef.current) return;
    if (!savedSession) return;
    if (status.duration <= 0) return;
    didResumeRef.current = true;
    player.seekTo(savedSession.currentTime);
  }, [savedSession, status.duration, player]);

  // Persist current position when the user navigates away mid-session.
  // Skips when the meditation has effectively completed (so we don't save
  // a "duration-equals-end" state that re-opens a finished session).
  useSaveOnLeave({
    save: () =>
      setSessions({
        ...sessions,
        [meditationId]: {
          currentTime: status.currentTime,
          updatedAt: Date.now(),
        },
      }),
    canSave:
      status.duration > 0 &&
      status.currentTime > 0 &&
      status.currentTime < status.duration - 1,
  });

  // Restore playback position after a voice swap. We subscribe directly to
  // the player's status events because `useAudioPlayerStatus` updates can
  // lag the underlying native state, and we need a precise signal for
  // "the new source has finished loading after player.replace()" — not
  // "the old source is still loaded". The post-swap event is identified by
  // `currentTime` resetting to ~0, well below the captured target time.
  useEffect(() => {
    const target = seekOnReadyRef.current;
    if (!target) return;
    if (target.key !== audioKey) return;

    let consumed = false;
    const sub = player.addListener('playbackStatusUpdate', (s) => {
      if (consumed) return;
      if (!s.isLoaded || s.duration <= 0) return;
      // Old source still loaded — currentTime would still be near where the
      // user toggled. Skip until expo-audio reports a fresh post-replace
      // status (currentTime resets to ~0).
      if (s.currentTime + 0.5 >= target.time) return;

      consumed = true;
      seekOnReadyRef.current = null;
      sub.remove();
      player.seekTo(target.time);
      if (target.shouldPlay) player.play();
    });

    return () => {
      consumed = true;
      sub.remove();
    };
  }, [audioKey, player]);

  // Detect audio completion → navigate to the shared practices completion
  // screen. Loving Kindness gets the 4-chemical reward set; everything else
  // gets the 3-chemical default. See dose-rewards.ts.
  useEffect(() => {
    if (status.playing) hasStartedRef.current = true;

    if (hasNavigatedToCompletionRef.current) return;
    if (!hasStartedRef.current) return;
    if (status.duration <= 0) return;
    if (status.currentTime < status.duration) return;
    if (status.playing) return;

    hasNavigatedToCompletionRef.current = true;
    if (meditationId in sessions) {
      const next = { ...sessions };
      delete next[meditationId];
      setSessions(next);
    }
    router.replace({
      pathname: '/practices/completion',
      params: {
        practiceType: meditationId,
        durationSeconds: String(Math.round(status.duration)),
      },
    });
  }, [
    status.currentTime,
    status.duration,
    status.playing,
    meditationId,
    router,
    sessions,
    setSessions,
  ]);

  if (!meditation) return null;

  const promptForVoice = async (): Promise<AudioVoice | null> => {
    const result = await dialog.info<AudioVoice>({
      title: 'Choose a voice',
      message:
        'Pick the narrator voice you prefer. You can change this later in Settings → Audio & Storage.',
      buttons: [
        { label: 'Female voice', value: 'female', variant: 'primary' },
        { label: 'Male voice', value: 'male', variant: 'secondary' },
      ],
    });
    if (result === 'female' || result === 'male') {
      setVoicePref(result);
      return result;
    }
    return null;
  };

  const renderStatValue = (stat: {
    value: string;
    live?: 'heart_rate' | 'hrv' | 'duration' | 'remaining' | 'elapsed';
  }): string => {
    if (!stat.live) return stat.value;
    if (stat.live === 'heart_rate') {
      return heartRate != null ? `${heartRate} BPM` : '— BPM';
    }
    if (stat.live === 'hrv') {
      return hrv != null ? `${Math.round(hrv)} ms` : '— ms';
    }
    if (stat.live === 'duration') {
      return isReady && status.duration > 0 ? formatTime(status.duration) : '—';
    }
    if (stat.live === 'remaining') {
      return isReady && status.duration > 0
        ? formatTime(Math.max(0, status.duration - status.currentTime))
        : '—';
    }
    // elapsed
    return isReady ? formatTime(status.currentTime) : '—';
  };

  const onTogglePlay = async () => {
    if (!meditation.audioBaseKey) {
      void dialog.info({
        title: 'Coming soon',
        message: 'Audio for this meditation is not available yet.',
      });
      return;
    }
    // First-play voice picker: if neither a global pref nor a per-screen
    // override is set, ask before kicking off the download.
    if (!effectiveVoice) {
      const picked = await promptForVoice();
      if (!picked) return;
      // Voice atom updated; useStreamedAudioPlayer will start downloading on
      // the next render. Defer playback until the file is ready.
      autoPlayWhenReadyRef.current = true;
      return;
    }
    if (!isReady) return; // still downloading; status dialog handles UX
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const onToggleVoice = () => {
    const current = effectiveVoice ?? 'female';
    const newVoice: AudioVoice = current === 'female' ? 'male' : 'female';
    // Preserve position + play state across the swap. We require >= 1s of
    // elapsed playback because the post-swap detection relies on the new
    // source's currentTime being well below the captured target time —
    // toggles within the first second fall through to start-from-0 behavior.
    if (
      meditation.audioBaseKey &&
      isReady &&
      status.duration > 0 &&
      status.currentTime >= 1
    ) {
      seekOnReadyRef.current = {
        time: status.currentTime,
        key: `${meditation.audioBaseKey}-${newVoice}`,
        shouldPlay: status.playing,
      };
      // Pause now so the new source doesn't auto-resume from 0 while we
      // wait for it to load. The seek-on-ready effect will play() after
      // seeking if the user was playing before the toggle.
      if (status.playing) player.pause();
    }
    setOverrideVoice(newVoice);
  };

  const onReplay10 = () => {
    if (!isReady) return;
    player.seekTo(Math.max(0, status.currentTime - 10));
  };

  const onForward30 = () => {
    if (!isReady) return;
    if (status.duration > 0) {
      player.seekTo(Math.min(status.duration, status.currentTime + 30));
    }
  };

  // Times: prefer real status when audio is loaded, fall back to the
  // meditation's advertised duration as a placeholder until then.
  const elapsed = isReady ? formatTime(status.currentTime) : '00:00';
  const total = isReady
    ? formatTime(status.duration)
    : meditation.duration.replace(' min', ':00');
  const playbackRatio =
    isReady && status.duration > 0 ? status.currentTime / status.duration : 0;

  return (
    <Screen
      scroll
      header={<PracticeStackHeader wordmark="Meditation" />}
      sticky={
        <View className="gap-7 border-t border-foreground/5 px-2 pt-4">
          {/* Voice toggle (only once a voice is in effect) */}
          {meditation.audioBaseKey && effectiveVoice ? (
            <View className="items-center">
              <Pressable
                onPress={onToggleVoice}
                className="flex-row items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-3.5 py-1.5 active:opacity-70"
              >
                <MaterialIcons
                  name={effectiveVoice === 'female' ? 'female' : 'male'}
                  size={14}
                  color={controlIconColor}
                />
                <Text size="xs" treatment="caption" tone="secondary">
                  {effectiveVoice === 'female' ? 'Female' : 'Male'} voice
                </Text>
                <MaterialIcons
                  name="swap-horiz"
                  size={14}
                  color={controlIconColor}
                />
              </Pressable>
            </View>
          ) : null}

          {/* Progress bar + times */}
          <View>
            <View className="h-[3px] w-full overflow-hidden rounded-full bg-foreground/10">
              <LinearGradient
                colors={[colors.primary.pink, colors.accent.yellow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 3, width: `${playbackRatio * 100}%` }}
              />
            </View>
            <View className="mt-2 flex-row items-center justify-between">
              <Text
                size="xs"
                tone="secondary"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {elapsed}
              </Text>
              <Text
                size="xs"
                tone="secondary"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {total}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-center gap-6">
            <IconChip
              size={48}
              shape="circle"
              onPress={onReplay10}
              disabled={!isReady}
              accessibilityLabel="Replay 10 seconds"
            >
              <MaterialIcons
                name="replay-10"
                size={24}
                color={controlIconColor}
              />
            </IconChip>

            <Pressable
              onPress={onTogglePlay}
              disabled={
                !!meditation.audioBaseKey && !!effectiveVoice && !isReady
              }
              style={{
                borderRadius: 32,
                boxShadow: `0 0 24px ${withAlpha(colors.primary.pink, 0.5)}`,
                opacity:
                  meditation.audioBaseKey && effectiveVoice && !isReady
                    ? 0.7
                    : 1,
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
                {isDownloading ? (
                  <Text
                    size="sm"
                    tone="inverse"
                    weight="bold"
                    style={{ fontVariant: ['tabular-nums'] }}
                  >
                    {progress != null ? `${Math.round(progress * 100)}%` : '…'}
                  </Text>
                ) : (
                  <MaterialIcons
                    name={status.playing ? 'pause' : 'play-arrow'}
                    size={32}
                    color="white"
                  />
                )}
              </LinearGradient>
            </Pressable>

            <IconChip
              size={48}
              shape="circle"
              onPress={onForward30}
              disabled={!isReady}
              accessibilityLabel="Forward 30 seconds"
            >
              <MaterialIcons
                name="forward-30"
                size={24}
                color={controlIconColor}
              />
            </IconChip>
          </View>
        </View>
      }
      className="px-6 pt-4"
    >
      <View
        className="overflow-hidden rounded-[28px]"
        style={{
          boxShadow: `0px 0px 12px ${withAlpha(colors.primary.pink, 0.2)}`,
        }}
      >
        <Image
          source={meditation.introImage}
          style={{ width: '100%', aspectRatio: 1.4 }}
          contentFit="cover"
        />
      </View>

      {meditation.eyebrow ? (
        <Badge tone="pink" size="sm" className="mt-6 self-start">
          {meditation.eyebrow}
        </Badge>
      ) : (
        <View className="mt-6" />
      )}

      <GradientText className="mt-3 text-[34px] font-extrabold leading-[1.1]">
        {meditation.title}
      </GradientText>

      {meditation.meta ? (
        <Text size="sm" tone="secondary" className="mt-1">
          {meditation.meta}
        </Text>
      ) : null}

      <View className="mt-6 gap-3">
        {meditation.body.map((p) => (
          <Text key={p} size="lg" tone="secondary" className="leading-relaxed">
            {p}
          </Text>
        ))}
      </View>

      {meditation.stats && meditation.stats.length > 0 ? (
        <View className="mt-6 flex-row gap-3">
          {meditation.stats.map((stat) => (
            <BiometricStatCard
              key={stat.label}
              className="flex-1"
              label={stat.label}
              value={renderStatValue(stat)}
            />
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

import { Text } from '@/components/themed/Text';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  accentFor,
  colors,
  foregroundFor,
  withAlpha,
  type AccentHue,
} from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from 'react-native';

export type AudioPlayerVariant = 'hero' | 'mini' | 'inline' | 'card';

/** Visual variant for the right-side skip button. */
export type SkipForwardKind = 'time' | 'instruction';

export interface AudioPlayerProps {
  title: string;
  /** Artist / narrator / subtitle line. */
  subtitle?: string;
  /** Cover artwork (rendered on hero + mini). */
  artworkUri?: string;
  /** 0..1 normalized progress. Clamped if out of range. */
  progress: number;
  /** Total duration in seconds. */
  duration: number;
  /** Current playback state. */
  playing: boolean;
  /** Shows a spinner / loading label in place of the play icon. */
  loading?: boolean;
  /**
   * When `loading` is true and `loadingLabel` is set, the play button shows
   * the label text (e.g. "67%") instead of a spinner. Use for download-
   * progress UX where the user wants to see the percent flow.
   */
  loadingLabel?: string;
  onTogglePlay: () => void;
  /**
   * Optional seek handler — receives the target playback time in seconds.
   * When omitted, tapping the scrubber is a no-op (display-only player).
   */
  onSeek?: (seconds: number) => void;

  /** Skip-back button (replay-Ns). Omit handler → button hidden. */
  onSkipBack?: () => void;
  /** Replay step in seconds. Default: 10. */
  backSeconds?: number;

  /** Skip-forward / skip-instruction button. Omit handler → button hidden. */
  onSkipForward?: () => void;
  /** Forward step in seconds. Default: 30. Ignored when `skipForwardKind="instruction"`. */
  forwardSeconds?: number;
  /**
   * `time` (default) → renders the `forward-30` style icon + seconds label.
   * `instruction` → renders a `skip-next` icon (no seconds label) — use for
   * practice screens that skip to the next phase, or anywhere the forward
   * action isn't a fixed-time scrub.
   */
  skipForwardKind?: SkipForwardKind;

  /**
   * Voice-toggle pill rendered above the scrubber (hero only). Omit
   * `onToggleVoice` → pill hidden.
   */
  voiceLabel?: string;
  voiceIcon?: 'female' | 'male';
  onToggleVoice?: () => void;

  /** Mute toggle button (inline with controls row). Omit handler → hidden. */
  muted?: boolean;
  onToggleMute?: () => void;

  /** Layout. Default: `hero`. */
  variant?: AudioPlayerVariant;
  /** Accent (scrubber fill + play-button glow). Default: `pink`. */
  tone?: AccentHue;
  className?: string;
}

/**
 * Themed audio-playback UI. PRESENTATION ONLY — the parent owns the audio
 * player hook (e.g. `useManagedAudioPlayer`) and feeds progress, duration,
 * playing, and onTogglePlay in.
 *
 * Four layout variants:
 *   hero   — full-screen practice / meditation player (default)
 *   card   — list-row card with artwork + scrubber + play (media library)
 *   mini   — compact docked strip (persistent player)
 *   inline — single row inside a card (audio attachment, voice note)
 *
 * The hero variant has a configurable control row: pass only the handlers
 * you want, and the button row composes itself. Examples:
 *   - Meditation: onSkipBack + onSkipForward + onToggleVoice
 *   - Sleep meditation: onSkipBack only (no forward — user can't skip ahead)
 *   - Practice instructions: onSkipForward + skipForwardKind="instruction"
 *   - Ambient: onToggleMute (no scrub, no skip)
 */
export function AudioPlayer({
  title,
  subtitle,
  artworkUri,
  progress,
  duration,
  playing,
  loading,
  loadingLabel,
  onTogglePlay,
  onSeek,
  onSkipBack,
  backSeconds = 10,
  onSkipForward,
  forwardSeconds = 30,
  skipForwardKind = 'time',
  voiceLabel,
  voiceIcon,
  onToggleVoice,
  muted,
  onToggleMute,
  variant = 'hero',
  tone = 'pink',
  className,
}: AudioPlayerProps) {
  const scheme = useScheme();
  const accent = accentFor(scheme, tone);
  const clamped = Math.max(0, Math.min(1, isFinite(progress) ? progress : 0));
  const currentSec = clamped * duration;

  const handlePlayPause = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTogglePlay();
  }, [onTogglePlay]);

  if (variant === 'hero') {
    return (
      <View className={clsx('gap-6', className)}>
        {artworkUri ? (
          <View className="aspect-square w-full overflow-hidden rounded-3xl">
            <Image
              source={{ uri: artworkUri }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View className="aspect-square w-full items-center justify-center overflow-hidden rounded-3xl bg-foreground/5">
            <Ionicons
              name="musical-notes"
              size={64}
              color={foregroundFor(scheme, 0.25)}
            />
          </View>
        )}

        <View className="gap-1">
          <Text size="h2" weight="bold" align="center" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text size="sm" tone="secondary" align="center" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {onToggleVoice || onToggleMute ? (
          <View className="flex-row items-center justify-center gap-3">
            {onToggleVoice ? (
              <VoiceTogglePill
                label={voiceLabel ?? 'Voice'}
                icon={voiceIcon}
                onPress={onToggleVoice}
              />
            ) : null}
            {onToggleMute ? (
              <MuteIconButton muted={!!muted} onPress={onToggleMute} />
            ) : null}
          </View>
        ) : null}

        <Scrubber
          progress={clamped}
          duration={duration}
          tone={tone}
          gradient
          size="lg"
          onSeek={onSeek}
        />

        <ControlRow
          accent={accent}
          playing={playing}
          loading={loading}
          loadingLabel={loadingLabel}
          onPlayPause={handlePlayPause}
          onSkipBack={onSkipBack}
          backSeconds={backSeconds}
          onSkipForward={onSkipForward}
          forwardSeconds={forwardSeconds}
          skipForwardKind={skipForwardKind}
        />
      </View>
    );
  }

  if (variant === 'mini') {
    return (
      <View
        className={clsx(
          'overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.04]',
          className,
        )}
      >
        <View className="flex-row items-center gap-3 p-3">
          {artworkUri ? (
            <Image
              source={{ uri: artworkUri }}
              style={{ width: 48, height: 48, borderRadius: 12 }}
              resizeMode="cover"
            />
          ) : (
            <View
              className="items-center justify-center rounded-xl bg-foreground/10"
              style={{ width: 48, height: 48 }}
            >
              <Ionicons
                name="musical-notes"
                size={20}
                color={foregroundFor(scheme, 0.55)}
              />
            </View>
          )}

          <View className="flex-1">
            <Text size="sm" weight="semibold" numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text size="xs" tone="secondary" numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          {onToggleMute ? (
            <MuteIconButton muted={!!muted} onPress={onToggleMute} />
          ) : null}

          <PlayButton
            playing={playing}
            loading={loading}
            loadingLabel={loadingLabel}
            onPress={handlePlayPause}
            size="sm"
            accent={accent}
          />
        </View>
        <ProgressBar progress={clamped} size="sm" tone={tone} />
      </View>
    );
  }

  if (variant === 'card') {
    return (
      <View
        className={clsx(
          'flex-row items-center gap-4 rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-4',
          className,
        )}
      >
        {artworkUri ? (
          <Image
            source={{ uri: artworkUri }}
            style={{ width: 64, height: 64, borderRadius: 14 }}
            resizeMode="cover"
          />
        ) : (
          <View
            className="items-center justify-center rounded-2xl bg-foreground/10"
            style={{ width: 64, height: 64 }}
          >
            <Ionicons
              name="musical-notes"
              size={24}
              color={foregroundFor(scheme, 0.55)}
            />
          </View>
        )}

        <View className="flex-1 gap-1">
          <Text size="sm" weight="semibold" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text size="xs" tone="secondary" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
          <View className="mt-1">
            <Scrubber
              progress={clamped}
              duration={duration}
              tone={tone}
              size="sm"
              onSeek={onSeek}
              compact
            />
          </View>
          <Text
            size="xs"
            tone="tertiary"
            className="font-mono"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formatTime(currentSec)} / {formatTime(duration)}
          </Text>
        </View>

        {onToggleMute ? (
          <MuteIconButton muted={!!muted} onPress={onToggleMute} />
        ) : null}
        <PlayButton
          playing={playing}
          loading={loading}
          loadingLabel={loadingLabel}
          onPress={handlePlayPause}
          size="sm"
          accent={accent}
        />
      </View>
    );
  }

  // inline
  return (
    <View
      className={clsx(
        'flex-row items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/[0.04] px-4 py-3',
        className,
      )}
    >
      <PlayButton
        playing={playing}
        loading={loading}
        loadingLabel={loadingLabel}
        onPress={handlePlayPause}
        size="sm"
        accent={accent}
      />
      <View className="flex-1 gap-1">
        {title ? (
          <Text size="sm" weight="semibold" numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        <Scrubber
          progress={clamped}
          duration={duration}
          tone={tone}
          size="sm"
          onSeek={onSeek}
          compact
        />
      </View>
      <Text
        size="xs"
        tone="tertiary"
        className="font-mono"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {formatTime(currentSec)} / {formatTime(duration)}
      </Text>
      {onToggleMute ? (
        <MuteIconButton muted={!!muted} onPress={onToggleMute} />
      ) : null}
    </View>
  );
}

function ControlRow({
  accent,
  playing,
  loading,
  loadingLabel,
  onPlayPause,
  onSkipBack,
  backSeconds,
  onSkipForward,
  forwardSeconds,
  skipForwardKind,
}: {
  accent: string;
  playing: boolean;
  loading?: boolean;
  loadingLabel?: string;
  onPlayPause: () => void;
  onSkipBack?: () => void;
  backSeconds: number;
  onSkipForward?: () => void;
  forwardSeconds: number;
  skipForwardKind: SkipForwardKind;
}) {
  // Three fixed slots so the play button stays visually centered regardless
  // of which side buttons are present. Empty slots render an invisible
  // spacer that matches the SkipButton footprint.
  return (
    <View className="flex-row items-center justify-center gap-8">
      <SkipSlot>
        {onSkipBack ? (
          <SkipButton
            direction="back"
            seconds={backSeconds}
            onPress={onSkipBack}
          />
        ) : null}
      </SkipSlot>
      <PlayButton
        playing={playing}
        loading={loading}
        loadingLabel={loadingLabel}
        onPress={onPlayPause}
        size="lg"
        accent={accent}
      />
      <SkipSlot>
        {onSkipForward ? (
          skipForwardKind === 'instruction' ? (
            <SkipInstructionButton onPress={onSkipForward} />
          ) : (
            <SkipButton
              direction="forward"
              seconds={forwardSeconds}
              onPress={onSkipForward}
            />
          )
        ) : null}
      </SkipSlot>
    </View>
  );
}

/** Fixed-size slot so the control row stays balanced when a skip handler
 *  is omitted — keeps PlayButton visually centered. Height matches the
 *  PlayButton (64) so items-center aligns all three at the same vertical
 *  line; the SkipButton's icon + seconds-text combo is centered inside
 *  this slot, which lands the icon at the same y as the play arrow. */
function SkipSlot({ children }: { children: React.ReactNode }) {
  return (
    <View
      className="items-center justify-center"
      style={{ width: 44, height: 64 }}
    >
      {children}
    </View>
  );
}

function PlayButton({
  playing,
  loading,
  loadingLabel,
  onPress,
  size,
  accent,
}: {
  playing: boolean;
  loading?: boolean;
  loadingLabel?: string;
  onPress: () => void;
  size: 'sm' | 'lg';
  accent: string;
}) {
  const dim = size === 'lg' ? 64 : 36;
  const icon = size === 'lg' ? 32 : 18;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={playing ? 'Pause' : 'Play'}
      hitSlop={8}
    >
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 ${size === 'lg' ? 16 : 8}px ${withAlpha(accent, size === 'lg' ? 0.4 : 0.25)}`,
        }}
      >
        {loading ? (
          loadingLabel ? (
            <Text
              size={size === 'lg' ? 'sm' : 'xs'}
              weight="bold"
              style={{ color: 'white', fontVariant: ['tabular-nums'] }}
            >
              {loadingLabel}
            </Text>
          ) : (
            <ActivityIndicator
              color="white"
              size={size === 'lg' ? 'large' : 'small'}
            />
          )
        ) : (
          <Ionicons
            name={playing ? 'pause' : 'play'}
            size={icon}
            color="white"
            style={
              !playing
                ? { transform: [{ translateX: size === 'lg' ? 2 : 1 }] }
                : undefined
            }
          />
        )}
      </LinearGradient>
    </Pressable>
  );
}

function SkipButton({
  direction,
  seconds,
  onPress,
}: {
  direction: 'back' | 'forward';
  seconds: number;
  onPress: () => void;
}) {
  const scheme = useScheme();
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={`Skip ${direction} ${seconds} seconds`}
      hitSlop={8}
      className="items-center justify-center active:scale-95"
      style={{ width: 44, height: 64 }}
    >
      <Ionicons
        name={direction === 'back' ? 'play-back' : 'play-forward'}
        size={22}
        color={foregroundFor(scheme, 0.85)}
      />
      <Text size="xs" tone="tertiary" className="font-mono">
        {seconds}
      </Text>
    </Pressable>
  );
}

function SkipInstructionButton({ onPress }: { onPress: () => void }) {
  const scheme = useScheme();
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel="Skip to next"
      hitSlop={8}
      className="items-center justify-center active:scale-95"
      style={{ width: 44, height: 64 }}
    >
      <Ionicons
        name="play-skip-forward"
        size={26}
        color={foregroundFor(scheme, 0.85)}
      />
    </Pressable>
  );
}

function MuteIconButton({
  muted,
  onPress,
  large,
}: {
  muted: boolean;
  onPress: () => void;
  large?: boolean;
}) {
  const scheme = useScheme();
  const dim = large ? 48 : 36;
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={muted ? 'Unmute' : 'Mute'}
      accessibilityState={{ selected: muted }}
      hitSlop={8}
      className={clsx(
        'items-center justify-center rounded-full border border-foreground/10 active:scale-95',
        muted ? 'bg-primary-pink/15' : 'bg-foreground/5',
      )}
      style={{ width: dim, height: dim }}
    >
      <Ionicons
        name={muted ? 'volume-mute' : 'volume-high'}
        size={large ? 22 : 18}
        color={muted ? colors.primary.pink : foregroundFor(scheme, 0.7)}
      />
    </Pressable>
  );
}

function VoiceTogglePill({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon?: 'female' | 'male';
  onPress: () => void;
}) {
  const scheme = useScheme();
  return (
    <View className="items-center">
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        accessibilityRole="button"
        accessibilityLabel={`Toggle voice (${label})`}
        className="flex-row items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-3.5 py-1.5 active:opacity-70"
      >
        {icon ? (
          <MaterialIcons
            name={icon}
            size={14}
            color={foregroundFor(scheme, 0.7)}
          />
        ) : null}
        <Text size="xs" treatment="caption" className="text-foreground/70">
          {label}
        </Text>
        <MaterialIcons
          name="swap-horiz"
          size={14}
          color={foregroundFor(scheme, 0.7)}
        />
      </Pressable>
    </View>
  );
}

function Scrubber({
  progress,
  duration,
  tone,
  size,
  gradient,
  onSeek,
  compact,
}: {
  progress: number;
  duration: number;
  tone: AccentHue;
  size: 'sm' | 'md' | 'lg';
  gradient?: boolean;
  onSeek?: (seconds: number) => void;
  compact?: boolean;
}) {
  const [trackWidth, setTrackWidth] = useState(0);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  }, []);

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      if (!onSeek || trackWidth <= 0 || duration <= 0) return;
      const x = e.nativeEvent.locationX;
      const ratio = Math.max(0, Math.min(1, x / trackWidth));
      Haptics.selectionAsync();
      onSeek(ratio * duration);
    },
    [onSeek, trackWidth, duration],
  );

  const bar = (
    <View onLayout={handleLayout}>
      <ProgressBar
        progress={progress}
        size={size}
        tone={tone}
        gradient={gradient}
      />
    </View>
  );

  return (
    <View className="gap-1.5">
      {onSeek ? (
        <Pressable
          onPress={handlePress}
          hitSlop={8}
          accessibilityRole="adjustable"
        >
          {bar}
        </Pressable>
      ) : (
        bar
      )}
      {!compact ? (
        <View className="flex-row items-center justify-between">
          <Text
            size="xs"
            tone="tertiary"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formatTime(progress * duration)}
          </Text>
          <Text
            size="xs"
            tone="tertiary"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formatTime(duration)}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, View } from 'react-native';

export type PlaybackControlsSize = 'sm' | 'md';

export interface PlaybackControlsProps {
  /** Current play/pause state. */
  isPaused: boolean;
  onPauseToggle: () => void;

  /** Mute toggle — when omitted, the mute slot renders an invisible spacer. */
  isMuted?: boolean;
  onMuteToggle?: () => void;

  /**
   * Restart / skip-next handler. Required.
   * Icon morphs between replay (when sessionReady) and skip-next.
   */
  onRestart: () => void;
  /**
   * When true, the right button shows replay (mid-session). When false,
   * it shows skip-next (advance to next phase). Default: true.
   */
  sessionReady?: boolean;

  /**
   * `sm` (default) — 48px side buttons + 64px gradient center. Compact —
   * for in-body session controls.
   * `md` — 56px side buttons + 80px gradient center. Prominent — for
   * bottom-anchored / hero session controls.
   */
  size?: PlaybackControlsSize;

  /** When true, all buttons reject taps + render at 40% opacity. */
  disabled?: boolean;
  /** Suppress press haptics. Default: false. */
  noHaptic?: boolean;
  /**
   * Outer container className. Default layout is `flex-row items-center`;
   * callers add spacing (e.g. `gap-8 justify-center` for compact, or
   * `justify-between px-12` for the spread-out bottom row).
   */
  className?: string;
}

interface SizeStyle {
  sidePx: number;
  centerPx: number;
  centerIconPx: number;
}

const SIZES: Record<PlaybackControlsSize, SizeStyle> = {
  sm: { sidePx: 48, centerPx: 64, centerIconPx: 32 },
  md: { sidePx: 56, centerPx: 80, centerIconPx: 36 },
};

/**
 * Three-slot bottom control row for breathing / meditation sessions:
 *
 *   [mute]    [PLAY/PAUSE]    [restart]
 *
 * Mute is optional — omitting `onMuteToggle` renders an invisible spacer
 * so the center play button stays horizontally balanced.
 *
 * Layout (gap + horizontal padding) lives in `className` so callers can
 * use `gap-8 justify-center` for compact in-body controls or
 * `justify-between px-12` for spread-out bottom-anchored controls.
 *
 * Promoted from 3 nearly-identical local copies across the practices
 * sessions (DoubleInhale, Lazy8, StarBreathing).
 */
export function PlaybackControls({
  isPaused,
  onPauseToggle,
  isMuted,
  onMuteToggle,
  onRestart,
  sessionReady = true,
  size = 'sm',
  disabled,
  noHaptic,
  className,
}: PlaybackControlsProps) {
  const scheme = useScheme();
  const sz = SIZES[size];

  const fire = (handler: () => void) => {
    if (disabled) return;
    if (!noHaptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handler();
  };

  return (
    <View
      className={clsx('flex-row items-center', className)}
      style={disabled ? { opacity: 0.4 } : undefined}
    >
      {/* Mute slot */}
      {onMuteToggle ? (
        <Pressable
          onPress={() => fire(onMuteToggle)}
          accessibilityRole="button"
          accessibilityLabel={isMuted ? 'Unmute' : 'Mute'}
          accessibilityState={{ selected: !!isMuted }}
          hitSlop={4}
          className="items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 active:scale-95"
          style={{ width: sz.sidePx, height: sz.sidePx }}
        >
          <MaterialIcons
            name={isMuted ? 'volume-off' : 'volume-up'}
            size={24}
            color={foregroundFor(scheme, 0.6)}
          />
        </Pressable>
      ) : (
        // Invisible spacer so the play button stays centered when no mute.
        <View style={{ width: sz.sidePx, height: sz.sidePx }} />
      )}

      {/* Play / Pause */}
      <Pressable
        onPress={() => fire(onPauseToggle)}
        accessibilityRole="button"
        accessibilityLabel={isPaused ? 'Play' : 'Pause'}
        hitSlop={8}
        className="active:scale-95"
        style={{
          borderRadius: sz.centerPx / 2,
          boxShadow: `0 0 24px ${withAlpha(colors.primary.pink, 0.5)}`,
        }}
      >
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: sz.centerPx,
            height: sz.centerPx,
            borderRadius: sz.centerPx / 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons
            name={isPaused ? 'play-arrow' : 'pause'}
            size={sz.centerIconPx}
            color="white"
          />
        </LinearGradient>
      </Pressable>

      {/* Restart / skip-next */}
      <Pressable
        onPress={() => fire(onRestart)}
        accessibilityRole="button"
        accessibilityLabel={sessionReady ? 'Restart' : 'Skip to next'}
        hitSlop={4}
        className="items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 active:scale-95"
        style={{ width: sz.sidePx, height: sz.sidePx }}
      >
        <MaterialIcons
          name={sessionReady ? 'replay' : 'skip-next'}
          size={24}
          color={foregroundFor(scheme, 0.6)}
        />
      </Pressable>
    </View>
  );
}

import { Text } from '@/components/themed/Text';
import {
  accentFor,
  colors,
  withAlpha,
  type AccentHue,
} from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { EaseView } from 'react-native-ease';

export type ChipSelectSize = 'sm' | 'md';

/**
 * Visual variants for selected chips.
 *
 * - `tinted` — accent-tinted bg + accent border + accent text (default).
 *   Per-option tones are respected, making this the right pick for
 *   semantic palettes (emotion / category).
 * - `gradient` — selected chips fill with the brand pink→yellow gradient
 *   + white label + no border. Per-option tones are IGNORED in this mode
 *   (the gradient is always pink→yellow). Use for primary chip pickers
 *   that should grab attention.
 */
export type ChipSelectVariant = 'tinted' | 'gradient';

export interface ChipOption<T extends string = string> {
  label: string;
  value: T;
  /**
   * Leading icon — React node or render-prop that receives the resolved
   * accent color (so option icons can match the chip tone automatically).
   */
  icon?: ReactNode | ((color: string) => ReactNode);
  /** Per-option tone override; falls back to `ChipSelect`'s tone. */
  tone?: AccentHue;
  /** When true, the option rejects taps and renders at 40% opacity. */
  disabled?: boolean;
}

export interface ChipSelectProps<T extends string = string> {
  options: ChipOption<T>[];
  /**
   * Selected values. Always an array — even in single-select mode, where
   * length is constrained to 0 or 1.
   */
  value: T[];
  onChange: (next: T[]) => void;
  /** Single-select replaces the array; multi toggles. Default: multi. */
  multi?: boolean;
  /** Chip size. Default: `md`. */
  size?: ChipSelectSize;
  /** Default tone for chips that don't set their own. Default: `pink`. */
  tone?: AccentHue;
  /**
   * Selected-chip visual style. `tinted` (default) honors per-option tones;
   * `gradient` uses the brand pink→yellow LinearGradient for every selected
   * chip and ignores per-option tones.
   */
  variant?: ChipSelectVariant;
  /**
   * Layout. `wrap` lays chips out in rows that wrap (multi-line gallery);
   * `scroll` keeps them on one horizontal scrollable line.
   * Default: `wrap`.
   */
  layout?: 'wrap' | 'scroll';
  /** Caller className for the outer container. */
  className?: string;
  /** Suppress press haptics. Default: false. */
  noHaptic?: boolean;
}

const SIZE_PILL: Record<ChipSelectSize, string> = {
  sm: 'px-3 py-1',
  md: 'px-4 py-1.5',
};

const SIZE_TEXT: Record<ChipSelectSize, string> = {
  sm: 'text-[10px] uppercase tracking-wider',
  md: 'text-[13px]',
};

const SIZE_WEIGHT: Record<ChipSelectSize, string> = {
  sm: 'font-bold',
  md: 'font-semibold',
};

/**
 * Multi-select (or single-select) pill grid. Use for choosing N of M short
 * options inline — journal tags, feeling/need pickers, category filters,
 * onboarding chip questions.
 *
 * For exactly-one selection from a small stable set, SegmentedControl is a
 * better fit (tighter layout, clearer "active tab" affordance). For richer
 * selectable rows with descriptions / icons, reach for SelectionCard.
 */
export function ChipSelect<T extends string = string>({
  options,
  value,
  onChange,
  multi = true,
  size = 'md',
  tone: defaultTone = 'pink',
  variant = 'tinted',
  layout = 'wrap',
  className,
  noHaptic,
}: ChipSelectProps<T>) {
  const scheme = useScheme();

  const toggle = (v: T, disabled?: boolean) => {
    if (disabled) return;
    if (!noHaptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (multi) {
      onChange(
        value.includes(v) ? value.filter((x) => x !== v) : [...value, v],
      );
    } else {
      onChange(value[0] === v ? [] : [v]);
    }
  };

  const chips = options.map((opt) => {
    const selected = value.includes(opt.value);
    const tone = opt.tone ?? defaultTone;
    const accent = accentFor(scheme, tone);
    // In gradient mode, selected chips use white text + white icon color so
    // they read against the saturated pink→yellow fill. Unselected stays
    // neutral gray in both variants.
    const gradientMode = variant === 'gradient' && selected;
    const iconColor = gradientMode
      ? '#ffffff'
      : selected
        ? accent
        : 'rgba(127,127,127,0.7)';
    const resolvedIcon =
      typeof opt.icon === 'function' ? opt.icon(iconColor) : opt.icon;
    const labelColor = gradientMode
      ? '#ffffff'
      : selected
        ? accent
        : 'rgba(127,127,127,0.9)';

    const pill = (
      <View
        className={clsx(
          'flex-row items-center gap-1.5 rounded-full border',
          SIZE_PILL[size],
        )}
        style={
          gradientMode
            ? { borderColor: 'transparent' }
            : {
                backgroundColor: selected
                  ? withAlpha(accent, 0.15)
                  : 'rgba(127,127,127,0.08)',
                borderColor: selected
                  ? withAlpha(accent, 0.5)
                  : 'rgba(127,127,127,0.18)',
              }
        }
      >
        {resolvedIcon}
        <Text
          className={clsx(SIZE_TEXT[size], SIZE_WEIGHT[size])}
          style={{ color: labelColor }}
        >
          {opt.label}
        </Text>
      </View>
    );

    return (
      <Pressable
        key={opt.value}
        onPress={() => toggle(opt.value, opt.disabled)}
        disabled={opt.disabled}
        accessibilityRole={multi ? 'checkbox' : 'radio'}
        accessibilityState={{
          checked: selected,
          disabled: !!opt.disabled,
        }}
        style={opt.disabled ? { opacity: 0.4 } : undefined}
      >
        <EaseView
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 18, stiffness: 240 }}
        >
          {gradientMode ? (
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 9999 }}
            >
              {pill}
            </LinearGradient>
          ) : (
            pill
          )}
        </EaseView>
      </Pressable>
    );
  });

  if (layout === 'scroll') {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
        className={className}
      >
        {chips}
      </ScrollView>
    );
  }

  return (
    <View className={clsx('flex-row flex-wrap items-center gap-2', className)}>
      {chips}
    </View>
  );
}

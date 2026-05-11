import { cn } from '@/lib/cn';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

/**
 * Typography type system — orthogonal axes plus optional treatment.
 *
 *   size       sets fontSize + lineHeight        (default: 'md')
 *   tone       sets color / hierarchy            (default: 'primary')
 *   weight     overrides the size's default weight (optional)
 *   align      text alignment                    (optional)
 *   italic     italic style                      (optional)
 *   treatment  applies a special pattern (caption) on top
 *
 * Default weight per size is baked in (display→extrabold, h1/h2→bold,
 * h3→semibold, lg/md/sm/xs→normal). Pass `weight` only when overriding.
 *
 * Headings (display/h1/h2/h3) automatically get `accessibilityRole="header"`
 * so VoiceOver / TalkBack announce them as headings.
 */
export type TextSize =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'lg'
  | 'md'
  | 'sm'
  | 'xs';

export type TextTone =
  | 'primary'
  | 'body'
  | 'secondary'
  | 'tertiary'
  | 'disabled'
  | 'accent'
  | 'danger'
  | 'success'
  | 'warning'
  | 'inverse';

export type TextWeight =
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';

export type TextAlign = 'left' | 'center' | 'right';

export type TextTreatment = 'caption';

const sizeClasses: Record<TextSize, string> = {
  display: 'text-[36px] leading-[40px]',
  h1: 'text-[28px] leading-[34px]',
  h2: 'text-[22px] leading-[28px]',
  h3: 'text-[18px] leading-[24px]',
  lg: 'text-[17px] leading-[24px]',
  md: 'text-[15px] leading-[22px]',
  sm: 'text-[13px] leading-[19px]',
  xs: 'text-[11px] leading-[15px]',
};

const sizeDefaultWeight: Record<TextSize, string> = {
  display: 'font-extrabold',
  h1: 'font-bold',
  h2: 'font-bold',
  h3: 'font-semibold',
  lg: 'font-normal',
  md: 'font-normal',
  sm: 'font-normal',
  xs: 'font-normal',
};

const weightClasses: Record<TextWeight, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
};

const toneClasses: Record<TextTone, string> = {
  primary: 'text-foreground',
  // Body sits between primary (/100) and secondary (/55) — for descriptive
  // body copy / supporting paragraphs where /100 is too loud but /55 is too
  // muted. Audit found /60-/80 overrides everywhere; `body=/70` absorbs the
  // bulk of them.
  body: 'text-foreground/70',
  secondary: 'text-foreground/55',
  tertiary: 'text-foreground/30',
  disabled: 'text-foreground/15',
  accent: 'text-primary-pink',
  danger: 'text-status-danger',
  success: 'text-status-success',
  warning: 'text-status-warning',
  inverse: 'text-white',
};

const alignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const treatmentClasses: Record<TextTreatment, string> = {
  caption: 'uppercase tracking-widest font-semibold',
};

const HEADING_SIZES: ReadonlySet<TextSize> = new Set([
  'display',
  'h1',
  'h2',
  'h3',
]);

export interface TextProps extends RNTextProps {
  size?: TextSize;
  tone?: TextTone;
  weight?: TextWeight;
  align?: TextAlign;
  /** Render in italic. Composes with every other axis. */
  italic?: boolean;
  treatment?: TextTreatment;
}

/**
 * Themed Text.
 *
 *   <Text size="h1">Title</Text>
 *   <Text tone="secondary">Subtitle in body size</Text>
 *   <Text size="sm" tone="tertiary">Helper text</Text>
 *   <Text size="xs" treatment="caption" tone="accent">EYEBROW</Text>
 *   <Text size="sm" tone="danger" align="center">Validation error</Text>
 *   <Text italic tone="secondary">Italic body</Text>
 */
export function Text({
  size = 'md',
  tone = 'primary',
  weight,
  align,
  italic,
  treatment,
  className,
  allowFontScaling = true,
  accessibilityRole,
  ...rest
}: TextProps) {
  // Resolution order for weight:
  //   1. explicit `weight` prop (highest)
  //   2. treatment (caption=semibold)
  //   3. size default (display=extrabold, h1/h2=bold, h3=semibold, body=normal)
  const weightClass = weight
    ? weightClasses[weight]
    : treatment
      ? '' // treatment string carries its own weight
      : sizeDefaultWeight[size];

  // Auto-apply accessibilityRole="header" for heading sizes unless the caller
  // explicitly passed one (e.g. for a button label that uses h3 sizing).
  const resolvedRole =
    accessibilityRole ?? (HEADING_SIZES.has(size) ? 'header' : undefined);

  return (
    <RNText
      // cn() = clsx + tailwind-merge: caller className overrides the variant
      // defaults (e.g. `text-foreground/40` wins over the tone preset) without
      // needing `!` important modifiers.
      className={cn(
        sizeClasses[size],
        weightClass,
        toneClasses[tone],
        align ? alignClasses[align] : '',
        treatment ? treatmentClasses[treatment] : '',
        italic ? 'italic' : '',
        className,
      )}
      allowFontScaling={allowFontScaling}
      accessibilityRole={resolvedRole}
      {...rest}
    />
  );
}

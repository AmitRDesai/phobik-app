import { cn } from '@/lib/cn';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'lg'
  | 'md'
  | 'sm'
  | 'xs'
  | 'label'
  | 'caption'
  | 'mono';

const variantClasses: Record<TextVariant, string> = {
  display: 'text-[36px] leading-[40px] font-extrabold',
  h1: 'text-[28px] leading-[34px] font-bold',
  h2: 'text-[22px] leading-[28px] font-bold',
  h3: 'text-[18px] leading-[24px] font-semibold',
  lg: 'text-[17px] leading-[24px] font-normal',
  md: 'text-[15px] leading-[22px] font-normal',
  sm: 'text-[13px] leading-[19px] font-normal',
  xs: 'text-[11px] leading-[15px] font-normal',
  label: 'text-[13px] leading-[18px] font-semibold',
  caption: 'text-[11px] leading-[14px] font-semibold uppercase tracking-widest',
  mono: 'text-[13px] leading-[18px] font-medium',
};

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  /** Apply muted foreground (lower opacity). Default: false */
  muted?: boolean;
  /** Use inverse foreground (e.g. text on a brand background). Default: false */
  inverse?: boolean;
}

/**
 * Themed Text. Defaults to `text-foreground` (theme-aware via ThemeProvider
 * vars). Pass a `variant` to apply the typography scale; `muted` /
 * `inverse` adjust color without overriding the variant's size/weight.
 */
export function Text({
  variant = 'md',
  muted,
  inverse,
  className,
  style,
  allowFontScaling = true,
  ...rest
}: TextProps) {
  const colorClass = inverse
    ? 'text-surface'
    : muted
      ? 'text-foreground/55'
      : 'text-foreground';
  return (
    <RNText
      // cn() = clsx + tailwind-merge: dedupes classes by Tailwind conflict
      // group so caller `className` overrides the variant defaults (e.g.
      // `font-bold` wins over the variant's `font-normal`) without needing
      // the `!` important modifier.
      className={cn(variantClasses[variant], colorClass, className)}
      style={style}
      allowFontScaling={allowFontScaling}
      {...rest}
    />
  );
}

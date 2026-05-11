import { Text } from '@/components/themed';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import { useState, type Ref } from 'react';
import { TextInput as RNTextInput, View } from 'react-native';

export type TextAreaVariant = 'filled' | 'minimal';
export type TextAreaRows = 'sm' | 'md' | 'lg';

export interface TextAreaProps {
  ref?: Ref<RNTextInput>;
  /** Label rendered above the input. */
  label?: string;
  /** Helper text rendered below when there's no error. */
  hint?: string;
  /** Error message rendered below; replaces hint when present. */
  error?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  /**
   * Visual variant.
   * - `filled`  — rounded bg + border (default; matches TextField surface)
   * - `minimal` — borderless transparent body (long-form writing, journal)
   */
  variant?: TextAreaVariant;
  /** Min-height in row presets, or a custom pixel number. Default: `md` (8 rows). */
  rows?: TextAreaRows | number;
  /** Hard character cap. When set and counter is undefined, the counter shows automatically. */
  maxLength?: number;
  /** Force-show character counter. Defaults to true when `maxLength` is set. */
  showCounter?: boolean;
  editable?: boolean;
  autoFocus?: boolean;
  /** Override label casing. Default: false (sentence case). */
  labelUppercase?: boolean;
  className?: string;
}

const ROW_HEIGHT: Record<TextAreaRows, number> = {
  sm: 96, // ~4 lines
  md: 192, // ~8 lines (default)
  lg: 288, // ~12 lines
};

const NEUTRAL_BORDER = 'rgba(127,127,127,0.18)';

/**
 * Multiline text input primitive. Same label / hint / error scaffold as
 * TextField but with row-based sizing and optional character counter, and
 * a `minimal` variant for long-form writing surfaces (journal, letter)
 * where the chrome would compete with the writing.
 */
export function TextArea({
  ref,
  label,
  hint,
  error,
  placeholder,
  value,
  onChangeText,
  variant = 'filled',
  rows = 'md',
  maxLength,
  showCounter,
  editable = true,
  autoFocus,
  labelUppercase = false,
  className,
}: TextAreaProps) {
  const scheme = useScheme();
  const [focused, setFocused] = useState(false);
  const hasError = !!error;
  const minHeight = typeof rows === 'number' ? rows : ROW_HEIGHT[rows];
  const counterVisible = showCounter ?? maxLength != null;
  const over = maxLength != null && value.length > maxLength;

  return (
    <View className={clsx('gap-2', className)}>
      {label ? (
        <Text
          size={labelUppercase ? 'xs' : 'sm'}
          treatment={labelUppercase ? 'caption' : undefined}
          weight={labelUppercase ? undefined : 'semibold'}
          tone={labelUppercase ? 'primary' : 'secondary'}
          className={labelUppercase ? '' : 'px-1'}
        >
          {label}
        </Text>
      ) : null}
      <View
        className={clsx(
          'rounded-2xl',
          variant === 'filled' ? 'border bg-surface-input px-5 py-4' : 'px-1',
        )}
        style={
          variant === 'filled'
            ? {
                borderColor: hasError
                  ? colors.status.danger
                  : focused
                    ? colors.primary.pink
                    : NEUTRAL_BORDER,
                boxShadow:
                  focused || hasError
                    ? `0 0 8px ${withAlpha(hasError ? colors.status.danger : colors.primary.pink, 0.3)}`
                    : undefined,
              }
            : undefined
        }
      >
        <RNTextInput
          ref={ref}
          multiline
          textAlignVertical="top"
          className="android:p-0 text-[16px] leading-relaxed text-foreground"
          style={{ minHeight }}
          placeholder={placeholder}
          placeholderTextColor={foregroundFor(scheme, {
            dark: 0.4,
            light: 0.35,
          })}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
          autoFocus={autoFocus}
          cursorColor={colors.primary.pink}
          selectionColor={colors.primary.pink}
          maxLength={maxLength}
        />
      </View>
      {counterVisible || hasError || hint ? (
        <View className="flex-row items-start justify-between gap-3 px-2">
          <View className="flex-1">
            {hasError ? (
              <Text size="sm" tone="danger">
                {error}
              </Text>
            ) : hint ? (
              <Text size="sm" tone="secondary">
                {hint}
              </Text>
            ) : null}
          </View>
          {counterVisible ? (
            <Text
              size="xs"
              tone={over ? 'danger' : 'tertiary'}
              className="font-mono"
            >
              {value.length}
              {maxLength != null ? ` / ${maxLength}` : ''}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

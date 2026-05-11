import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { colors, foregroundFor, type AccentHue } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { type CustomDialogProps, type DialogResult } from '@/store/dialog';
import { dialog } from '@/utils/dialog';
import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Pressable, View as RNView } from 'react-native';

export type DropdownSelectSize = 'default' | 'compact';

export interface DropdownOption<T extends string = string> {
  label: string;
  value: T;
  description?: string;
  /** Leading icon for this option inside the picker sheet. */
  icon?: ReactNode | ((color: string) => ReactNode);
  /** Tone for the option's icon chip inside the picker. */
  tone?: AccentHue;
  disabled?: boolean;
}

export interface DropdownSelectProps<T extends string = string> {
  options: DropdownOption<T>[];
  value: T | null;
  onChange: (next: T | null) => void;
  /** Placeholder for the trigger when no value is selected. */
  placeholder?: string;
  /** Sheet title rendered above the options list. */
  title?: string;
  /** Label rendered above the trigger (like TextField). */
  label?: string;
  /** Helper text below the trigger; replaced by `error` when set. */
  hint?: string;
  /** Error message — flips the trigger border to status-danger. */
  error?: string;
  /** Label casing. Default: sentence case. */
  labelUppercase?: boolean;
  /** Optional leading icon on the trigger. */
  icon?: ReactNode;
  /** Trigger height. Default: `default`. */
  size?: DropdownSelectSize;
  /** When true, a "Clear selection" button appears in the picker. */
  allowClear?: boolean;
  disabled?: boolean;
  className?: string;
}

const NEUTRAL_BORDER = 'rgba(127,127,127,0.18)';
const NEUTRAL_PLACEHOLDER = 'rgba(127,127,127,0.55)';

const SIZE_STYLES: Record<DropdownSelectSize, string> = {
  default: 'px-6 py-4',
  compact: 'px-4 py-3',
};

/**
 * Single-select dropdown that opens a themed bottom-sheet (via the Dialog
 * primitive) with a SelectionCard list of options. Use for form fields
 * where the choice list is longer than a SegmentedControl can fit and a
 * full radio group would crowd the screen.
 *
 * Compose with TextField inside form layouts — the trigger chrome
 * matches so the two read as one form system.
 */
export function DropdownSelect<T extends string = string>({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  title,
  label,
  hint,
  error,
  labelUppercase = false,
  icon,
  size = 'default',
  allowClear,
  disabled,
  className,
}: DropdownSelectProps<T>) {
  const scheme = useScheme();
  const hasError = !!error;
  const selectedLabel = value
    ? (options.find((o) => o.value === value)?.label ?? null)
    : null;

  const handleOpen = async () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = (await dialog.open({
      component: DropdownPicker as never,
      props: {
        title,
        options,
        current: value,
        allowClear,
      },
    })) as DialogResult<T | null>;
    // `undefined` = picker dismissed via tap-outside / back → leave value alone
    if (next === undefined) return;
    onChange(next as T | null);
  };

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

      <Pressable
        onPress={handleOpen}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        accessibilityState={{ disabled: !!disabled }}
        style={disabled ? { opacity: 0.4 } : undefined}
      >
        <View
          className={clsx(
            'flex-row items-center rounded-full border bg-surface-input',
            SIZE_STYLES[size],
          )}
          style={{
            borderColor: hasError ? colors.status.danger : NEUTRAL_BORDER,
          }}
        >
          {icon ? <RNView className="mr-3">{icon}</RNView> : null}
          <Text
            size="md"
            className="flex-1"
            style={{
              color: selectedLabel
                ? foregroundFor(scheme, 1)
                : NEUTRAL_PLACEHOLDER,
            }}
            numberOfLines={1}
          >
            {selectedLabel ?? placeholder}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={foregroundFor(scheme, 0.55)}
          />
        </View>
      </Pressable>

      {hasError ? (
        <Text size="sm" tone="danger" className="px-2">
          {error}
        </Text>
      ) : hint ? (
        <Text size="sm" tone="secondary" className="px-2">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

interface DropdownPickerProps<
  T extends string,
> extends CustomDialogProps<T | null> {
  title?: string;
  options: DropdownOption<T>[];
  current: T | null;
  allowClear?: boolean;
}

function DropdownPicker<T extends string>({
  close,
  title,
  options,
  current,
  allowClear,
}: DropdownPickerProps<T>) {
  return (
    <View className="gap-3 pt-2">
      {title ? (
        <Text size="h3" align="center">
          {title}
        </Text>
      ) : null}

      <View className="gap-2">
        {options.map((opt) => (
          <SelectionCard
            key={opt.value}
            variant="radio"
            label={opt.label}
            description={opt.description}
            tone={opt.tone}
            icon={opt.icon}
            selected={current === opt.value}
            onPress={() => close(opt.value)}
            disabled={opt.disabled}
          />
        ))}
      </View>

      {allowClear && current ? (
        <Button variant="ghost" onPress={() => close(null)}>
          Clear selection
        </Button>
      ) : null}
    </View>
  );
}

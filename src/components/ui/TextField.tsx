import { Text } from '@/components/themed';
import { colors, withAlpha } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { useState, type ReactNode, type Ref } from 'react';
import {
  Pressable,
  TextInput as RNTextInput,
  View,
  type KeyboardTypeOptions,
  type ReturnKeyTypeOptions,
} from 'react-native';

export type TextFieldType = 'text' | 'password' | 'email' | 'numeric';
export type TextFieldSize = 'default' | 'compact';

export interface TextFieldProps {
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
  /** Type of input — controls keyboard, autocapitalize, secureText. */
  type?: TextFieldType;
  size?: TextFieldSize;
  /** Optional leading icon (React node — pass an icon component). */
  icon?: ReactNode;
  editable?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  /** Override label casing. Default: false (sentence case). */
  labelUppercase?: boolean;
  className?: string;
}

const typeProps: Record<
  TextFieldType,
  {
    keyboardType: KeyboardTypeOptions;
    autoCapitalize: 'none' | 'sentences';
    secureTextEntry: boolean;
  }
> = {
  text: {
    keyboardType: 'default',
    autoCapitalize: 'sentences',
    secureTextEntry: false,
  },
  password: {
    keyboardType: 'default',
    autoCapitalize: 'none',
    secureTextEntry: true,
  },
  email: {
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    secureTextEntry: false,
  },
  numeric: {
    keyboardType: 'numeric',
    autoCapitalize: 'none',
    secureTextEntry: false,
  },
};

const sizeStyles = {
  default: 'px-6 py-4',
  compact: 'px-4 py-3',
} as const;

// Theme-neutral grays used for placeholder, icon, and idle border. These read
// well in both light and dark mode without needing per-theme overrides;
// hex literals stay scoped to this file rather than living at call sites.
const NEUTRAL_BORDER = 'rgba(127,127,127,0.18)';
const NEUTRAL_PLACEHOLDER = 'rgba(127,127,127,0.55)';
const NEUTRAL_ICON = 'rgba(127,127,127,0.6)';

/**
 * TextField primitive — variant-aware (uses `surface-input`/`foreground`
 * theme tokens), with built-in label, hint, error chrome.
 *
 * Replaces module-level uses of the older `TextInput` (which stays for
 * backward-compat during Phase 3 migration).
 */
export function TextField({
  ref,
  label,
  hint,
  error,
  placeholder,
  value,
  onChangeText,
  type = 'text',
  size = 'default',
  icon,
  editable = true,
  returnKeyType,
  onSubmitEditing,
  labelUppercase = false,
  className,
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const t = typeProps[type];
  const hasError = !!error;
  const isPassword = type === 'password';

  return (
    <View className={clsx('gap-2', className)}>
      {label ? (
        <Text
          variant={labelUppercase ? 'caption' : 'label'}
          muted={!labelUppercase}
          className={labelUppercase ? '' : 'px-1'}
        >
          {label}
        </Text>
      ) : null}
      <View
        className={clsx(
          'flex-row items-center rounded-full border bg-surface-input',
          sizeStyles[size],
        )}
        style={{
          borderColor: hasError
            ? colors.status.danger
            : focused
              ? colors.primary.pink
              : NEUTRAL_BORDER,
          boxShadow:
            focused || hasError
              ? `0 0 8px ${withAlpha(hasError ? colors.status.danger : colors.primary.pink, 0.3)}`
              : undefined,
        }}
      >
        {icon ? <View className="mr-3">{icon}</View> : null}
        <RNTextInput
          ref={ref}
          className="android:p-0 flex-1 text-[16px] text-foreground"
          placeholder={placeholder}
          placeholderTextColor={NEUTRAL_PLACEHOLDER}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && hidden}
          keyboardType={t.keyboardType}
          autoCapitalize={t.autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          >
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={NEUTRAL_ICON}
            />
          </Pressable>
        ) : null}
      </View>
      {hasError ? (
        <Text variant="body-sm" className="px-2 text-status-danger">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="body-sm" muted className="px-2">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

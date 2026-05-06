import { colors, withAlpha } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { useState, type Ref } from 'react';
import {
  Pressable,
  TextInput as RNTextInput,
  Text,
  View,
  type KeyboardTypeOptions,
  type ReturnKeyTypeOptions,
} from 'react-native';

// Theme-neutral grays — readable on both light and dark backgrounds without
// per-theme overrides. Match TextField's neutral constants for consistency.
const NEUTRAL_BORDER = 'rgba(127,127,127,0.18)';
const NEUTRAL_PLACEHOLDER = 'rgba(127,127,127,0.55)';
const NEUTRAL_ICON = 'rgba(127,127,127,0.6)';

interface TextInputProps {
  ref?: Ref<RNTextInput>;
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words';
  labelColor?: string;
  iconColor?: string;
  labelUppercase?: boolean;
  editable?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  error?: string;
}

export function TextInput({
  ref,
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  labelColor,
  iconColor,
  labelUppercase = true,
  editable = true,
  returnKeyType,
  onSubmitEditing,
  error,
}: TextInputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const resolvedIconColor = iconColor ?? NEUTRAL_ICON;
  const hasError = !!error;

  return (
    <View className="gap-2">
      <Text
        className={clsx(
          'font-semibold',
          labelUppercase ? 'text-xs uppercase tracking-wider' : 'px-1 text-sm',
          !labelColor && 'text-foreground/55',
        )}
        style={labelColor ? { color: labelColor } : undefined}
      >
        {label}
      </Text>
      <View
        className="flex-row items-center rounded-full border bg-surface-input px-6 py-4"
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
        <Ionicons
          name={icon}
          size={20}
          color={resolvedIconColor}
          style={{ marginRight: 12 }}
        />
        <RNTextInput
          ref={ref}
          className="flex-1 text-[16px] text-foreground android:p-0"
          placeholder={placeholder}
          placeholderTextColor={NEUTRAL_PLACEHOLDER}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={resolvedIconColor}
            />
          </Pressable>
        )}
      </View>
      {hasError && (
        <Text className="px-2 text-xs text-status-danger">{error}</Text>
      )}
    </View>
  );
}

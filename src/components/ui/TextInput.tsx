import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Pressable,
  TextInput as RNTextInput,
  Text,
  View,
  type KeyboardTypeOptions,
  type ReturnKeyTypeOptions,
} from 'react-native';

interface TextInputProps {
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

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  function TextInput(
    {
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
    },
    ref,
  ) {
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(true);

    const resolvedIconColor = iconColor ?? 'rgba(255,255,255,0.4)';
    const hasError = !!error;

    return (
      <View className="gap-2">
        <Text
          className={`font-semibold ${labelUppercase ? 'text-xs uppercase tracking-wider' : 'px-1 text-sm'} ${labelColor ? '' : 'text-white/50'}`}
          style={labelColor ? { color: labelColor } : undefined}
        >
          {label}
        </Text>
        <View
          className="flex-row items-center rounded-full border bg-background-input px-6 py-4"
          style={{
            borderColor: hasError
              ? colors.red[500]
              : focused
                ? colors.primary.pink
                : 'rgba(255,255,255,0.1)',
            shadowColor: hasError ? colors.red[500] : colors.primary.pink,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: focused || hasError ? 0.3 : 0,
            shadowRadius: focused || hasError ? 8 : 0,
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
            className="flex-1 text-base text-white android:p-0"
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.3)"
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
        {hasError && <Text className="px-2 text-xs text-red-400">{error}</Text>}
      </View>
    );
  },
);

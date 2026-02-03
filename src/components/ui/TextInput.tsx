import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Platform,
  Pressable,
  Text,
  TextInput as RNTextInput,
  View,
  type KeyboardTypeOptions,
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
  variant?: 'default' | 'pill';
  labelColor?: string;
  iconColor?: string;
  labelUppercase?: boolean;
}

export function TextInput({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  variant = 'default',
  labelColor,
  iconColor,
  labelUppercase = true,
}: TextInputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const isPill = variant === 'pill';
  const resolvedIconColor = iconColor ?? 'rgba(255,255,255,0.4)';

  return (
    <View className="gap-2">
      <Text
        className={`font-semibold ${labelUppercase ? 'text-xs uppercase tracking-wider' : 'px-1 text-sm'} ${labelColor ? '' : 'text-white/50'}`}
        style={labelColor ? { color: labelColor } : undefined}
      >
        {label}
      </Text>
      <View
        className={`flex-row items-center ${isPill ? 'rounded-full px-6 py-4' : 'rounded-xl px-4 py-3.5'}`}
        style={{
          backgroundColor: '#1a1a1a',
          borderWidth: 1,
          borderColor: focused ? colors.primary.pink : 'rgba(255,255,255,0.1)',
          shadowColor: colors.primary.pink,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: focused ? 0.3 : 0,
          shadowRadius: focused ? 8 : 0,
        }}
      >
        <Ionicons
          name={icon}
          size={20}
          color={resolvedIconColor}
          style={{ marginRight: 12 }}
        />
        <RNTextInput
          className="flex-1 text-base text-white"
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={Platform.OS === 'android' ? { padding: 0 } : undefined}
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
    </View>
  );
}

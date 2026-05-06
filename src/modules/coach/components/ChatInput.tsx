import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { Text } from '@/components/themed/Text';
import { Keyboard, Pressable, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useVoiceInput } from '../hooks/useVoiceInput';

type ChatInputProps = {
  onSend: (message: string) => void;
  isLoading: boolean;
  onStop: () => void;
};

export function ChatInput({ onSend, isLoading, onStop }: ChatInputProps) {
  const scheme = useScheme();
  const [text, setText] = useState('');
  const placeholderColor = foregroundFor(scheme, 0.3);
  const micIdleColor = foregroundFor(scheme, 0.4);
  const sendDisabledIcon = foregroundFor(scheme, 0.3);

  const handleSend = useCallback(() => {
    if (!text.trim() || isLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend(text.trim());
    setText('');
    Keyboard.dismiss();
  }, [text, isLoading, onSend]);

  const handleStop = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onStop();
  }, [onStop]);

  const handleVoiceResult = useCallback((voiceText: string) => {
    setText((prev) => (prev ? `${prev} ${voiceText}` : voiceText));
  }, []);

  const { isListening, transcript, isAvailable, start, stop } = useVoiceInput({
    onResult: handleVoiceResult,
  });

  const canSend = text.trim().length > 0;

  return (
    <View className="px-4 pb-1 pt-2">
      {/* Voice listening indicator */}
      {isListening && (
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          className="mb-2 flex-row items-center gap-2 rounded-2xl px-4 py-2.5"
          style={{
            backgroundColor: colors.accent.purple + '15',
            borderWidth: 1,
            borderColor: colors.accent.purple + '30',
          }}
        >
          <View
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: colors.accent.purple }}
          />
          <Text className="flex-1 text-[13px] text-foreground/60">
            {transcript || 'Listening...'}
          </Text>
          <Pressable onPress={stop}>
            <Text className="text-[13px] font-medium text-accent-purple">
              Done
            </Text>
          </Pressable>
        </Animated.View>
      )}

      <View className="flex-row items-center rounded-[28px] border border-foreground/10 bg-surface-input px-3">
        <TextInput
          className="max-h-[120px] flex-1 px-2 py-3 text-[15px] text-foreground"
          placeholder="Ask your coach anything..."
          placeholderTextColor={placeholderColor}
          value={text}
          onChangeText={setText}
          multiline
          onSubmitEditing={handleSend}
          submitBehavior="newline"
        />

        {/* Voice input button — only show when no text and not loading */}
        {isAvailable && !canSend && !isLoading && (
          <Pressable
            onPress={isListening ? stop : start}
            className="mr-1 h-9 w-9 items-center justify-center rounded-full"
            style={{
              backgroundColor: isListening
                ? withAlpha(colors.accent.purple, 0.2)
                : 'transparent',
            }}
          >
            <Ionicons
              name={isListening ? 'mic' : 'mic-outline'}
              size={20}
              color={isListening ? colors.accent.purple : micIdleColor}
            />
          </Pressable>
        )}

        {isLoading ? (
          <Pressable
            onPress={handleStop}
            className="h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-foreground/15 bg-surface-elevated"
          >
            <View className="h-3 w-3 rounded-sm bg-foreground" />
          </Pressable>
        ) : (
          <Pressable
            onPress={handleSend}
            disabled={!canSend}
            className="h-9 w-9 items-center justify-center rounded-full"
            style={{
              backgroundColor: canSend
                ? colors.primary.pink
                : foregroundFor(scheme, 0.08),
              boxShadow: canSend
                ? `0 2px 6px ${withAlpha(colors.primary.pink, 0.4)}`
                : undefined,
            }}
          >
            <Ionicons
              name="arrow-up"
              size={18}
              color={canSend ? '#fff' : sendDisabledIcon}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

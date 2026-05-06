import { alpha, colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useVoiceInput } from '../hooks/useVoiceInput';

type ChatInputProps = {
  onSend: (message: string) => void;
  isLoading: boolean;
  onStop: () => void;
};

export function ChatInput({ onSend, isLoading, onStop }: ChatInputProps) {
  const [text, setText] = useState('');

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

      <View
        className="flex-row items-center rounded-[28px] border px-3"
        style={{
          borderColor: alpha.white10,
          backgroundColor: colors.background.input,
        }}
      >
        <TextInput
          className="max-h-[120px] flex-1 px-2 py-3 text-[15px] text-foreground"
          placeholder="Ask your coach anything..."
          placeholderTextColor={alpha.white30}
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
                ? colors.accent.purple + '20'
                : 'transparent',
            }}
          >
            <Ionicons
              name={isListening ? 'mic' : 'mic-outline'}
              size={20}
              color={isListening ? colors.accent.purple : alpha.white40}
            />
          </Pressable>
        )}

        {isLoading ? (
          <Pressable
            onPress={handleStop}
            className="h-9 w-9 items-center justify-center rounded-full"
            style={{
              backgroundColor: colors.card.elevated,
              borderWidth: 1.5,
              borderColor: alpha.white15,
            }}
          >
            <View
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: colors.white }}
            />
          </Pressable>
        ) : (
          <Pressable
            onPress={handleSend}
            disabled={!canSend}
            className="h-9 w-9 items-center justify-center rounded-full"
            style={{
              backgroundColor: canSend
                ? colors.primary.pink
                : colors.card.elevated,
              shadowColor: canSend ? colors.primary.pink : 'transparent',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: canSend ? 0.4 : 0,
              shadowRadius: 6,
            }}
          >
            <Ionicons
              name="arrow-up"
              size={18}
              color={canSend ? '#fff' : alpha.white30}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

import { alpha, colors, withAlpha } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import type { ChatMessage } from '../hooks/useCoachChat';

type ChatBubbleProps = {
  message: ChatMessage;
  onRetry?: (id: string) => void;
  isNew?: boolean;
};

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ChatBubble({ message, onRetry, isNew }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const router = useRouter();

  if (!isUser && !message.content && message.status !== 'error') return null;

  const handleCopy = async () => {
    if (!message.content) return;
    await Clipboard.setStringAsync(message.content);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleShare = async () => {
    if (!message.content) return;
    const result = await dialog.info({
      title: 'Share',
      message: 'Where would you like to share this?',
      buttons: [
        { label: 'Community', value: 'community', variant: 'primary' },
        { label: 'Other Apps', value: 'external', variant: 'secondary' },
        { label: 'Cancel', value: 'cancel', variant: 'secondary' },
      ],
    });

    if (result === 'community') {
      router.push({
        pathname: '/community/create',
        params: { prefill: message.content },
      });
    } else if (result === 'external') {
      try {
        await Share.share({ message: message.content });
      } catch {
        await handleCopy();
      }
    }
  };

  // Error state
  if (message.status === 'error') {
    return (
      <Animated.View
        entering={isNew ? FadeInDown.duration(200) : undefined}
        className="mb-4 flex-row gap-3"
      >
        <View
          className="mt-0.5 h-7 w-7 items-center justify-center rounded-full"
          style={{ backgroundColor: alpha.white08 }}
        >
          <MaterialIcons
            name="psychology"
            size={16}
            color={colors.accent.purple}
          />
        </View>
        <View className="flex-1 gap-2">
          <Text className="text-[14px] text-foreground/40">
            Failed to get a response
          </Text>
          <Pressable
            onPress={() => onRetry?.(message.id)}
            className="flex-row items-center gap-1.5 self-start rounded-full px-3 py-1.5"
            style={{
              backgroundColor: alpha.white08,
              borderWidth: 1,
              borderColor: alpha.white10,
            }}
          >
            <Ionicons name="refresh" size={14} color={colors.accent.purple} />
            <Text className="text-[13px] font-medium text-foreground/70">
              Retry
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  }

  // User message
  if (isUser) {
    return (
      <Animated.View
        entering={isNew ? FadeInRight.duration(200) : undefined}
        className="mb-3 max-w-[80%] self-end"
      >
        <View
          className="rounded-2xl rounded-br-sm px-4 py-3"
          style={{
            backgroundColor: colors.primary.pink,
            boxShadow: `0 2px 8px ${withAlpha(colors.primary.pink, 0.25)}`,
          }}
        >
          <Text className="text-[15px] leading-[22px] text-foreground">
            {message.content}
          </Text>
        </View>
        <View className="mt-1 flex-row items-center justify-end gap-2">
          <Text className="text-[10px] text-foreground/20">
            {formatTime(message.timestamp)}
          </Text>
          <Pressable onPress={handleCopy} hitSlop={8}>
            <Ionicons name="copy-outline" size={12} color={alpha.white20} />
          </Pressable>
        </View>
      </Animated.View>
    );
  }

  // Assistant message
  return (
    <Animated.View
      entering={isNew ? FadeInDown.duration(250) : undefined}
      className="mb-4 flex-row gap-3"
    >
      <View
        className="mt-0.5 h-7 w-7 items-center justify-center rounded-full"
        style={{ backgroundColor: alpha.white08 }}
      >
        <MaterialIcons
          name="psychology"
          size={16}
          color={colors.accent.purple}
        />
      </View>
      <View className="flex-1">
        <Markdown style={markdownStyles}>{message.content}</Markdown>
        <View className="mt-1 flex-row items-center justify-between">
          <Text className="text-[10px] text-foreground/20">
            {formatTime(message.timestamp)}
          </Text>
          {message.status === 'sent' && message.content.length > 0 && (
            <View className="flex-row gap-3">
              <Pressable onPress={handleCopy} hitSlop={8}>
                <Ionicons name="copy-outline" size={14} color={alpha.white20} />
              </Pressable>
              <Pressable onPress={handleShare} hitSlop={8}>
                <Ionicons
                  name="share-outline"
                  size={14}
                  color={alpha.white20}
                />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const markdownStyles = StyleSheet.create({
  body: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    lineHeight: 24,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 8,
  },
  heading1: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
  },
  heading2: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 4,
  },
  heading3: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  strong: {
    color: '#fff',
    fontWeight: '600',
  },
  em: {
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
  },
  bullet_list: {
    marginBottom: 8,
  },
  ordered_list: {
    marginBottom: 8,
  },
  list_item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 4,
  },
  bullet_list_icon: {
    color: colors.accent.purple,
    fontSize: 24,
    lineHeight: 24,
    marginLeft: 4,
    marginRight: 6,
  },
  bullet_list_content: {
    flex: 1,
  },
  ordered_list_icon: {
    color: colors.accent.purple,
    fontSize: 14,
    lineHeight: 24,
    marginLeft: 4,
    marginRight: 8,
  },
  ordered_list_content: {
    flex: 1,
  },
  code_inline: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: colors.accent.cyan,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 13,
    fontFamily: 'Courier',
  },
  fence: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  code_block: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontFamily: 'Courier',
  },
  blockquote: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderLeftColor: colors.accent.purple,
    borderLeftWidth: 3,
    paddingLeft: 12,
    paddingVertical: 4,
    marginVertical: 8,
    borderRadius: 4,
  },
  hr: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    height: 1,
    marginVertical: 12,
  },
  link: {
    color: colors.accent.cyan,
    textDecorationLine: 'underline',
  },
});

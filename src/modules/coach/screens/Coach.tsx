import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { NetworkBanner } from '@/components/ui/NetworkBanner';
import { Screen } from '@/components/ui/Screen';
import {
  accentFor,
  colors,
  foregroundFor,
  withAlpha,
} from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { dialog } from '@/utils/dialog';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable } from 'react-native';
import { ChatBubble } from '../components/ChatBubble';
import { ChatInput } from '../components/ChatInput';
import { FollowUpSuggestions } from '../components/FollowUpSuggestions';
import { ScrollToBottomButton } from '../components/ScrollToBottomButton';
import { SessionHistory } from '../components/SessionHistory';
import { TypingIndicator } from '../components/TypingIndicator';
import { useCoachChat } from '../hooks/useCoachChat';

const FOLLOW_UP_SUGGESTIONS = [
  'Tell me more',
  'Try a different approach',
  'Guide me through it step by step',
];

export default function Coach() {
  const scheme = useScheme();
  const {
    messages,
    sendMessage,
    isLoading,
    isLoadingHistory,
    error,
    stop,
    retry,
    startNewSession,
    switchThread,
    threadId,
    greeting,
  } = useCoachChat();
  const flatListRef = useRef<FlatList>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messageCountRef = useRef(messages.length);

  const isStreaming =
    isLoading &&
    messages.length > 0 &&
    messages[messages.length - 1]?.role === 'assistant' &&
    (messages[messages.length - 1]?.content.length ?? 0) > 0;

  const isWaiting = isLoading && !isStreaming;

  // Show follow-up suggestions after assistant finishes responding
  const showFollowUps =
    !isLoading &&
    messages.length > 0 &&
    messages[messages.length - 1]?.role === 'assistant' &&
    messages[messages.length - 1]?.status === 'sent';

  const handleNewSession = async () => {
    const result = await dialog.info({
      title: 'New Conversation',
      message:
        'Start a fresh conversation? Your current session will be saved.',
      buttons: [
        { label: 'Cancel', value: 'cancel', variant: 'secondary' },
        { label: 'Start New', value: 'confirm', variant: 'primary' },
      ],
    });

    if (result === 'confirm') {
      startNewSession();
    }
  };

  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  const handleScroll = useCallback(
    (e: {
      nativeEvent: {
        contentOffset: { y: number };
        contentSize: { height: number };
        layoutMeasurement: { height: number };
      };
    }) => {
      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
      const distanceFromBottom =
        contentSize.height - layoutMeasurement.height - contentOffset.y;
      setShowScrollButton(distanceFromBottom > 100);
    },
    [],
  );

  // Track new messages for animation (in effect to avoid ref access during render)
  const [isNewMessage, setIsNewMessage] = useState(false);
  useEffect(() => {
    setIsNewMessage(messages.length > messageCountRef.current);
    messageCountRef.current = messages.length;
  }, [messages.length]);

  const renderMessage = useCallback(
    ({ item, index }: { item: (typeof messages)[number]; index: number }) => (
      <ChatBubble
        message={item}
        onRetry={retry}
        isNew={isNewMessage && index >= messages.length - 2}
      />
    ),
    [retry, isNewMessage, messages.length],
  );

  const iconMuted = foregroundFor(scheme, 0.5);
  const purple = accentFor(scheme, 'purple');

  const headerLeft = (
    <IconChip shape="circle">
      <MaterialIcons name="psychology" size={20} color={purple} />
    </IconChip>
  );
  const headerCenter = (
    <View className="ml-3 flex-1">
      <Text size="md" weight="semibold">
        Coach
      </Text>
      <Text size="xs" tone="tertiary">
        Powered by AI
      </Text>
    </View>
  );
  const headerRight = (
    <View className="flex-row gap-2">
      <IconChip
        size="sm"
        shape="circle"
        onPress={() => setShowHistory(true)}
        accessibilityLabel="Session history"
      >
        <Ionicons name="time-outline" size={16} color={iconMuted} />
      </IconChip>
      {messages.length > 0 && (
        <IconChip
          size="sm"
          shape="circle"
          onPress={handleNewSession}
          accessibilityLabel="New session"
        >
          <Ionicons name="add" size={18} color={iconMuted} />
        </IconChip>
      )}
    </View>
  );

  return (
    <>
      <Screen
        keyboard
        header={
          <Header
            left={headerLeft}
            center={headerCenter}
            right={headerRight}
            className="border-b border-foreground/5"
          />
        }
        sticky={
          <View>
            <NetworkBanner message="You're offline. Messages will be sent when you reconnect." />
            {error && (
              <View
                className="mx-4 mb-2 flex-row items-center gap-2 rounded-2xl border border-status-danger/15 px-4 py-3"
                style={{
                  backgroundColor: withAlpha(colors.status.danger, 0.08),
                }}
              >
                <Ionicons
                  name="alert-circle"
                  size={16}
                  color={colors.status.danger}
                />
                <Text
                  size="sm"
                  className="flex-1"
                  style={{ color: colors.status.danger }}
                >
                  {error}
                </Text>
              </View>
            )}
            <FollowUpSuggestions
              suggestions={FOLLOW_UP_SUGGESTIONS}
              onSelect={sendMessage}
              visible={showFollowUps}
            />
            <ChatInput
              onSend={sendMessage}
              isLoading={isLoading}
              onStop={stop}
            />
          </View>
        }
        className="flex-1"
      >
        {isLoadingHistory ? (
          <View className="flex-1 items-center justify-center gap-3">
            <View className="flex-row items-center gap-2">
              <ActivityIndicator color={purple} size="small" />
              <Text size="sm" tone="tertiary">
                Loading conversation...
              </Text>
            </View>
          </View>
        ) : messages.length === 0 ? (
          <EmptyState greeting={greeting} onSuggestion={sendMessage} />
        ) : (
          <View className="flex-1">
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerClassName="px-4 pt-5 pb-2"
              onContentSizeChange={scrollToBottom}
              onLayout={scrollToBottom}
              onScroll={handleScroll}
              scrollEventThrottle={100}
              ListFooterComponent={isWaiting ? <TypingIndicator /> : null}
              showsVerticalScrollIndicator={false}
            />
            <ScrollToBottomButton
              visible={showScrollButton}
              onPress={scrollToBottom}
            />
          </View>
        )}
      </Screen>
      <SessionHistory
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectThread={switchThread}
        currentThreadId={threadId}
      />
    </>
  );
}

const INITIAL_SUGGESTIONS = [
  'Help me with a grounding exercise',
  'I feel anxious right now',
  'Teach me a breathing technique',
];

function EmptyState({
  greeting,
  onSuggestion,
}: {
  greeting: string | null;
  onSuggestion: (text: string) => void;
}) {
  const scheme = useScheme();
  const purple = accentFor(scheme, 'purple');
  return (
    <View className="flex-1 justify-end px-5 pb-6">
      <View className="flex-1 items-center justify-center">
        <View className="mb-5 h-16 w-16 items-center justify-center rounded-full border border-foreground/[0.08] bg-foreground/[0.04]">
          <MaterialIcons name="psychology" size={30} color={purple} />
        </View>
        {greeting ? (
          <Text
            size="md"
            align="center"
            tone="secondary"
            className="max-w-[300px] leading-6"
          >
            {greeting}
          </Text>
        ) : (
          <>
            <Text size="h3" align="center" className="mb-2">
              Hey, I&apos;m here for you
            </Text>
            <Text
              size="sm"
              align="center"
              tone="tertiary"
              className="max-w-[280px] leading-5"
            >
              I can help with anxiety, grounding exercises, breathing
              techniques, and building resilience.
            </Text>
          </>
        )}
      </View>

      <View className="gap-2">
        {INITIAL_SUGGESTIONS.map((text) => (
          <Button
            key={text}
            variant="secondary"
            size="xs"
            onPress={() => onSuggestion(text)}
          >
            {text}
          </Button>
        ))}
      </View>
    </View>
  );
}

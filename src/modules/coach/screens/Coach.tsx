import { alpha, colors } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatBubble } from '../components/ChatBubble';
import { ChatInput } from '../components/ChatInput';
import { FollowUpSuggestions } from '../components/FollowUpSuggestions';
import { NetworkBanner } from '../components/NetworkBanner';
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

  return (
    <View className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          {/* Header */}
          <View
            className="flex-row items-center px-5 pb-3 pt-2"
            style={{
              borderBottomWidth: 1,
              borderBottomColor: alpha.white05,
            }}
          >
            <View
              className="h-9 w-9 items-center justify-center rounded-full"
              style={{
                backgroundColor: alpha.white08,
                borderWidth: 1,
                borderColor: alpha.white10,
              }}
            >
              <MaterialIcons
                name="psychology"
                size={20}
                color={colors.accent.purple}
              />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-[15px] font-semibold text-foreground">
                Coach
              </Text>
              <Text className="text-[11px] text-foreground/35">
                Powered by AI
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setShowHistory(true)}
                className="h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: alpha.white05 }}
              >
                <Ionicons name="time-outline" size={16} color={alpha.white50} />
              </Pressable>
              {messages.length > 0 && (
                <Pressable
                  onPress={handleNewSession}
                  className="h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: alpha.white05 }}
                >
                  <Ionicons name="add" size={18} color={alpha.white50} />
                </Pressable>
              )}
            </View>
          </View>

          {/* Loading skeleton */}
          {isLoadingHistory ? (
            <View className="flex-1 items-center justify-center gap-3">
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color={colors.accent.purple} size="small" />
                <Text className="text-[13px] text-foreground/30">
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

          {/* Network banner */}
          <NetworkBanner />

          {/* Error */}
          {error && (
            <View
              className="mx-4 mb-2 flex-row items-center gap-2 rounded-2xl px-4 py-3"
              style={{
                backgroundColor: 'rgba(239,68,68,0.08)',
                borderWidth: 1,
                borderColor: 'rgba(239,68,68,0.15)',
              }}
            >
              <Ionicons name="alert-circle" size={16} color="#ef4444" />
              <Text className="flex-1 text-[13px] text-red-400">{error}</Text>
            </View>
          )}

          {/* Follow-up suggestions */}
          <FollowUpSuggestions
            suggestions={FOLLOW_UP_SUGGESTIONS}
            onSelect={sendMessage}
            visible={showFollowUps}
          />

          {/* Input */}
          <ChatInput onSend={sendMessage} isLoading={isLoading} onStop={stop} />
          <SafeAreaView edges={['bottom']} />
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Session History Modal */}
      <SessionHistory
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectThread={switchThread}
        currentThreadId={threadId}
      />
    </View>
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
  return (
    <View className="flex-1 justify-end px-5 pb-6">
      <View className="flex-1 items-center justify-center">
        <View
          className="mb-5 h-16 w-16 items-center justify-center rounded-full"
          style={{
            backgroundColor: alpha.white05,
            borderWidth: 1,
            borderColor: alpha.white08,
          }}
        >
          <MaterialIcons
            name="psychology"
            size={30}
            color={colors.accent.purple}
          />
        </View>
        {greeting ? (
          <Text className="max-w-[300px] text-center text-[15px] leading-6 text-foreground/70">
            {greeting}
          </Text>
        ) : (
          <>
            <Text className="mb-2 text-center text-xl font-bold text-foreground">
              Hey, I&apos;m here for you
            </Text>
            <Text className="max-w-[280px] text-center text-[14px] leading-5 text-foreground/40">
              I can help with anxiety, grounding exercises, breathing
              techniques, and building resilience.
            </Text>
          </>
        )}
      </View>

      <View className="gap-2">
        {INITIAL_SUGGESTIONS.map((text) => (
          <Pressable
            key={text}
            onPress={() => onSuggestion(text)}
            className="rounded-2xl border px-4 py-3"
            style={{
              borderColor: alpha.white10,
              backgroundColor: alpha.white03,
            }}
          >
            <Text className="text-[14px] text-foreground/60">{text}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

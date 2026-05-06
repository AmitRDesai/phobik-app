import { alpha, colors } from '@/constants/colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authClient } from '@/lib/auth';
import { env } from '@/utils/env';

type Thread = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

type SessionHistoryProps = {
  visible: boolean;
  onClose: () => void;
  onSelectThread: (threadId: string) => void;
  currentThreadId: string | null;
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function SessionHistory({
  visible,
  onClose,
  onSelectThread,
  currentThreadId,
}: SessionHistoryProps) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;

    setIsLoading(true);
    (async () => {
      try {
        // @ts-expect-error getCookie is added by the Expo plugin at runtime
        const cookies = authClient.getCookie() as string | undefined;
        const { fetch: expoFetch } = await import('expo/fetch');
        const res = await expoFetch(
          `${env.get('API_URL')}/api/memory/threads`,
          {
            headers: {
              'Content-Type': 'application/json',
              ...(cookies ? { Cookie: cookies } : {}),
            },
          },
        );
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.threads ?? []);
        setThreads(list);
      } catch {
        setThreads([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-surface">
        <SafeAreaView edges={['top']} className="flex-1">
          {/* Header */}
          <View
            className="flex-row items-center px-5 pb-3 pt-6"
            style={{
              borderBottomWidth: 1,
              borderBottomColor: alpha.white05,
            }}
          >
            <Text className="flex-1 text-lg font-semibold text-foreground">
              Past Sessions
            </Text>
            <Pressable
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: alpha.white05 }}
            >
              <Ionicons name="close" size={18} color={alpha.white50} />
            </Pressable>
          </View>

          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color={colors.accent.purple} size="small" />
            </View>
          ) : threads.length === 0 ? (
            <View className="flex-1 items-center justify-center gap-3 px-8">
              <Ionicons
                name="chatbubbles-outline"
                size={40}
                color={alpha.white20}
              />
              <Text className="text-center text-[14px] text-foreground/30">
                No past sessions yet. Start a conversation with your coach!
              </Text>
            </View>
          ) : (
            <FlatList
              data={threads}
              keyExtractor={(item) => item.id}
              contentContainerClassName="px-4 pt-3 pb-4"
              renderItem={({ item }) => {
                const isCurrent = item.id === currentThreadId;
                return (
                  <Pressable
                    onPress={() => {
                      onSelectThread(item.id);
                      onClose();
                    }}
                    className="mb-2 flex-row items-center gap-3 rounded-2xl px-4 py-3.5"
                    style={{
                      backgroundColor: isCurrent
                        ? colors.accent.purple + '15'
                        : alpha.white03,
                      borderWidth: 1,
                      borderColor: isCurrent
                        ? colors.accent.purple + '30'
                        : alpha.white05,
                    }}
                  >
                    <View
                      className="h-9 w-9 items-center justify-center rounded-full"
                      style={{ backgroundColor: alpha.white08 }}
                    >
                      <MaterialIcons
                        name="psychology"
                        size={18}
                        color={isCurrent ? colors.accent.purple : alpha.white40}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-[14px] font-medium text-foreground/80"
                        numberOfLines={1}
                      >
                        {item.title || 'Untitled session'}
                      </Text>
                      <Text className="text-[11px] text-foreground/30">
                        {formatDate(item.createdAt)}
                      </Text>
                    </View>
                    {isCurrent && (
                      <View className="rounded-full bg-accent-purple/20 px-2 py-0.5">
                        <Text className="text-[10px] font-medium text-accent-purple">
                          Active
                        </Text>
                      </View>
                    )}
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={alpha.white20}
                    />
                  </Pressable>
                );
              }}
            />
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

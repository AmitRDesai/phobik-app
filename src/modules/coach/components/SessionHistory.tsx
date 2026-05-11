import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { accentFor, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { authClient } from '@/lib/auth';
import { env } from '@/utils/env';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const scheme = useScheme();
  const purple = accentFor(scheme, 'purple');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const iconMuted = foregroundFor(scheme, 0.5);
  const iconDim = foregroundFor(scheme, 0.4);
  const iconFaint = foregroundFor(scheme, 0.2);

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
          <View className="flex-row items-center border-b border-foreground/5 px-5 pb-3 pt-6">
            <Text size="h3" className="flex-1">
              Past Sessions
            </Text>
            <Pressable
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full bg-foreground/[0.04]"
            >
              <Ionicons name="close" size={18} color={iconMuted} />
            </Pressable>
          </View>

          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color={purple} size="small" />
            </View>
          ) : threads.length === 0 ? (
            <View className="flex-1 items-center justify-center gap-3 px-8">
              <Ionicons
                name="chatbubbles-outline"
                size={40}
                color={iconFaint}
              />
              <Text size="sm" align="center" tone="tertiary">
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
                    className="mb-2 flex-row items-center gap-3 rounded-2xl border px-4 py-3.5"
                    style={{
                      backgroundColor: isCurrent
                        ? withAlpha(purple, 0.15)
                        : foregroundFor(scheme, 0.03),
                      borderColor: isCurrent
                        ? withAlpha(purple, 0.3)
                        : foregroundFor(scheme, 0.05),
                    }}
                  >
                    <View className="h-9 w-9 items-center justify-center rounded-full bg-foreground/[0.08]">
                      <MaterialIcons
                        name="psychology"
                        size={18}
                        color={isCurrent ? purple : iconDim}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        size="sm"
                        weight="medium"
                        className="text-foreground/80"
                        numberOfLines={1}
                      >
                        {item.title || 'Untitled session'}
                      </Text>
                      <Text size="xs" tone="tertiary">
                        {formatDate(item.createdAt)}
                      </Text>
                    </View>
                    {isCurrent && (
                      <View
                        className="rounded-full px-2 py-0.5"
                        style={{
                          backgroundColor: withAlpha(purple, 0.2),
                        }}
                      >
                        <Text
                          size="xs"
                          weight="medium"
                          style={{ color: purple }}
                        >
                          Active
                        </Text>
                      </View>
                    )}
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={iconFaint}
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

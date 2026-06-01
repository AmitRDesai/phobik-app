import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconChip } from '@/components/ui/IconChip';
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

type ThreadRowProps = {
  item: Thread;
  isCurrent: boolean;
  purple: string;
  iconDim: string;
  iconFaint: string;
  bgDefault: string;
  borderDefault: string;
  onPress: (id: string) => void;
};

function ThreadRow({
  item,
  isCurrent,
  purple,
  iconDim,
  iconFaint,
  bgDefault,
  borderDefault,
  onPress,
}: ThreadRowProps) {
  return (
    <Pressable
      onPress={() => onPress(item.id)}
      className="mb-2 flex-row items-center gap-3 rounded-2xl border px-4 py-3.5"
      style={{
        backgroundColor: isCurrent ? withAlpha(purple, 0.15) : bgDefault,
        borderColor: isCurrent ? withAlpha(purple, 0.3) : borderDefault,
      }}
    >
      <View className="size-9 items-center justify-center rounded-full bg-foreground/[0.08]">
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
          style={{ backgroundColor: withAlpha(purple, 0.2) }}
        >
          <Text size="xs" weight="medium" style={{ color: purple }}>
            Active
          </Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={16} color={iconFaint} />
    </Pressable>
  );
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
  const [prevVisible, setPrevVisible] = useState(visible);

  // Adjust isLoading during render when visible transitions to true (avoids
  // synchronous setState inside the effect body).
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) setIsLoading(true);
  }

  const iconMuted = foregroundFor(scheme, 0.5);
  const iconDim = foregroundFor(scheme, 0.4);
  const iconFaint = foregroundFor(scheme, 0.2);
  const bgDefault = foregroundFor(scheme, 0.03);
  const borderDefault = foregroundFor(scheme, 0.05);

  useEffect(() => {
    if (!visible) return;

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

  const handleSelectThread = (id: string) => {
    onSelectThread(id);
    onClose();
  };

  const renderItem = ({ item }: { item: Thread }) => (
    <ThreadRow
      item={item}
      isCurrent={item.id === currentThreadId}
      purple={purple}
      iconDim={iconDim}
      iconFaint={iconFaint}
      bgDefault={bgDefault}
      borderDefault={borderDefault}
      onPress={handleSelectThread}
    />
  );

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
            <IconChip
              size="sm"
              shape="circle"
              onPress={onClose}
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={18} color={iconMuted} />
            </IconChip>
          </View>

          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color={purple} size="small" />
            </View>
          ) : threads.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <EmptyState
                icon={(color) => (
                  <Ionicons
                    name="chatbubbles-outline"
                    size={24}
                    color={color}
                  />
                )}
                title="No past sessions yet"
                description="Start a conversation with your coach."
              />
            </View>
          ) : (
            <FlatList
              data={threads}
              keyExtractor={(item) => item.id}
              contentContainerClassName="px-4 pt-3 pb-4"
              renderItem={renderItem}
            />
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

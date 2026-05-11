import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, SectionList } from 'react-native';
import { NotificationItem } from '../components/NotificationItem';
import {
  type NotificationItem as NotificationItemType,
  useMarkAllRead,
  useNotifications,
} from '../hooks/useNotifications';

interface Section {
  title: string;
  data: NotificationItemType[];
}

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function groupByDate(items: NotificationItemType[]): Section[] {
  const today = startOfDay(new Date()).getTime();
  const yesterday = today - 24 * 60 * 60 * 1000;
  const weekAgo = today - 7 * 24 * 60 * 60 * 1000;

  const todayItems: NotificationItemType[] = [];
  const yesterdayItems: NotificationItemType[] = [];
  const thisWeekItems: NotificationItemType[] = [];
  const earlierItems: NotificationItemType[] = [];

  for (const item of items) {
    const itemDay = startOfDay(new Date(item.createdAt)).getTime();
    if (itemDay === today) todayItems.push(item);
    else if (itemDay === yesterday) yesterdayItems.push(item);
    else if (itemDay >= weekAgo) thisWeekItems.push(item);
    else earlierItems.push(item);
  }

  const sections: Section[] = [];
  if (todayItems.length) sections.push({ title: 'Today', data: todayItems });
  if (yesterdayItems.length)
    sections.push({ title: 'Yesterday', data: yesterdayItems });
  if (thisWeekItems.length)
    sections.push({ title: 'This week', data: thisWeekItems });
  if (earlierItems.length)
    sections.push({ title: 'Earlier', data: earlierItems });

  return sections;
}

export default function Notifications() {
  const scheme = useScheme();
  const { data, isLoading } = useNotifications();
  const { mutate: markAllRead } = useMarkAllRead();
  const [refreshing, setRefreshing] = useState(false);

  // Auto-mark all as read when the screen opens
  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  const sections = useMemo(() => groupByDate(data), [data]);

  const handleRefresh = useCallback(() => {
    // PowerSync is reactive — refresh is a no-op visual cue.
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  return (
    <Screen header={<Header title="Notifications" />} className="flex-1">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary.pink} size="large" />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem notification={item} />}
          renderSectionHeader={({ section }) => (
            <Text
              size="xs"
              treatment="caption"
              tone="secondary"
              className="mb-2 mt-4 px-1"
            >
              {section.title}
            </Text>
          )}
          contentContainerClassName="px-4 pb-12 gap-3"
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary.pink}
            />
          }
          ListEmptyComponent={
            <View className="items-center px-8 py-24">
              <MaterialIcons
                name="notifications-none"
                size={48}
                color={foregroundFor(scheme, 0.2)}
              />
              <Text size="sm" align="center" tone="tertiary" className="mt-4">
                No notifications yet.{'\n'}You're all caught up.
              </Text>
            </View>
          }
        />
      )}
    </Screen>
  );
}

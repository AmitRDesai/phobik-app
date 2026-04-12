import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';

export type NotificationType =
  | 'system'
  | 'reminder'
  | 'challenge'
  | 'community'
  | 'coach';

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data: { screen?: string; params?: Record<string, unknown> } | null;
  readAt: string | null;
  createdAt: string;
}

const NOTIFICATION_JSON = { data: true } as const;

/**
 * List all notifications for the current user, newest first.
 * Reactive — auto-updates when the table changes.
 */
export function useNotifications() {
  const userId = useUserId();

  const { data, isLoading, error } = useQuery({
    queryKey: ['notifications', userId],
    query: db
      .selectFrom('notification')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .orderBy('created_at', 'desc'),
    enabled: !!userId,
  });

  const items = useMemo(
    () =>
      data?.map(
        (r) => toCamel(r, NOTIFICATION_JSON) as unknown as NotificationItem,
      ) ?? [],
    [data],
  );

  return { data: items, isLoading, error };
}

/**
 * Reactive unread notification count for the bell badge.
 */
export function useUnreadCount(): number {
  const userId = useUserId();

  const { data } = useQuery({
    queryKey: ['notifications-unread-count', userId],
    query: db
      .selectFrom('notification')
      .select((eb) => eb.fn.countAll<number>().as('count'))
      .where('user_id', '=', userId ?? '')
      .where('read_at', 'is', null),
    enabled: !!userId,
  });

  return Number(data?.[0]?.count ?? 0);
}

/**
 * Mark a single notification as read.
 */
export function useMarkRead() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!userId) return;
      await db
        .updateTable('notification')
        .set({ read_at: new Date().toISOString() })
        .where('id', '=', id)
        .where('user_id', '=', userId)
        .where('read_at', 'is', null)
        .execute();
    },
  });
}

/**
 * Mark all unread notifications as read.
 * Called on notification screen mount.
 */
export function useMarkAllRead() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async () => {
      if (!userId) return;
      await db
        .updateTable('notification')
        .set({ read_at: new Date().toISOString() })
        .where('user_id', '=', userId)
        .where('read_at', 'is', null)
        .execute();
    },
  });
}

import { useQuery } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import type { AccentHue } from '@/constants/colors';
import { orpc } from '@/lib/orpc';
import { useUserId } from '@/lib/powersync/useUserId';
import {
  hasConnectedHealthAtom,
  whoopConnectedAtom,
} from '../store/health-connection';

/** A connected cloud connection counts as live; `active`/`backfilling` only. */
export function isCloudConnected(status: string | undefined): boolean {
  return status === 'active' || status === 'backfilling';
}

/** Connected-state status badge for a cloud connection (null when offline). */
export function cloudStatusBadge(
  status: string | undefined,
): { label: string; tone: AccentHue } | null {
  if (status === 'active') return { label: 'Connected', tone: 'cyan' };
  if (status === 'backfilling') return { label: 'Syncing', tone: 'yellow' };
  return null;
}

/** The single on-device source for this platform. */
export const DEVICE_PROVIDER =
  Platform.OS === 'ios' ? 'apple_health' : 'health_connect';

export type HealthConnectionStatus = {
  provider: string;
  connected: boolean;
  /** active | backfilling | needs_reauth | revoked | error | disconnected */
  status: string;
  lastSyncAt: string | null;
};

/**
 * Online-only read of cloud (OAuth) connections — Whoop, future vendors.
 * Deliberately not synced to the device: connection status has no offline
 * meaning (you can't connect/reconnect Whoop offline).
 */
export function useCloudConnections() {
  const userId = useUserId();
  const query = useQuery({
    ...orpc.health.getConnections.queryOptions(),
    enabled: !!userId,
  });

  // Keep the persisted Whoop-connected flag in sync so the iOS readers (and the
  // background task) know whether to drop WHOOP-mirrored HealthKit samples.
  const setWhoopConnected = useSetAtom(whoopConnectedAtom);
  const whoopStatus = query.data?.find((c) => c.provider === 'whoop')?.status;
  useEffect(() => {
    if (query.data) setWhoopConnected(isCloudConnected(whoopStatus));
  }, [query.data, whoopStatus, setWhoopConnected]);

  return query;
}

/**
 * Merged per-provider connection map: the on-device source (Jotai, offline)
 * plus cloud connections (online oRPC). UI renders from this so the on-device
 * source and Whoop are both representable at once on one device.
 */
export function useHealthConnections(): {
  connections: Record<string, HealthConnectionStatus>;
  anyConnected: boolean;
  isLoading: boolean;
} {
  const deviceConnected = useAtomValue(hasConnectedHealthAtom);
  const cloud = useCloudConnections();

  const connections: Record<string, HealthConnectionStatus> = {
    [DEVICE_PROVIDER]: {
      provider: DEVICE_PROVIDER,
      connected: deviceConnected,
      status: deviceConnected ? 'active' : 'disconnected',
      lastSyncAt: null,
    },
  };
  for (const c of cloud.data ?? []) {
    connections[c.provider] = {
      provider: c.provider,
      connected: c.status !== 'revoked' && c.status !== 'needs_reauth',
      status: c.status,
      lastSyncAt: c.lastSyncAt,
    };
  }

  const anyConnected = Object.values(connections).some((c) => c.connected);
  return { connections, anyConnected, isLoading: cloud.isLoading };
}

/** Convenience: is ANY health source connected (device or cloud)? */
export function useAnyHealthConnected(): boolean {
  return useHealthConnections().anyConnected;
}

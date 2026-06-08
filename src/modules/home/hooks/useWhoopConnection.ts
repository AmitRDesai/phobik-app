import { connectWhoop, disconnectWhoop } from '@/lib/biometrics/whoop-connect';
import type { AccentHue } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { useDataSourcePrompt } from './useDataSourcePrompt';
import {
  cloudStatusBadge,
  isCloudConnected,
  useCloudConnections,
} from './useHealthConnections';

export type WhoopConnection = {
  status: string | undefined;
  connected: boolean;
  badge: { label: string; tone: AccentHue } | null;
  busy: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

/**
 * Shared WHOOP connect/disconnect for the connect + settings screens — the
 * status, badge, busy flag, and the connect/disconnect flows (haptic, refetch,
 * post-connect data-source prompt, confirm dialog) in one place.
 * `deviceConnected` lets the post-connect prompt know whether a 2nd overlapping
 * source is now present.
 */
export function useWhoopConnection(deviceConnected: boolean): WhoopConnection {
  const cloud = useCloudConnections();
  const maybePromptDataSources = useDataSourcePrompt();
  const [busy, setBusy] = useState(false);

  const status = cloud.data?.find((c) => c.provider === 'whoop')?.status;

  const connect = async () => {
    setBusy(true);
    const result = await connectWhoop().catch(() => 'error' as const);
    setBusy(false);
    if (result === 'connected') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      cloud.refetch();
      // Two overlapping sources are now connected — offer to pick per metric.
      await maybePromptDataSources(deviceConnected);
    } else if (result === 'error') {
      await dialog.error({
        title: "Couldn't connect",
        message:
          "We couldn't connect your WHOOP account. Please try again in a moment.",
      });
    }
  };

  const disconnect = async () => {
    const result = await dialog.error({
      title: 'Disconnect WHOOP',
      message:
        'Phobik will stop receiving your WHOOP data and revoke access at WHOOP.',
      buttons: [
        { label: 'Disconnect', value: 'disconnect', variant: 'destructive' },
        { label: 'Cancel', value: 'cancel', variant: 'secondary' },
      ],
    });
    if (result === 'disconnect') {
      await disconnectWhoop().catch(() => {});
      cloud.refetch();
    }
  };

  return {
    status,
    connected: isCloudConnected(status),
    badge: cloudStatusBadge(status),
    busy,
    connect,
    disconnect,
  };
}

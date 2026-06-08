import type { WhoopConnection } from '../hooks/useWhoopConnection';
import { HealthProviderCard } from './HealthProviderCard';

/** The WHOOP row, shared by the Connect and Settings screens. */
export function WhoopProviderCard({ whoop }: { whoop: WhoopConnection }) {
  return (
    <HealthProviderCard
      icon="fitness-center"
      name="WHOOP"
      subtitle={
        whoop.connected
          ? 'Recovery, strain & sleep'
          : whoop.status === 'needs_reauth'
            ? 'Reconnect to resume syncing'
            : 'Connect your WHOOP account for recovery, strain & sleep'
      }
      connected={whoop.connected}
      statusLabel={whoop.badge?.label}
      statusTone={whoop.badge?.tone}
      actionLabel={whoop.status === 'needs_reauth' ? 'Reconnect' : 'Connect'}
      onAction={whoop.connect}
      busy={whoop.busy}
      secondaryActionLabel="Disconnect"
      onSecondary={whoop.disconnect}
    />
  );
}

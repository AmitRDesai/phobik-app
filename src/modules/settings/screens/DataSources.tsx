import { Text } from '@/components/themed/Text';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import {
  DATA_TYPE_LABELS,
  PROVIDER_PRIORITY,
  PROVIDER_SUPPLIES,
  providerDisplayName,
  SELECTABLE_DATA_TYPES,
  type SelectableDataType,
} from '@/lib/biometrics/providers';
import {
  DEVICE_PROVIDER,
  isCloudConnected,
  useCloudConnections,
} from '@/modules/home/hooks/useHealthConnections';
import {
  useDataSourcePreferences,
  useSetDataSourcePreference,
} from '@/modules/home/hooks/useDataSourcePreferences';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { MaterialIcons } from '@expo/vector-icons';

/** The candidate with the highest default priority (the zero-tap pre-selection). */
function defaultSource(candidates: string[]): string {
  return candidates.reduce((best, s) =>
    (PROVIDER_PRIORITY[s] ?? 0) > (PROVIDER_PRIORITY[best] ?? 0) ? s : best,
  );
}

export default function DataSources() {
  const device = useLatestBiometrics();
  const cloud = useCloudConnections();
  const { prefs } = useDataSourcePreferences();
  const setPref = useSetDataSourcePreference();

  const whoopStatus = cloud.data?.find((c) => c.provider === 'whoop')?.status;
  const connected: string[] = [];
  if (device.hasAccess) connected.push(DEVICE_PROVIDER);
  if (isCloudConnected(whoopStatus)) connected.push('whoop');

  // Only data types that ≥2 connected sources supply are selectable.
  const rows: { dt: SelectableDataType; candidates: string[] }[] = [];
  for (const dt of SELECTABLE_DATA_TYPES) {
    const candidates = connected.filter((s) => PROVIDER_SUPPLIES[s]?.has(dt));
    if (candidates.length >= 2) rows.push({ dt, candidates });
  }

  return (
    <Screen
      scroll
      header={<Header title="Data Sources" />}
      contentClassName="gap-4"
    >
      {rows.length === 0 ? (
        <EmptyState
          icon={(color) => (
            <MaterialIcons name="sync" size={28} color={color} />
          )}
          title="One source connected"
          description="Connect a second source — for example WHOOP alongside Apple Health — to choose which one feeds each metric."
        />
      ) : (
        <>
          <Text size="sm" tone="secondary" className="leading-relaxed">
            You have more than one source for these metrics. Choose which one
            Phobik uses — the others stay stored, just not double-counted.
          </Text>
          {rows.map(({ dt, candidates }) => (
            <Card key={dt} className="gap-3 p-4">
              <Text size="md" weight="semibold">
                {DATA_TYPE_LABELS[dt]}
              </Text>
              <SegmentedControl
                variant="tinted"
                selected={prefs[dt] ?? defaultSource(candidates)}
                onSelect={(source) => setPref.mutate({ dataType: dt, source })}
                options={candidates.map((s) => ({
                  label: providerDisplayName(s),
                  value: s,
                }))}
              />
            </Card>
          ))}
        </>
      )}
    </Screen>
  );
}

import { AccentPill } from '@/components/ui/AccentPill';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { MaterialIcons } from '@expo/vector-icons';

export function HeartRateBadge() {
  const { heartRate, hasAccess } = useLatestBiometrics();
  if (!hasAccess) return null;
  const display = heartRate != null ? `${heartRate} BPM` : '— BPM';

  return (
    <AccentPill
      variant="tinted"
      tone="pink"
      label={display}
      icon={(color) => (
        <MaterialIcons name="favorite" size={12} color={color} />
      )}
    />
  );
}

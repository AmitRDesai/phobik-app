import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { ConnectHealthCard } from './ConnectHealthCard';
import { DayNavigator } from './DayNavigator';
import { DoseScoreCard } from './DoseScoreCard';
import { SectionTitle } from './SectionTitle';
import { SleepScoreCard } from './SleepScoreCard';
import { WearableValueCard } from './WearableValueCard';

interface MyRhythmSectionProps {
  date: string;
  isToday: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
}

/**
 * Section title + day navigator + two ring cards (Sleep + D.O.S.E.) on one
 * row + full-width Wearable raw-values card. D.O.S.E. always renders.
 * When health is not connected, Sleep + Wearable collapse to a Connect CTA.
 */
export function MyRhythmSection({
  date,
  isToday,
  canGoForward,
  onBack,
  onForward,
}: MyRhythmSectionProps) {
  const { hasAccess } = useLatestBiometrics();

  return (
    <View className="gap-4">
      <SectionTitle
        prefix="My"
        accent="Rhythm"
        eyebrow={
          <Text size="xs" treatment="caption" weight="bold" tone="secondary">
            Real time analysis
          </Text>
        }
      />

      <DayNavigator
        date={date}
        isToday={isToday}
        canGoForward={canGoForward}
        onBack={onBack}
        onForward={onForward}
      />

      {hasAccess ? (
        <>
          <View className="flex-row gap-3">
            <SleepScoreCard date={date} />
            <DoseScoreCard date={date} />
          </View>
          <WearableValueCard />
        </>
      ) : (
        <>
          <DoseScoreCard date={date} />
          <ConnectHealthCard />
        </>
      )}
    </View>
  );
}

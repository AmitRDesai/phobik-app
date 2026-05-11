import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { ConnectHealthCard } from './ConnectHealthCard';
import { DayNavigator } from './DayNavigator';
import { DoseScoreCard } from './DoseScoreCard';
import { SleepScoreCard } from './SleepScoreCard';
import { WearableValueCard } from './WearableValueCard';

interface RealTimeAnalysisSectionProps {
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
export function RealTimeAnalysisSection({
  date,
  isToday,
  canGoForward,
  onBack,
  onForward,
}: RealTimeAnalysisSectionProps) {
  const { hasAccess } = useLatestBiometrics();

  return (
    <View className="gap-4">
      <View>
        <View className="flex-row items-baseline">
          <Text size="h1">Real Time </Text>
          <GradientText className="text-[28px] font-bold leading-[34px]">
            Analysis
          </GradientText>
        </View>
        <Text size="sm" tone="secondary" className="mt-1">
          Biometric synchronization and chemistry signals.
        </Text>
      </View>

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

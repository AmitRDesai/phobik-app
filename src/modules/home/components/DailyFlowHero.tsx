import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientButton } from '@/components/ui/GradientButton';
import { isTodayLocal } from '@/modules/daily-flow/data/flow-navigation';
import { useActiveDailyFlowSession } from '@/modules/daily-flow/hooks/useDailyFlowSession';
import { useEnterDailyFlow } from '@/modules/daily-flow/hooks/useEnterDailyFlow';
import { MaterialIcons } from '@expo/vector-icons';

export function DailyFlowHero() {
  const { session } = useActiveDailyFlowSession();
  const canResume = !!session && isTodayLocal(session.startedAt);
  const enterFlow = useEnterDailyFlow();

  return (
    <View className="items-center px-2 pb-2 pt-6">
      <Text variant="h1" className="mb-2 text-center font-black leading-tight">
        How do you want to feel right now?
      </Text>
      <Text variant="sm" muted className="mb-6 text-center font-medium">
        {canResume ? 'Pick up where you left off' : 'Start your Daily Flow'}
      </Text>
      <View className="w-full px-6">
        <GradientButton
          onPress={enterFlow}
          prefixIcon={
            <MaterialIcons
              name={canResume ? 'play-arrow' : 'play-circle-filled'}
              size={24}
              color="white"
            />
          }
        >
          {canResume ? 'RESUME DAILY FLOW' : 'DAILY FLOW'}
        </GradientButton>
      </View>
    </View>
  );
}

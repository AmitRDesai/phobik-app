import { GradientButton } from '@/components/ui/GradientButton';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
import { isTodayLocal } from '@/modules/daily-flow/data/flow-navigation';
import { useActiveDailyFlowSession } from '@/modules/daily-flow/hooks/useDailyFlowSession';
import { useEnterDailyFlow } from '@/modules/daily-flow/hooks/useEnterDailyFlow';

export function DailyFlowHero() {
  const { session } = useActiveDailyFlowSession();
  const canResume = !!session && isTodayLocal(session.startedAt);
  const enterFlow = useEnterDailyFlow();

  return (
    <View className="items-center px-2 pb-2 pt-6">
      <Text className="mb-2 text-center text-3xl font-black leading-tight tracking-tight text-foreground">
        How do you want to feel right now?
      </Text>
      <Text className="mb-6 text-center text-sm font-medium text-foreground/60">
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

import { colors, withAlpha } from '@/constants/colors';
import { hasConnectedHealthAtom } from '@/modules/home/store/health-connection';
import { useSleepHistory } from '@/modules/insights/hooks/useSleepHistory';
import { timeRangeAtom } from '@/modules/insights/store/insights';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtomValue } from 'jotai';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
function scoreLabel(score: number | null): string {
  if (score == null) return 'No data';
  if (score >= 80) return 'Restorative Sleep';
  if (score >= 60) return 'Solid Sleep';
  if (score >= 40) return 'Mixed Sleep';
  return 'Disrupted Sleep';
}

function scoreSubtitle(score: number | null, hasConnected: boolean): string {
  if (score == null) {
    return hasConnected
      ? 'Wear your device overnight to see a score'
      : 'Connect Apple Health or Health Connect';
  }
  if (score >= 80) return 'Your body recovered efficiently last night';
  if (score >= 60) return 'A balanced night — room to optimize stages';
  if (score >= 40) return 'Some recovery — duration or efficiency was off';
  return 'Recovery was limited — try a wind-down practice tonight';
}

export function SleepScoreHeader() {
  const range = useAtomValue(timeRangeAtom);
  const hasConnectedHealth = useAtomValue(hasConnectedHealthAtom);
  const { lastNightScore } = useSleepHistory(range);

  return (
    <View className="items-center px-4 py-8">
      <View className="relative mb-6 h-40 w-40 items-center justify-center">
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 160,
            height: 160,
            borderRadius: 80,
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0px 0px 25px ${withAlpha(colors.primary.pink, 0.4)}`,
          }}
        >
          <View
            className="absolute rounded-full bg-surface"
            style={{
              width: 144,
              height: 144,
              transform: [{ translateX: 16 }, { translateY: -8 }],
            }}
          />
          <View className="z-10 items-center">
            <Text className="text-5xl font-extrabold text-foreground">
              {lastNightScore != null ? lastNightScore : '—'}
            </Text>
            <Text className="text-[10px] font-bold uppercase tracking-widest text-foreground/80">
              Score
            </Text>
          </View>
        </LinearGradient>
      </View>
      <Text className="text-2xl font-bold text-foreground">
        {scoreLabel(lastNightScore)}
      </Text>
      <Text className="mt-1 font-medium text-primary-pink/80">
        {scoreSubtitle(lastNightScore, hasConnectedHealth)}
      </Text>
    </View>
  );
}

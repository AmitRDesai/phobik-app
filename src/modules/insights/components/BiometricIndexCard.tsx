import { DashboardCard } from '@/components/ui/DashboardCard';
import { colors } from '@/constants/colors';
import { hasConnectedHealthAtom } from '@/modules/home/store/health-connection';
import {
  useBiometricHistory,
  type BiometricHistoryPoint,
} from '@/modules/insights/hooks/useBiometricHistory';
import { timeRangeAtom } from '@/modules/insights/store/insights';
import { useAtomValue } from 'jotai';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

const VIEW_W = 400;
const VIEW_H = 100;
const PAD = 6;

function buildPath(points: BiometricHistoryPoint[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) {
    return `M${VIEW_W / 2},${VIEW_H / 2}`;
  }
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const xStep = (VIEW_W - PAD * 2) / (points.length - 1);
  return points
    .map((p, i) => {
      const x = PAD + i * xStep;
      const y = PAD + (VIEW_H - PAD * 2) * (1 - (p.value - min) / range);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export function BiometricIndexCard() {
  const range = useAtomValue(timeRangeAtom);
  const hasConnectedHealth = useAtomValue(hasConnectedHealthAtom);
  const hr = useBiometricHistory('heart_rate', range);
  const hrv = useBiometricHistory(['hrv_sdnn', 'hrv_rmssd'], range);

  const hasData = hr.points.length > 0 || hrv.points.length > 0;

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] font-black uppercase tracking-[3px] text-foreground/40">
          Biometric Index
        </Text>
        <View className="flex-row gap-3">
          <View className="flex-row items-center gap-1">
            <View className="h-1.5 w-1.5 rounded-full bg-white" />
            <Text className="text-[9px] font-bold uppercase tracking-tighter text-foreground">
              HR
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="h-1.5 w-1.5 rounded-full bg-primary-pink" />
            <Text className="text-[9px] font-bold uppercase tracking-tighter text-foreground">
              HRV
            </Text>
          </View>
        </View>
      </View>
      <DashboardCard className="p-5">
        {hasData ? (
          <View className="h-24 w-full">
            <Svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              preserveAspectRatio="none"
            >
              {hr.points.length > 1 ? (
                <Path
                  d={buildPath(hr.points)}
                  fill="none"
                  stroke="white"
                  strokeOpacity={0.4}
                  strokeWidth="1.5"
                />
              ) : null}
              {hrv.points.length > 1 ? (
                <Path
                  d={buildPath(hrv.points)}
                  fill="none"
                  stroke={colors.primary['pink-soft']}
                  strokeWidth="1.5"
                />
              ) : null}
            </Svg>
          </View>
        ) : hasConnectedHealth ? (
          <View className="h-24 w-full items-center justify-center">
            <Text className="text-center text-xs font-semibold uppercase tracking-widest text-foreground/40">
              No data
            </Text>
            <Text className="mt-1 text-[10px] leading-snug text-foreground/30">
              No HR or HRV samples in this window
            </Text>
          </View>
        ) : (
          <Pressable
            onPress={() => router.push('/settings/health')}
            className="h-24 w-full items-center justify-center"
          >
            <Text className="text-center text-xs leading-relaxed text-foreground/40">
              Connect Apple Health or Health Connect to see your HR & HRV
              trends.
            </Text>
            <Text className="mt-1 text-[10px] font-bold uppercase tracking-widest text-primary-pink">
              Set up →
            </Text>
          </Pressable>
        )}
        <View className="mt-4 flex-row gap-4 border-t border-foreground/5 pt-4">
          <View className="flex-1">
            <Text className="text-[9px] font-black uppercase tracking-widest text-foreground/40">
              {range === 'Day' ? 'Latest Heart Rate' : 'Avg Heart Rate'}
            </Text>
            <Text className="text-xl font-black text-foreground">
              {hr.avg != null
                ? Math.round(range === 'Day' ? hr.latest!.value : hr.avg)
                : '—'}{' '}
              <Text className="text-xs text-foreground/30">BPM</Text>
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-[9px] font-black uppercase tracking-widest text-foreground/40">
              {range === 'Day' ? 'Latest HRV' : 'Mean HRV'}
            </Text>
            <Text className="text-xl font-black text-primary-pink">
              {hrv.avg != null
                ? (range === 'Day' ? hrv.latest!.value : hrv.avg).toFixed(1)
                : '—'}{' '}
              <Text className="text-xs text-foreground/30">ms</Text>
            </Text>
          </View>
        </View>
      </DashboardCard>
    </View>
  );
}

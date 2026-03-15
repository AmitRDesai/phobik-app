import { colors } from '@/constants/colors';
import { Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const TIMES = ['11PM', '1AM', '3AM', '5AM', '7AM'];

export function HrvRecoveryChart() {
  return (
    <View className="gap-4 px-4">
      <View className="flex-row items-end justify-between">
        <View>
          <Text className="text-lg font-bold text-white">HRV Recovery</Text>
          <Text className="text-sm text-white/40">
            Heart Rate Variability trend
          </Text>
        </View>
        <View className="items-end">
          <Text
            className="text-2xl font-bold tracking-tight"
            style={{
              color: colors.amber[400],
              shadowColor: colors.amber[400],
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.4,
              shadowRadius: 4,
            }}
          >
            62 <Text className="text-xs font-normal">ms</Text>
          </Text>
          <Text
            className="text-xs font-bold"
            style={{ color: colors.status.success }}
          >
            +5% from avg
          </Text>
        </View>
      </View>
      <View className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4">
        <View className="h-[160px] w-full">
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 400 150"
            preserveAspectRatio="none"
          >
            <Defs>
              <LinearGradient id="hrvGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop
                  offset="0%"
                  stopColor={colors.amber[400]}
                  stopOpacity={0.3}
                />
                <Stop
                  offset="100%"
                  stopColor={colors.amber[400]}
                  stopOpacity={0}
                />
              </LinearGradient>
            </Defs>
            <Path
              d="M0,120 Q50,110 100,60 T200,80 T300,30 T400,100 L400,150 L0,150 Z"
              fill="url(#hrvGrad)"
            />
            <Path
              d="M0,120 Q50,110 100,60 T200,80 T300,30 T400,100"
              fill="none"
              stroke={colors.amber[400]}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </Svg>
        </View>
        <View className="mt-4 flex-row justify-between px-1">
          {TIMES.map((t) => (
            <Text
              key={t}
              className="text-[10px] font-bold uppercase text-white/30"
            >
              {t}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

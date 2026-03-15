import { DashboardCard } from '@/components/ui/DashboardCard';
import { colors } from '@/constants/colors';
import { Text, View } from 'react-native';
import Svg, { Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export function EnergyIndexChart() {
  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] font-black uppercase tracking-[3px] text-white/40">
          Energy Index Trend
        </Text>
        <View className="flex-row items-center gap-1.5">
          <View className="h-2 w-2 rounded-full bg-primary-pink" />
          <Text className="text-[10px] font-bold text-white">Avg. 68</Text>
        </View>
      </View>
      <DashboardCard className="overflow-hidden p-6">
        <View className="h-[180px] w-full">
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 400 150"
            preserveAspectRatio="none"
          >
            <Defs>
              <LinearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={colors.primary['pink-soft']} />
                <Stop offset="100%" stopColor={colors.accent.gold} />
              </LinearGradient>
              <LinearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop
                  offset="0%"
                  stopColor={colors.primary['pink-soft']}
                  stopOpacity={0.25}
                />
                <Stop
                  offset="100%"
                  stopColor={colors.primary['pink-soft']}
                  stopOpacity={0}
                />
              </LinearGradient>
            </Defs>
            <Line
              x1="0"
              y1="0"
              x2="400"
              y2="0"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
            <Line
              x1="0"
              y1="50"
              x2="400"
              y2="50"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
            <Line
              x1="0"
              y1="100"
              x2="400"
              y2="100"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
            <Path
              d="M0,120 C50,110 80,40 120,60 C160,80 200,20 250,50 C300,80 350,10 400,30"
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <Path
              d="M0,120 C50,110 80,40 120,60 C160,80 200,20 250,50 C300,80 350,10 400,30 L400,150 L0,150 Z"
              fill="url(#areaGrad)"
            />
          </Svg>
          <View className="absolute inset-0 justify-between py-1">
            <Text className="text-[8px] font-bold uppercase text-white/30">
              High
            </Text>
            <Text className="text-[8px] font-bold uppercase text-white/30">
              Med
            </Text>
            <Text className="text-[8px] font-bold uppercase text-white/30">
              Low
            </Text>
          </View>
        </View>
        <View className="mt-4 flex-row justify-between">
          {DAYS.map((d) => (
            <Text key={d} className="text-[9px] font-bold text-white/30">
              {d}
            </Text>
          ))}
        </View>
      </DashboardCard>
    </View>
  );
}

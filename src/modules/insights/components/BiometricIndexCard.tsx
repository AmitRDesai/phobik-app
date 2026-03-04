import { DashboardCard } from '@/modules/home/components/DashboardCard';
import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export function BiometricIndexCard() {
  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] font-black uppercase tracking-[3px] text-white/40">
          Biometric Index
        </Text>
        <View className="flex-row gap-3">
          <View className="flex-row items-center gap-1">
            <View className="h-1.5 w-1.5 rounded-full bg-white" />
            <Text className="text-[9px] font-bold uppercase tracking-tighter text-white">
              HR
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="h-1.5 w-1.5 rounded-full bg-primary-pink" />
            <Text className="text-[9px] font-bold uppercase tracking-tighter text-white">
              HRV
            </Text>
          </View>
        </View>
      </View>
      <DashboardCard className="p-5">
        <View className="h-24 w-full">
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
          >
            <Path
              d="M0,50 L40,45 L80,60 L120,55 L160,70 L200,65 L240,50 L280,40 L320,55 L360,45 L400,50"
              fill="none"
              stroke="white"
              strokeOpacity={0.2}
              strokeWidth="1.5"
            />
            <Path
              d="M0,80 L40,70 L80,75 L120,60 L160,55 L200,40 L240,45 L280,55 L320,60 L360,50 L400,45"
              fill="none"
              stroke="#FF4D97"
              strokeWidth="1.5"
            />
          </Svg>
        </View>
        <View className="mt-4 flex-row gap-4 border-t border-white/5 pt-4">
          <View className="flex-1">
            <Text className="text-[9px] font-black uppercase tracking-widest text-white/40">
              Resting Heart Rate
            </Text>
            <Text className="text-xl font-black text-white">
              64 <Text className="text-xs text-white/30">BPM</Text>
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-[9px] font-black uppercase tracking-widest text-white/40">
              Mean HRV
            </Text>
            <Text className="text-xl font-black text-primary-pink">
              72 <Text className="text-xs text-white/30">ms</Text>
            </Text>
          </View>
        </View>
      </DashboardCard>
    </View>
  );
}

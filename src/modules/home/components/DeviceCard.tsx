import { GradientButton } from '@/components/ui/GradientButton';
import { alpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

import type { Device } from '../data/devices';

interface DeviceCardProps {
  device: Device;
  onConnect: () => void;
}

export function DeviceCard({ device, onConnect }: DeviceCardProps) {
  return (
    <View className="rounded-2xl border border-white/10 bg-card-plum/50 p-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-white/5">
            <MaterialIcons name={device.icon} size={24} color={alpha.white80} />
          </View>
          <View>
            <Text className="font-bold tracking-tight text-white">
              {device.name}
            </Text>
            <Text className="text-[10px] font-bold uppercase text-slate-500">
              {device.subtitle}
            </Text>
          </View>
        </View>
        <GradientButton onPress={onConnect} compact>
          Connect
        </GradientButton>
      </View>
    </View>
  );
}

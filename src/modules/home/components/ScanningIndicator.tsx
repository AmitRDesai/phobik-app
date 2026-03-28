import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { EaseView } from 'react-native-ease';

export function ScanningIndicator() {
  return (
    <View className="mb-10 mt-6 items-center">
      {/* Bluetooth icon with pulse ring */}
      <View className="relative mb-6 items-center justify-center">
        <View className="absolute h-24 w-24 overflow-hidden rounded-full">
          <GlowBg
            centerX={0.5}
            centerY={0.5}
            intensity={2}
            radius={0.5}
            startColor={colors.primary.pink}
            endColor={colors.accent.yellow}
            bgClassName="bg-transparent"
          />
        </View>
        <View className="h-24 w-24 items-center justify-center rounded-full border-2 border-primary-pink/30">
          <EaseView
            initialAnimate={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1.1, opacity: 1 }}
            transition={{
              type: 'timing',
              duration: 1000,
              easing: [0.455, 0.03, 0.515, 0.955],
              loop: 'reverse',
            }}
            className="h-16 w-16 items-center justify-center rounded-full border-2 border-accent-yellow"
          >
            <MaterialIcons
              name="bluetooth-searching"
              size={30}
              color={colors.accent.yellow}
            />
          </EaseView>
        </View>
      </View>

      <Text className="mb-2 text-xs font-bold uppercase tracking-widest text-primary-pink">
        Scanning for devices
      </Text>
      <Text className="mb-3 text-3xl font-bold tracking-tight text-white">
        Sync Your Device
      </Text>
      <Text className="max-w-[280px] text-center text-sm leading-relaxed text-slate-400">
        Connect via Bluetooth for real-time energy and stress monitoring.
      </Text>
    </View>
  );
}

import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { DeviceCard } from '../components/DeviceCard';
import { ScanningIndicator } from '../components/ScanningIndicator';
import { DEVICES } from '../data/devices';

export default function ConnectWearable() {
  return (
    <Container safeAreaClass="bg-background-dashboard">
      <GlowBg
        bgClassName="bg-background-dashboard"
        centerY={0.2}
        intensity={0.6}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />

      {/* Back button + title row */}
      <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 active:opacity-70"
        >
          <MaterialIcons name="chevron-left" size={28} color="white" />
        </Pressable>
        <Text
          className="text-sm font-bold uppercase tracking-[4px] text-white/60"
          numberOfLines={1}
        >
          Connect Wearable
        </Text>
        <View className="h-10 w-10" />
      </View>

      <ScrollView
        contentContainerClassName="px-6 pb-12"
        showsVerticalScrollIndicator={false}
      >
        <ScanningIndicator />
        <View className="gap-4">
          {DEVICES.map((device) => (
            <DeviceCard key={device.id} device={device} onConnect={() => {}} />
          ))}
        </View>
      </ScrollView>
    </Container>
  );
}

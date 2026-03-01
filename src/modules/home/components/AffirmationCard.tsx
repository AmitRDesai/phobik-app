import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { DashboardCard } from './DashboardCard';

export function AffirmationCard() {
  return (
    <DashboardCard className="min-h-[200px] items-center justify-between p-8 shadow-2xl shadow-primary-pink/15">
      <View className="mb-2 w-full flex-row items-start justify-between">
        <View className="w-6" />
        <Text className="max-w-[180px] text-center text-[10px] font-medium italic leading-tight tracking-wide text-white/50">
          Set the intention for the day
        </Text>
        <Pressable className="active:scale-90">
          <MaterialIcons
            name="sync"
            size={22}
            color={`${colors.primary.pink}B3`}
          />
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center py-4">
        <Text className="text-center text-3xl font-light italic leading-relaxed text-white/95">
          {'"'}Today, I move with{' '}
          <Text className="font-bold text-primary-pink">courage</Text>.{'"'}
        </Text>
      </View>

      <Pressable className="mt-4 rounded-full border border-accent-yellow/30 bg-white/5 px-4 py-2 active:scale-95 ios:shadow-lg ios:shadow-accent-yellow/20 android:elevation-2">
        <Text className="text-[10px] font-bold uppercase tracking-widest text-accent-yellow">
          Personalize affirmation
        </Text>
      </Pressable>
    </DashboardCard>
  );
}

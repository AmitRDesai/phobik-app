import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { PracticeCategory } from '../types';

interface PracticeCardProps {
  practice: PracticeCategory;
}

export function PracticeCard({ practice }: PracticeCardProps) {
  return (
    <View
      className="relative overflow-hidden rounded-3xl border border-white/5 bg-card-dark"
      style={{
        shadowColor: colors.primary.pink,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 4,
      }}
    >
      {/* Corner glow */}
      <GlowBg
        bgClassName=""
        centerX={0.9}
        centerY={0.05}
        radius={1}
        intensity={0.9}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />

      {/* Top row: thumbnail + text */}
      <View className="flex-row gap-4 p-5">
        {/* Thumbnail */}
        <View className="h-24 w-24 overflow-hidden rounded-3xl border border-white/10">
          <LinearGradient
            colors={[colors.primary.pink, colors.accent.yellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.3,
            }}
          />
          <View className="absolute inset-0 items-center justify-center bg-black/20">
            <MaterialIcons
              name={
                practice.thumbnailIcon as keyof typeof MaterialIcons.glyphMap
              }
              size={32}
              color="white"
            />
          </View>
        </View>

        {/* Text column */}
        <View className="flex-1 justify-center">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-bold uppercase tracking-wider text-primary-pink">
              {practice.category}
            </Text>
            <Text className="text-xs font-medium text-white/60">
              {practice.duration}
            </Text>
          </View>
          <Text className="mt-1 text-xl font-bold text-white">
            {practice.title}
          </Text>
          <Text className="mt-1 text-sm text-gray-400" numberOfLines={1}>
            {practice.description}
          </Text>
        </View>
      </View>

      {/* Bottom row: benefit + explore button */}
      <View className="flex-row items-center justify-between px-5 pb-5">
        <View className="flex-row items-center gap-2">
          <MaterialIcons
            name={practice.benefitIcon as keyof typeof MaterialIcons.glyphMap}
            size={14}
            color="#6b7280"
          />
          <Text className="text-xs font-medium text-gray-400">
            {practice.benefit}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/practices/exercise-library')}
          className="rounded-full bg-primary-pink px-6 py-2 active:opacity-90"
        >
          <Text className="text-sm font-bold text-white">Explore</Text>
        </Pressable>
      </View>

      {/* Bottom accent line */}
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: 4, width: '100%', opacity: 0.5 }}
      />
    </View>
  );
}

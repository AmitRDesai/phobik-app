import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import type { PatternArchetype } from '../data/pivot-point-patterns';

interface PatternResultCardProps {
  archetype: PatternArchetype;
  isPrimary?: boolean;
}

export function PatternResultCard({
  archetype,
  isPrimary,
}: PatternResultCardProps) {
  if (!isPrimary) {
    return (
      <View className="rounded-2xl border border-foreground/5 bg-foreground/[0.03] p-5">
        <Text className="mb-2 text-lg font-bold text-foreground">
          {archetype.emoji} {archetype.label}
        </Text>
        <Text className="text-sm text-zinc-400">{archetype.tagline}</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[colors.primary.pink, colors.accent.yellow]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 16, padding: 1.5 }}
    >
      <View className="rounded-2xl bg-surface p-6">
        {/* Badge */}
        <View className="mb-3 self-start rounded-full bg-primary-pink/10 px-3 py-1">
          <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-pink">
            Primary Pattern
          </Text>
        </View>

        {/* Emoji + Title */}
        <Text className="mb-2 text-4xl">{archetype.emoji}</Text>
        <Text className="mb-3 text-2xl font-bold text-foreground">
          {archetype.label}
        </Text>
        <Text className="mb-5 text-sm text-zinc-400">{archetype.tagline}</Text>

        {/* Strength */}
        <View className="mb-3 flex-row items-center gap-2">
          <MaterialIcons name="bolt" size={18} color={colors.accent.yellow} />
          <Text className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Strength
          </Text>
        </View>
        <Text className="mb-4 text-sm text-foreground">
          {archetype.strength}
        </Text>

        {/* Growth Edge */}
        <View className="mb-3 flex-row items-center gap-2">
          <MaterialIcons
            name="psychology"
            size={18}
            color={colors.primary.pink}
          />
          <Text className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Growth Edge
          </Text>
        </View>
        <Text className="text-sm text-foreground">{archetype.growthEdge}</Text>
      </View>
    </LinearGradient>
  );
}

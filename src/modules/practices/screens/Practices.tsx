import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { ScrollView, Text, View } from 'react-native';

import { PracticeCard } from '../components/PracticeCard';
import { PracticesHeader } from '../components/PracticesHeader';
import { PRACTICE_CATEGORIES } from '../data/practices';

export default function Practices() {
  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-dashboard"
        centerY={0.25}
        intensity={0.5}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />
      <PracticesHeader />
      <ScrollView
        contentContainerClassName="gap-6 px-6 py-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xl font-bold text-white/90">
          I want to feel...
        </Text>
        {PRACTICE_CATEGORIES.map((practice) => (
          <PracticeCard key={practice.id} practice={practice} />
        ))}
        {/* Bottom spacer for tab bar clearance */}
        <View className="h-4" />
      </ScrollView>
    </View>
  );
}

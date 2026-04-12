import { BackButton } from '@/components/ui/BackButton';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PatternResultCard } from '../components/PatternResultCard';
import { RegulationScoreRing } from '../components/RegulationScoreRing';
import { PATTERN_ARCHETYPES } from '../data/pivot-point-patterns';
import { usePivotPointScoring } from '../hooks/usePivotPointScoring';

export default function PivotPointResults() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { computeResults } = usePivotPointScoring();

  const results = computeResults();

  if (!results) {
    return (
      <View className="flex-1 items-center justify-center bg-background-charcoal">
        <Text className="text-zinc-400">Assessment incomplete.</Text>
        <GradientButton onPress={() => router.back()} className="mt-4">
          Back to Assessments
        </GradientButton>
      </View>
    );
  }

  const primary = PATTERN_ARCHETYPES[results.primaryPattern];
  const secondary = PATTERN_ARCHETYPES[results.secondaryPattern];

  return (
    <View className="flex-1 bg-background-charcoal">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-6 pb-4"
        style={{
          paddingTop: insets.top + 8,
          backgroundColor: 'rgba(14,14,14,0.9)',
        }}
      >
        <BackButton onPress={() => router.back()} />
        <Text className="text-lg font-bold tracking-tight text-white">
          The Pivot Point
        </Text>
        <View className="h-10 w-10" />
      </View>

      <ScrollView
        contentContainerClassName="px-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View className="mb-8 pt-4">
          <Text className="mb-3 text-3xl font-bold tracking-tight text-white">
            This is how you respond under pressure
          </Text>
          <Text className="text-base leading-relaxed text-zinc-400">
            This isn&apos;t who you are&mdash;it&apos;s a pattern your brain has
            learned. And patterns can change.
          </Text>
        </View>

        {/* Primary Pattern */}
        <View className="mb-4">
          <PatternResultCard archetype={primary} isPrimary />
        </View>

        {/* Regulation Score */}
        <View className="mb-4">
          <RegulationScoreRing percentage={results.regulationScore} />
        </View>

        {/* Secondary Pattern */}
        <View className="mb-4">
          <View className="mb-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Secondary Pattern
            </Text>
          </View>
          <PatternResultCard archetype={secondary} />
        </View>

        {/* Personalization — Your Next Practices */}
        <View className="mb-4 rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <View className="mb-4 flex-row items-center gap-2">
            <MaterialIcons
              name="auto-awesome"
              size={18}
              color={colors.accent.yellow}
            />
            <Text className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Your Next Practices
            </Text>
          </View>
          <Text className="mb-4 text-sm leading-relaxed text-zinc-400">
            Based on your primary pattern, these are the practices that will
            help you most right now.
          </Text>
          {primary.recommendations.map((rec) => (
            <View key={rec} className="mb-3 flex-row items-start gap-3">
              <View className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-pink" />
              <Text className="flex-1 text-sm text-white">{rec}</Text>
            </View>
          ))}
        </View>

        {/* Closing Message */}
        <View className="mb-8 rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <Text className="text-sm italic leading-relaxed text-zinc-400">
            Your next step isn&apos;t to become someone new&hellip; It&apos;s to
            respond just 1% differently when it matters.
          </Text>
        </View>

        {/* CTA */}
        <GradientButton onPress={() => router.back()}>
          Back to Assessments
        </GradientButton>
      </ScrollView>
    </View>
  );
}

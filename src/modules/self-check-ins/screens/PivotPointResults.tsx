import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { accentFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { PatternResultCard } from '../components/PatternResultCard';
import { RegulationScoreRing } from '../components/RegulationScoreRing';
import { PATTERN_ARCHETYPES } from '../data/pivot-point-patterns';
import { usePivotPointScoring } from '../hooks/usePivotPointScoring';

export default function PivotPointResults() {
  const router = useRouter();
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  const { computeResults } = usePivotPointScoring();

  const results = computeResults();

  if (!results) {
    return (
      <Screen variant="default" className="px-6">
        <View className="flex-1 items-center justify-center">
          <Text variant="md" muted>
            Assessment incomplete.
          </Text>
          <GradientButton onPress={() => router.back()} className="mt-4">
            Back to Assessments
          </GradientButton>
        </View>
      </Screen>
    );
  }

  const primary = PATTERN_ARCHETYPES[results.primaryPattern];
  const secondary = PATTERN_ARCHETYPES[results.secondaryPattern];

  return (
    <Screen
      variant="default"
      scroll
      header={
        <Header
          left={<BackButton onPress={() => router.back()} />}
          center={
            <Text variant="lg" className="font-bold">
              The Pivot Point
            </Text>
          }
        />
      }
      sticky={
        <GradientButton onPress={() => router.back()}>
          Back to Assessments
        </GradientButton>
      }
      className="px-6"
    >
      <View className="mb-8 pt-4">
        <Text variant="h1" className="mb-3 font-bold">
          This is how you respond under pressure
        </Text>
        <Text variant="md" className="leading-relaxed text-foreground/60">
          This isn&apos;t who you are&mdash;it&apos;s a pattern your brain has
          learned. And patterns can change.
        </Text>
      </View>

      <View className="mb-4">
        <PatternResultCard archetype={primary} isPrimary />
      </View>

      <View className="mb-4">
        <RegulationScoreRing percentage={results.regulationScore} />
      </View>

      <View className="mb-4">
        <Text
          variant="caption"
          className="mb-2 font-bold tracking-widest text-foreground/55"
        >
          Secondary Pattern
        </Text>
        <PatternResultCard archetype={secondary} />
      </View>

      <Card variant="surface" className="mb-4 p-6">
        <View className="mb-4 flex-row items-center gap-2">
          <MaterialIcons name="auto-awesome" size={18} color={yellow} />
          <Text
            variant="caption"
            className="font-bold tracking-widest text-foreground/55"
          >
            Your Next Practices
          </Text>
        </View>
        <Text variant="sm" className="mb-4 leading-relaxed text-foreground/60">
          Based on your primary pattern, these are the practices that will help
          you most right now.
        </Text>
        {primary.recommendations.map((rec) => (
          <View key={rec} className="mb-3 flex-row items-start gap-3">
            <View className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-pink" />
            <Text variant="sm" className="flex-1">
              {rec}
            </Text>
          </View>
        ))}
      </Card>

      <Card variant="surface" className="p-6">
        <Text
          variant="sm"
          className="italic leading-relaxed text-foreground/60"
        >
          Your next step isn&apos;t to become someone new&hellip; It&apos;s to
          respond just 1% differently when it matters.
        </Text>
      </Card>
    </Screen>
  );
}

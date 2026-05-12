import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { ChipSelect } from '@/components/ui/ChipSelect';
import { accentFor, alpha, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { TextInput } from 'react-native';
import { OnboardingQuestionShell } from '../components/OnboardingQuestionShell';
import {
  onboardingCustomToolAtom,
  onboardingRegulationToolsAtom,
  type RegulationTool,
} from '../store/onboarding';

const MAX_SELECTIONS = 3;

const TOOLS: { id: RegulationTool; label: string }[] = [
  { id: 'breathing', label: 'Breathing' },
  { id: 'movement', label: 'Movement' },
  { id: 'journaling', label: 'Journaling' },
  { id: 'meditation', label: 'Meditation' },
  { id: 'calming-sounds', label: 'Calming sounds' },
  { id: 'learning', label: 'Learning' },
  { id: 'talking', label: 'Talking' },
  { id: 'listen-to-music', label: 'Listen to music' },
  { id: 'laughter', label: 'Laughter' },
  { id: 'rest', label: 'Rest' },
  { id: 'cooking', label: 'Cooking' },
  { id: 'not-sure', label: 'Not sure yet' },
];

export default function RegulationPreference() {
  const [selected, setSelected] = useAtom(onboardingRegulationToolsAtom);
  const [customTool, setCustomTool] = useAtom(onboardingCustomToolAtom);
  const scheme = useScheme();
  const orangeAccent = accentFor(scheme, 'orange');
  const yellowAccent = accentFor(scheme, 'yellow');

  // ChipSelect calls onChange with the next array. Reject updates that
  // would exceed MAX_SELECTIONS — the chip stays unselected because
  // ChipSelect is controlled by `value`.
  const handleChange = (next: RegulationTool[]) => {
    if (next.length <= MAX_SELECTIONS) setSelected(next);
  };

  return (
    <OnboardingQuestionShell
      step={4}
      title="When you're stressed, what helps most?"
      subtitle="Select options to help us personalize your tools."
      subtitleClassName="mt-3 text-base font-medium leading-relaxed text-foreground/60"
      buttonLabel="Continue"
      onButtonPress={() => router.push('/onboarding/energy-patterns')}
      buttonDisabled={selected.length === 0}
    >
      {/* Selection limit counter */}
      <Text size="xs" weight="medium" className="mb-4 text-foreground/40">
        Selection Limit: {selected.length} / {MAX_SELECTIONS}
      </Text>

      {/* Chip grid */}
      <ChipSelect
        options={TOOLS.map((t) => ({ value: t.id, label: t.label }))}
        value={selected}
        onChange={handleChange}
        variant="gradient"
        layout="wrap"
        className="mb-6"
      />

      <View className="mb-6 flex-row flex-wrap gap-2.5">
        {/* Other input */}
        <View className="mt-2 w-full">
          <View className="h-12 flex-row items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-5">
            <Text size="sm" weight="bold" className="text-foreground/50">
              Other:
            </Text>
            <TextInput
              value={customTool}
              onChangeText={setCustomTool}
              placeholder="type here..."
              placeholderTextColor={alpha.neutral55}
              className="flex-1 text-sm text-foreground"
            />
          </View>
        </View>
      </View>

      {/* Why this matters info box */}
      <View
        className="mt-4 rounded-xl border bg-foreground/5 p-5"
        style={{
          borderColor: withAlpha(yellowAccent, scheme === 'dark' ? 0.2 : 0.4),
          boxShadow: `0px 0px 25px ${withAlpha(orangeAccent, scheme === 'dark' ? 0.15 : 0.2)}`,
        }}
      >
        <View className="flex-row items-start gap-4">
          <View className="h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full">
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
              }}
            />
            <MaterialIcons name="info" size={22} color="white" />
          </View>
          <View className="flex-1">
            <Text size="sm" style={{ color: orangeAccent }} weight="bold">
              Why this matters
            </Text>
            <Text size="sm" tone="secondary" className="mt-1 leading-relaxed">
              We match your preferences with your current nervous system state
              to find your optimal stress tolerance.
            </Text>
          </View>
        </View>
      </View>
    </OnboardingQuestionShell>
  );
}

import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { Text, TextInput, View } from 'react-native';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { SelectableChip } from '../components/SelectableChip';
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

  const toggle = (id: RegulationTool) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((t) => t !== id));
    } else if (selected.length < MAX_SELECTIONS) {
      setSelected([...selected, id]);
    }
  };

  return (
    <OnboardingLayout
      step={4}
      title="When you're stressed, what helps most?"
      subtitle="Select options to help us personalize your tools."
      subtitleClassName="mt-3 text-base font-medium leading-relaxed text-primary-muted/80"
      onBack={() => router.back()}
      buttonLabel="Continue"
      onButtonPress={() => router.push('/onboarding/energy-patterns')}
      buttonDisabled={selected.length === 0}
    >
      {/* Selection limit counter */}
      <Text className="mb-4 text-xs font-medium uppercase tracking-widest text-white/40">
        Selection Limit: {selected.length} / {MAX_SELECTIONS}
      </Text>

      {/* Chip grid */}
      <View className="mb-6 flex-row flex-wrap gap-2.5">
        {TOOLS.map((tool) => (
          <SelectableChip
            key={tool.id}
            label={tool.label}
            selected={selected.includes(tool.id)}
            onPress={() => toggle(tool.id)}
          />
        ))}

        {/* Other input */}
        <View className="mt-2 w-full">
          <View className="h-12 flex-row items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5">
            <Text className="text-sm font-bold text-white/50">Other:</Text>
            <TextInput
              value={customTool}
              onChangeText={setCustomTool}
              placeholder="type here..."
              placeholderTextColor="rgba(255,255,255,0.2)"
              className="flex-1 text-sm text-white"
            />
          </View>
        </View>
      </View>

      {/* Why this matters info box */}
      <View
        className="mt-4 rounded-xl border border-accent-yellow/20 bg-white/5 p-5"
        style={{
          shadowColor: '#ff8e53',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 25,
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
            <Text style={{ color: '#ff8e53' }} className="text-sm font-bold">
              Why this matters
            </Text>
            <Text className="mt-1 text-xs leading-relaxed text-white/40">
              We match your preferences with your current nervous system state
              to find your optimal stress tolerance.
            </Text>
          </View>
        </View>
      </View>
    </OnboardingLayout>
  );
}

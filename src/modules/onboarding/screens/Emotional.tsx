import { View } from '@/components/themed/View';
import { OnboardingGridCard } from '@/modules/onboarding/components/OnboardingGridCard';
import { OnboardingQuestionShell } from '@/modules/onboarding/components/OnboardingQuestionShell';
import {
  type EmotionalState,
  onboardingEmotionalStateAtom,
} from '@/store/onboarding';
import type { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';

type IconName = keyof typeof MaterialIcons.glyphMap;
type EmotionOption = { value: EmotionalState; label: string; icon: IconName };

const EMOTION_OPTIONS: EmotionOption[] = [
  { value: 'calm', label: 'Calm', icon: 'spa' },
  { value: 'energized', label: 'Energized', icon: 'bolt' },
  { value: 'hopeful', label: 'Hopeful', icon: 'wb-sunny' },
  { value: 'focused', label: 'Focused', icon: 'gps-fixed' },
  { value: 'tired', label: 'Tired', icon: 'battery-2-bar' },
  { value: 'stressed', label: 'Stressed', icon: 'priority-high' },
  { value: 'anxious', label: 'Anxious', icon: 'air' },
  { value: 'restless', label: 'Restless', icon: 'directions-run' },
  { value: 'overwhelmed', label: 'Overwhelmed', icon: 'layers' },
  { value: 'burned-out', label: 'Burned out', icon: 'local-fire-department' },
  { value: 'disconnected', label: 'Disconnected', icon: 'link-off' },
  { value: 'foggy', label: 'Foggy', icon: 'cloud' },
];

function chunkPairs<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return rows;
}

export default function EmotionalScreen() {
  const [states, setStates] = useAtom(onboardingEmotionalStateAtom);

  // "Not sure" is mutually exclusive with the specific feelings.
  const toggle = (state: EmotionalState) => {
    if (state === 'not-sure') {
      setStates(states.includes('not-sure') ? [] : ['not-sure']);
      return;
    }
    const next = states.filter((s) => s !== 'not-sure');
    setStates(
      next.includes(state) ? next.filter((s) => s !== state) : [...next, state],
    );
  };

  return (
    <OnboardingQuestionShell
      step={11}
      showStepCounter={false}
      title="How have you been feeling lately?"
      subtitle="Select all that apply."
      buttonLabel="Continue"
      buttonDisabled={states.length === 0}
      buttonIcon={<Ionicons name="arrow-forward" size={24} color="white" />}
      onButtonPress={() => router.push('/onboarding/philosophy')}
    >
      <View className="gap-3">
        {chunkPairs(EMOTION_OPTIONS).map((row) => (
          <View key={row[0].value} className="flex-row gap-3">
            {row.map((option) => (
              <OnboardingGridCard
                key={option.value}
                icon={option.icon}
                label={option.label}
                selected={states.includes(option.value)}
                onPress={() => toggle(option.value)}
              />
            ))}
          </View>
        ))}
        <View className="flex-row">
          <OnboardingGridCard
            icon="help-outline"
            label="Not sure"
            selected={states.includes('not-sure')}
            onPress={() => toggle('not-sure')}
          />
        </View>
      </View>
    </OnboardingQuestionShell>
  );
}

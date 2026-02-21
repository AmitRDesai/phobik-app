import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { View } from 'react-native';
import { OnboardingGridCard } from '../components/OnboardingGridCard';
import { OnboardingLayout } from '../components/OnboardingLayout';
import {
  onboardingStressorsAtom,
  type LifeStressor,
} from '../store/onboarding';

const STRESSORS: {
  id: LifeStressor;
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
}[] = [
  { id: 'work', label: 'Work & Performance', icon: 'trending-up' },
  {
    id: 'financial',
    label: 'Financial Security',
    icon: 'account-balance-wallet',
  },
  { id: 'relationships', label: 'Relationships & Conflict', icon: 'groups' },
  { id: 'self-image', label: 'Self Image & Comparison', icon: 'person-search' },
  { id: 'time', label: 'Time Scarcity', icon: 'schedule' },
  { id: 'inner-critic', label: 'Inner Critic', icon: 'psychology-alt' },
  { id: 'isolation', label: 'Isolation & Loneliness', icon: 'person-off' },
  { id: 'fear', label: 'Unresolved Fear', icon: 'error' },
  { id: 'purpose', label: 'Lack of Purpose', icon: 'explore' },
  { id: 'exhaustion', label: 'Exhaustion & Recovery', icon: 'battery-1-bar' },
];

export default function LifeStressors() {
  const [selected, setSelected] = useAtom(onboardingStressorsAtom);

  const toggle = (id: LifeStressor) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  };

  return (
    <OnboardingLayout
      step={2}
      title="What tends to drain you most?"
      subtitle="Select all that apply to help us personalize your nervous system recovery plan."
      onBack={() => router.back()}
      buttonLabel="Continue"
      onButtonPress={() => router.push('/onboarding/fear-triggers')}
      buttonDisabled={selected.length === 0}
    >
      <View className="flex-row flex-wrap gap-3">
        {STRESSORS.map((stressor, index) => (
          <View key={stressor.id} className="w-[48%]">
            <OnboardingGridCard
              icon={stressor.icon}
              label={stressor.label}
              selected={selected.includes(stressor.id)}
              onPress={() => toggle(stressor.id)}
            />
          </View>
        ))}
      </View>
    </OnboardingLayout>
  );
}

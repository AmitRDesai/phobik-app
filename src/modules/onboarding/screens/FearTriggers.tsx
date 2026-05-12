import { View } from '@/components/themed/View';
import { alpha } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { TextInput } from 'react-native';
import { FearTriggersDialog } from '../components/FearTriggersDialog';
import { OnboardingGridCard } from '../components/OnboardingGridCard';
import { OnboardingQuestionShell } from '../components/OnboardingQuestionShell';
import {
  onboardingCustomTriggerAtom,
  onboardingTriggersAtom,
  type FearTrigger,
} from '../store/onboarding';

const TRIGGERS: {
  id: FearTrigger;
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
}[] = [
  { id: 'spiders', label: 'Fear of Spiders', icon: 'bug-report' },
  { id: 'heights', label: 'Fear of Heights', icon: 'landscape' },
  { id: 'claustrophobia', label: 'Claustrophobia', icon: 'view-in-ar' },
  { id: 'flying', label: 'Flying', icon: 'flight' },
  { id: 'snakes', label: 'Snakes', icon: 'pets' },
  { id: 'dentist', label: 'Dentist', icon: 'local-hospital' },
  {
    id: 'public-speaking',
    label: 'Public Speaking',
    icon: 'record-voice-over',
  },
  { id: 'crowds', label: 'Crowds', icon: 'groups' },
  { id: 'needles', label: 'Needles', icon: 'vaccines' },
  { id: 'dogs', label: 'Dogs', icon: 'pets' },
];

export default function FearTriggers() {
  const [selected, setSelected] = useAtom(onboardingTriggersAtom);
  const [customTrigger, setCustomTrigger] = useAtom(
    onboardingCustomTriggerAtom,
  );

  const toggle = (id: FearTrigger) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((t) => t !== id)
        : [...selected, id],
    );
  };

  const handleContinue = async () => {
    if (selected.length > 0) {
      await dialog.open({
        component: FearTriggersDialog,
      });
    }
    router.push('/onboarding/regulation-preference');
  };

  return (
    <OnboardingQuestionShell
      step={3}
      title="Are there specific situations that spike anxiety for you?"
      titleClassName="text-[22px] font-extrabold leading-tight text-foreground"
      subtitle="Select all that apply to personalize your nervous system support."
      buttonLabel="Continue"
      onButtonPress={handleContinue}
    >
      {/* Grid */}
      <View className="flex-row flex-wrap gap-3">
        {TRIGGERS.map((trigger) => (
          <View key={trigger.id} className="w-[48%]">
            <OnboardingGridCard
              icon={trigger.icon}
              label={trigger.label}
              selected={selected.includes(trigger.id)}
              onPress={() => toggle(trigger.id)}
              height={100}
            />
          </View>
        ))}

        {/* Other input */}
        <View className="w-full">
          <View className="flex-row items-center gap-2 rounded-xl border border-foreground/5 bg-foreground/5 px-3.5 py-3">
            <MaterialIcons name="edit-note" size={20} color={alpha.neutral60} />
            <TextInput
              value={customTrigger}
              onChangeText={setCustomTrigger}
              placeholder="Other (type here...)"
              placeholderTextColor={alpha.neutral55}
              className="android:p-0 flex-1 text-sm text-foreground"
            />
          </View>
        </View>
      </View>
    </OnboardingQuestionShell>
  );
}

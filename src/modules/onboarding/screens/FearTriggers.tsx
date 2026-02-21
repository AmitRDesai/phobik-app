import { colors } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { FearTriggersDialog } from '../components/FearTriggersDialog';
import { OnboardingGridCard } from '../components/OnboardingGridCard';
import { OnboardingLayout } from '../components/OnboardingLayout';
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
  { id: 'snakes', label: 'Snakes', icon: 'vital-signs' as any },
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
  const [search, setSearch] = useState('');

  const toggle = (id: FearTrigger) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((t) => t !== id)
        : [...selected, id],
    );
  };

  const filtered = search
    ? TRIGGERS.filter((t) =>
        t.label.toLowerCase().includes(search.toLowerCase()),
      )
    : TRIGGERS;

  const handleContinue = async () => {
    if (selected.length > 0) {
      await dialog.open({
        component: FearTriggersDialog,
      });
    }
    router.push('/onboarding/regulation-preference');
  };

  return (
    <OnboardingLayout
      step={3}
      title="Are there specific situations that spike anxiety for you?"
      titleClassName="text-[22px] font-extrabold leading-tight tracking-tight text-white"
      subtitle="Select all that apply to personalize your nervous system support."
      onBack={() => router.back()}
      buttonLabel="Continue"
      onButtonPress={handleContinue}
    >
      {/* Search Input */}
      <View className="mb-4 flex-row items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3.5 py-3">
        <MaterialIcons name="search" size={20} color="rgba(255,255,255,0.3)" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search triggers..."
          placeholderTextColor={colors.primary.muted}
          className="flex-1 text-sm text-white android:p-0"
        />
      </View>

      {/* Grid */}
      <View className="flex-row flex-wrap gap-3">
        {filtered.map((trigger) => (
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
          <View className="flex-row items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3.5 py-3">
            <MaterialIcons
              name="edit-note"
              size={20}
              color="rgba(255,255,255,0.2)"
            />
            <TextInput
              value={customTrigger}
              onChangeText={setCustomTrigger}
              placeholder="Other (type here...)"
              placeholderTextColor="rgba(255,255,255,0.3)"
              className="flex-1 text-sm text-white android:p-0"
            />
          </View>
        </View>
      </View>
    </OnboardingLayout>
  );
}

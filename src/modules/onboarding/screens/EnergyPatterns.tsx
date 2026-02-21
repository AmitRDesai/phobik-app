import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { Text, View } from 'react-native';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { SegmentedControl } from '../components/SegmentedControl';
import {
  onboardingEnergyCreativityAtom,
  onboardingEnergyDipAtom,
  onboardingEnergyFocusAtom,
  type TimeOfDay,
} from '../store/onboarding';

const TIME_OPTIONS: { label: string; value: TimeOfDay }[] = [
  { label: 'Morning', value: 'morning' },
  { label: 'Midday', value: 'midday' },
  { label: 'Evening', value: 'evening' },
];

const SECTIONS: {
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
}[] = [
  { label: 'Focus comes easiest...', icon: 'bolt' },
  { label: 'Creativity flows most...', icon: 'auto-awesome' },
  { label: 'Energy dips most...', icon: 'battery-2-bar' },
];

export default function EnergyPatterns() {
  const [focus, setFocus] = useAtom(onboardingEnergyFocusAtom);
  const [creativity, setCreativity] = useAtom(onboardingEnergyCreativityAtom);
  const [dip, setDip] = useAtom(onboardingEnergyDipAtom);

  const atoms = [
    { value: focus, setter: setFocus },
    { value: creativity, setter: setCreativity },
    { value: dip, setter: setDip },
  ];

  return (
    <OnboardingLayout
      step={5}
      title="Understanding your energy helps PHOBIK tailor your nervous system regulation."
      titleClassName="text-[22px] font-extrabold leading-tight tracking-tight text-white"
      onBack={() => router.back()}
      buttonLabel="Continue"
      onButtonPress={() => router.push('/onboarding/calendar-support')}
    >
      <View className="gap-8">
        {SECTIONS.map((section, index) => (
          <View key={section.label}>
            <View className="mb-3 flex-row items-center gap-2">
              <MaterialIcons name={section.icon} size={20} color="#f4258c" />
              <Text className="text-lg font-bold text-white">
                {section.label}
              </Text>
            </View>
            <SegmentedControl
              options={TIME_OPTIONS}
              selected={atoms[index].value}
              onSelect={atoms[index].setter}
            />
          </View>
        ))}
      </View>
    </OnboardingLayout>
  );
}

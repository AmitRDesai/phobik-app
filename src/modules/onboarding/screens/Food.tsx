import { View } from '@/components/themed/View';
import { TextField } from '@/components/ui/TextField';
import { OnboardingGridCard } from '@/modules/onboarding/components/OnboardingGridCard';
import { OnboardingQuestionShell } from '@/modules/onboarding/components/OnboardingQuestionShell';
import {
  type FoodPreference,
  onboardingFoodPreferencesAtom,
  onboardingFoodPreferencesOtherAtom,
} from '@/store/onboarding';
import type { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { useState } from 'react';

type IconName = keyof typeof MaterialIcons.glyphMap;
type FoodOption = { value: FoodPreference; label: string; icon: IconName };

const FOOD_OPTIONS: FoodOption[] = [
  { value: 'dairy-free', label: 'Dairy free', icon: 'water-drop' },
  { value: 'gluten-free', label: 'Gluten free', icon: 'grass' },
  { value: 'vegetarian', label: 'Vegetarian', icon: 'eco' },
  { value: 'vegan', label: 'Vegan', icon: 'spa' },
  { value: 'keto', label: 'Keto', icon: 'egg' },
  { value: 'paleo', label: 'Paleo', icon: 'terrain' },
  { value: 'mediterranean', label: 'Mediterranean', icon: 'beach-access' },
  { value: 'high-protein', label: 'High protein', icon: 'fitness-center' },
  { value: 'low-sugar', label: 'Low sugar', icon: 'health-and-safety' },
  { value: 'no-preference', label: 'No preference', icon: 'check-circle' },
];

function chunkPairs<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return rows;
}

export default function FoodScreen() {
  const [prefs, setPrefs] = useAtom(onboardingFoodPreferencesAtom);
  const [other, setOther] = useAtom(onboardingFoodPreferencesOtherAtom);
  const [showOther, setShowOther] = useState(other.length > 0);

  // "No preference" is mutually exclusive with everything else.
  const toggle = (pref: FoodPreference) => {
    if (pref === 'no-preference') {
      setPrefs(prefs.includes('no-preference') ? [] : ['no-preference']);
      return;
    }
    const next = prefs.filter((p) => p !== 'no-preference');
    setPrefs(
      next.includes(pref) ? next.filter((p) => p !== pref) : [...next, pref],
    );
  };

  return (
    <OnboardingQuestionShell
      step={5}
      showStepCounter={false}
      title="Do you follow any food or lifestyle preferences?"
      subtitle="Select all that apply."
      buttonLabel="Continue"
      buttonDisabled={prefs.length === 0 && other.trim().length === 0}
      buttonIcon={<Ionicons name="arrow-forward" size={24} color="white" />}
      onButtonPress={() => router.push('/onboarding/activity')}
    >
      <View className="gap-3">
        {chunkPairs(FOOD_OPTIONS).map((row) => (
          <View key={row[0].value} className="flex-row gap-3">
            {row.map((option) => (
              <OnboardingGridCard
                key={option.value}
                icon={option.icon}
                label={option.label}
                selected={prefs.includes(option.value)}
                onPress={() => toggle(option.value)}
              />
            ))}
            {row.length === 1 ? <View className="flex-1" /> : null}
          </View>
        ))}
        <View className="flex-row">
          <OnboardingGridCard
            icon={showOther ? 'remove-circle' : 'add-circle'}
            label="Other preference"
            selected={showOther}
            onPress={() => setShowOther((v) => !v)}
          />
        </View>
        {showOther ? (
          <TextField
            value={other}
            onChangeText={setOther}
            placeholder="Tell us more…"
            autoFocus
          />
        ) : null}
      </View>
    </OnboardingQuestionShell>
  );
}

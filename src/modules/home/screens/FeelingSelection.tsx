import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientButton } from '@/components/ui/GradientButton';
import { Screen } from '@/components/ui/Screen';
import { router } from 'expo-router';
import { useState } from 'react';
import { AffirmationHeader } from '../components/AffirmationHeader';
import { FeelingCompass } from '../components/FeelingCompass';

export default function FeelingSelection() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Screen
      variant="default"
      header={<AffirmationHeader currentStep={1} />}
      sticky={
        <GradientButton
          onPress={() =>
            router.push({
              pathname: '/affirmation/affirmation-ready',
              params: { feeling: selected! },
            })
          }
          disabled={!selected}
        >
          Continue
        </GradientButton>
      }
      className="items-center justify-center px-6"
    >
      <View className="mb-10">
        <Text size="h2" align="center" className="font-light leading-tight">
          What do you want to feel{'\n'}
          more of today?
        </Text>
      </View>
      <FeelingCompass selected={selected} onSelect={setSelected} />
    </Screen>
  );
}

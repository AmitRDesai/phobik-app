import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AffirmationHeader } from '../components/AffirmationHeader';
import { FeelingCompass } from '../components/FeelingCompass';

export default function FeelingSelection() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Container>
      <GlowBg centerY={0.55} />

      <AffirmationHeader currentStep={1} />

      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-10">
          <Text className="text-center text-2xl font-light leading-tight text-white">
            What do you want to feel{'\n'}
            <Text className="italic">more of</Text> today?
          </Text>
        </View>

        <FeelingCompass selected={selected} onSelect={setSelected} />
      </View>

      <View className="px-6 pb-10">
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
      </View>
    </Container>
  );
}

import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { router, useLocalSearchParams } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AffirmationHeader } from '../components/AffirmationHeader';
import { AffirmationReadyCard } from '../components/AffirmationReadyCard';
import { AFFIRMATIONS, affirmationAtom } from '../store/affirmation';

export default function AffirmationReady() {
  const { feeling } = useLocalSearchParams<{ feeling: string }>();
  const setAffirmation = useSetAtom(affirmationAtom);

  const [text, setText] = useState(() => {
    const options = AFFIRMATIONS[feeling] ?? AFFIRMATIONS.courage;
    return options[Math.floor(Math.random() * options.length)];
  });

  const handleSync = () => {
    const options = AFFIRMATIONS[feeling] ?? AFFIRMATIONS.courage;
    const newText = options[Math.floor(Math.random() * options.length)];
    setText(newText);
  };

  const handleSave = () => {
    setAffirmation({ feeling, text });
    router.navigate('/');
  };

  return (
    <Container>
      <GlowBg centerY={0.3} />

      <AffirmationHeader currentStep={2} />

      <View className="flex-1 px-6 pt-4">
        <AffirmationReadyCard
          feeling={feeling}
          affirmation={text}
          onSync={handleSync}
        />

        <View className="mt-6 px-4">
          <Text className="text-center text-base leading-relaxed text-white/70">
            Your affirmation works best when you practice it regularly. Repeat
            it during challenging moments to help guide your thoughts and
            reactions.
          </Text>
        </View>
      </View>

      <View className="px-6 pb-10">
        <GradientButton onPress={handleSave}>
          Save to Today Dashboard
        </GradientButton>
      </View>
    </Container>
  );
}

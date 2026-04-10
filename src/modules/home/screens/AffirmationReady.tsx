import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { StackActions } from '@react-navigation/native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AffirmationHeader } from '../components/AffirmationHeader';
import { AffirmationReadyCard } from '../components/AffirmationReadyCard';
import { useSaveAffirmation } from '../hooks/useAffirmation';
import {
  type Feeling,
  getAffirmations,
  getTimeOfDay,
} from '../store/affirmation';

function pickRandom(options: string[]): string {
  return options[Math.floor(Math.random() * options.length)];
}

export default function AffirmationReady() {
  const { feeling } = useLocalSearchParams<{ feeling: string }>();
  const saveAffirmation = useSaveAffirmation();
  const navigation = useNavigation();
  const parentNavigation = navigation.getParent();

  const [text, setText] = useState(() => {
    const pool = getAffirmations(getTimeOfDay(), feeling as Feeling);
    return pickRandom(pool);
  });

  const handleSync = () => {
    const pool = getAffirmations(getTimeOfDay(), feeling as Feeling);
    setText(pickRandom(pool));
  };

  const handleSave = async () => {
    await saveAffirmation.mutateAsync({ feeling, text });

    // Pop the affirmation group from the root Stack
    parentNavigation?.dispatch(StackActions.pop());
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
        <GradientButton
          onPress={handleSave}
          loading={saveAffirmation.isPending}
        >
          Save to Today Dashboard
        </GradientButton>
      </View>
    </Container>
  );
}

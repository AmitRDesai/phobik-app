import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Screen } from '@/components/ui/Screen';
import { dismissToRoot } from '@/utils/navigation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
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
  const router = useRouter();

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
    dismissToRoot(router);
  };

  return (
    <Screen
      header={<AffirmationHeader currentStep={2} />}
      sticky={
        <Button onPress={handleSave} loading={saveAffirmation.isPending}>
          Save to Today Dashboard
        </Button>
      }
      className="px-6 pt-4"
    >
      <AffirmationReadyCard
        feeling={feeling}
        affirmation={text}
        onSync={handleSync}
      />
      <View className="mt-6 px-4">
        <Text
          size="lg"
          align="center"
          tone="secondary"
          className="leading-relaxed"
        >
          Your affirmation works best when you practice it regularly. Repeat it
          during challenging moments to help guide your thoughts and reactions.
        </Text>
      </View>
    </Screen>
  );
}

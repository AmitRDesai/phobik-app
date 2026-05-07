import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { colors, withAlpha } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

import {
  useSaveAffirmation,
  useTodayAffirmation,
} from '../hooks/useAffirmation';
import { AFFIRMATIONS, FEELINGS, getTimeOfDay } from '../store/affirmation';

export function AffirmationCard() {
  const { data: affirmation } = useTodayAffirmation();
  const saveAffirmation = useSaveAffirmation();

  const handleRefresh = async () => {
    const result = await dialog.info({
      title: 'Refresh Affirmation',
      message: 'Get a new random affirmation for today?',
      buttons: [
        { label: 'Refresh', value: 'refresh', variant: 'primary' as const },
        { label: 'Cancel', value: 'cancel', variant: 'secondary' as const },
      ],
    });
    if (result === 'refresh') {
      const time = getTimeOfDay();
      const randomFeeling =
        FEELINGS[Math.floor(Math.random() * FEELINGS.length)]!;
      const options = AFFIRMATIONS[time][randomFeeling];
      const randomText = options[Math.floor(Math.random() * options.length)]!;
      saveAffirmation.mutate({ feeling: randomFeeling, text: randomText });
    }
  };

  const renderAffirmationText = () => {
    if (!affirmation) {
      return (
        <View className="items-center gap-3 py-2">
          <MaterialIcons
            name="format-quote"
            size={32}
            color={withAlpha(colors.primary.pink, 0.4)}
          />
          <Text
            variant="lg"
            className="text-center font-light leading-relaxed text-foreground/40"
          >
            Tap below to set your affirmation for today
          </Text>
        </View>
      );
    }

    const feeling = affirmation.feeling as string;
    const text = affirmation.text as string;
    const index = text.toLowerCase().indexOf(feeling.toLowerCase());

    if (index < 0) {
      return (
        <Text className="text-center text-3xl font-light italic leading-relaxed text-foreground/95">
          {'"'}
          {text}.{'"'}
        </Text>
      );
    }

    const before = text.slice(0, index);
    const word = text.slice(index, index + feeling.length);
    const after = text.slice(index + feeling.length);

    return (
      <Text className="text-center text-3xl font-light italic leading-relaxed text-foreground/95">
        {'"'}
        {before}
        <Text className="font-bold text-primary-pink">{word}</Text>
        {after}.{'"'}
      </Text>
    );
  };

  return (
    <DashboardCard
      className="min-h-[200px] items-center justify-between p-8"
      style={{
        boxShadow: `0 12px 32px ${withAlpha(colors.primary.pink, 0.15)}`,
      }}
    >
      <View className="mb-2 w-full flex-row items-start justify-between">
        <View className="w-6" />
        <Text
          variant="xs"
          className="max-w-[180px] text-center font-medium italic leading-tight tracking-wide text-foreground/50"
        >
          Set the intention for the day
        </Text>
        {affirmation ? (
          <Pressable onPress={handleRefresh} className="active:scale-90">
            <MaterialIcons
              name="sync"
              size={22}
              color={withAlpha(colors.primary.pink, 0.7)}
            />
          </Pressable>
        ) : (
          <View className="w-6" />
        )}
      </View>

      <View className="flex-1 items-center justify-center py-4">
        {renderAffirmationText()}
      </View>

      <Button
        variant="secondary"
        size="compact"
        onPress={() => router.push('/affirmation/feeling-selection')}
        className="mt-4"
      >
        {affirmation ? 'Change affirmation' : 'Set affirmation'}
      </Button>
    </DashboardCard>
  );
}

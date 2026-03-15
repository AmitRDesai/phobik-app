import { colors } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { Pressable, Text, View } from 'react-native';

import { AFFIRMATIONS, affirmationAtom } from '../store/affirmation';
import { DashboardCard } from '@/components/ui/DashboardCard';

export function AffirmationCard() {
  const affirmation = useAtomValue(affirmationAtom);
  const setAffirmation = useSetAtom(affirmationAtom);

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
      const feelings = Object.keys(AFFIRMATIONS);
      const randomFeeling =
        feelings[Math.floor(Math.random() * feelings.length)];
      const options = AFFIRMATIONS[randomFeeling];
      const randomText = options[Math.floor(Math.random() * options.length)];
      setAffirmation({ feeling: randomFeeling, text: randomText });
    }
  };

  const renderAffirmationText = () => {
    if (!affirmation) {
      return (
        <Text className="text-center text-3xl font-light italic leading-relaxed text-white/95">
          {'"'}Today, I move with{' '}
          <Text className="font-bold text-primary-pink">courage</Text>.{'"'}
        </Text>
      );
    }

    const { feeling, text } = affirmation;
    const index = text.toLowerCase().indexOf(feeling.toLowerCase());
    if (index < 0) {
      return (
        <Text className="text-center text-3xl font-light italic leading-relaxed text-white/95">
          {'"'}
          {text}.{'"'}
        </Text>
      );
    }

    const before = text.slice(0, index);
    const word = text.slice(index, index + feeling.length);
    const after = text.slice(index + feeling.length);

    return (
      <Text className="text-center text-3xl font-light italic leading-relaxed text-white/95">
        {'"'}
        {before}
        <Text className="font-bold text-primary-pink">{word}</Text>
        {after}.{'"'}
      </Text>
    );
  };

  return (
    <DashboardCard className="min-h-[200px] items-center justify-between p-8 shadow-2xl shadow-primary-pink/15">
      <View className="mb-2 w-full flex-row items-start justify-between">
        <View className="w-6" />
        <Text className="max-w-[180px] text-center text-[10px] font-medium italic leading-tight tracking-wide text-white/50">
          Set the intention for the day
        </Text>
        <Pressable onPress={handleRefresh} className="active:scale-90">
          <MaterialIcons
            name="sync"
            size={22}
            color={`${colors.primary.pink}B3`}
          />
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center py-4">
        {renderAffirmationText()}
      </View>

      <Pressable
        onPress={() => router.push('/affirmation/feeling-selection')}
        className="mt-4 rounded-full border border-accent-yellow/30 bg-white/5 px-4 py-2 active:scale-95 ios:shadow-lg ios:shadow-accent-yellow/20 android:elevation-2"
      >
        <Text className="text-[10px] font-bold uppercase tracking-widest text-accent-yellow">
          Personalize affirmation
        </Text>
      </Pressable>
    </DashboardCard>
  );
}

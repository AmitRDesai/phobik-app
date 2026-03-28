import { dialog } from '@/utils/dialog';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { CourageHeader } from '../components/CourageHeader';
import { SpecializedPackCard } from '../components/SpecializedPackCard';
import { SPECIALIZED_PACKS } from '../data/specialized-packs';

export default function SpecializedPacks() {
  const router = useRouter();
  // TODO: Replace with in-app purchase flow — this is for testing purposes only
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());

  const handleUnlock = useCallback(
    async (packId: string, packTitle: string) => {
      const result = await dialog.info({
        title: `Unlock ${packTitle}?`,
        message: 'This will give you full access to all sessions in this pack.',
        buttons: [
          { label: 'Cancel', value: 'cancel', variant: 'secondary' },
          { label: 'Unlock', value: 'unlock', variant: 'primary' },
        ],
      });

      if (result === 'unlock') {
        setUnlockedIds((prev) => new Set(prev).add(packId));
      }
    },
    [],
  );

  const handleView = useCallback(() => {
    router.push('/practices/flight-checklist-hub');
  }, [router]);

  return (
    <View className="flex-1 bg-background-charcoal">
      <CourageHeader title="Specialized Packs" />
      <ScrollView
        contentContainerClassName="px-4 pb-28"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-2 pt-4 pb-2">
          <Text className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Premium Journeys
          </Text>
          <Text className="text-3xl font-bold text-white">
            Enhance Your Mind
          </Text>
        </View>

        <View className="mt-6 gap-6">
          {SPECIALIZED_PACKS.map((pack) => (
            <SpecializedPackCard
              key={pack.id}
              pack={pack}
              unlocked={unlockedIds.has(pack.id)}
              onUnlock={() => handleUnlock(pack.id, pack.title)}
              onView={pack.id === 'fear-of-flying' ? handleView : undefined}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

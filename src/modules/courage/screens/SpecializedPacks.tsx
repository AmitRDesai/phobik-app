import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { usePackPurchases } from '@/modules/purchases/hooks/usePackPurchased';

import { SpecializedPackCard } from '../components/SpecializedPackCard';
import { SPECIALIZED_PACKS } from '../data/specialized-packs';

export default function SpecializedPacks() {
  const router = useRouter();
  const purchasedPacks = usePackPurchases();

  const handleNavigateToLanding = useCallback(() => {
    router.push('/practices/ebook-landing');
  }, [router]);

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="Specialized Packs" />}
      className="px-4"
    >
      <View className="px-2 pb-2 pt-4">
        <Text variant="caption" muted className="mb-1">
          Premium Journeys
        </Text>
        <Text variant="h1">Enhance Your Mind</Text>
      </View>

      <View className="mt-6 gap-6">
        {SPECIALIZED_PACKS.map((pack) => (
          <SpecializedPackCard
            key={pack.id}
            pack={pack}
            unlocked={purchasedPacks.has(pack.id)}
            onUnlock={
              pack.status === 'active' ? handleNavigateToLanding : undefined
            }
            onView={
              pack.status === 'active' ? handleNavigateToLanding : undefined
            }
          />
        ))}
      </View>
    </Screen>
  );
}

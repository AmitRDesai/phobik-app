import { usePackPurchases } from '@/modules/purchases/hooks/usePackPurchased';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Text } from '@/components/themed/Text';
import { ScrollView, View } from 'react-native';
import { CourageHeader } from '../components/CourageHeader';
import { SpecializedPackCard } from '../components/SpecializedPackCard';
import { SPECIALIZED_PACKS } from '../data/specialized-packs';

export default function SpecializedPacks() {
  const router = useRouter();
  const purchasedPacks = usePackPurchases();

  const handleNavigateToLanding = useCallback(() => {
    router.push('/practices/ebook-landing');
  }, [router]);

  return (
    <View className="flex-1 bg-surface">
      <CourageHeader title="Specialized Packs" />
      <ScrollView
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-2 pb-2 pt-4">
          <Text variant="caption" className="mb-1 text-foreground/60">
            Premium Journeys
          </Text>
          <Text className="text-3xl font-bold text-foreground">
            Enhance Your Mind
          </Text>
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
      </ScrollView>
    </View>
  );
}

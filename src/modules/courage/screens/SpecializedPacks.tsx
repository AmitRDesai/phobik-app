import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { CourageHeader } from '../components/CourageHeader';
import { SpecializedPackCard } from '../components/SpecializedPackCard';
import { SPECIALIZED_PACKS } from '../data/specialized-packs';
import { ebookPurchasedAtom } from '@/modules/ebook/store/ebook-purchase';

export default function SpecializedPacks() {
  const router = useRouter();
  const [ebookPurchased] = useAtom(ebookPurchasedAtom);

  const handleNavigateToLanding = useCallback(() => {
    router.push('/practices/ebook-landing');
  }, [router]);

  return (
    <View className="flex-1 bg-background-charcoal">
      <CourageHeader title="Specialized Packs" />
      <ScrollView
        contentContainerClassName="px-4 pb-28"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-2 pb-2 pt-4">
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
              unlocked={pack.id === 'fear-of-flying' ? ebookPurchased : false}
              onUnlock={
                pack.id === 'fear-of-flying'
                  ? handleNavigateToLanding
                  : undefined
              }
              onView={
                pack.id === 'fear-of-flying'
                  ? handleNavigateToLanding
                  : undefined
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

import { PillarCard } from '@/modules/practices/components/PillarCard';
import { PillarHeroHeader } from '@/modules/practices/components/PillarHeroHeader';
import { PracticeScreenShell } from '@/modules/practices/components/PracticeScreenShell';
import { dialog } from '@/utils/dialog';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { SOUNDSCAPE_CATEGORIES } from '../data/sound-studio';

export default function CuratedSoundscapes() {
  const router = useRouter();

  return (
    <PracticeScreenShell
      wordmark="Sound Studio"
      bgClassName="bg-background-charcoal"
      glowCenterY={0.25}
      glowIntensity={0.5}
    >
      <PillarHeroHeader
        title="CURATED"
        accent="SOUNDSCAPES"
        subtitle="Curated soundscapes designed to help you reset your body, settle your thoughts, and feel safe — fast."
      />

      <View className="gap-5">
        {SOUNDSCAPE_CATEGORIES.map((cat) => (
          <PillarCard
            key={cat.id}
            image={cat.image}
            title={cat.title}
            subtitle={cat.subtitle}
            eyebrow={cat.meta}
            onPress={() =>
              dialog.info({
                title: 'Coming soon',
                message: 'Curated soundscape playback will be available soon.',
              })
            }
            aspect="square"
          />
        ))}
      </View>
    </PracticeScreenShell>
  );
}

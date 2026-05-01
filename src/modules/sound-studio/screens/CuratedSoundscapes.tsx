import { GradientText } from '@/modules/practices/components/GradientText';
import { PillarCard } from '@/modules/practices/components/PillarCard';
import { PracticeScreenShell } from '@/modules/practices/components/PracticeScreenShell';
import { dialog } from '@/utils/dialog';
import { Text, View } from 'react-native';

import { SOUNDSCAPE_CATEGORIES } from '../data/sound-studio';

export default function CuratedSoundscapes() {
  return (
    <PracticeScreenShell
      wordmark="Sound Studio"
      bgClassName="bg-background-charcoal"
      glowCenterY={0.25}
      glowIntensity={0.5}
    >
      {/* Smaller hero so "CURATED SOUNDSCAPES" fits on two lines cleanly */}
      <View className="mb-8 mt-6">
        <Text className="text-[32px] font-extrabold uppercase leading-none tracking-tighter text-white">
          CURATED
        </Text>
        <GradientText className="text-[32px] font-extrabold uppercase leading-none tracking-tighter">
          SOUNDSCAPES
        </GradientText>
        <Text className="mt-3 max-w-[320px] text-sm leading-relaxed text-white/60">
          Curated soundscapes designed to help you reset your body, settle your
          thoughts, and feel safe — fast.
        </Text>
      </View>

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

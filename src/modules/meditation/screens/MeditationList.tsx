import { GradientText } from '@/modules/practices/components/GradientText';
import { PracticeListRow } from '@/modules/practices/components/PracticeListRow';
import { PracticeScreenShell } from '@/modules/practices/components/PracticeScreenShell';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { MEDITATIONS } from '../data/meditations';

export default function MeditationList() {
  const router = useRouter();

  return (
    <PracticeScreenShell
      wordmark="FLOW STUDIO"
      bgClassName="bg-background-charcoal"
      glowCenterY={0.25}
      glowIntensity={0.5}
    >
      <View className="mb-8 mt-4">
        <GradientText className="text-[44px] font-extrabold leading-none tracking-tighter">
          Meditations
        </GradientText>
        <Text className="mt-4 max-w-[340px] text-base leading-relaxed text-white/60">
          Step into your biometric field. Choose a practice to align your
          physiological state with your mental intention.
        </Text>
      </View>

      <View className="gap-5">
        {MEDITATIONS.map((meditation) => (
          <PracticeListRow
            key={meditation.id}
            image={meditation.listImage}
            title={meditation.title}
            meta={meditation.shortDescription}
            tags={[meditation.duration]}
            onPress={() => router.push(meditation.route)}
          />
        ))}
      </View>
    </PracticeScreenShell>
  );
}

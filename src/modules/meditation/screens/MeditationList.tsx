import { GradientButton } from '@/components/ui/GradientButton';
import { GradientText } from '@/components/ui/GradientText';
import { PracticeListRow } from '@/modules/practices/components/PracticeListRow';
import { PracticeScreenShell } from '@/modules/practices/components/PracticeScreenShell';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { MEDITATIONS } from '../data/meditations';
import { meditationSessionsAtom } from '../store/sessions';

export default function MeditationList() {
  const router = useRouter();
  const sessions = useAtomValue(meditationSessionsAtom);

  // Most recently updated saved session (if any) — surfaces the "Unfinished
  // session" card matching the BreatheList resume pattern.
  const resumable = useMemo(() => {
    const entries = Object.entries(sessions);
    if (entries.length === 0) return null;
    entries.sort(([, a], [, b]) => b.updatedAt - a.updatedAt);
    const first = entries[0];
    if (!first) return null;
    const [id] = first;
    const meditation = MEDITATIONS.find((m) => m.id === id);
    return meditation ?? null;
  }, [sessions]);

  return (
    <PracticeScreenShell
      wordmark="FLOW STUDIO"
      bgClassName="bg-surface"
      glowCenterY={0.25}
      glowIntensity={0.5}
    >
      <View className="mb-8 mt-4">
        <GradientText className="text-[44px] font-extrabold leading-none tracking-tighter">
          Meditations
        </GradientText>
        <Text className="mt-4 max-w-[340px] text-base leading-relaxed text-foreground/60">
          Step into your biometric field. Choose a practice to align your
          physiological state with your mental intention.
        </Text>
      </View>

      {resumable ? (
        <Pressable
          onPress={() => router.push(resumable.route)}
          className="mb-6 active:scale-[0.98]"
        >
          <View className="flex-row items-center gap-4 rounded-3xl border border-primary-pink/30 bg-primary-pink/10 p-4">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-pink/20">
              <MaterialIcons name="play-arrow" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-pink">
                Unfinished session
              </Text>
              <Text className="mt-0.5 text-base font-bold text-foreground">
                {resumable.title}
              </Text>
            </View>
            <View>
              <GradientButton
                compact
                onPress={() => router.push(resumable.route)}
              >
                Resume
              </GradientButton>
            </View>
          </View>
        </Pressable>
      ) : null}

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

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { IconChip } from '@/components/ui/IconChip';
import { PracticeListRow } from '@/modules/practices/components/PracticeListRow';
import { PracticeScreenShell } from '@/modules/practices/components/PracticeScreenShell';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

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
    <PracticeScreenShell wordmark="FLOW STUDIO">
      <View className="mb-8 mt-4">
        <GradientText className="text-4xl font-extrabold leading-[1.05]">
          Meditations
        </GradientText>
        <Text size="lg" tone="secondary" className="mt-4 max-w-[340px]">
          Step into your biometric field. Choose a practice to align your
          physiological state with your mental intention.
        </Text>
      </View>

      {resumable ? (
        <Card
          variant="toned"
          tone="pink"
          onPress={() => router.push(resumable.route)}
          className="mb-6 flex-row items-center gap-4"
        >
          <IconChip size="lg" shape="circle" tone="pink">
            {(color) => (
              <MaterialIcons name="play-arrow" size={24} color={color} />
            )}
          </IconChip>
          <View className="flex-1">
            <Text size="xs" treatment="caption" tone="accent" weight="bold">
              Unfinished
            </Text>
            <Text size="lg" numberOfLines={1} weight="bold" className="mt-0.5">
              {resumable.title}
            </Text>
          </View>
          <View>
            <Button size="xs" onPress={() => router.push(resumable.route)}>
              Resume
            </Button>
          </View>
        </Card>
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

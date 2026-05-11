import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { variantConfig } from '@/components/variant-config';
import { colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { DailyFlowHeader } from '../components/DailyFlowHeader';
import { TimelineConnector } from '../components/TimelineConnector';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

type PillarColor = 'pink' | 'yellow' | 'purple';

const COLOR_MAP: Record<PillarColor, string> = {
  pink: colors.primary.pink,
  yellow: colors.accent.yellow,
  purple: colors.accent.purple,
};

type Pillar = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  highlight?: string;
  body: string;
  color: PillarColor;
};

const PILLARS: Pillar[] = [
  {
    icon: 'blur-on',
    title: 'The Reality',
    highlight:
      "Your brain isn't broken — it's protective. It's designed for survival, not happiness.",
    body: 'It scans for danger.\nIt replays mistakes.\nAnticipates worst-case scenarios.',
    color: 'pink',
  },
  {
    icon: 'lightbulb',
    title: 'The Truth',
    body: 'Thoughts are visitors.\nEmotions are signals.\nAnd your nervous system shapes how you respond.',
    color: 'yellow',
  },
  {
    icon: 'spa',
    title: 'The Solution',
    body: 'Why calm comes first. When your body feels safe, your mind becomes more flexible and you can respond with clarity instead of panic.',
    color: 'purple',
  },
];

export default function Intro() {
  const router = useRouter();
  const scheme = useScheme();
  const variantBg = variantConfig.default[scheme].bgHex;
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();

  if (isLoading || !session) return <LoadingScreen />;

  const handleContinue = async () => {
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'feeling',
    });
    router.push('/daily-flow/feeling');
  };

  return (
    <Screen
      variant="default"
      scroll
      header={<DailyFlowHeader wordmark showClose={false} />}
      sticky={
        <View className="items-center">
          <Button onPress={handleContinue} loading={updateSession.isPending}>
            Continue
          </Button>
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            className="mt-5 tracking-[0.3em] text-foreground/45"
            style={{ paddingRight: 3.3 }}
          >
            Step 1 of 4
          </Text>
        </View>
      }
      className="px-6"
    >
      <View className="mb-10 items-center">
        <Text
          size="display"
          align="center"
          weight="black"
          className="leading-[1.1]"
        >
          Why you
        </Text>
        <GradientText className="text-4xl font-black leading-[1.1]">
          Feel the way you do.
        </GradientText>
      </View>

      <View className="relative">
        <TimelineConnector />
        {PILLARS.map((p) => {
          const accent = COLOR_MAP[p.color];
          return (
            <View key={p.title} className="mb-8 flex-row items-start gap-5">
              <View
                className="h-12 w-12 items-center justify-center rounded-full border-2"
                style={{
                  backgroundColor: variantBg,
                  borderColor: accent,
                  boxShadow: `0 0 14px ${withAlpha(accent, 0.45)}`,
                }}
              >
                <MaterialIcons name={p.icon} size={20} color={accent} />
              </View>
              <Card className="mt-1 flex-1 p-5">
                <Text size="h2">{p.title}</Text>
                {p.highlight ? (
                  <Text
                    size="lg"
                    tone="accent"
                    weight="bold"
                    className="mt-3 leading-6 -light"
                  >
                    {p.highlight}
                  </Text>
                ) : null}
                <Text size="md" tone="secondary" className="mt-2 leading-6">
                  {p.body}
                </Text>
              </Card>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

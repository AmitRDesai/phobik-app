import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { GradientText } from '@/components/ui/GradientText';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { variantConfig } from '@/components/variant-config';
import { colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
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
          <GradientButton
            onPress={handleContinue}
            loading={updateSession.isPending}
          >
            Continue
          </GradientButton>
          <Text className="mt-5 text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/45">
            Step 1 of 4
          </Text>
        </View>
      }
      className="px-6"
    >
      <View className="mb-10 items-center">
        <Text className="text-center text-4xl font-black leading-[1.1] tracking-tight text-foreground">
          Why you
        </Text>
        <GradientText className="text-4xl font-black leading-[1.1] tracking-tight">
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
                <Text className="text-2xl font-bold tracking-tight text-foreground">
                  {p.title}
                </Text>
                {p.highlight ? (
                  <Text className="mt-3 text-base font-bold leading-6 text-primary-pink-light">
                    {p.highlight}
                  </Text>
                ) : null}
                <Text className="mt-2 text-[15px] leading-6 text-foreground/60">
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

import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

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

function GradientHeadline({ text }: { text: string }) {
  return (
    <MaskedView
      maskElement={
        <Text className="text-4xl font-black leading-[1.1] tracking-tight">
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text className="text-4xl font-black leading-[1.1] tracking-tight opacity-0">
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

export default function Intro() {
  const router = useRouter();
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
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-charcoal"
        centerY={0.2}
        intensity={0.5}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />

      <DailyFlowHeader wordmark showClose={false} />

      <ScrollView
        contentContainerClassName="px-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-10 items-center">
          <Text className="text-center text-4xl font-black leading-[1.1] tracking-tight text-white">
            Why you
          </Text>
          <GradientHeadline text="Feel the way you do." />
        </View>

        <View className="relative">
          <TimelineConnector />
          {PILLARS.map((p) => {
            const accent = COLOR_MAP[p.color];
            return (
              <View key={p.title} className="mb-8 flex-row items-start gap-5">
                <View
                  className="h-12 w-12 items-center justify-center rounded-full border-2 bg-background-charcoal"
                  style={{
                    borderColor: accent,
                    shadowColor: accent,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.45,
                    shadowRadius: 14,
                    elevation: 6,
                  }}
                >
                  <MaterialIcons name={p.icon} size={20} color={accent} />
                </View>
                <View className="mt-1 flex-1 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                  <Text className="text-2xl font-bold tracking-tight text-white">
                    {p.title}
                  </Text>
                  {p.highlight ? (
                    <Text className="mt-3 text-base font-bold leading-6 text-primary-pink-light">
                      {p.highlight}
                    </Text>
                  ) : null}
                  <Text className="mt-2 text-[15px] leading-6 text-white/60">
                    {p.body}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View className="items-center px-6 pb-10">
        <GradientButton
          onPress={handleContinue}
          loading={updateSession.isPending}
        >
          Continue
        </GradientButton>
        <Text className="mt-5 text-[11px] font-bold uppercase tracking-[0.3em] text-white/45">
          Step 1 of 4
        </Text>
      </View>
    </View>
  );
}

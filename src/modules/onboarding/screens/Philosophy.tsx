import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { OnboardingQuestionShell } from '@/modules/onboarding/components/OnboardingQuestionShell';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const DOSE = [
  {
    emoji: '🟣',
    name: 'Dopamine',
    desc: 'The reward and motivation chemical.',
  },
  { emoji: '🔵', name: 'Oxytocin', desc: 'The connection and love hormone.' },
  { emoji: '🟢', name: 'Serotonin', desc: 'The mood balancer and stabilizer.' },
  {
    emoji: '🟠',
    name: 'Endorphins',
    desc: 'The natural pain and stress reliever.',
  },
];

const INDICATORS = [
  { emoji: '⚡', label: 'Strain' },
  { emoji: '😴', label: 'Rest' },
  { emoji: '💙', label: 'Vitals' },
  { emoji: '🧠', label: 'Focus' },
  { emoji: '🚀', label: 'Energy' },
  { emoji: '🌱', label: 'Growth' },
];

const RESET_FORMULA = [
  {
    emoji: '🫁',
    name: 'Breathe',
    desc: 'Controlled breathwork to calm the CNS.',
  },
  {
    emoji: '🚶',
    name: 'Move',
    desc: 'Functional movement to release tension.',
  },
  {
    emoji: '💙',
    name: 'Connect',
    desc: 'Social resonance and shared presence.',
  },
  {
    emoji: '🥗',
    name: 'Nourish',
    desc: 'Fueling your body for optimal rhythm.',
  },
  { emoji: '🧠', name: 'Focus', desc: 'Directing attention with intention.' },
];

const DAILY_FLOW = [
  'Morning intentions',
  'Breathing practices',
  'Daily DOSE activities',
  'Movement moments',
  'Micro challenges',
  'Journaling',
  'Reflection',
  'Rest and recovery practices',
];

const SYNRGY_FACTORS = [
  'Sleep Quality',
  'Movement Load',
  'Heart Rate Variability',
  'Logged Moods',
  'Screen Time',
  'Environment',
];

const STRESS_INFLUENCES = [
  'Work deadlines & pressure',
  'Nutritional gaps & spikes',
  'Lack of restorative sleep',
  'Digital over-stimulation',
];

const TINY_LOGS = [
  { emoji: '✍️', label: 'Mood' },
  { emoji: '⚡', label: 'Energy' },
  { emoji: '😴', label: 'Sleep' },
  { emoji: '🧘', label: 'Calm' },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <View className="mb-3 flex-row">
      <GradientText className="text-xs font-bold uppercase tracking-[0.18em]">
        {children}
      </GradientText>
    </View>
  );
}

export default function Philosophy() {
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');

  return (
    <OnboardingQuestionShell
      step={12}
      showStepCounter={false}
      title="Understanding your rhythm"
      buttonLabel="Continue"
      buttonIcon={<Ionicons name="arrow-forward" size={24} color="white" />}
      onButtonPress={() => router.push('/onboarding/privacy')}
    >
      <View className="gap-8">
        {/* Introduction */}
        <View>
          <SectionLabel>INTRODUCTION</SectionLabel>
          <Text size="h3" className="leading-tight">
            Welcome to Phobik. A space to realign your mind and body with the
            natural rhythms of life.
          </Text>
          <Text size="sm" tone="secondary" className="mt-3">
            We believe that by understanding the science of your stress and
            recovery, you can unlock a version of yourself that is more
            resilient, creative, and calm.
          </Text>
        </View>

        {/* Your Daily DOSE */}
        <View>
          <SectionLabel>YOUR DAILY DOSE</SectionLabel>
          <View className="gap-3">
            {[DOSE.slice(0, 2), DOSE.slice(2, 4)].map((row) => (
              <View key={row[0].name} className="flex-row gap-3">
                {row.map((item) => (
                  <Card
                    key={item.name}
                    variant="flat"
                    size="md"
                    className="flex-1 gap-2"
                  >
                    <Text size="h3">{item.emoji}</Text>
                    <Text size="md" weight="bold">
                      {item.name}
                    </Text>
                    <Text size="sm" tone="secondary">
                      {item.desc}
                    </Text>
                  </Card>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Stress and Recovery */}
        <View>
          <SectionLabel>STRESS AND RECOVERY</SectionLabel>
          <Card variant="flat" size="lg">
            <Text size="md" tone="secondary" className="mb-5">
              We track key indicators to show how your body handles pressure:
            </Text>
            <View className="flex-row flex-wrap gap-y-5">
              {INDICATORS.map((item) => (
                <View key={item.label} className="w-1/3 items-center gap-1">
                  <Text size="h3">{item.emoji}</Text>
                  <Text
                    size="xs"
                    treatment="caption"
                    weight="bold"
                    className="text-foreground/60"
                  >
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* The Reset Formula */}
        <View>
          <SectionLabel>THE RESET FORMULA</SectionLabel>
          <View className="gap-3">
            {RESET_FORMULA.map((item) => (
              <Card
                key={item.name}
                variant="flat"
                size="md"
                className="flex-row items-center gap-4"
              >
                <Text size="h3">{item.emoji}</Text>
                <View className="flex-1">
                  <Text size="md" weight="bold">
                    {item.name}
                  </Text>
                  <Text size="sm" tone="secondary">
                    {item.desc}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Small Moments Matter */}
        <View>
          <SectionLabel>SMALL MOMENTS MATTER</SectionLabel>
          <Card variant="flat" size="md" className="gap-4">
            <View className="flex-row gap-3">
              <Ionicons name="timer-outline" size={20} color={yellow} />
              <Text size="md" className="flex-1">
                When stress builds, our thoughts, breathing, and body sensations
                can speed up automatically.
              </Text>
            </View>
            <View className="flex-row gap-3">
              <Ionicons name="leaf-outline" size={20} color={yellow} />
              <Text size="md" className="flex-1">
                Simple practices that slow breathing and bring attention back to
                the present moment can help create awareness and steadiness.
              </Text>
            </View>
            <View
              className="items-center rounded-lg border p-3"
              style={{
                backgroundColor: withAlpha(colors.primary.pink, 0.1),
                borderColor: withAlpha(colors.primary.pink, 0.2),
              }}
            >
              <Text size="md" weight="bold" className="text-primary-pink">
                Even short moments matter.
              </Text>
            </View>
            <Text size="sm" tone="secondary">
              Every practice you complete helps Phobik better understand what
              supports your rhythm and what helps you feel your best. Small
              actions can create meaningful shifts over time.
            </Text>
          </Card>
        </View>

        {/* Building Your Daily Rhythm */}
        <View>
          <SectionLabel>BUILDING YOUR DAILY RHYTHM</SectionLabel>
          <Card variant="flat" size="md" className="gap-4">
            <View className="gap-2">
              <Text size="md" weight="bold" italic>
                Consistency often matters more than intensity.
              </Text>
              <Text size="sm" tone="secondary">
                Your Daily Flow may include:
              </Text>
            </View>
            <View className="gap-2.5">
              {DAILY_FLOW.map((item) => (
                <View key={item} className="flex-row items-center gap-3">
                  <Text size="md" weight="bold" style={{ color: yellow }}>
                    ✓
                  </Text>
                  <Text size="md">{item}</Text>
                </View>
              ))}
            </View>
            <Text
              size="sm"
              tone="secondary"
              className="border-t border-foreground/10 pt-4"
            >
              As you continue using Phobik, your experience becomes more
              personalized based on your habits, preferences, and progress.
            </Text>
          </Card>
        </View>

        {/* Your Synrgy Score */}
        <View>
          <SectionLabel>YOUR SYNRGY SCORE</SectionLabel>
          <Card variant="flat" size="lg" className="gap-4">
            <Text size="md">
              The Synrgy Score is a real-time snapshot of your internal balance.
              It&apos;s influenced by your daily patterns:
            </Text>
            <View className="flex-row flex-wrap gap-y-2.5">
              {SYNRGY_FACTORS.map((factor) => (
                <View
                  key={factor}
                  className="w-1/2 flex-row items-center gap-2 pr-2"
                >
                  <View className="size-1.5 rounded-full bg-primary-pink" />
                  <Text size="sm" tone="secondary" className="flex-1">
                    {factor}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Your Rhythm in Motion */}
        <View>
          <SectionLabel>YOUR RHYTHM IN MOTION</SectionLabel>
          <Text size="md" tone="secondary" className="mb-4">
            The Rhythm Graph visualizes your ups and downs. Our goal isn&apos;t
            a flat line — it&apos;s &lsquo;steady days&rsquo; where peaks and
            valleys are manageable and balanced.
          </Text>
          <View className="h-24 w-full items-center justify-center overflow-hidden rounded-lg border border-foreground/10 bg-foreground/5">
            <Text size="xs" treatment="caption" italic className="opacity-30">
              Interactive Graph Visual
            </Text>
          </View>
        </View>

        {/* The Stress Compass */}
        <View>
          <SectionLabel>THE STRESS COMPASS</SectionLabel>
          <Card variant="flat" size="lg">
            <Text size="md" className="mb-4">
              Identify what pulls you out of rhythm. Common influences include:
            </Text>
            <View className="gap-2.5">
              {STRESS_INFLUENCES.map((item) => (
                <View key={item} className="flex-row items-center gap-3">
                  <View className="size-1.5 rounded-full bg-primary-pink" />
                  <Text size="md">{item}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Tiny Logs, Smarter Insights */}
        <View>
          <SectionLabel>TINY LOGS, SMARTER INSIGHTS</SectionLabel>
          <View className="gap-3">
            {[TINY_LOGS.slice(0, 2), TINY_LOGS.slice(2, 4)].map((row) => (
              <View key={row[0].label} className="flex-row gap-3">
                {row.map((item) => (
                  <Card
                    key={item.label}
                    variant="flat"
                    size="sm"
                    className="flex-1 flex-row items-center gap-3"
                  >
                    <Text size="md">{item.emoji}</Text>
                    <Text size="sm" weight="bold">
                      {item.label}
                    </Text>
                  </Card>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Personalized Insights */}
        <View>
          <SectionLabel>PERSONALIZED INSIGHTS</SectionLabel>
          <View
            className="rounded-2xl bg-foreground/5 p-5"
            style={{ borderLeftWidth: 4, borderLeftColor: yellow }}
          >
            <Text size="md">
              By syncing with{' '}
              <Text size="md" weight="bold">
                Apple Health
              </Text>{' '}
              and your wearables, Phobik creates a bio-unique roadmap. Your data
              is encrypted and remains private — we only see the patterns, never
              the person.
            </Text>
          </View>
        </View>
      </View>
    </OnboardingQuestionShell>
  );
}

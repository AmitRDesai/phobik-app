import expressiveImg from '@/assets/images/sound-studio/expressive-writing.jpg';
import { GradientButton } from '@/components/ui/GradientButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { colors } from '@/constants/colors';
import { GradientText } from '@/modules/practices/components/GradientText';
import { PracticeStackHeader } from '@/modules/practices/components/PracticeStackHeader';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

const STEPS = [
  {
    number: '01',
    title: 'Set a timer',
    description:
      'Set a timer for 20 minutes to create a focused space for your mind to decompress.',
  },
  {
    number: '02',
    title: 'Release the mess',
    description:
      "Write what you've been holding — the messier, the better. Raw honesty is the goal.",
  },
  {
    number: '03',
    title: 'Build consistency',
    description:
      'Repeat for 20 minutes a day, for 4 days in a row to see the neurological shift.',
  },
  {
    number: '04',
    title: 'Log in Phobik',
    description:
      'Speak it into your Phobik journal to bridge the gap between thought and sound.',
  },
  {
    number: '05',
    title: 'Sonic Transformation',
    description:
      'Let Sound Studio bring it to life through generative soundscapes that mirror your emotion.',
  },
];

export default function ExpressiveWriting() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <GlowBg
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        centerY={0.25}
        radius={0.45}
        intensity={0.5}
        bgClassName="bg-surface"
      />
      <PracticeStackHeader wordmark="Session Flow" />

      <ScrollFade fadeColor={colors.background.charcoal}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-2"
          contentContainerStyle={{ paddingBottom: FADE_HEIGHT }}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View className="mt-2">
            <GradientText className="text-[40px] font-extrabold leading-tight tracking-tight">
              The Practice:
            </GradientText>
            <GradientText className="text-[40px] font-extrabold leading-tight tracking-tight">
              Step-by-Step.
            </GradientText>
          </View>
          <Text className="mt-4 text-base leading-relaxed text-foreground/70">
            Expressive writing is an organic process. Follow the rhythm of these
            five steps to begin.
          </Text>

          {/* Steps */}
          <View className="mt-6 gap-3">
            {STEPS.map((step) => (
              <View
                key={step.number}
                className="rounded-3xl border border-foreground/10 bg-foreground/5 p-5"
              >
                <Text className="text-2xl font-extrabold tracking-widest text-accent-yellow">
                  {step.number}
                </Text>
                <Text className="mt-1 text-lg font-bold text-foreground">
                  {step.title}
                </Text>
                <Text className="mt-2 text-sm leading-relaxed text-foreground/70">
                  {step.description}
                </Text>
              </View>
            ))}
          </View>

          {/* Decorative image at bottom */}
          <View className="mt-6 overflow-hidden rounded-3xl">
            <Image
              source={expressiveImg}
              style={{ width: '100%', height: 160 }}
              contentFit="cover"
            />
          </View>
        </ScrollView>
      </ScrollFade>

      {/* Sticky bottom: Start Session */}
      <View className="border-t border-foreground/5 bg-surface/80 px-6 pb-8 pt-5">
        <GradientButton onPress={() => router.push('/sound-studio/ai/write')}>
          Start Session
        </GradientButton>
        <Text className="mt-3 text-center text-[10px] uppercase tracking-widest text-foreground/50">
          Tap to begin the timer
        </Text>
      </View>
    </View>
  );
}

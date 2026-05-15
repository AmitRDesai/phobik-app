import { Button } from '@/components/ui/Button';
import expressiveImg from '@/assets/images/sound-studio/expressive-writing.jpg';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { Screen } from '@/components/ui/Screen';
import { accentFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Header } from '@/components/ui/Header';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

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
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');

  return (
    <Screen
      scroll
      header={<Header variant="back" title="Session Flow" />}
      sticky={
        <View>
          <Button onPress={() => router.push('/sound-studio/ai/write')}>
            Start Session
          </Button>
          <Text
            size="xs"
            treatment="caption"
            tone="secondary"
            align="center"
            className="mt-3"
          >
            Tap to begin the timer
          </Text>
        </View>
      }
      className="px-6 pt-2"
    >
      {/* Title */}
      <View className="mt-2">
        <GradientText className="text-[40px] font-extrabold leading-tight">
          The Practice:
        </GradientText>
        <GradientText className="text-[40px] font-extrabold leading-tight">
          Step-by-Step.
        </GradientText>
      </View>
      <Text size="lg" className="mt-4 leading-relaxed text-foreground/70">
        Expressive writing is an organic process. Follow the rhythm of these
        five steps to begin.
      </Text>

      {/* Steps */}
      <View className="mt-6 gap-3">
        {STEPS.map((step) => (
          <Card key={step.number} className="rounded-3xl p-5">
            <Text
              size="h2"
              weight="extrabold"
              className="tracking-widest"
              style={{ color: yellow }}
            >
              {step.number}
            </Text>
            <Text size="h3" weight="bold" className="mt-1">
              {step.title}
            </Text>
            <Text size="sm" className="mt-2 leading-relaxed text-foreground/70">
              {step.description}
            </Text>
          </Card>
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
    </Screen>
  );
}

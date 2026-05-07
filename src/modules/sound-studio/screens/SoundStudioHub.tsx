import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { GradientText } from '@/components/ui/GradientText';
import {
  accentFor,
  colors,
  foregroundFor,
  withAlpha,
} from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { PracticeScreenShell } from '@/modules/practices/components/PracticeScreenShell';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

import { NOW_PLAYING_IMAGE } from '../data/sound-studio';

const FAKE_CREDITS = 42;

export default function SoundStudioHub() {
  const router = useRouter();
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  const fg = foregroundFor(scheme, 1);

  return (
    <PracticeScreenShell wordmark="Sound Studio" scrollContentClassName="pb-32">
      {/* Credits row */}
      <Card
        onPress={() => router.push('/sound-studio/credits')}
        className="mt-2 flex-row items-center justify-between p-5"
      >
        <View>
          <Text variant="caption" muted>
            AI Generation
          </Text>
          <Text variant="h2" className="mt-1 font-extrabold">
            {FAKE_CREDITS} Credits
          </Text>
          <Text variant="xs" muted className="mt-1">
            Refills in 12 hours
          </Text>
        </View>
        <View className="rounded-full bg-primary-pink px-5 py-2">
          <Text variant="caption" className="text-on-primary-fixed font-bold">
            Refill
          </Text>
        </View>
      </Card>

      {/* Curated Soundscapes card */}
      <Card
        onPress={() => router.push('/sound-studio/curated')}
        className="mt-5 p-7"
        shadow={{ color: colors.primary.pink }}
      >
        <Badge tone="pink" size="sm" className="self-center">
          Handpicked
        </Badge>
        <Text
          variant="display"
          className="mt-4 text-center text-[28px] leading-[34px]"
        >
          Curated{'\n'}Soundscapes
        </Text>
        <Text variant="sm" muted className="mt-3 text-center leading-relaxed">
          Immerse yourself in expertly crafted audio environments designed for
          peak relaxation and focus.
        </Text>
        <View className="mt-5">
          <GradientButton
            onPress={() => router.push('/sound-studio/curated')}
            icon={<MaterialIcons name="play-arrow" size={18} color="white" />}
          >
            Start Listening
          </GradientButton>
        </View>
      </Card>

      {/* AI Studio card */}
      <Card
        onPress={() => router.push('/sound-studio/ai/write')}
        className="mt-5 p-7"
        shadow={{ color: colors.accent.yellow }}
      >
        <Badge tone="yellow" size="sm" className="self-center">
          New Feature
        </Badge>
        <Text
          variant="display"
          className="mt-4 text-center text-[28px] leading-[34px]"
        >
          AI Studio
        </Text>
        <Text variant="sm" muted className="mt-3 text-center leading-relaxed">
          Generate personalized soundscapes tailored to your current brainwave
          patterns.
        </Text>
        <View className="mt-5">
          <GradientButton
            onPress={() => router.push('/sound-studio/ai/write')}
            icon={<MaterialIcons name="bolt" size={18} color="white" />}
          >
            Start Creating
          </GradientButton>
        </View>
      </Card>

      {/* Now playing footer */}
      <Pressable
        onPress={() =>
          dialog.info({
            title: 'Coming soon',
            message: 'Audio playback will be available soon.',
          })
        }
        className="mt-6 flex-row items-center gap-3 rounded-3xl border border-foreground/10 bg-foreground/[0.04] p-3 pr-5 active:scale-[0.98]"
      >
        <Image
          source={NOW_PLAYING_IMAGE}
          style={{ width: 44, height: 44, borderRadius: 12 }}
          contentFit="cover"
        />
        <View className="flex-1">
          <Text variant="sm" className="font-bold">
            Deep Focus Beta
          </Text>
          <Text variant="xs" muted>
            AI Generated • 4:20
          </Text>
        </View>
        <Pressable className="h-9 w-9 items-center justify-center rounded-full border border-foreground/10 bg-foreground/10">
          <MaterialIcons name="skip-next" size={18} color={fg} />
        </Pressable>
        <View
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{
            boxShadow: `0 0 8px ${withAlpha(colors.primary.pink, 0.5)}`,
          }}
        >
          <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-pink">
            <MaterialIcons name="pause" size={18} color="white" />
          </View>
        </View>
      </Pressable>

      {/* Open Expressive Writing practice */}
      <Pressable
        onPress={() => router.push('/sound-studio/expressive-writing')}
        className="mt-3 self-center"
      >
        <Text variant="caption" style={{ color: yellow }}>
          Try expressive writing →
        </Text>
      </Pressable>

      <GradientText className="mt-10 text-center text-xs uppercase tracking-[0.3em]">
        Studio
      </GradientText>
    </PracticeScreenShell>
  );
}

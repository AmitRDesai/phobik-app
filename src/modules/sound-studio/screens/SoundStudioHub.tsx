import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { GradientText } from '@/components/ui/GradientText';
import { PracticeScreenShell } from '@/modules/practices/components/PracticeScreenShell';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { NOW_PLAYING_IMAGE } from '../data/sound-studio';

const FAKE_CREDITS = 42;

export default function SoundStudioHub() {
  const router = useRouter();

  return (
    <PracticeScreenShell
      wordmark="Sound Studio"
      bgClassName="bg-surface"
      glowCenterY={0.25}
      glowIntensity={0.5}
      scrollContentClassName="px-6 pb-32"
    >
      {/* Credits row */}
      <Card
        onPress={() => router.push('/sound-studio/credits')}
        className="mt-2 flex-row items-center justify-between p-5"
      >
        <View>
          <Text className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
            AI Generation
          </Text>
          <Text className="mt-1 text-2xl font-extrabold text-foreground">
            {FAKE_CREDITS} Credits
          </Text>
          <Text className="mt-1 text-xs text-foreground/50">
            Refills in 12 hours
          </Text>
        </View>
        <View className="rounded-full bg-primary-pink px-5 py-2">
          <Text className="text-xs font-bold uppercase tracking-widest text-on-primary-fixed">
            Refill
          </Text>
        </View>
      </Card>

      {/* Curated Soundscapes card */}
      <Card
        onPress={() => router.push('/sound-studio/curated')}
        className="mt-5 p-7"
        style={{
          shadowColor: colors.primary.pink,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 24,
        }}
      >
        <Badge tone="pink" size="sm" className="self-center">
          Handpicked
        </Badge>
        <Text className="mt-4 text-center text-3xl font-extrabold text-foreground">
          Curated{'\n'}Soundscapes
        </Text>
        <Text className="mt-3 text-center text-sm leading-relaxed text-foreground/70">
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
        style={{
          shadowColor: colors.accent.yellow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 24,
        }}
      >
        <Badge tone="yellow" size="sm" className="self-center">
          New Feature
        </Badge>
        <Text className="mt-4 text-center text-3xl font-extrabold text-foreground">
          AI Studio
        </Text>
        <Text className="mt-3 text-center text-sm leading-relaxed text-foreground/70">
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
        className="mt-6 flex-row items-center gap-3 rounded-3xl border border-foreground/10 bg-foreground/5 p-3 pr-5 active:scale-[0.98]"
      >
        <Image
          source={NOW_PLAYING_IMAGE}
          style={{ width: 44, height: 44, borderRadius: 12 }}
          contentFit="cover"
        />
        <View className="flex-1">
          <Text className="text-sm font-bold text-foreground">
            Deep Focus Beta
          </Text>
          <Text className="text-[11px] text-foreground/50">
            AI Generated • 4:20
          </Text>
        </View>
        <Pressable className="h-9 w-9 items-center justify-center rounded-full border border-foreground/10 bg-foreground/10">
          <MaterialIcons name="skip-next" size={18} color="white" />
        </Pressable>
        <View
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{
            shadowColor: colors.primary.pink,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
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
        <Text className="text-xs font-semibold uppercase tracking-widest text-accent-yellow">
          Try expressive writing →
        </Text>
      </Pressable>

      <GradientText className="mt-10 text-center text-xs uppercase tracking-[0.3em]">
        Studio
      </GradientText>
    </PracticeScreenShell>
  );
}

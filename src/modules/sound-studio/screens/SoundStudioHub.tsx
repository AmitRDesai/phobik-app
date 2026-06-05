import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { colors } from '@/constants/colors';
import { useCreditBalance } from '@/hooks/sound-generation';
import { PracticeScreenShell } from '@/modules/practices/components/PracticeScreenShell';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SoundStudioHub() {
  const router = useRouter();
  const { balance } = useCreditBalance();

  return (
    <PracticeScreenShell wordmark="Sound Studio" scrollContentClassName="pb-16">
      {/* Credits row */}
      <Card
        onPress={() => router.push('/sound-studio/credits')}
        className="mt-2 flex-row items-center justify-between p-5"
      >
        <View>
          <Text size="xs" treatment="caption" tone="secondary">
            AI Generation
          </Text>
          <Text size="h2" weight="extrabold" className="mt-1">
            {balance} Credit{balance === 1 ? '' : 's'}
          </Text>
          <Text size="xs" tone="secondary" className="mt-1">
            Tap to buy more
          </Text>
        </View>
        <View className="rounded-full bg-primary-pink px-5 py-2">
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            className="text-on-primary-fixed"
          >
            Get Credits
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
          size="display"
          align="center"
          className="mt-4 text-[28px] leading-[34px]"
        >
          Curated{'\n'}Soundscapes
        </Text>
        <Text
          size="sm"
          tone="secondary"
          align="center"
          className="mt-3 leading-relaxed"
        >
          Immerse yourself in expertly crafted audio environments designed for
          peak relaxation and focus.
        </Text>
        <View className="mt-5">
          <Button
            onPress={() => router.push('/sound-studio/curated')}
            icon={<MaterialIcons name="play-arrow" size={18} color="white" />}
          >
            Start Listening
          </Button>
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
          size="display"
          align="center"
          className="mt-4 text-[28px] leading-[34px]"
        >
          AI Studio
        </Text>
        <Text
          size="sm"
          tone="secondary"
          align="center"
          className="mt-3 leading-relaxed"
        >
          Turn what you're feeling into a one-of-a-kind track, generated just
          for you.
        </Text>
        <View className="mt-5">
          <Button
            onPress={() => router.push('/sound-studio/ai/write')}
            icon={<MaterialIcons name="bolt" size={18} color="white" />}
          >
            Start Creating
          </Button>
        </View>
      </Card>

      {/* Open Expressive Writing practice */}
      <Button
        variant="ghost"
        size="xs"
        onPress={() => router.push('/sound-studio/expressive-writing')}
        className="mt-5 self-center"
      >
        Try expressive writing →
      </Button>

      <GradientText className="mt-10 text-center text-xs uppercase tracking-[0.3em]">
        Studio
      </GradientText>
    </PracticeScreenShell>
  );
}

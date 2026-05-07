import expressImg from '@/assets/images/sound-studio/express-analyzing.jpg';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Badge } from '@/components/ui/Badge';
import { GradientText } from '@/components/ui/GradientText';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { PracticeStackHeader } from '@/modules/practices/components/PracticeStackHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function AiStudioExpress() {
  const router = useRouter();
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  const [progress, setProgress] = useState(0.78);

  // Display-only progress nudges; auto-advance to playback at 100%.
  useEffect(() => {
    if (progress >= 1) {
      const t = setTimeout(
        () => router.replace('/sound-studio/ai/playback'),
        800,
      );
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setProgress((p) => Math.min(1, p + 0.005)), 200);
    return () => clearTimeout(t);
  }, [progress, router]);

  return (
    <Screen
      variant="default"
      header={<PracticeStackHeader wordmark="Sound Studio" />}
      className="flex-1 px-6 pt-2"
    >
      {/* Step indicator */}
      <Badge tone="pink" size="sm" className="self-start">
        Step 03 / 06
      </Badge>

      {/* Hero copy */}
      <View className="mt-4 items-center">
        <Text className="text-[34px] font-extrabold leading-tight">
          Bringing
        </Text>
        <Text className="text-[34px] font-extrabold leading-tight">
          <Text className="text-[34px] font-extrabold leading-tight">
            your{' '}
          </Text>
          <GradientText className="text-[34px] font-extrabold leading-tight">
            sound
          </GradientText>
        </Text>
        <Text className="text-[34px] font-extrabold leading-tight">
          to life.
        </Text>
        <Text
          variant="lg"
          muted
          className="mt-4 max-w-[300px] text-center leading-relaxed"
        >
          Giving your feelings a voice — so they can move, shift, and set you
          free.
        </Text>
      </View>

      {/* Analyzing wheel */}
      <View className="mt-10 items-center">
        <View
          className="h-[260px] w-[260px] items-center justify-center overflow-hidden rounded-full"
          style={{
            boxShadow: `0 0 40px ${withAlpha(colors.accent.yellow, 0.5)}`,
          }}
        >
          <Image
            source={expressImg}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          <View className="absolute inset-0 items-center justify-center">
            <View className="h-20 w-20 items-center justify-center rounded-full border border-foreground/20 bg-surface/60">
              <MaterialIcons name="settings" size={32} color={yellow} />
            </View>
          </View>
        </View>

        {/* Status pill */}
        <View className="absolute right-2 top-4 rounded-full border border-foreground/15 bg-foreground/10 px-3 py-1">
          <Text variant="caption" className="font-bold">
            Analyzing
          </Text>
        </View>
      </View>

      {/* Progress */}
      <View className="mt-12">
        <View className="flex-row items-center justify-between">
          <Text variant="caption" muted>
            Neural-Harmonic Mapping
          </Text>
          <Text variant="caption" className="font-bold">
            {Math.round(progress * 100)}%
          </Text>
        </View>
        <View className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-foreground/10">
          <LinearGradient
            colors={[colors.primary.pink, colors.accent.yellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 3, width: `${progress * 100}%` }}
          />
        </View>
      </View>
    </Screen>
  );
}

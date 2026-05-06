import expressImg from '@/assets/images/sound-studio/express-analyzing.jpg';
import { Badge } from '@/components/ui/Badge';
import { GlowBg } from '@/components/ui/GlowBg';
import { colors, withAlpha } from '@/constants/colors';
import { GradientText } from '@/components/ui/GradientText';
import { PracticeStackHeader } from '@/modules/practices/components/PracticeStackHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

export default function AiStudioExpress() {
  const router = useRouter();
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
    <View className="flex-1 bg-surface">
      <GlowBg
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        centerY={0.4}
        radius={0.5}
        intensity={0.6}
        bgClassName="bg-surface"
      />
      <PracticeStackHeader wordmark="Sound Studio" />

      <View className="flex-1 px-6 pt-2">
        {/* Step indicator */}
        <Badge tone="pink" size="sm" className="self-start">
          Step 03 / 06
        </Badge>

        {/* Hero copy */}
        <View className="mt-4 items-center">
          <Text className="text-[34px] font-extrabold leading-tight tracking-tight text-foreground">
            Bringing
          </Text>
          <Text className="text-[34px] font-extrabold leading-tight tracking-tight text-foreground">
            <Text>your </Text>
            <GradientText className="text-[34px] font-extrabold leading-tight tracking-tight">
              sound
            </GradientText>
          </Text>
          <Text className="text-[34px] font-extrabold leading-tight tracking-tight text-foreground">
            to life.
          </Text>
          <Text className="mt-4 max-w-[300px] text-center text-base leading-relaxed text-foreground/60">
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
                <MaterialIcons
                  name="settings"
                  size={32}
                  color={colors.accent.yellow}
                />
              </View>
            </View>
          </View>

          {/* Status pill */}
          <View className="absolute right-2 top-4 rounded-full border border-foreground/15 bg-foreground/10 px-3 py-1">
            <Text variant="caption" className="text-foreground/80">
              Analyzing
            </Text>
          </View>
        </View>

        {/* Progress */}
        <View className="mt-12">
          <View className="flex-row items-center justify-between">
            <Text variant="caption" className="text-foreground/50">
              Neural-Harmonic Mapping
            </Text>
            <Text variant="caption" className="text-foreground">
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
      </View>
    </View>
  );
}

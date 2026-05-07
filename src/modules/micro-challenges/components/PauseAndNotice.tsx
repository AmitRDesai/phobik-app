import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { ScrollView } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors, withAlpha } from '@/constants/colors';

interface PauseAndNoticeProps {
  onContinue: () => void;
}

export function PauseAndNotice({ onContinue }: PauseAndNoticeProps) {
  const breathScale = useSharedValue(1);

  useEffect(() => {
    breathScale.value = withRepeat(
      withTiming(1.1, { duration: 2000 }),
      -1,
      true,
    );
    return () => cancelAnimation(breathScale);
  }, []);

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathScale.value }],
  }));

  return (
    <ScrollView
      contentContainerClassName="items-center px-6 pb-12"
      showsVerticalScrollIndicator={false}
    >
      {/* Step label */}
      <Text
        variant="caption"
        muted
        className="mb-2 mt-4 tracking-[0.2em]"
        style={{ paddingRight: 2.2 }}
      >
        Step 1 of 6
      </Text>

      {/* Title */}
      <Text variant="h1" className="mb-8">
        Pause and Notice
      </Text>

      {/* Breathing circle */}
      <View className="mb-8 items-center justify-center">
        <Animated.View style={breathStyle}>
          <LinearGradient
            colors={[colors.primary.pink, colors.accent.yellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 12px ${withAlpha(colors.primary.pink, 0.2)}`,
            }}
          >
            <MaterialIcons name="pause-circle-filled" size={56} color="white" />
          </LinearGradient>
        </Animated.View>
      </View>

      {/* Instruction */}
      <Text variant="h2" className="mb-8 text-center">
        Take one slow breath.
      </Text>

      {/* Prompt card */}
      <Card className="mb-6 w-full p-6">
        <Text variant="lg" className="mb-3 text-center text-foreground/80">
          Say quietly:{' '}
          <Text variant="lg" className="font-bold">
            &ldquo;I notice...&rdquo;
          </Text>
        </Text>
        <Text
          variant="sm"
          className="text-center leading-relaxed text-foreground/60"
        >
          Describe what is happening in your body like you&apos;re reporting
          facts. Simply noticing helps interrupt the stress loop.
        </Text>
      </Card>

      {/* Example chips */}
      <View className="mb-8 w-full gap-3">
        {['My shoulders feel tense', 'My thoughts feel fast'].map((example) => (
          <View
            key={example}
            className="flex-row items-center gap-3 rounded-xl border border-foreground/5 bg-foreground/[0.03] px-4 py-3"
          >
            <MaterialIcons
              name="info"
              size={16}
              color={withAlpha(colors.primary.pink, 0.6)}
            />
            <Text variant="sm" className="italic text-foreground/70">
              &ldquo;{example}&rdquo;
            </Text>
          </View>
        ))}
      </View>

      {/* Continue button */}
      <View className="w-full">
        <GradientButton onPress={onContinue}>Continue</GradientButton>
      </View>

      {/* Footer */}
      <Text variant="xs" className="mt-6 text-center text-foreground/55">
        Take your time. There is no rush.
      </Text>
    </ScrollView>
  );
}

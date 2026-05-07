import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { dialog } from '@/utils/dialog';

import type { DoseReward, MysteryChallenge } from '../data/mystery-challenges';
import { useRecordChallenge } from '../hooks/useMysteryChallenge';
import { usePracticeTimer } from '../hooks/usePracticeTimer';
import { MysteryComplete } from './MysteryComplete';

interface MysteryPracticeCardProps {
  challenge: MysteryChallenge;
  onStart?: () => void;
  onComplete?: () => void;
}

function DoseGrid({ dose }: { dose: DoseReward }) {
  const items = [
    { label: 'Dopamine', value: dose.dopamine, isPink: true },
    { label: 'Oxytocin', value: dose.oxytocin, isPink: false },
    { label: 'Serotonin', value: dose.serotonin, isPink: true },
    { label: 'Endorphins', value: dose.endorphins, isPink: false },
  ];

  return (
    <View className="mt-8 w-full border-t border-foreground/10 pt-6">
      <Text
        variant="caption"
        muted
        className="mb-4 text-center tracking-[0.2em]"
        style={{ paddingRight: 2.2 }}
      >
        Daily D.O.S.E. Reward
      </Text>
      <View className="flex-row justify-between">
        {items.map((item) => (
          <View key={item.label} className="items-center">
            <Text
              variant="sm"
              className="font-bold"
              style={{
                color: item.isPink ? colors.primary.pink : colors.accent.yellow,
              }}
            >
              +{item.value}
            </Text>
            <Text className="text-[8px] uppercase text-foreground/55">
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function GradientTimer({ formatted }: { formatted: string }) {
  return (
    <GradientText className="text-center font-mono text-4xl font-bold">
      {formatted}
    </GradientText>
  );
}

export function MysteryPracticeCard({
  challenge,
  onStart,
  onComplete,
}: MysteryPracticeCardProps) {
  const scheme = useScheme();
  const { seconds, formatted, isRunning, start, stop } = usePracticeTimer();
  const recordChallenge = useRecordChallenge();

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    start();
    onStart?.();
  };

  const handleDone = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Snapshot the duration before stop() — keeps the value stable through
    // the dialog flow even if the timer state churns.
    const durationSeconds = seconds;
    stop();

    try {
      await recordChallenge.mutateAsync({
        challengeType: challenge.type,
        doseDopamine: challenge.dose.dopamine,
        doseOxytocin: challenge.dose.oxytocin,
        doseSerotonin: challenge.dose.serotonin,
        doseEndorphins: challenge.dose.endorphins,
        durationSeconds,
      });
    } catch (error) {
      await dialog.error({
        title: 'Could not save',
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong saving your practice. Please try again.',
      });
      return;
    }

    await dialog.open({
      component: MysteryComplete,
      props: { challenge, durationSeconds },
    });

    onComplete?.();
  };

  // Split practice text around highlight if present
  const renderPracticeText = () => {
    const { practiceText, highlightText } = challenge;

    if (!highlightText) {
      // Check for newline (affirmations pattern: main text + italic quote)
      const newlineIdx = practiceText.indexOf('\n');
      if (newlineIdx !== -1) {
        const mainText = practiceText.slice(0, newlineIdx);
        const quoteText = practiceText.slice(newlineIdx + 1);
        return (
          <>
            <Text
              variant="lg"
              className="text-center leading-snug text-foreground/90"
            >
              {mainText}
            </Text>
            <Text
              variant="lg"
              className="mt-1 text-center font-bold italic leading-snug"
              style={{ color: colors.accent.yellow }}
            >
              {quoteText}
            </Text>
          </>
        );
      }
      return (
        <Text
          variant="lg"
          className="text-center leading-snug text-foreground/90"
        >
          {practiceText}
        </Text>
      );
    }

    const parts = practiceText.split(highlightText);
    return (
      <>
        <Text
          variant="lg"
          className="text-center leading-snug text-foreground/90"
        >
          {parts[0]}
          <Text
            variant="lg"
            className="font-bold"
            style={{ color: colors.accent.yellow }}
          >
            {highlightText}
          </Text>
          {parts[1]}
        </Text>
        {/* If highlightText is a standalone question (feelings), render it separately */}
        {challenge.type === 'feelings' && (
          <Text
            variant="lg"
            className="mt-2 text-center font-medium italic leading-snug"
            style={{ color: colors.accent.yellow }}
          >
            {highlightText}
          </Text>
        )}
      </>
    );
  };

  return (
    <View
      className="overflow-hidden rounded-3xl"
      style={{
        backgroundColor: foregroundFor(scheme, 0.05),
        borderWidth: 1,
        borderColor: foregroundFor(scheme, 0.1),
      }}
    >
      {/* Top gradient accent bar */}
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: 4 }}
      />

      <View className="items-center p-8">
        {/* Icon circle */}
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            boxShadow: `0 0 12px ${withAlpha(colors.primary.pink, 0.2)}`,
          }}
        >
          <MaterialIcons
            name={challenge.icon}
            size={32}
            color={colors.background.dark}
          />
        </LinearGradient>

        {/* Practice label */}
        <Text variant="h3" className="mb-4 font-bold">
          {challenge.practiceLabel}
        </Text>

        {/* Practice text */}
        {renderPracticeText()}

        {/* Timer */}
        <View className="mb-2 mt-6">
          <GradientTimer formatted={formatted} />
        </View>

        {/* Buttons */}
        <View className="mt-8 w-full flex-row gap-4">
          <Pressable
            onPress={handleStart}
            disabled={isRunning}
            className="flex-1 active:scale-95"
            style={{ opacity: isRunning ? 0.5 : 1 }}
          >
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 24,
                alignItems: 'center',
                boxShadow: `0 0 12px ${withAlpha(colors.primary.pink, 0.2)}`,
              }}
            >
              <Text
                variant="sm"
                className="font-bold uppercase tracking-wider"
                style={{ color: colors.background.dark }}
              >
                Start
              </Text>
            </LinearGradient>
          </Pressable>

          <Button
            variant="secondary"
            size="compact"
            onPress={handleDone}
            className="flex-1"
          >
            Done
          </Button>
        </View>

        {/* DOSE Rewards */}
        <DoseGrid dose={challenge.dose} />
      </View>
    </View>
  );
}

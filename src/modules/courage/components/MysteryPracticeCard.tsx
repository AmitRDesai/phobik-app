import { alpha, colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';

import type { DoseReward, MysteryChallenge } from '../data/mystery-challenges';
import { usePracticeTimer } from '../hooks/usePracticeTimer';

interface MysteryPracticeCardProps {
  challenge: MysteryChallenge;
}

function DoseGrid({ dose }: { dose: DoseReward }) {
  const items = [
    { label: 'Dopamine', value: dose.dopamine, isPink: true },
    { label: 'Oxytocin', value: dose.oxytocin, isPink: false },
    { label: 'Serotonin', value: dose.serotonin, isPink: true },
    { label: 'Endorphins', value: dose.endorphins, isPink: false },
  ];

  return (
    <View className="mt-8 w-full border-t border-white/10 pt-6">
      <Text className="mb-4 text-center text-[10px] uppercase tracking-[3px] text-slate-400">
        Daily D.O.S.E. Reward
      </Text>
      <View className="flex-row justify-between">
        {items.map((item) => (
          <View key={item.label} className="items-center">
            <Text
              className="text-sm font-bold"
              style={{
                color: item.isPink ? colors.primary.pink : colors.accent.yellow,
              }}
            >
              +{item.value}
            </Text>
            <Text className="text-[8px] uppercase text-slate-500">
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
    <MaskedView
      maskElement={
        <Text className="text-center font-mono text-4xl font-bold">
          {formatted}
        </Text>
      }
    >
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text className="text-center font-mono text-4xl font-bold opacity-0">
          {formatted}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

export function MysteryPracticeCard({ challenge }: MysteryPracticeCardProps) {
  const { formatted, isRunning, start, stop } = usePracticeTimer();

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    start();
  };

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    stop();
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
            <Text className="text-center text-lg leading-snug text-white/90">
              {mainText}
            </Text>
            <Text
              className="mt-1 text-center text-lg font-bold italic leading-snug"
              style={{ color: colors.accent.yellow }}
            >
              {quoteText}
            </Text>
          </>
        );
      }
      return (
        <Text className="text-center text-lg leading-snug text-white/90">
          {practiceText}
        </Text>
      );
    }

    const parts = practiceText.split(highlightText);
    return (
      <>
        <Text className="text-center text-lg leading-snug text-white/90">
          {parts[0]}
          <Text className="font-bold" style={{ color: colors.accent.yellow }}>
            {highlightText}
          </Text>
          {parts[1]}
        </Text>
        {/* If highlightText is a standalone question (feelings), render it separately */}
        {challenge.type === 'feelings' && (
          <Text
            className="mt-2 text-center text-lg font-medium italic leading-snug"
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
        backgroundColor: alpha.white05,
        borderWidth: 1,
        borderColor: alpha.white10,
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
            shadowColor: colors.primary.pink,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
          }}
        >
          <MaterialIcons
            name={challenge.icon}
            size={32}
            color={colors.background.dark}
          />
        </LinearGradient>

        {/* Practice label */}
        <Text className="mb-4 text-xl font-bold text-white">
          {challenge.practiceLabel}
        </Text>

        {/* Practice text */}
        {renderPracticeText()}

        {/* Timer */}
        <View className="mt-6 mb-2">
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
                shadowColor: colors.primary.pink,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
              }}
            >
              <Text
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: colors.background.dark }}
              >
                Start
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={handleDone}
            className="flex-1 items-center justify-center rounded-2xl border-2 border-white/20 px-6 py-4 active:scale-95"
          >
            <Text className="text-sm font-bold uppercase tracking-wider text-white">
              Done
            </Text>
          </Pressable>
        </View>

        {/* DOSE Rewards */}
        <DoseGrid dose={challenge.dose} />
      </View>
    </View>
  );
}

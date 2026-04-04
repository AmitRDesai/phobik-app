import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtomValue } from 'jotai';
import { ScrollView, Text, View } from 'react-native';

import { DoseRewardsGrid } from './DoseRewardsGrid';
import { getChallenge } from '../data/challenges';
import { EMOTIONS } from '../data/emotions';
import { NEEDS } from '../data/needs';
import {
  selectedEmotionAtom,
  selectedNeedAtom,
} from '../store/micro-challenges';

interface DailyDoseProps {
  onAccept: () => void;
}

export function DailyDose({ onAccept }: DailyDoseProps) {
  const emotionId = useAtomValue(selectedEmotionAtom) ?? 'afraid';
  const needId = useAtomValue(selectedNeedAtom) ?? 'safety';
  const challenge = getChallenge(emotionId, needId);

  const emotionLabel =
    EMOTIONS.find((e) => e.id === emotionId)?.label.toLowerCase() ?? emotionId;
  const needLabel =
    NEEDS.find((n) => n.id === needId)?.label.toLowerCase() ?? needId;

  return (
    <View className="flex-1">
      {/* Nebula glow */}
      <GlowBg
        centerY={0.1}
        radius={0.5}
        intensity={0.8}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        bgClassName="bg-transparent"
      />

      <ScrollView
        contentContainerClassName="px-6 pb-12"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8 items-center pt-4">
          <Text className="text-2xl font-bold text-white">
            Get your Daily Dose
          </Text>
          <Text className="mt-1 text-xs font-bold uppercase tracking-widest text-white/40">
            Regulation Complete
          </Text>
        </View>

        {/* Challenge card */}
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 20, padding: 1 }}
        >
          <View className="rounded-[19px] bg-black p-6">
            {/* Badge with pulsing dot */}
            <View className="mb-4 flex-row items-center gap-2">
              <View className="h-2 w-2 rounded-full bg-primary-pink" />
              <Text className="text-xs font-bold uppercase tracking-wider text-primary-pink">
                Your Personalized Challenge
              </Text>
            </View>

            <Text className="mb-3 text-xl font-semibold leading-tight text-white">
              {challenge.title}
            </Text>
            <Text className="text-base leading-relaxed text-slate-300">
              Since you&apos;re feeling{' '}
              <Text className="font-medium text-accent-yellow">
                {emotionLabel}
              </Text>{' '}
              and need{' '}
              <Text className="font-medium text-primary-pink">{needLabel}</Text>
              , try this:
            </Text>

            {/* Challenge text */}
            <View className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
              <Text className="text-sm italic leading-relaxed text-white/90">
                &ldquo;{challenge.challengeText}&rdquo;
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* D.O.S.E. Rewards */}
        <View className="mt-8">
          <DoseRewardsGrid dose={challenge.dose} />
        </View>

        {/* Accept button */}
        <View className="mt-8">
          <GradientButton onPress={onAccept}>Accept & Start</GradientButton>
        </View>
      </ScrollView>
    </View>
  );
}

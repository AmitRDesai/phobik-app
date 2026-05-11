import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { ActivityIndicator, ScrollView } from 'react-native';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GlowBg } from '@/components/ui/GlowBg';
import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';

import { EMOTIONS } from '../data/emotions';
import { NEEDS } from '../data/needs';
import { useAIChallenge } from '../hooks/useAIChallenge';
import { useActiveChallenge } from '../hooks/useMicroChallenge';
import { DoseRewardsGrid } from './DoseRewardsGrid';

interface DailyDoseProps {
  onAccept: () => void;
  onAIResponse?: (data: {
    title: string;
    prompt: string;
    challengeText: string;
    doseDopamine: number;
    doseOxytocin: number;
    doseSerotonin: number;
    doseEndorphins: number;
  }) => void;
}

export function DailyDose({ onAccept, onAIResponse }: DailyDoseProps) {
  const scheme = useScheme();
  const { challenge: activeChallenge } = useActiveChallenge();
  const emotionId = (activeChallenge?.emotionId as string) ?? 'afraid';
  const needId = (activeChallenge?.needId as string) ?? 'safety';

  // If DB already has an AI response (resuming), use it directly
  const cachedAI = activeChallenge?.aiResponse as
    | { title: string; prompt: string; challengeText: string }
    | null
    | undefined;

  const { challenge, isLoading, isAI } = useAIChallenge({
    emotionId,
    needId,
  });

  // Notify parent when AI response arrives so it gets persisted
  const notifiedRef = useRef(false);
  useEffect(() => {
    if (isAI && !notifiedRef.current && onAIResponse) {
      notifiedRef.current = true;
      onAIResponse({
        title: challenge.title,
        prompt: challenge.prompt,
        challengeText: challenge.challengeText,
        doseDopamine: challenge.dose.dopamine,
        doseOxytocin: challenge.dose.oxytocin,
        doseSerotonin: challenge.dose.serotonin,
        doseEndorphins: challenge.dose.endorphins,
      });
    }
  }, [isAI, challenge, onAIResponse]);

  // Use DB-cached AI response if available and AI hasn't loaded yet
  const displayChallenge =
    cachedAI && !isAI
      ? {
          ...challenge,
          title: cachedAI.title,
          prompt: cachedAI.prompt,
          challengeText: cachedAI.challengeText,
        }
      : challenge;
  const showAsAI = isAI || !!cachedAI;
  const showLoading = isLoading && !cachedAI;

  const emotionLabel =
    EMOTIONS.find((e) => e.id === emotionId)?.label.toLowerCase() ?? emotionId;
  const needLabel =
    NEEDS.find((n) => n.id === needId)?.label.toLowerCase() ?? needId;

  return (
    <View className="flex-1">
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
        <View className="mb-8 items-center pt-4">
          <Text size="h2">Get your Daily Dose</Text>
          <Text
            size="xs"
            treatment="caption"
            className="mt-1 text-foreground/40"
            style={{ paddingRight: 2.2 }}
          >
            Regulation Complete
          </Text>
        </View>

        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 20, padding: 1 }}
        >
          <View className="rounded-[19px] bg-surface-elevated p-6">
            <View className="mb-4 flex-row items-center gap-2">
              {showLoading ? (
                <ActivityIndicator size={10} color={colors.primary.pink} />
              ) : (
                <View className="h-2 w-2 rounded-full bg-primary-pink" />
              )}
              <Text size="xs" treatment="caption" tone="accent">
                {showLoading
                  ? 'Personalizing...'
                  : showAsAI
                    ? 'AI-Personalized Challenge'
                    : 'Your Personalized Challenge'}
              </Text>
            </View>

            <Text size="h3" className="mb-3 leading-tight">
              {displayChallenge.title}
            </Text>
            <Text size="md" className="leading-relaxed text-foreground/70">
              Since you&apos;re feeling{' '}
              <Text size="md" weight="medium" className="text-accent-yellow">
                {emotionLabel}
              </Text>{' '}
              and need{' '}
              <Text size="md" tone="accent" weight="medium">
                {needLabel}
              </Text>
              , try this:
            </Text>

            <View className="mt-6 rounded-xl border border-foreground/10 bg-foreground/5 p-4">
              <Text
                size="sm"
                italic
                className="leading-relaxed text-foreground/90"
              >
                &ldquo;{displayChallenge.challengeText}&rdquo;
              </Text>
            </View>

            {showAsAI && (
              <View className="mt-3 flex-row items-center gap-1.5 self-end">
                <Ionicons
                  name="sparkles"
                  size={12}
                  color={foregroundFor(scheme, 0.3)}
                />
                <Text size="xs" tone="tertiary">
                  Tailored by AI based on your history
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        <View className="mt-8">
          <DoseRewardsGrid dose={challenge.dose} />
        </View>

        <View className="mt-8">
          <Button
            onPress={onAccept}
            disabled={showLoading}
            loading={showLoading}
          >
            Accept & Start
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

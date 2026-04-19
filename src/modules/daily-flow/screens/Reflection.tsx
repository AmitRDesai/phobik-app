import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { DailyFlowHeader } from '../components/DailyFlowHeader';
import { DailyFlowProgressBar } from '../components/DailyFlowProgressBar';
import { exitDailyFlow } from '../data/flow-navigation';
import type { ReflectionAnswer } from '../data/types';
import {
  useActiveDailyFlowSession,
  useCompleteDailyFlowSession,
} from '../hooks/useDailyFlowSession';

type Option = {
  id: ReflectionAnswer;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  color: string;
};

const OPTIONS: Option[] = [
  {
    id: 'more_steady',
    icon: 'water-drop',
    label: 'More steady',
    color: colors.primary.pink,
  },
  {
    id: 'a_little_better',
    icon: 'wb-sunny',
    label: 'A little better',
    color: colors.accent.yellow,
  },
  {
    id: 'same',
    icon: 'drag-handle',
    label: 'Same',
    color: 'rgba(255,255,255,0.55)',
  },
  {
    id: 'need_reset',
    icon: 'replay',
    label: 'Need another reset',
    color: colors.status.danger,
  },
];

export default function Reflection() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const complete = useCompleteDailyFlowSession();
  const [selected, setSelected] = useState<ReflectionAnswer | null>(null);

  if (isLoading || !session) return <LoadingScreen />;

  const handleFinish = async () => {
    if (!selected) return;
    await complete.mutateAsync({ id: session.id, reflection: selected });
    exitDailyFlow(router);
  };

  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-charcoal"
        centerY={0.18}
        intensity={0.5}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />
      <DailyFlowHeader
        wordmark
        showBack={false}
        onClose={() => exitDailyFlow(router)}
      />

      <ScrollView
        contentContainerClassName="px-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-4 items-center">
          <View
            className="h-24 w-24 rounded-full p-[2px]"
            style={{
              shadowColor: colors.primary.pink,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.45,
              shadowRadius: 25,
            }}
          >
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 999,
                padding: 2,
              }}
            >
              <View className="h-full w-full items-center justify-center rounded-full bg-background-charcoal">
                <MaterialIcons
                  name="auto-awesome"
                  size={32}
                  color={colors.accent.yellow}
                />
              </View>
            </LinearGradient>
          </View>

          <Text className="mt-7 text-4xl font-black tracking-tight text-white">
            Session Complete
          </Text>
          <Text className="mt-3 max-w-xs text-center text-sm leading-5 text-white/60">
            You&rsquo;ve dedicated 10 minutes to your internal landscape. Notice
            the stillness.
          </Text>
        </View>

        <View className="mt-10">
          <DailyFlowProgressBar progress={1} />
        </View>

        <View className="mt-12">
          <Text className="text-2xl font-bold tracking-tight text-white">
            How do you feel now?
          </Text>
          <View className="mt-2 h-1 w-12 rounded-full bg-primary-pink" />
        </View>

        <View className="mt-6 gap-3">
          {OPTIONS.map((option) => {
            const active = selected === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setSelected(option.id)}
                className={clsx(
                  'flex-row items-center gap-4 rounded-2xl border p-5',
                  active
                    ? 'border-white/30 bg-white/[0.08]'
                    : 'border-white/5 bg-white/[0.04]',
                )}
                style={
                  active
                    ? {
                        shadowColor: option.color,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.4,
                        shadowRadius: 14,
                      }
                    : undefined
                }
              >
                <MaterialIcons
                  name={option.icon}
                  size={24}
                  color={option.color}
                />
                <Text className="text-lg font-bold text-white">
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View className="px-6 pb-8">
        <GradientButton
          onPress={handleFinish}
          disabled={!selected}
          loading={complete.isPending}
        >
          Back to Today
        </GradientButton>
      </View>
    </View>
  );
}

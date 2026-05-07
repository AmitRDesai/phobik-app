import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientButton } from '@/components/ui/GradientButton';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { variantConfig } from '@/components/variant-config';
import {
  accentFor,
  colors,
  foregroundFor,
  withAlpha,
} from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';

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
  accent: 'pink' | 'yellow' | 'neutral' | 'danger';
};

const OPTIONS: Option[] = [
  {
    id: 'more_steady',
    icon: 'water-drop',
    label: 'More steady',
    accent: 'pink',
  },
  {
    id: 'a_little_better',
    icon: 'wb-sunny',
    label: 'A little better',
    accent: 'yellow',
  },
  { id: 'same', icon: 'drag-handle', label: 'Same', accent: 'neutral' },
  {
    id: 'need_reset',
    icon: 'replay',
    label: 'Need another reset',
    accent: 'danger',
  },
];

export default function Reflection() {
  const router = useRouter();
  const scheme = useScheme();
  const variantBg = variantConfig.default[scheme].bgHex;
  const { session, isLoading } = useActiveDailyFlowSession();
  const complete = useCompleteDailyFlowSession();
  const [selected, setSelected] = useState<ReflectionAnswer | null>(null);

  if (isLoading || !session) return <LoadingScreen />;

  const optionColor = (a: Option['accent']): string => {
    if (a === 'pink') return colors.primary.pink;
    if (a === 'yellow') return accentFor(scheme, 'yellow');
    if (a === 'danger') return colors.status.danger;
    return foregroundFor(scheme, 0.55);
  };

  const handleFinish = async () => {
    if (!selected) return;
    await complete.mutateAsync({ id: session.id, reflection: selected });
    exitDailyFlow(router);
  };

  return (
    <Screen
      variant="default"
      scroll
      header={
        <DailyFlowHeader
          wordmark
          showBack={false}
          onClose={() => exitDailyFlow(router)}
        />
      }
      sticky={
        <GradientButton
          onPress={handleFinish}
          disabled={!selected}
          loading={complete.isPending}
        >
          Back to Today
        </GradientButton>
      }
      className="px-6"
    >
      <View className="mt-4 items-center">
        <View
          className="h-24 w-24 rounded-full p-[2px]"
          style={{
            boxShadow: `0 0 25px ${withAlpha(colors.primary.pink, 0.45)}`,
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
            <View
              className="h-full w-full items-center justify-center rounded-full"
              style={{ backgroundColor: variantBg }}
            >
              <MaterialIcons
                name="auto-awesome"
                size={32}
                color={accentFor(scheme, 'yellow')}
              />
            </View>
          </LinearGradient>
        </View>

        <Text variant="h1" className="mt-7 font-black">
          Session Complete
        </Text>
        <Text
          variant="sm"
          muted
          className="mt-3 max-w-xs text-center leading-5"
        >
          You&rsquo;ve dedicated 10 minutes to your internal landscape. Notice
          the stillness.
        </Text>
      </View>

      <View className="mt-10">
        <DailyFlowProgressBar progress={1} />
      </View>

      <View className="mt-12">
        <Text variant="h2" className="font-bold">
          How do you feel now?
        </Text>
        <View className="mt-2 h-1 w-12 rounded-full bg-primary-pink" />
      </View>

      <View className="mt-6 gap-3">
        {OPTIONS.map((option) => {
          const color = optionColor(option.accent);
          return (
            <SelectionCard
              key={option.id}
              label={option.label}
              icon={
                <MaterialIcons name={option.icon} size={20} color={color} />
              }
              selected={selected === option.id}
              onPress={() => setSelected(option.id)}
              variant="radio"
            />
          );
        })}
      </View>
    </Screen>
  );
}

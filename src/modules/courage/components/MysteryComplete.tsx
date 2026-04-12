import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import type { CustomDialogProps } from '@/store/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import type { DoseReward, MysteryChallenge } from '../data/mystery-challenges';

interface MysteryCompleteProps extends CustomDialogProps {
  challenge: MysteryChallenge;
  durationSeconds: number;
}

function formatDuration(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

function DoseGrid({ dose }: { dose: DoseReward }) {
  const items = [
    { label: 'Dopamine', value: dose.dopamine, isPink: true },
    { label: 'Oxytocin', value: dose.oxytocin, isPink: false },
    { label: 'Serotonin', value: dose.serotonin, isPink: true },
    { label: 'Endorphins', value: dose.endorphins, isPink: false },
  ];

  return (
    <View className="mt-2 w-full border-t border-white/10 pt-5">
      <Text className="mb-4 text-center text-[10px] uppercase tracking-[3px] text-slate-400">
        D.O.S.E. Earned
      </Text>
      <View className="flex-row justify-between">
        {items.map((item) => (
          <View key={item.label} className="items-center">
            <Text
              className="text-base font-bold"
              style={{
                color: item.isPink ? colors.primary.pink : colors.accent.yellow,
              }}
            >
              +{item.value}
            </Text>
            <Text className="mt-0.5 text-[8px] uppercase text-slate-500">
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function MysteryComplete({
  close,
  challenge,
  durationSeconds,
}: MysteryCompleteProps) {
  return (
    <View>
      {/* Header */}
      <View className="items-center pb-2">
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
            marginBottom: 16,
            shadowColor: colors.primary.pink,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
          }}
        >
          <MaterialIcons
            name="check"
            size={36}
            color={colors.background.dark}
          />
        </LinearGradient>

        <Text className="text-[10px] font-bold uppercase tracking-[3px] text-primary-pink">
          Practice Complete
        </Text>
        <Text className="mt-1 text-center text-2xl font-bold leading-tight text-white">
          {challenge.title}
        </Text>
        <Text className="mt-2 text-center text-[13px] leading-relaxed text-primary-muted">
          You spent {formatDuration(durationSeconds)} on{' '}
          {challenge.practiceLabel.toLowerCase()}. Small brave steps matter.
        </Text>
      </View>

      {/* DOSE earned */}
      <View className="my-4">
        <DoseGrid dose={challenge.dose} />
      </View>

      {/* Done button */}
      <GradientButton
        onPress={() => close(true)}
        icon={<MaterialIcons name="arrow-forward" size={20} color="white" />}
      >
        Done
      </GradientButton>
    </View>
  );
}

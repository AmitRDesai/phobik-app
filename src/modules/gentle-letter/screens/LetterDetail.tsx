import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/BackButton';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/constants/colors';

import { LETTER_STEPS } from '../data/letter-steps';
import { useGetLetter } from '../hooks/useGentleLetter';

function formatCoreAct(act: string): string {
  return act.charAt(0).toUpperCase() + act.slice(1);
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y!, m! - 1, d);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function LetterDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: letter, isLoading } = useGetLetter(id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color={colors.primary.pink} />
      </View>
    );
  }

  if (!letter) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <Text className="text-base text-foreground/60">Letter not found.</Text>
      </View>
    );
  }

  const content = letter.content as Record<string, string>;

  return (
    <Screen
      variant="default"
      scroll
      header={
        <View className="flex-row items-center justify-between border-b border-foreground/5 px-4 py-2">
          <BackButton />
          <Text className="flex-1 pr-10 text-center text-sm font-semibold text-foreground">
            Gentle Letter
          </Text>
        </View>
      }
      className="px-6"
    >
      <View className="mt-6 gap-3">
        <Text className="text-2xl font-bold leading-tight text-foreground">
          {letter.title}
        </Text>
        <Text className="text-sm text-foreground/55">
          {formatDate(letter.entryDate)}
        </Text>
        {letter.coreAct && (
          <View className="self-start rounded-full border border-primary-pink/30 bg-primary-pink/20 px-3 py-1">
            <Text className="text-xs font-bold uppercase tracking-tight text-primary-pink">
              Core Act: {formatCoreAct(letter.coreAct)}
            </Text>
          </View>
        )}
      </View>

      <View className="mt-8 gap-6">
        {LETTER_STEPS.map((step) => {
          const text = content[step.key];
          if (!text) return null;

          return (
            <View key={step.key} className="gap-2">
              <View className="flex-row items-center gap-2">
                <MaterialIcons
                  name={step.icon}
                  size={18}
                  color={colors.primary.pink}
                />
                <Text className="text-xs font-bold uppercase tracking-widest text-foreground/55">
                  Step {step.step}: {step.label}
                </Text>
              </View>
              <View className="rounded-2xl border border-foreground/5 bg-surface-elevated p-5">
                <Text className="text-base leading-relaxed text-foreground/80">
                  {text}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

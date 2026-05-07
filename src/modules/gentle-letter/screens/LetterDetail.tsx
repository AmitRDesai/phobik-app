import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator } from 'react-native';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
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
        <Text variant="md" muted>
          Letter not found.
        </Text>
      </View>
    );
  }

  const content = letter.content as Record<string, string>;

  return (
    <Screen
      variant="default"
      scroll
      header={
        <Header
          title="Gentle Letter"
          className="border-b border-foreground/5"
        />
      }
      className="px-6"
    >
      <View className="mt-6 gap-3">
        <Text variant="h2" className="font-bold leading-tight">
          {letter.title}
        </Text>
        <Text variant="sm" className="text-foreground/55">
          {formatDate(letter.entryDate)}
        </Text>
        {letter.coreAct && (
          <Badge tone="pink" size="md" className="self-start">
            {`Core Act: ${formatCoreAct(letter.coreAct)}`}
          </Badge>
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
                <Text
                  variant="caption"
                  className="font-bold text-foreground/55"
                >
                  Step {step.step}: {step.label}
                </Text>
              </View>
              <Card variant="surface" className="p-5">
                <Text
                  variant="md"
                  className="leading-relaxed text-foreground/80"
                >
                  {text}
                </Text>
              </Card>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

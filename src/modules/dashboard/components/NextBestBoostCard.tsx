import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { CHEMICAL_META, type Chemical } from '../lib/dose-copy';

interface NextBestBoostCardProps {
  lowest: Chemical;
  /** Per-chemical accent color used for the left bar + icon tint. */
  color: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  /** Points the boost would award (e.g., 5). Display only — formula stays in dose-rewards.ts. */
  pointHint?: number;
}

export function NextBestBoostCard({
  lowest,
  color,
  icon,
  pointHint = 5,
}: NextBestBoostCardProps) {
  const router = useRouter();
  const meta = CHEMICAL_META[lowest];
  return (
    <Card variant="elevated" className="overflow-hidden p-0">
      <View className="flex-row items-center gap-4 p-4">
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: 4,
            backgroundColor: color,
          }}
        />
        <View
          className="ml-2 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: withAlpha(color, 0.2) }}
        >
          <MaterialIcons name={icon} size={22} color={color} />
        </View>
        <View className="flex-1">
          <Text
            variant="caption"
            className="font-bold tracking-widest text-foreground/55"
          >
            Your Next Boost
          </Text>
          <Text variant="sm" className="mt-1 font-bold text-foreground">
            +{pointHint} {meta.label}:{' '}
            <Text variant="sm" className="font-medium text-foreground/70">
              {meta.boostLabel}
            </Text>
          </Text>
        </View>
        <Pressable
          onPress={() => router.push(meta.boostRoute)}
          className="rounded-xl bg-foreground px-3 py-2 active:opacity-80"
        >
          <Text
            variant="caption"
            className="font-bold tracking-widest text-surface"
          >
            Do it
          </Text>
        </Pressable>
      </View>
    </Card>
  );
}

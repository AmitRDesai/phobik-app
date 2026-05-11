import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { withAlpha } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

const LINKS = [
  { label: 'Sunny', href: '/characters/sunny' as const, tint: '#FACC15' },
  { label: 'Olive', href: '/characters/olive' as const, tint: '#FFB7D5' },
  { label: 'Eddy', href: '/characters/eddy' as const, tint: '#FF8C00' },
  { label: 'Dash', href: '/characters/dash' as const, tint: '#00F2FF' },
];

export function CharacterDevLinks() {
  const router = useRouter();

  return (
    <Card variant="raised" size="lg">
      <Text
        size="xs"
        treatment="caption"
        weight="bold"
        className="mb-3 text-foreground/40"
      >
        Characters (dev)
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {LINKS.map((link) => (
          <Pressable
            key={link.href}
            onPress={() => router.push(link.href)}
            className="rounded-full border border-foreground/10 px-4 py-2"
            style={{ backgroundColor: withAlpha(link.tint, 0.13) }}
          >
            <Text size="sm" weight="semibold" style={{ color: link.tint }}>
              {link.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </Card>
  );
}

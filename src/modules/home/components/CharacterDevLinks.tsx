import { withAlpha } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

const LINKS = [
  { label: 'Sunny', href: '/characters/sunny' as const, tint: '#FACC15' },
  { label: 'Olive', href: '/characters/olive' as const, tint: '#FFB7D5' },
  { label: 'Eddy', href: '/characters/eddy' as const, tint: '#FF8C00' },
  { label: 'Dash', href: '/characters/dash' as const, tint: '#00F2FF' },
];

export function CharacterDevLinks() {
  const router = useRouter();

  return (
    <View className="rounded-3xl border border-foreground/10 bg-foreground/5 p-4">
      <Text className="mb-3 text-[10px] font-bold uppercase tracking-widest text-foreground/40">
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
            <Text
              className="text-xs font-semibold"
              style={{ color: link.tint }}
            >
              {link.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

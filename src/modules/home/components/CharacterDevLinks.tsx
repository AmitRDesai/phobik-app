import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

const LINKS = [
  { label: 'Sunny', href: '/characters/sunny', tint: '#FACC15' },
  { label: 'Olive', href: '/characters/olive', tint: '#FFB7D5' },
  { label: 'Eddy', href: '/characters/eddy', tint: '#FF8C00' },
  { label: 'Dash', href: '/characters/dash', tint: '#00F2FF' },
] as const;

export function CharacterDevLinks() {
  const router = useRouter();

  return (
    <View className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <Text className="mb-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
        Characters (dev)
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {LINKS.map((link) => (
          <Pressable
            key={link.href}
            onPress={() => router.push(link.href as any)}
            className="rounded-full border border-white/10 px-4 py-2"
            style={{ backgroundColor: `${link.tint}22` }}
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

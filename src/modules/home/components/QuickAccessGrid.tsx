import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

interface QuickAccessItem {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  href?: string;
}

const ITEMS: QuickAccessItem[] = [
  {
    icon: 'self-improvement',
    label: 'Body',
    href: '/practices/body-regulation',
  },
  { icon: 'psychology', label: 'Mind', href: '/practices/mind-regulation' },
  {
    icon: 'favorite',
    label: 'Relationship',
    href: '/practices/relationship-regulation',
  },
  { icon: 'edit-note', label: 'Journal', href: '/journal' },
];

export function QuickAccessGrid() {
  const router = useRouter();

  return (
    <View className="flex-row flex-wrap gap-3">
      {ITEMS.map((item) => (
        <Pressable
          key={item.label}
          onPress={item.href ? () => router.push(item.href as any) : undefined}
          className="flex-row items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4"
          style={{ width: '48%' }}
        >
          <MaterialIcons
            name={item.icon}
            size={22}
            color={colors.accent.yellow}
          />
          <Text className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

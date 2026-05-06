import { Card } from '@/components/ui/Card';
import { accentFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { Text, View } from 'react-native';

interface QuickAccessItem {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  href: Href;
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
  const scheme = useScheme();
  const iconColor = accentFor(scheme, 'yellow');
  const router = useRouter();

  return (
    <View className="flex-row flex-wrap gap-3">
      {ITEMS.map((item) => (
        <Card
          key={item.label}
          onPress={() => router.push(item.href)}
          className="flex-row items-center gap-3"
          style={{ width: '48%' }}
        >
          <MaterialIcons name={item.icon} size={22} color={iconColor} />
          <Text className="text-[11px] font-bold uppercase tracking-wider text-foreground/70">
            {item.label}
          </Text>
        </Card>
      ))}
    </View>
  );
}

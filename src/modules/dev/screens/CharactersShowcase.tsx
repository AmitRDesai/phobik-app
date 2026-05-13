import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { withAlpha } from '@/constants/colors';
import { SettingsMenuItem } from '@/modules/settings/components/SettingsMenuItem';
import { useRouter } from 'expo-router';

const CHARACTERS: {
  href:
    | '/dev/characters/sunny'
    | '/dev/characters/olive'
    | '/dev/characters/eddy'
    | '/dev/characters/dash';
  label: string;
  subtitle: string;
  icon: React.ComponentProps<typeof SettingsMenuItem>['icon'];
  tint: string;
}[] = [
  {
    href: '/dev/characters/sunny',
    label: 'Sunny',
    subtitle: 'Warmth · golden light · gentle uplift',
    icon: 'wb-sunny',
    tint: '#FACC15',
  },
  {
    href: '/dev/characters/olive',
    label: 'Olive',
    subtitle: 'Care · soft pink · nurturing presence',
    icon: 'spa',
    tint: '#FFB7D5',
  },
  {
    href: '/dev/characters/eddy',
    label: 'Eddy',
    subtitle: 'Energy · amber spark · activation',
    icon: 'bolt',
    tint: '#FF8C00',
  },
  {
    href: '/dev/characters/dash',
    label: 'Dash',
    subtitle: 'Focus · cool cyan · momentum',
    icon: 'flash-on',
    tint: '#00F2FF',
  },
];

export default function CharactersShowcase() {
  const router = useRouter();

  return (
    <Screen
      scroll
      header={
        <Header
          left={<BackButton />}
          center={
            <Text size="lg" weight="bold">
              Characters
            </Text>
          }
        />
      }
      className="px-4"
      contentClassName="gap-4"
    >
      <View className="px-2 pt-2">
        <Text size="sm" tone="secondary" className="leading-relaxed">
          Dev-only catalog. Each row opens the character&rsquo;s standalone
          screen.
        </Text>
      </View>

      <View className="gap-2">
        {CHARACTERS.map((c) => (
          <SettingsMenuItem
            key={c.href}
            icon={c.icon}
            iconColor={c.tint}
            iconBgColor={withAlpha(c.tint, 0.15)}
            label={c.label}
            subtitle={c.subtitle}
            onPress={() => router.push(c.href)}
          />
        ))}
      </View>
    </Screen>
  );
}

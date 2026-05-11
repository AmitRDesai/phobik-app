import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SettingsMenuItem } from '@/modules/settings/components/SettingsMenuItem';
import { useRouter } from 'expo-router';

const SECTIONS: {
  href: '/dev/design-system/typography';
  label: string;
  subtitle: string;
  icon: React.ComponentProps<typeof SettingsMenuItem>['icon'];
}[] = [
  {
    href: '/dev/design-system/typography',
    label: 'Typography',
    subtitle: 'Text variants — display, h1–h3, lg/md/sm/xs, label, caption',
    icon: 'text-fields',
  },
];

export default function DesignSystemIndex() {
  const router = useRouter();
  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="Design System" />}
      className="px-4"
      contentClassName="gap-6"
    >
      <View className="px-2 pt-2">
        <Text size="sm" tone="secondary" className="leading-relaxed">
          Dev-only catalog. Each section shows every variant of a primitive so
          regressions are caught visually.
        </Text>
      </View>

      <View className="gap-2">
        {SECTIONS.map((s) => (
          <SettingsMenuItem
            key={s.href}
            icon={s.icon}
            label={s.label}
            subtitle={s.subtitle}
            onPress={() => router.push(s.href)}
          />
        ))}
      </View>
    </Screen>
  );
}

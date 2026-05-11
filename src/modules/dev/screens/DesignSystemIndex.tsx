import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SettingsMenuItem } from '@/modules/settings/components/SettingsMenuItem';
import { useRouter } from 'expo-router';

const SECTIONS: {
  href:
    | '/dev/design-system/typography'
    | '/dev/design-system/buttons'
    | '/dev/design-system/cards'
    | '/dev/design-system/badges'
    | '/dev/design-system/icon-chips'
    | '/dev/design-system/text-fields'
    | '/dev/design-system/screens';
  label: string;
  subtitle: string;
  icon: React.ComponentProps<typeof SettingsMenuItem>['icon'];
}[] = [
  {
    href: '/dev/design-system/typography',
    label: 'Typography',
    subtitle: 'size · tone · weight · align · italic · treatment',
    icon: 'text-fields',
  },
  {
    href: '/dev/design-system/buttons',
    label: 'Button',
    subtitle: 'primary · secondary · ghost · destructive · sizes · states',
    icon: 'smart-button',
  },
  {
    href: '/dev/design-system/cards',
    label: 'Card',
    subtitle: 'flat · raised · toned · sizes · shadow · tone tinting',
    icon: 'view-agenda',
  },
  {
    href: '/dev/design-system/badges',
    label: 'Badge',
    subtitle: 'tinted · outline · solid · 6 tones · with-icon · sizes',
    icon: 'label',
  },
  {
    href: '/dev/design-system/icon-chips',
    label: 'IconChip',
    subtitle: 'sizes · shapes · tones · custom bg/border · render-prop icon',
    icon: 'auto-awesome',
  },
  {
    href: '/dev/design-system/text-fields',
    label: 'TextField',
    subtitle: 'types · sizes · label · hint · error · icon · states',
    icon: 'edit',
  },
  {
    href: '/dev/design-system/screens',
    label: 'Screen',
    subtitle: 'variants · scroll · header · sticky · keyboard · insets',
    icon: 'fullscreen',
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

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
    | '/dev/design-system/text-areas'
    | '/dev/design-system/segmented-controls'
    | '/dev/design-system/selection-cards'
    | '/dev/design-system/headers'
    | '/dev/design-system/progress-dots'
    | '/dev/design-system/notification-badges'
    | '/dev/design-system/gradient-text'
    | '/dev/design-system/glows'
    | '/dev/design-system/dialogs'
    | '/dev/design-system/network-banners'
    | '/dev/design-system/progress-bars'
    | '/dev/design-system/switches'
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
    href: '/dev/design-system/text-areas',
    label: 'TextArea',
    subtitle: 'filled · minimal · rows · label · hint · error · counter',
    icon: 'notes',
  },
  {
    href: '/dev/design-system/segmented-controls',
    label: 'SegmentedControl',
    subtitle: '2–4 options · binary · null state · long labels · patterns',
    icon: 'tab',
  },
  {
    href: '/dev/design-system/selection-cards',
    label: 'SelectionCard',
    subtitle: 'radio · checkbox · icon · description · single/multi-select',
    icon: 'check-box',
  },
  {
    href: '/dev/design-system/headers',
    label: 'Header',
    subtitle: 'back · close · wordmark · title · slots · progress · confirm',
    icon: 'view-headline',
  },
  {
    href: '/dev/design-system/progress-dots',
    label: 'ProgressDots',
    subtitle: 'total · current · interactive · positions · in-header pattern',
    icon: 'more-horiz',
  },
  {
    href: '/dev/design-system/notification-badges',
    label: 'NotificationBadge',
    subtitle: 'count · overflow (9+) · anchor parents · positioning rules',
    icon: 'circle-notifications',
  },
  {
    href: '/dev/design-system/gradient-text',
    label: 'GradientText',
    subtitle:
      'color pairs · direction · sizes · brand wordmark · anti-patterns',
    icon: 'gradient',
  },
  {
    href: '/dev/design-system/glows',
    label: 'Glows',
    subtitle:
      'GlowBg (screen wash) + RadialGlow (element halo) · sizes · colors',
    icon: 'blur-on',
  },
  {
    href: '/dev/design-system/dialogs',
    label: 'Dialog',
    subtitle:
      'error · info · loading · open (custom) · buttons · async patterns',
    icon: 'chat-bubble-outline',
  },
  {
    href: '/dev/design-system/network-banners',
    label: 'NetworkBanner',
    subtitle:
      'auto-hide offline strip · NetInfo subscription · placement · messages',
    icon: 'cloud-off',
  },
  {
    href: '/dev/design-system/progress-bars',
    label: 'ProgressBar',
    subtitle:
      'sizes · tones · gradient · clamping · audio scrubber + upload patterns',
    icon: 'linear-scale',
  },
  {
    href: '/dev/design-system/switches',
    label: 'Switch',
    subtitle: 'binary toggle · disabled · settings rows · form flag patterns',
    icon: 'toggle-on',
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

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { EmptyState } from '@/components/ui/EmptyState';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { SettingsMenuItem } from '@/modules/settings/components/SettingsMenuItem';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { SchemeToggle } from '../components/SchemeToggle';

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
    | '/dev/design-system/chip-selects'
    | '/dev/design-system/dropdown-selects'
    | '/dev/design-system/audio-players'
    | '/dev/design-system/empty-states'
    | '/dev/design-system/toasts'
    | '/dev/design-system/skeletons'
    | '/dev/design-system/sliders'
    | '/dev/design-system/accordions'
    | '/dev/design-system/floating-add-buttons'
    | '/dev/design-system/info-callouts'
    | '/dev/design-system/user-avatars'
    | '/dev/design-system/ratings'
    | '/dev/design-system/inline-links'
    | '/dev/design-system/playback-controls'
    | '/dev/design-system/social-auth-buttons'
    | '/dev/design-system/image-scrims'
    | '/dev/design-system/accent-pills'
    | '/dev/design-system/biometric-stat-cards'
    | '/dev/design-system/dividers'
    | '/dev/design-system/segmented-progress'
    | '/dev/design-system/progress-rings'
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
    href: '/dev/design-system/chip-selects',
    label: 'ChipSelect',
    subtitle:
      'multi / single · sizes · tones · icons · wrap / scroll · disabled',
    icon: 'style',
  },
  {
    href: '/dev/design-system/dropdown-selects',
    label: 'DropdownSelect',
    subtitle:
      'trigger opens Dialog sheet · descriptions · icons · allowClear · form fields',
    icon: 'arrow-drop-down-circle',
  },
  {
    href: '/dev/design-system/audio-players',
    label: 'AudioPlayer',
    subtitle:
      'hero · card · mini · inline · tones · loading · seek · skip · voice · mute',
    icon: 'play-circle-outline',
  },
  {
    href: '/dev/design-system/empty-states',
    label: 'EmptyState',
    subtitle:
      'sm / md / lg · tones · icon + title + description + optional CTA',
    icon: 'inbox',
  },
  {
    href: '/dev/design-system/toasts',
    label: 'Toast',
    subtitle:
      'success · info · warning · error · imperative API · auto-dismiss',
    icon: 'notifications-active',
  },
  {
    href: '/dev/design-system/skeletons',
    label: 'Skeleton',
    subtitle:
      'rect / pill / circle · animated pulse · compositions · static mode',
    icon: 'view-stream',
  },
  {
    href: '/dev/design-system/sliders',
    label: 'Slider',
    subtitle:
      'range + step · tones · disabled · auto-measured width · drag + tap',
    icon: 'tune',
  },
  {
    href: '/dev/design-system/accordions',
    label: 'Accordion',
    subtitle:
      'flat / card · sizes · controlled · auto-height · FAQ + settings patterns',
    icon: 'expand-more',
  },
  {
    href: '/dev/design-system/floating-add-buttons',
    label: 'FloatingAddButton',
    subtitle:
      'bottom-right FAB · custom icons · positioning override · accessibility',
    icon: 'add-circle',
  },
  {
    href: '/dev/design-system/info-callouts',
    label: 'InfoCallout',
    subtitle:
      'tinted / plain · tones · sizes · action · dismissible · inline tips',
    icon: 'lightbulb-outline',
  },
  {
    href: '/dev/design-system/user-avatars',
    label: 'UserAvatar',
    subtitle:
      'sizes · image / initials / icon fallback hierarchy · session-aware',
    icon: 'account-circle',
  },
  {
    href: '/dev/design-system/ratings',
    label: 'Rating',
    subtitle:
      'numeric scale · ranges · sizes · gradient / tinted · endpoint labels',
    icon: 'looks-5',
  },
  {
    href: '/dev/design-system/inline-links',
    label: 'InlineLink',
    subtitle:
      'tone-mixed single-row link · prefix + accent action · auth flow CTAs',
    icon: 'link',
  },
  {
    href: '/dev/design-system/playback-controls',
    label: 'PlaybackControls',
    subtitle:
      'mute + play/pause + restart · sizes · session controls for breathing flows',
    icon: 'play-circle-filled',
  },
  {
    href: '/dev/design-system/social-auth-buttons',
    label: 'SocialAuthButton',
    subtitle:
      'round 56×56 Google / Apple chip · theme-aware icon · iOS-only apple gate',
    icon: 'fingerprint',
  },
  {
    href: '/dev/design-system/image-scrims',
    label: 'ImageScrim',
    subtitle:
      'bottom / top gradient scrim over images · strength + start coverage · stack for both edges',
    icon: 'gradient',
  },
  {
    href: '/dev/design-system/accent-pills',
    label: 'AccentPill',
    subtitle:
      'neutral / tinted / solid · status labels · category tags · corner badges · tappable toggles',
    icon: 'label-important',
  },
  {
    href: '/dev/design-system/biometric-stat-cards',
    label: 'BiometricStatCard',
    subtitle:
      'session stat tile · label + value + unit + icon · sm / md · isStale · tappable',
    icon: 'monitor-heart',
  },
  {
    href: '/dev/design-system/dividers',
    label: 'Divider',
    subtitle:
      'hairline section break · optional centered label · spacing via className',
    icon: 'horizontal-rule',
  },
  {
    href: '/dev/design-system/segmented-progress',
    label: 'SegmentedProgress',
    subtitle:
      'segmented gradient bar · onboarding / micro-challenge step flows · sm / md',
    icon: 'view-week',
  },
  {
    href: '/dev/design-system/progress-rings',
    label: 'ProgressRing',
    subtitle:
      'circular SVG progress · animated · gradient or single tone · custom size + stroke',
    icon: 'donut-large',
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
  const scheme = useScheme();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SECTIONS;
    return SECTIONS.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <Screen
      scroll
      header={<Header title="Design System" right={<SchemeToggle />} />}
      className="px-4"
      contentClassName="gap-4"
    >
      <View className="px-2 pt-2">
        <Text size="sm" tone="secondary" className="leading-relaxed">
          Dev-only catalog. Each section shows every variant of a primitive so
          regressions are caught visually.
        </Text>
      </View>

      <TextField
        value={query}
        onChangeText={setQuery}
        placeholder="Search primitives…"
        icon={
          <MaterialIcons
            name="search"
            size={18}
            color={foregroundFor(scheme, 0.55)}
          />
        }
        returnKeyType="search"
      />

      {filtered.length === 0 ? (
        <EmptyState
          size="md"
          title="No primitives match"
          description={`Nothing matches “${query.trim()}”. Try a shorter term or clear the search.`}
          icon={(color) => (
            <MaterialIcons name="search-off" size={32} color={color} />
          )}
        />
      ) : (
        <View className="gap-2">
          {filtered.map((s) => (
            <SettingsMenuItem
              key={s.href}
              icon={s.icon}
              label={s.label}
              subtitle={s.subtitle}
              onPress={() => router.push(s.href)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

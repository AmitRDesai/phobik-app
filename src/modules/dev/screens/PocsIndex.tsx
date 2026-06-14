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
import { useState } from 'react';
import { SchemeToggle } from '../components/SchemeToggle';

/**
 * Dev-only catalog of prototypes, POCs, and screens not yet reachable from the
 * product nav. Mirrors the Design System index so anything in-progress stays
 * one tap away during development.
 */
const SECTIONS: {
  href:
    | '/dev/pocs/background-music'
    | '/dev/pocs/eft/guide'
    | '/dev/pocs/eft/toh-focus'
    | '/dev/pocs/eft/tapping'
    | '/affirmation/feeling-selection'
    | '/daily-check-in'
    | '/insights/health';
  label: string;
  subtitle: string;
  icon: React.ComponentProps<typeof SettingsMenuItem>['icon'];
}[] = [
  {
    href: '/dev/pocs/background-music',
    label: 'Background Music (POC)',
    subtitle:
      'voice + looping bed mixed on-device · independent per-track volume · useMixedAudioPlayer',
    icon: 'library-music',
  },
  {
    href: '/dev/pocs/eft/guide',
    label: 'EFT Tapping — Points Guide',
    subtitle: 'restored from old daily flow · entry of the 3-step tapping flow',
    icon: 'touch-app',
  },
  {
    href: '/dev/pocs/eft/toh-focus',
    label: 'EFT Tapping — TOH Focus',
    subtitle: 'restored · top-of-head focus before the session',
    icon: 'touch-app',
  },
  {
    href: '/dev/pocs/eft/tapping',
    label: 'EFT Tapping — Session',
    subtitle: 'restored · per-point tapping session with animation',
    icon: 'touch-app',
  },
  {
    href: '/affirmation/feeling-selection',
    label: 'Affirmation — Feeling Selection',
    subtitle: 'unlinked route · live flow enters from the home feeling picker',
    icon: 'mood',
  },
  {
    href: '/daily-check-in',
    label: 'Daily Check-In (Energy)',
    subtitle: 'unlinked energy check-in · superseded by Daily Flow',
    icon: 'bolt',
  },
  {
    href: '/insights/health',
    label: 'Insights — Health',
    subtitle: 'unlinked health insights · sibling of Settings → Health',
    icon: 'monitor-heart',
  },
];

export default function PocsIndex() {
  const router = useRouter();
  const scheme = useScheme();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered = q
    ? SECTIONS.filter(
        (s) =>
          s.label.toLowerCase().includes(q) ||
          s.subtitle.toLowerCase().includes(q),
      )
    : SECTIONS;

  return (
    <Screen
      scroll
      header={
        <Header title="Prototypes & Experiments" right={<SchemeToggle />} />
      }
      className="px-4"
      contentClassName="gap-4"
    >
      <View className="px-2 pt-2">
        <Text size="sm" tone="secondary" className="leading-relaxed">
          Dev-only catalog of prototypes and screens not yet wired into the
          product nav. Added here so in-progress work stays reachable.
        </Text>
      </View>

      <TextField
        value={query}
        onChangeText={setQuery}
        placeholder="Search screens…"
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
          title="No screens match"
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

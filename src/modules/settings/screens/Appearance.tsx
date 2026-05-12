import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { accentFor, withAlpha } from '@/constants/colors';
import { useTheme, type ThemeMode } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export default function Appearance() {
  const { mode: themeMode, setMode: setThemeMode, scheme } = useTheme();
  const yellow = accentFor(scheme, 'yellow');

  return (
    <Screen
      scroll
      header={<Header title="Appearance" />}
      className="px-4"
      contentClassName="gap-6"
    >
      <Card className="gap-4 p-5">
        <View className="flex-row items-center gap-3">
          <View
            className="h-10 w-10 items-center justify-center rounded-xl"
            style={{
              backgroundColor: withAlpha(
                yellow,
                scheme === 'dark' ? 0.15 : 0.12,
              ),
            }}
          >
            <MaterialIcons
              name={scheme === 'dark' ? 'dark-mode' : 'light-mode'}
              size={20}
              color={yellow}
            />
          </View>
          <View className="flex-1">
            <Text size="md" weight="semibold">
              Theme
            </Text>
            <Text size="sm" tone="secondary">
              {themeMode === 'system'
                ? `Following system (${scheme})`
                : `Always ${themeMode}`}
            </Text>
          </View>
        </View>
        <SegmentedControl
          options={THEME_OPTIONS}
          selected={themeMode}
          onSelect={setThemeMode}
        />
        <Text size="sm" tone="secondary" className="leading-relaxed">
          Choose how Phobik appears. Pick System to follow your device&apos;s
          dark/light setting automatically.
        </Text>
      </Card>
    </Screen>
  );
}

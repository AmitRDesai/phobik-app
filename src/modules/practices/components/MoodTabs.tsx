import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { ChipSelect } from '@/components/ui/ChipSelect';

type MoodTabsProps = {
  label?: string;
  options: string[];
  active: string | null;
  /** Receives null when the user taps the currently selected option, only when allowDeselect is true. */
  onChange: (value: string | null) => void;
  /** Allow tapping the active chip to deselect it. Defaults to true. */
  allowDeselect?: boolean;
};

export function MoodTabs({
  label,
  options,
  active,
  onChange,
  allowDeselect = true,
}: MoodTabsProps) {
  return (
    <View className="mb-6">
      {label ? (
        <View className="mb-3 flex-row items-center gap-2">
          <View className="h-1.5 w-1.5 rounded-full bg-primary-pink" />
          <Text size="xs" tone="secondary" weight="semibold">
            {label}
          </Text>
        </View>
      ) : null}
      <ChipSelect
        options={options.map((o) => ({ value: o, label: o }))}
        value={active ? [active] : []}
        onChange={(next) => {
          // single-select: ChipSelect emits [] when re-tapping the active
          // chip. Respect allowDeselect — if false, ignore that empty next.
          if (next.length === 0) {
            if (allowDeselect) onChange(null);
            return;
          }
          onChange(next[0]);
        }}
        multi={false}
        variant="gradient"
        layout="scroll"
      />
    </View>
  );
}

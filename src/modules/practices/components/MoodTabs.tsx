import { SelectableChip } from '@/modules/onboarding/components/SelectableChip';
import { Text } from '@/components/themed/Text';
import { ScrollView, View } from 'react-native';
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
          <Text variant="caption" className="text-foreground/60">
            {label}
          </Text>
        </View>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
      >
        {options.map((option) => {
          const isActive = option === active;
          return (
            <SelectableChip
              key={option}
              label={option}
              selected={isActive}
              onPress={() => {
                if (isActive) {
                  if (allowDeselect) onChange(null);
                  return;
                }
                onChange(option);
              }}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

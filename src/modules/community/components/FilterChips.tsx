import { colors, withAlpha } from '@/constants/colors';
import { Text } from '@/components/themed/Text';
import { Pressable, ScrollView } from 'react-native';
const CIRCLES = [
  { label: 'All Stories', value: undefined },
  { label: '18-24', value: '18-24' },
  { label: '25-34', value: '25-34' },
  { label: '35-44', value: '35-44' },
  { label: '45-54', value: '45-54' },
  { label: '55+', value: '55+' },
] as const;

interface FilterChipsProps {
  selected: string | undefined;
  onSelect: (circle: string | undefined) => void;
}

export function FilterChips({ selected, onSelect }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="-mx-4"
      contentContainerClassName="gap-2 px-4"
    >
      {CIRCLES.map((circle) => {
        const isActive = selected === circle.value;
        return (
          <Pressable
            key={circle.label}
            onPress={() => onSelect(circle.value)}
            className={`h-9 items-center justify-center rounded-full px-5 ${
              isActive
                ? 'bg-primary-pink'
                : 'border border-primary-pink/10 bg-surface-elevated'
            }`}
            style={
              isActive
                ? {
                    boxShadow: `0px 2px 8px ${withAlpha(colors.gradient.magenta, 0.3)}`,
                  }
                : undefined
            }
          >
            <Text
              className={`text-sm font-semibold ${isActive ? 'text-foreground' : 'text-foreground/80'}`}
            >
              {circle.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

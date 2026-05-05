import { colors, withAlpha } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

interface SelectionCardProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onPress: () => void;
  variant: 'radio' | 'checkbox';
}

export function SelectionCard({
  label,
  description,
  icon,
  selected,
  onPress,
  variant,
}: SelectionCardProps) {
  const cardContent = (
    <>
      {icon && (
        <View className="h-10 w-10 items-center justify-center rounded-full bg-foreground/10">
          {icon}
        </View>
      )}
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">{label}</Text>
        {description && (
          <Text className="mt-0.5 text-sm text-foreground/55">
            {description}
          </Text>
        )}
      </View>
      {variant === 'radio' ? (
        <RadioIndicator selected={selected} />
      ) : (
        <CheckboxIndicator selected={selected} />
      )}
    </>
  );

  if (variant === 'checkbox') {
    const cardInner = (
      <View
        className={`flex-row items-center gap-4 rounded-2xl px-4 py-4 ${
          selected ? 'bg-surface-elevated' : 'bg-foreground/5'
        }`}
      >
        {cardContent}
      </View>
    );

    return (
      <Pressable onPress={onPress}>
        {selected ? (
          <LinearGradient
            colors={[colors.primary.pink, colors.accent.yellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 16, padding: 2 }}
          >
            {cardInner}
          </LinearGradient>
        ) : (
          <View style={{ borderRadius: 16, padding: 2 }}>{cardInner}</View>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress}>
      <View
        className={`flex-row items-center gap-4 rounded-2xl border px-4 py-4 ${
          selected
            ? 'border-primary-pink'
            : 'border-foreground/10 bg-foreground/5'
        }`}
        style={
          selected
            ? {
                boxShadow: `0 0 12px ${withAlpha(colors.primary.pink, 0.3)}`,
              }
            : undefined
        }
      >
        {cardContent}
      </View>
    </Pressable>
  );
}

function RadioIndicator({ selected }: { selected: boolean }) {
  return (
    <View
      className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
        selected ? 'border-primary-pink' : 'border-foreground/25'
      }`}
    >
      {selected && <View className="h-3 w-3 rounded-full bg-primary-pink" />}
    </View>
  );
}

function CheckboxIndicator({ selected }: { selected: boolean }) {
  return (
    <View
      className={`h-6 w-6 items-center justify-center rounded-full ${
        selected ? 'bg-accent-yellow' : 'bg-foreground/15'
      }`}
    >
      {selected && <Ionicons name="checkmark-sharp" size={14} color="black" />}
    </View>
  );
}

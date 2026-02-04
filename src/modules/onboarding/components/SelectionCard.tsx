import { colors } from '@/constants/colors';
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
        <View className="h-10 w-10 items-center justify-center rounded-full bg-white/10">
          {icon}
        </View>
      )}
      <View className="flex-1">
        <Text className="text-base font-semibold text-white">{label}</Text>
        {description && (
          <Text className="mt-0.5 text-sm text-white/50">{description}</Text>
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
    if (selected) {
      return (
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 16, padding: 2 }}
        >
          <Pressable onPress={onPress}>
            <View
              className="flex-row items-center gap-4 rounded-2xl px-4 py-4"
              style={{ backgroundColor: colors.background.charcoal }}
            >
              {cardContent}
            </View>
          </Pressable>
        </LinearGradient>
      );
    }

    return (
      <Pressable onPress={onPress}>
        <View
          className="flex-row items-center gap-4 rounded-2xl border px-4 py-4"
          style={{
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            backgroundColor: 'rgba(255,255,255,0.05)',
          }}
        >
          {cardContent}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress}>
      <View
        className="flex-row items-center gap-4 rounded-2xl border px-4 py-4"
        style={
          selected
            ? {
                borderColor: colors.primary.pink,
                borderWidth: 1,
                shadowColor: colors.primary.pink,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
              }
            : {
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                backgroundColor: 'rgba(255,255,255,0.05)',
              }
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
      className="h-6 w-6 items-center justify-center rounded-full border-2"
      style={{
        borderColor: selected ? colors.primary.pink : 'rgba(255,255,255,0.2)',
      }}
    >
      {selected && (
        <View
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: colors.primary.pink }}
        />
      )}
    </View>
  );
}

function CheckboxIndicator({ selected }: { selected: boolean }) {
  return (
    <View
      className="h-6 w-6 items-center justify-center rounded-full"
      style={{
        backgroundColor: selected
          ? colors.accent.yellow
          : 'rgba(255,255,255,0.1)',
      }}
    >
      {selected && <Ionicons name="checkmark-sharp" size={14} color="black" />}
    </View>
  );
}

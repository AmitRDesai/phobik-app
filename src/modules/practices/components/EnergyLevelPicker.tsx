import { alpha, colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

export type EnergyLevel =
  | 'peak-positive'
  | 'positive-calm'
  | 'low-energy'
  | 'stressed'
  | 'intense-negative'
  | 'dont-know';

interface EnergyOptionBase {
  id: EnergyLevel;
  label: string;
}

interface EmojiOption extends EnergyOptionBase {
  emoji: string;
}

interface IconOption extends EnergyOptionBase {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  iconBgColor: string;
}

/* eslint-disable prettier/prettier */
const EMOJI_MAP: Record<EnergyLevel, string> = {
  'peak-positive': String.fromCodePoint(0x26a1),
  'positive-calm': String.fromCodePoint(0x2728),
  'low-energy': String.fromCodePoint(0x1f56f) + '\uFE0F',
  stressed: String.fromCodePoint(0x1f30a),
  'intense-negative': String.fromCodePoint(0x1f32a) + '\uFE0F',
  'dont-know': String.fromCodePoint(0x2754),
};
/* eslint-enable prettier/prettier */

const EMOJI_OPTIONS: EmojiOption[] = [
  {
    id: 'peak-positive',
    emoji: EMOJI_MAP['peak-positive'],
    label: 'Peak Positive',
  },
  {
    id: 'positive-calm',
    emoji: EMOJI_MAP['positive-calm'],
    label: 'Positive Calm',
  },
  { id: 'low-energy', emoji: EMOJI_MAP['low-energy'], label: 'Low Energy' },
  { id: 'stressed', emoji: EMOJI_MAP['stressed'], label: 'Stressed' },
  {
    id: 'intense-negative',
    emoji: EMOJI_MAP['intense-negative'],
    label: 'Intense Negative',
  },
  { id: 'dont-know', emoji: EMOJI_MAP['dont-know'], label: "Don't Know" },
];

const ICON_OPTIONS: IconOption[] = [
  {
    id: 'peak-positive',
    icon: 'flash-on',
    iconColor: colors.emerald[400],
    iconBgColor: withAlpha(colors.emerald[500], 0.1),
    label: 'Peak Positive',
  },
  {
    id: 'positive-calm',
    icon: 'self-improvement',
    iconColor: colors.blue[400],
    iconBgColor: withAlpha(colors.blue[400], 0.1),
    label: 'Positive Calm',
  },
  {
    id: 'low-energy',
    icon: 'battery-alert',
    iconColor: colors.orange[400],
    iconBgColor: withAlpha(colors.orange[400], 0.1),
    label: 'Low Energy',
  },
  {
    id: 'stressed',
    icon: 'warning',
    iconColor: colors.pink[400],
    iconBgColor: withAlpha(colors.pink[400], 0.1),
    label: 'Stressed',
  },
  {
    id: 'intense-negative',
    icon: 'mood-bad',
    iconColor: colors.red[400],
    iconBgColor: withAlpha(colors.red[500], 0.1),
    label: 'Intense Negative',
  },
  {
    id: 'dont-know',
    icon: 'help-outline',
    iconColor: alpha.white60,
    iconBgColor: alpha.white10,
    label: "Don't Know",
  },
];

interface CenteredIconOption extends EnergyOptionBase {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
}

const CENTERED_ICON_OPTIONS: CenteredIconOption[] = [
  {
    id: 'peak-positive',
    icon: 'wb-sunny',
    iconColor: colors.yellow[400],
    label: 'Peak Positive',
  },
  {
    id: 'positive-calm',
    icon: 'spa',
    iconColor: colors.green[400],
    label: 'Positive Calm',
  },
  {
    id: 'low-energy',
    icon: 'hotel',
    iconColor: colors.blue[400],
    label: 'Low energy',
  },
  {
    id: 'stressed',
    icon: 'flash-on',
    iconColor: colors.orange[400],
    label: 'Stressed',
  },
  {
    id: 'intense-negative',
    icon: 'waves',
    iconColor: colors.red[500],
    label: 'Intense Negative',
  },
  {
    id: 'dont-know',
    icon: 'help',
    iconColor: alpha.white40,
    label: "Don't Know",
  },
];

interface EnergyLevelPickerProps {
  selected: EnergyLevel | null;
  onSelect: (level: EnergyLevel) => void;
  variant?: 'emoji' | 'icon' | 'centered-icon';
}

export function EnergyLevelPicker({
  selected,
  onSelect,
  variant = 'emoji',
}: EnergyLevelPickerProps) {
  if (variant === 'icon') {
    return (
      <View className="flex-row flex-wrap gap-2.5">
        {ICON_OPTIONS.map((option) => {
          const isActive = selected === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              className="active:scale-[0.98]"
              style={{ width: '48%' }}
            >
              <View
                className={`rounded-xl border p-3 ${
                  isActive
                    ? 'border-primary-pink/30 bg-white/[0.06]'
                    : 'border-white/[0.08] bg-white/[0.03]'
                }`}
              >
                <View
                  className="mb-2 h-7 w-7 items-center justify-center rounded-lg"
                  style={{ backgroundColor: option.iconBgColor }}
                >
                  <MaterialIcons
                    name={option.icon}
                    size={18}
                    color={option.iconColor}
                  />
                </View>
                <Text className="text-[13px] font-semibold text-white">
                  {option.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  }

  if (variant === 'centered-icon') {
    return (
      <View className="flex-row flex-wrap gap-3">
        {CENTERED_ICON_OPTIONS.map((option) => {
          const isActive = selected === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              className="active:scale-95"
              style={{ width: '48%' }}
            >
              <View
                className={`items-center justify-center gap-2 rounded-2xl border p-4 ${
                  isActive
                    ? 'border-primary-pink bg-primary-pink/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <MaterialIcons
                  name={option.icon}
                  size={30}
                  color={option.iconColor}
                />
                <Text className="text-xs font-bold text-white/90">
                  {option.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  }

  // Emoji variant: 2x3 grid, horizontal layout (emoji + label), matching Completion design
  return (
    <View className="flex-row flex-wrap gap-3">
      {EMOJI_OPTIONS.map((option) => {
        const isActive = selected === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => onSelect(option.id)}
            className="active:opacity-80"
            style={{ width: '48%' }}
          >
            {isActive ? (
              <LinearGradient
                colors={[colors.primary.pink, colors.accent.yellow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 16,
                  padding: 1,
                  shadowColor: colors.primary.pink,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 15,
                }}
              >
                <View className="flex-row items-center justify-center gap-2 rounded-2xl bg-primary-pink/10 p-4">
                  <Text className="text-lg">{option.emoji}</Text>
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-white">
                    {option.label}
                  </Text>
                </View>
              </LinearGradient>
            ) : (
              <View className="flex-row items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Text className="text-lg">{option.emoji}</Text>
                <Text className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                  {option.label}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

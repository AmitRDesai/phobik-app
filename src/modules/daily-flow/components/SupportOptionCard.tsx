import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, Text, View } from 'react-native';

import type { SupportOption } from '../data/supportOptions';

type Props = {
  option: SupportOption;
  selected: boolean;
  onPress: () => void;
};

const ACCENT_COLORS = {
  primary: colors.primary.pink,
  secondary: colors.accent.yellow,
  tertiary: colors.accent.purple,
} as const;

export function SupportOptionCard({ option, selected, onPress }: Props) {
  const isBestMatch = !!option.bestMatch;
  const durationColor = ACCENT_COLORS[option.durationColor];
  return (
    <View className="relative">
      {isBestMatch ? (
        <View className="absolute -top-[10px] left-6 z-10" pointerEvents="none">
          <LinearGradient
            colors={[colors.primary.pink, colors.accent.yellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 5,
            }}
          >
            <Text className="text-[10px] font-black uppercase tracking-[0.1em] text-black">
              Best match for you
            </Text>
          </LinearGradient>
        </View>
      ) : null}
      <Pressable
        onPress={onPress}
        className={clsx(
          'h-[240px] overflow-hidden rounded-2xl border',
          selected
            ? 'border-primary-pink'
            : isBestMatch
              ? 'border-primary-pink/20'
              : 'border-foreground/5',
        )}
        style={
          selected
            ? {
                boxShadow: `0 0 20px ${withAlpha(colors.primary.pink, 0.45)}`,
              }
            : undefined
        }
      >
        <Image
          source={option.image}
          className="absolute h-full w-full opacity-60"
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.95)']}
          locations={[0, 0.4, 1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <View className="flex-1 justify-end p-7">
          <View className="flex-row items-end justify-between">
            <View className="max-w-[80%] flex-1 pr-3">
              <Text className="text-3xl font-black leading-tight tracking-tight text-white">
                {option.title}
              </Text>
              <Text
                className="mt-1 text-sm leading-5 text-white/60"
                numberOfLines={2}
              >
                {option.description}
              </Text>
              <View className="mt-3 flex-row items-center gap-1">
                <MaterialIcons
                  name="schedule"
                  size={13}
                  color={durationColor}
                />
                <Text
                  className="text-xs font-bold"
                  style={{ color: durationColor }}
                >
                  {option.duration}
                </Text>
              </View>
            </View>
            <View
              className={clsx(
                'h-12 w-12 items-center justify-center rounded-full border',
                isBestMatch
                  ? 'border-transparent bg-primary-pink'
                  : 'border-white/20 bg-white/10',
              )}
            >
              <MaterialIcons
                name="play-arrow"
                size={22}
                color={isBestMatch ? colors.background.charcoal : 'white'}
              />
              {/* Card sits on a saturated photo overlay — white-on-image is
                  intentional and stays the same in light mode. */}
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

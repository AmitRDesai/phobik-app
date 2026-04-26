import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

type Tone = 'pink' | 'yellow' | 'orange';

const TONE: Record<
  Tone,
  { bg: string; text: string; iconBg: string; ring: string }
> = {
  pink: {
    bg: 'bg-white/[0.04]',
    text: colors.primary.pink,
    iconBg: 'bg-primary-pink/10',
    ring: 'border-primary-pink/15',
  },
  yellow: {
    bg: 'bg-white/[0.04]',
    text: colors.accent.yellow,
    iconBg: 'bg-accent-yellow/10',
    ring: 'border-accent-yellow/15',
  },
  orange: {
    bg: 'bg-white/[0.04]',
    text: colors.accent.orange,
    iconBg: 'bg-accent-orange/10',
    ring: 'border-accent-orange/15',
  },
};

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description?: string;
  tone?: Tone;
};

export function BenefitCard({
  icon,
  title,
  description,
  tone = 'pink',
}: Props) {
  const t = TONE[tone];
  return (
    <View className={`rounded-3xl border p-5 ${t.bg} ${t.ring}`}>
      <View
        className={`mb-4 h-12 w-12 items-center justify-center rounded-2xl ${t.iconBg}`}
      >
        <MaterialIcons name={icon} size={22} color={t.text} />
      </View>
      <Text className="text-lg font-bold text-white">{title}</Text>
      {description ? (
        <Text className="mt-1.5 text-[13px] leading-5 text-white/60">
          {description}
        </Text>
      ) : null}
    </View>
  );
}

import { Badge } from '@/components/ui/Badge';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/themed/Text';
import { Pressable, View } from 'react-native';
const cardShadow = {
  borderRadius: 32,
  boxShadow: [
    {
      offsetX: 0,
      offsetY: 20,
      blurRadius: 40,
      spreadDistance: -10,
      color: `${colors.primary.pink}1A`,
    },
  ],
} as const;

type PillarCardProps = {
  image: ImageSource | number;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  badge?: string;
  /** Optional Material icon shown next to the eyebrow, tinted with accentColor */
  icon?: keyof typeof MaterialIcons.glyphMap;
  /** Tints the icon + eyebrow text. Defaults to white/70 when omitted. */
  accentColor?: string;
  /** Optional CTA label rendered as a gradient pill at the bottom of the card */
  cta?: string;
  /** Optional Material icon rendered after the CTA label */
  ctaIcon?: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  /** Aspect: 'square' for hub/sub-menu cards, 'tall' for large hero cards */
  aspect?: 'square' | 'tall';
};

export function PillarCard({
  image,
  title,
  subtitle,
  eyebrow,
  badge,
  icon,
  accentColor,
  cta,
  ctaIcon,
  onPress,
  aspect = 'square',
}: PillarCardProps) {
  const heightClass = aspect === 'tall' ? 'min-h-[420px]' : 'aspect-square';

  return (
    <Pressable onPress={onPress} className="active:scale-[0.98]">
      <View className="rounded-[32px]" style={cardShadow}>
        <View
          className={`relative overflow-hidden rounded-[32px] ${heightClass}`}
        >
          <Image
            source={image}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.92)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ position: 'absolute', inset: 0 }}
          />
          <View className="flex-1 justify-end p-6">
            {badge ? (
              <Badge tone="pink" size="sm" className="mb-3 self-start">
                {badge}
              </Badge>
            ) : null}
            {icon && !eyebrow ? (
              <View
                className="mb-4 h-12 w-12 items-center justify-center rounded-full border border-foreground/15 bg-foreground/10"
                style={{
                  boxShadow: `0 0 12px ${withAlpha(
                    accentColor ?? colors.primary.pink,
                    0.5,
                  )}`,
                }}
              >
                <MaterialIcons
                  name={icon}
                  size={24}
                  color={accentColor ?? 'white'}
                />
              </View>
            ) : null}
            {eyebrow ? (
              <View className="mb-2 flex-row items-center gap-2">
                {icon ? (
                  <MaterialIcons
                    name={icon}
                    size={16}
                    color={accentColor ?? 'rgba(255,255,255,0.7)'}
                  />
                ) : null}
                <Text
                  className="flex-1 text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: accentColor ?? 'rgba(255,255,255,0.7)' }}
                >
                  {eyebrow}
                </Text>
              </View>
            ) : null}
            <Text className="text-2xl font-extrabold uppercase leading-tight tracking-tight text-foreground">
              {title}
            </Text>
            {subtitle ? (
              <Text className="mt-2 text-sm leading-snug text-foreground/70">
                {subtitle}
              </Text>
            ) : null}
            {cta ? (
              <View className="mt-5 self-start">
                <GradientButton
                  compact
                  onPress={onPress}
                  icon={
                    ctaIcon ? (
                      <MaterialIcons name={ctaIcon} size={14} color="white" />
                    ) : undefined
                  }
                >
                  {cta}
                </GradientButton>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

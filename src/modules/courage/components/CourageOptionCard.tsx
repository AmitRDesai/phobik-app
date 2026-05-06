import { colors } from '@/constants/colors';
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

import { ButtonVariant, CourageOption, IconDef } from '../data/courage-options';

function CardIcon({
  icon,
  size,
  color,
}: {
  icon: IconDef;
  size: number;
  color: string;
}) {
  if (icon.family === 'ionicons') {
    return <Ionicons name={icon.name} size={size} color={color} />;
  }
  if (icon.family === 'community') {
    return (
      <MaterialCommunityIcons name={icon.name} size={size} color={color} />
    );
  }
  return <MaterialIcons name={icon.name} size={size} color={color} />;
}

interface CourageOptionCardProps {
  option: CourageOption;
  onPress?: () => void;
}

function CardButton({
  variant,
  label,
  icon,
}: {
  variant: ButtonVariant;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}) {
  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius: 8, alignSelf: 'flex-start' }}
      >
        <View className="flex-row items-center gap-2 px-4 py-2">
          <Text className="text-xs font-bold text-foreground">{label}</Text>
          <MaterialIcons name={icon} size={12} color="white" />
        </View>
      </LinearGradient>
    );
  }

  const variantClasses = {
    pink: 'bg-primary-pink',
    yellow: 'bg-accent-yellow',
    ghost: 'border border-foreground/20 bg-foreground/10',
  } as const;

  const textColor = variant === 'yellow' ? colors.background.charcoal : 'white';

  return (
    <View
      className={`self-start flex-row items-center gap-2 rounded-lg px-4 py-2 ${variantClasses[variant]}`}
    >
      <Text className="text-xs font-bold" style={{ color: textColor }}>
        {label}
      </Text>
      <MaterialIcons name={icon} size={12} color={textColor} />
    </View>
  );
}

export function CourageOptionCard({ option, onPress }: CourageOptionCardProps) {
  return (
    <LinearGradient
      colors={[`${colors.primary.pink}40`, `${colors.accent.yellow}40`]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 12, padding: 1 }}
    >
      <Pressable
        onPress={onPress}
        className="flex-row items-stretch gap-4 rounded-[10px] bg-surface-elevated p-4 active:opacity-95"
      >
        {/* Left column: text + button */}
        <View className="flex-1 justify-between gap-4">
          <View>
            <View className="mb-1 flex-row items-center gap-2">
              <CardIcon icon={option.icon} size={20} color={option.iconColor} />
              <Text className="text-lg font-bold text-foreground">
                {option.title}
              </Text>
            </View>
            <Text className="text-xs leading-snug text-foreground/60">
              {option.description}
            </Text>
          </View>

          <CardButton
            variant={option.buttonVariant}
            label={option.buttonLabel}
            icon={option.buttonIcon}
          />
        </View>

        {/* Right decorative icon area */}
        <View className="h-24 w-24 shrink-0 overflow-hidden rounded-lg">
          <LinearGradient
            colors={option.decorativeGradientColors}
            start={option.decorativeGradientDirection.start}
            end={option.decorativeGradientDirection.end}
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CardIcon
              icon={option.decorativeIcon}
              size={48}
              color={option.decorativeIconColor}
            />
          </LinearGradient>
        </View>
      </Pressable>
    </LinearGradient>
  );
}

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { variantConfig } from '@/components/variant-config';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';

interface AffirmationReadyCardProps {
  feeling: string;
  affirmation: string;
  onSync?: () => void;
}

export function AffirmationReadyCard({
  feeling,
  affirmation,
  onSync,
}: AffirmationReadyCardProps) {
  const scheme = useScheme();
  const cardBg = withAlpha(variantConfig.default[scheme].bgHex, 0.9);
  const index = affirmation.toLowerCase().indexOf(feeling.toLowerCase());
  const before = index >= 0 ? affirmation.slice(0, index) : affirmation;
  const word =
    index >= 0 ? affirmation.slice(index, index + feeling.length) : '';
  const after = index >= 0 ? affirmation.slice(index + feeling.length) : '';

  return (
    <View
      className="relative"
      style={{
        boxShadow: `0 0 60px ${withAlpha(colors.primary.pink, 0.15)}`,
      }}
    >
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 24, padding: 1.5 }}
      >
        <View
          style={{ backgroundColor: cardBg, borderRadius: 22 }}
          className="px-8 py-10"
        >
          {onSync && (
            <Pressable
              onPress={onSync}
              className="absolute right-4 top-4 active:opacity-70"
            >
              <MaterialIcons
                name="sync"
                size={20}
                color={foregroundFor(scheme, 0.4)}
              />
            </Pressable>
          )}

          <View className="mb-4 items-center">
            <MaterialIcons
              name="auto-awesome"
              size={28}
              color={withAlpha(colors.primary.pink, 0.4)}
            />
          </View>

          <View className="flex-row flex-wrap justify-center">
            <Text className="text-center text-xl font-light leading-relaxed text-foreground">
              {'"'}
              {before}
            </Text>
            {word ? (
              <GradientText className="text-xl leading-relaxed font-medium">
                {word}
              </GradientText>
            ) : null}
            <Text className="text-center text-xl font-light leading-relaxed text-foreground">
              {after}
              {'"'}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

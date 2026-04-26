import { colors } from '@/constants/colors';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native';

type GradientTextProps = {
  children: string;
  className?: string;
  startColor?: string;
  endColor?: string;
};

export function GradientText({
  children,
  className = '',
  startColor = colors.primary.pink,
  endColor = colors.accent.yellow,
}: GradientTextProps) {
  return (
    <MaskedView
      maskElement={
        <Text className={className} style={{ color: 'white' }}>
          {children}
        </Text>
      }
    >
      <LinearGradient
        colors={[startColor, endColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text className={className} style={{ opacity: 0 }}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

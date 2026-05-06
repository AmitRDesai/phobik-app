import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
export function ChapterAffirmation() {
  return (
    <View className="my-8">
      <LinearGradient
        colors={[`${colors.primary.pink}1A`, `${colors.accent.yellow}0D`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 16, padding: 20 }}
      >
        <Text className="text-center text-xs font-semibold uppercase tracking-widest text-foreground/50">
          Affirmation
        </Text>
        <Text
          className="mt-3 text-center text-lg italic leading-relaxed text-foreground"
          style={{ fontFamily: 'serif' }}
        >
          I am safe in this moment.
        </Text>
      </LinearGradient>
    </View>
  );
}

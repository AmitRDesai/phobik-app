import { Text, View } from '@/components/themed';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

export function ChapterAffirmation() {
  return (
    <View className="my-8">
      <LinearGradient
        colors={[`${colors.primary.pink}1A`, `${colors.accent.yellow}0D`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 16, padding: 20 }}
      >
        <Text size="xs" treatment="caption" tone="secondary" align="center">
          Affirmation
        </Text>
        <Text
          size="lg"
          italic
          align="center"
          className="mt-3 leading-relaxed"
          style={{ fontFamily: 'serif' }}
        >
          I am safe in this moment.
        </Text>
      </LinearGradient>
    </View>
  );
}

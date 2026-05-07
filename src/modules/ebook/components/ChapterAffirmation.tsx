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
        <Text variant="caption" muted className="text-center">
          Affirmation
        </Text>
        <Text
          variant="lg"
          className="mt-3 text-center italic leading-relaxed"
          style={{ fontFamily: 'serif' }}
        >
          I am safe in this moment.
        </Text>
      </LinearGradient>
    </View>
  );
}

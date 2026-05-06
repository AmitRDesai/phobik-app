import { CardAura } from '@/components/ui/CardAura';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

export function AnxietyImpactCard() {
  return (
    <View className="px-4">
      <View className="overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-5">
        <CardAura color={colors.primary.pink} />
        <View className="mb-3 flex-row items-center gap-2">
          <MaterialIcons
            name="psychology"
            size={20}
            color={colors.primary.pink}
          />
          <Text className="font-bold tracking-tight text-foreground">
            Anxiety Impact
          </Text>
        </View>
        <View className="gap-3">
          <Text className="text-sm leading-relaxed text-foreground/70">
            Yesterday&apos;s elevated{' '}
            <Text className="font-bold text-primary-pink">cortisol levels</Text>{' '}
            from the afternoon stress spike delayed your REM entry by 42
            minutes.
          </Text>
          <View className="h-px w-full bg-foreground/5" />
          <Text className="text-xs italic text-foreground/60">
            &ldquo;Your deep sleep was 15% lower than your baseline. Consider a
            10-minute breathwork session before tonight&apos;s rest.&rdquo;
          </Text>
        </View>
        <Pressable className="mt-4 flex-row items-center justify-center gap-2 rounded-lg bg-primary-pink/20 py-3">
          <Text className="text-xs font-bold uppercase tracking-widest text-primary-pink">
            Open Guided Relief
          </Text>
          <MaterialIcons
            name="arrow-forward"
            size={14}
            color={colors.primary.pink}
          />
        </Pressable>
      </View>
    </View>
  );
}

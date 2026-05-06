import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

interface ReflectWithCuriosityProps {
  onFinish: (reflection?: string) => void;
}

export function ReflectWithCuriosity({ onFinish }: ReflectWithCuriosityProps) {
  const [reflection, setReflection] = useState('');

  return (
    <KeyboardAwareScrollView
      contentContainerClassName="px-6 pb-12"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bottomOffset={40}
    >
      {/* Title */}
      <Text className="mb-2 mt-4 text-center text-3xl font-bold tracking-tight text-foreground">
        Reflect with Curiosity
      </Text>

      {/* Instruction */}
      <Text className="mb-6 text-center text-sm text-foreground/60">
        Growth happens when we reflect without judging ourselves. Instead of
        asking: What&apos;s wrong with me? Ask, what is the feeling trying to
        tell me?
      </Text>

      {/* Prompt card */}
      <View className="mb-6 mt-4 flex-row items-center gap-4 rounded-xl border border-foreground/5 bg-foreground/[0.03] p-4">
        <View className="h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10">
          <MaterialIcons name="psychology" size={24} color="#34D399" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground">
            Next time, what could I do sooner to care for that need?
          </Text>
        </View>
      </View>

      {/* Reflection input */}
      <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-foreground/55">
        My Reflection Note
      </Text>
      <TextInput
        value={reflection}
        onChangeText={setReflection}
        placeholder="Next time..."
        placeholderTextColor="rgba(255,255,255,0.15)"
        multiline
        textAlignVertical="top"
        className="mb-8 min-h-[140px] rounded-xl border border-foreground/10 bg-foreground/[0.03] p-4 text-sm text-foreground/90"
      />

      {/* Save button */}
      <GradientButton
        onPress={() => onFinish(reflection.trim() || undefined)}
        icon={<MaterialIcons name="check-circle" size={20} color="white" />}
      >
        Save & Finish
      </GradientButton>

      {/* Completion indicator */}
      <View className="mt-6 items-center gap-3">
        <View className="h-1 w-full overflow-hidden rounded-full bg-foreground/10">
          <LinearGradient
            colors={[colors.primary.pink, colors.accent.yellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: '100%', width: '100%', borderRadius: 9999 }}
          />
        </View>
        <Text className="text-center text-xs font-medium uppercase tracking-widest text-foreground/55">
          Completion 100% &mdash; You&apos;re doing great!
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
}

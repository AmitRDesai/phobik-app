import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtom } from 'jotai';
import { Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { reflectionTextAtom } from '../store/micro-challenges';

interface ReflectWithCuriosityProps {
  onFinish: () => void;
}

export function ReflectWithCuriosity({ onFinish }: ReflectWithCuriosityProps) {
  const [reflection, setReflection] = useAtom(reflectionTextAtom);

  return (
    <KeyboardAwareScrollView
      contentContainerClassName="px-6 pb-12"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bottomOffset={40}
    >
      {/* Title */}
      <Text className="mb-2 mt-4 text-center text-3xl font-bold tracking-tight text-white">
        Reflect with Curiosity
      </Text>

      {/* Instruction */}
      <Text className="mb-6 text-center text-sm text-slate-400">
        Growth happens when we reflect without judging ourselves. Instead of
        asking: What&apos;s wrong with me? Ask, what is the feeling trying to
        tell me?
      </Text>

      {/* Prompt card */}
      <View className="mb-6 mt-4 flex-row items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4">
        <View className="h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10">
          <MaterialIcons name="psychology" size={24} color="#34D399" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-white">
            Next time, what could I do sooner to care for that need?
          </Text>
        </View>
      </View>

      {/* Reflection input */}
      <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
        My Reflection Note
      </Text>
      <TextInput
        value={reflection}
        onChangeText={setReflection}
        placeholder="Next time..."
        placeholderTextColor="rgba(255,255,255,0.15)"
        multiline
        textAlignVertical="top"
        className="mb-8 min-h-[140px] rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-100"
      />

      {/* Save button */}
      <GradientButton
        onPress={onFinish}
        icon={<MaterialIcons name="check-circle" size={20} color="white" />}
      >
        Save & Finish
      </GradientButton>

      {/* Completion indicator */}
      <View className="mt-6 items-center gap-3">
        <View className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <LinearGradient
            colors={[colors.primary.pink, colors.accent.yellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: '100%', width: '100%', borderRadius: 9999 }}
          />
        </View>
        <Text className="text-center text-xs font-medium uppercase tracking-widest text-slate-500">
          Completion 100% &mdash; You&apos;re doing great!
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
}

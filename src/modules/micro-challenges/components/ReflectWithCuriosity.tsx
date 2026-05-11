import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { IconChip } from '@/components/ui/IconChip';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';

interface ReflectWithCuriosityProps {
  onFinish: (reflection?: string) => void;
}

export function ReflectWithCuriosity({ onFinish }: ReflectWithCuriosityProps) {
  const [reflection, setReflection] = useState('');
  const scheme = useScheme();

  return (
    <KeyboardAwareScrollView
      contentContainerClassName="px-6 pb-12"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bottomOffset={40}
    >
      {/* Title */}
      <Text size="h1" align="center" className="mb-2 mt-4">
        Reflect with Curiosity
      </Text>

      {/* Instruction */}
      <Text size="sm" align="center" className="mb-6 text-foreground/60">
        Growth happens when we reflect without judging ourselves. Instead of
        asking: What&apos;s wrong with me? Ask, what is the feeling trying to
        tell me?
      </Text>

      {/* Prompt card */}
      <View className="mb-6 mt-4 flex-row items-center gap-4 rounded-xl border border-foreground/5 bg-foreground/[0.03] p-4">
        <IconChip
          size="md"
          shape="square"
          bg={withAlpha(colors.status.success, 0.1)}
        >
          <MaterialIcons
            name="psychology"
            size={24}
            color={colors.status.success}
          />
        </IconChip>
        <View className="flex-1">
          <Text size="sm" weight="semibold">
            Next time, what could I do sooner to care for that need?
          </Text>
        </View>
      </View>

      {/* Reflection input */}
      <Text size="xs" treatment="caption" tone="secondary" className="mb-2">
        My Reflection Note
      </Text>
      <TextArea
        rows="sm"
        className="mb-8"
        value={reflection}
        onChangeText={setReflection}
        placeholder="Next time..."
      />

      {/* Save button */}
      <Button
        onPress={() => onFinish(reflection.trim() || undefined)}
        icon={<MaterialIcons name="check-circle" size={20} color="white" />}
      >
        Save & Finish
      </Button>

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
        <Text
          size="xs"
          treatment="caption"
          tone="secondary"
          align="center"
          style={{ paddingRight: 2.2 }}
        >
          Completion 100% &mdash; You&apos;re doing great!
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
}

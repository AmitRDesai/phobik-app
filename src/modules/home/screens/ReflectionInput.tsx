import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors, alpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

export default function ReflectionInput() {
  const { feeling } = useLocalSearchParams<{ feeling: string }>();
  const [reflection, setReflection] = useState('');

  return (
    <Container keyboardAvoiding>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pb-6 pt-2">
        <BackButton />

        <Text className="text-xl font-bold uppercase tracking-tight text-white">
          Quick Reset
        </Text>

        {/* Spacer for centering */}
        <View className="w-8" />
      </View>

      {/* Prompt */}
      <View className="px-6">
        <Text className="text-2xl font-semibold leading-tight text-white/90">
          What happened?
        </Text>
        <Text className="mt-1 text-2xl font-normal leading-tight text-white/60">
          What is really happening right now?
        </Text>
      </View>

      {/* Text Area with Gradient Border */}
      <View className="mt-6 flex-1 px-6">
        <LinearGradient
          colors={[colors.primary.pink + '40', colors.accent.yellow + '40']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, borderRadius: 16, padding: 2 }}
        >
          <View className="flex-1 rounded-2xl bg-black">
            <TextInput
              className="flex-1 p-6 text-lg text-white/90"
              placeholder="Type your reflection here..."
              placeholderTextColor={alpha.white20}
              multiline
              textAlignVertical="top"
              value={reflection}
              onChangeText={setReflection}
            />

            {/* Microphone Button */}
            <View className="absolute bottom-4 right-4">
              <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <MaterialIcons
                  name="mic"
                  size={24}
                  color={colors.primary.pink}
                />
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Action Button */}
      <View className="px-6 pb-2 pt-4">
        <GradientButton onPress={() => {}} disabled={!reflection.trim()}>
          Get AI Support
        </GradientButton>
      </View>

      {/* Footer Text */}
      <Text className="pb-6 text-center text-xs italic text-white/40">
        Sharing your thoughts helps us guide you back to calm.
      </Text>
    </Container>
  );
}

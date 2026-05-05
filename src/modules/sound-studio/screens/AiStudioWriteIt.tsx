import writeVibeImg from '@/assets/images/sound-studio/write-vibe.jpg';
import { GradientButton } from '@/components/ui/GradientButton';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { GradientText } from '@/modules/practices/components/GradientText';
import { PracticeStackHeader } from '@/modules/practices/components/PracticeStackHeader';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function AiStudioWriteIt() {
  const router = useRouter();
  const [text, setText] = useState('');

  return (
    <View className="flex-1 bg-background-charcoal">
      <GlowBg
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        centerY={0.25}
        radius={0.4}
        intensity={0.5}
        bgClassName="bg-background-charcoal"
      />
      <PracticeStackHeader wordmark="Sonic Studio" />

      <ScrollFade fadeColor={colors.background.charcoal}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-2"
          contentContainerStyle={{ paddingBottom: FADE_HEIGHT }}
          showsVerticalScrollIndicator={false}
        >
          {/* Step indicator */}
          <View className="self-start rounded-full border border-primary-pink/30 bg-primary-pink/10 px-3 py-1">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-pink">
              Step 01 / 06
            </Text>
          </View>

          {/* Title */}
          <Text className="mt-4 text-[44px] font-extrabold leading-none tracking-tight text-white">
            What
          </Text>
          <Text className="text-[44px] font-extrabold leading-none tracking-tight text-white">
            happened?
          </Text>
          <Text className="mt-4 text-base leading-relaxed text-white/60">
            The algorithm listens to the sentiment of your story. Speak your
            truth, and let the sonics follow.
          </Text>

          {/* Textarea */}
          <View className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <TextInput
              value={text}
              onChangeText={setText}
              multiline
              placeholder="Describe your day, a specific memory, or your current mood here..."
              placeholderTextColor="rgba(255,255,255,0.35)"
              className="min-h-[120px] text-base text-white"
              textAlignVertical="top"
            />
            <View className="mt-4 flex-row gap-3">
              <Pressable
                onPress={() =>
                  dialog.info({
                    title: 'Coming soon',
                    message: 'AI polishing will be available soon.',
                  })
                }
                className="flex-row items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2"
              >
                <MaterialIcons name="auto-fix-high" size={14} color="white" />
                <Text className="text-xs font-bold text-white">
                  Polish with AI
                </Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  dialog.info({
                    title: 'Coming soon',
                    message: 'Voice-to-text will be available soon.',
                  })
                }
                className="flex-row items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2"
              >
                <MaterialIcons name="mic" size={14} color="white" />
                <Text className="text-xs font-bold text-white">
                  Voice-to-Text
                </Text>
              </Pressable>
            </View>
          </View>

          {/* From Journal sync */}
          <View className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5">
            <View className="self-center h-12 w-12 items-center justify-center rounded-2xl bg-accent-yellow/15">
              <MaterialIcons
                name="auto-stories"
                size={22}
                color={colors.accent.yellow}
              />
            </View>
            <Text className="mt-3 text-center text-base font-bold text-white">
              From Journal
            </Text>
            <Text className="mt-1 text-center text-sm text-white/60">
              Sync your morning thoughts or recent entries to jumpstart the
              sonic synthesis.
            </Text>
            <Pressable
              onPress={() =>
                dialog.info({
                  title: 'Coming soon',
                  message: 'Journal sync will be available soon.',
                })
              }
              className="mt-4 self-center rounded-full bg-white px-5 py-2"
            >
              <Text className="text-xs font-bold text-black">
                Connect Accounts
              </Text>
            </Pressable>
          </View>

          {/* Current Vibe card */}
          <View className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <Image
              source={writeVibeImg}
              style={{ width: '100%', height: 120 }}
              contentFit="cover"
            />
            <View className="p-5">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Current Vibe
              </Text>
              <Text className="mt-1 text-base font-bold text-white">
                Ethereal Melancholy
              </Text>
            </View>
          </View>

          <GradientText className="mt-6 self-center text-xs uppercase tracking-[0.3em]">
            Sonic Studio
          </GradientText>
        </ScrollView>
      </ScrollFade>

      {/* Sticky bottom: Next */}
      <View className="border-t border-white/5 bg-background-charcoal/80 px-6 pb-8 pt-5">
        <GradientButton
          onPress={() => router.push('/sound-studio/ai/feeling')}
          icon={<MaterialIcons name="arrow-forward" size={18} color="white" />}
        >
          Next
        </GradientButton>
      </View>
    </View>
  );
}

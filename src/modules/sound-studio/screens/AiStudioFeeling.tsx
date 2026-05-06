import { Badge } from '@/components/ui/Badge';
import { GradientButton } from '@/components/ui/GradientButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { colors } from '@/constants/colors';
import { PracticeStackHeader } from '@/modules/practices/components/PracticeStackHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { EMOTIONAL_TAGS, type EmotionalTag } from '../data/sound-studio';

const FAKE_CREDITS = 12;

export default function AiStudioFeeling() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<EmotionalTag>>(
    new Set(['Ethereal', 'Aggressive']),
  );
  const [customMood, setCustomMood] = useState('');
  const [musicPrompt, setMusicPrompt] = useState('');

  const toggle = (tag: EmotionalTag) => {
    const next = new Set(selected);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    setSelected(next);
  };

  return (
    <View className="flex-1 bg-surface">
      <GlowBg
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        centerY={0.25}
        radius={0.4}
        intensity={0.5}
        bgClassName="bg-surface"
      />
      <PracticeStackHeader wordmark="Sound Studio" />

      <ScrollFade fadeColor={colors.background.charcoal}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-2"
          contentContainerStyle={{ paddingBottom: FADE_HEIGHT }}
          showsVerticalScrollIndicator={false}
        >
          {/* Step indicator */}
          <Badge tone="pink" size="sm" className="self-start">
            Step 02 / 06
          </Badge>

          {/* Title */}
          <Text className="mt-4 text-[36px] font-extrabold leading-tight tracking-tight text-foreground">
            What are you <Text className="text-accent-yellow">feeling?</Text>
          </Text>
          <Text className="mt-3 text-base leading-relaxed text-foreground/60">
            The vibe dictates the architecture. Select the emotional textures
            that define your sonic organism.
          </Text>

          {/* Emotional tags */}
          <View className="mt-6 rounded-3xl border border-foreground/10 bg-foreground/5 p-5">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
              Emotional Tags
            </Text>
            <View className="mt-3 flex-row flex-wrap gap-2">
              {EMOTIONAL_TAGS.map((tag) => {
                const isSelected = selected.has(tag);
                return (
                  <Pressable
                    key={tag}
                    onPress={() => toggle(tag)}
                    className="active:scale-95"
                  >
                    {isSelected ? (
                      <LinearGradient
                        colors={[colors.primary.pink, colors.accent.yellow]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                          borderRadius: 9999,
                          paddingHorizontal: 14,
                          paddingVertical: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <MaterialIcons name="bolt" size={12} color="black" />
                        <Text className="text-xs font-bold text-black">
                          {tag}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View className="rounded-full border border-foreground/15 bg-foreground/5 px-4 py-2">
                        <Text className="text-xs font-semibold text-foreground/80">
                          {tag}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Custom mood */}
          <View className="mt-4 rounded-3xl border border-foreground/10 bg-foreground/5 p-5">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
              Custom Mood or Genre
            </Text>
            <TextInput
              value={customMood}
              onChangeText={setCustomMood}
              multiline
              placeholder="Describe the mood..."
              placeholderTextColor="rgba(255,255,255,0.35)"
              className="mt-3 min-h-[60px] text-base text-foreground"
              textAlignVertical="top"
            />
            <Text className="mt-3 text-xs leading-relaxed text-foreground/40">
              "A midnight drive through a neon-soaked city under a purple haze."
            </Text>
          </View>

          {/* Music prompt */}
          <View className="mt-4 rounded-3xl border border-foreground/10 bg-foreground/5 p-5">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
              Music Prompt
            </Text>
            <TextInput
              value={musicPrompt}
              onChangeText={setMusicPrompt}
              multiline
              placeholder="Describe the musical landscape, instruments, and progression in detail..."
              placeholderTextColor="rgba(255,255,255,0.35)"
              className="mt-3 min-h-[80px] text-base text-foreground"
              textAlignVertical="top"
            />
            <Text className="mt-3 text-xs leading-relaxed text-foreground/40">
              Example: "An cinematic orchestral piece that begins with a
              haunting cello solo and gradually swells into a triumphant
              hybrid-electronic climax with deep sub-bass and shimmering synth
              pads."
            </Text>
          </View>

          {/* Credits row */}
          <View className="mt-5 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="bolt"
                size={14}
                color={colors.accent.yellow}
              />
              <Text className="text-xs text-foreground/60">
                Existing Credits:{' '}
                <Text className="font-bold text-foreground">
                  {FAKE_CREDITS}
                </Text>
              </Text>
            </View>
            <Pressable onPress={() => router.push('/sound-studio/credits')}>
              <Text className="text-xs font-bold uppercase tracking-widest text-primary-pink">
                Add credits
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScrollFade>

      {/* Sticky bottom: Next */}
      <View className="border-t border-foreground/5 bg-surface/80 px-6 pb-8 pt-5">
        <GradientButton
          onPress={() => router.push('/sound-studio/ai/express')}
          icon={<MaterialIcons name="arrow-forward" size={18} color="white" />}
        >
          Next: Express it (1 credit)
        </GradientButton>
      </View>
    </View>
  );
}

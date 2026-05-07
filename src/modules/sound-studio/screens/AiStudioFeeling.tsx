import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { PracticeStackHeader } from '@/modules/practices/components/PracticeStackHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput } from 'react-native';

import { EMOTIONAL_TAGS, type EmotionalTag } from '../data/sound-studio';

const FAKE_CREDITS = 12;

export default function AiStudioFeeling() {
  const router = useRouter();
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
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
    <Screen
      variant="default"
      scroll
      header={<PracticeStackHeader wordmark="Sound Studio" />}
      sticky={
        <GradientButton
          onPress={() => router.push('/sound-studio/ai/express')}
          icon={<MaterialIcons name="arrow-forward" size={18} color="white" />}
        >
          Next: Express it (1 credit)
        </GradientButton>
      }
      className="px-6 pt-2"
    >
      {/* Step indicator */}
      <Badge tone="pink" size="sm" className="self-start">
        Step 02 / 06
      </Badge>

      {/* Title */}
      <Text variant="display" className="mt-4 leading-tight">
        What are you{' '}
        <Text
          variant="display"
          className="leading-tight"
          style={{ color: yellow }}
        >
          feeling?
        </Text>
      </Text>
      <Text variant="lg" muted className="mt-3 leading-relaxed">
        The vibe dictates the architecture. Select the emotional textures that
        define your sonic organism.
      </Text>

      {/* Emotional tags */}
      <Card className="mt-6 rounded-3xl p-5">
        <Text variant="caption" muted>
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
                    <Text variant="xs" className="font-bold text-black">
                      {tag}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View className="rounded-full border border-foreground/15 bg-foreground/[0.04] px-4 py-2">
                    <Text variant="xs" className="font-semibold">
                      {tag}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </Card>

      {/* Custom mood */}
      <Card className="mt-4 rounded-3xl p-5">
        <Text variant="caption" muted>
          Custom Mood or Genre
        </Text>
        <TextInput
          value={customMood}
          onChangeText={setCustomMood}
          multiline
          placeholder="Describe the mood..."
          placeholderTextColor={foregroundFor(scheme, 0.35)}
          className="mt-3 min-h-[60px] text-base text-foreground"
          textAlignVertical="top"
        />
        <Text variant="xs" className="mt-3 text-foreground/40 leading-relaxed">
          "A midnight drive through a neon-soaked city under a purple haze."
        </Text>
      </Card>

      {/* Music prompt */}
      <Card className="mt-4 rounded-3xl p-5">
        <Text variant="caption" muted>
          Music Prompt
        </Text>
        <TextInput
          value={musicPrompt}
          onChangeText={setMusicPrompt}
          multiline
          placeholder="Describe the musical landscape, instruments, and progression in detail..."
          placeholderTextColor={foregroundFor(scheme, 0.35)}
          className="mt-3 min-h-[80px] text-base text-foreground"
          textAlignVertical="top"
        />
        <Text variant="xs" className="mt-3 text-foreground/40 leading-relaxed">
          Example: "An cinematic orchestral piece that begins with a haunting
          cello solo and gradually swells into a triumphant hybrid-electronic
          climax with deep sub-bass and shimmering synth pads."
        </Text>
      </Card>

      {/* Credits row */}
      <View className="mt-5 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="bolt" size={14} color={yellow} />
          <Text variant="xs" muted>
            Existing Credits:{' '}
            <Text variant="xs" className="font-bold">
              {FAKE_CREDITS}
            </Text>
          </Text>
        </View>
        <Button
          variant="ghost"
          size="compact"
          onPress={() => router.push('/sound-studio/credits')}
        >
          Add credits
        </Button>
      </View>
    </Screen>
  );
}

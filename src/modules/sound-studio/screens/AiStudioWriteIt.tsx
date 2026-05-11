import writeVibeImg from '@/assets/images/sound-studio/write-vibe.jpg';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { Screen } from '@/components/ui/Screen';
import { accentFor, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { PracticeStackHeader } from '@/modules/practices/components/PracticeStackHeader';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextInput } from 'react-native';

export default function AiStudioWriteIt() {
  const router = useRouter();
  const [text, setText] = useState('');
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  const fg = foregroundFor(scheme, 1);

  return (
    <Screen
      variant="default"
      scroll
      header={<PracticeStackHeader wordmark="Sonic Studio" />}
      sticky={
        <Button
          onPress={() => router.push('/sound-studio/ai/feeling')}
          icon={<MaterialIcons name="arrow-forward" size={18} color="white" />}
        >
          Next
        </Button>
      }
      className="px-6 pt-2"
    >
      {/* Step indicator */}
      <Badge tone="pink" size="sm" className="self-start">
        Step 01 / 06
      </Badge>

      {/* Title */}
      <Text weight="extrabold" className="mt-4 text-[44px] leading-none">
        What
      </Text>
      <Text weight="extrabold" className="text-[44px] leading-none">
        happened?
      </Text>
      <Text size="lg" tone="secondary" className="mt-4 leading-relaxed">
        The algorithm listens to the sentiment of your story. Speak your truth,
        and let the sonics follow.
      </Text>

      {/* Textarea */}
      <Card className="mt-6 rounded-3xl p-5">
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          placeholder="Describe your day, a specific memory, or your current mood here..."
          placeholderTextColor={foregroundFor(scheme, 0.35)}
          className="min-h-[120px] text-base text-foreground"
          textAlignVertical="top"
        />
        <View className="mt-4 flex-row gap-3">
          <Button
            variant="secondary"
            size="xs"
            onPress={() =>
              dialog.info({
                title: 'Coming soon',
                message: 'AI polishing will be available soon.',
              })
            }
            prefixIcon={
              <MaterialIcons name="auto-fix-high" size={14} color={fg} />
            }
          >
            Polish with AI
          </Button>
          <Button
            variant="secondary"
            size="xs"
            onPress={() =>
              dialog.info({
                title: 'Coming soon',
                message: 'Voice-to-text will be available soon.',
              })
            }
            prefixIcon={<MaterialIcons name="mic" size={14} color={fg} />}
          >
            Voice-to-Text
          </Button>
        </View>
      </Card>

      {/* From Journal sync */}
      <Card className="mt-4 rounded-3xl p-5">
        <View className="h-12 w-12 items-center justify-center self-center rounded-2xl bg-accent-yellow/15">
          <MaterialIcons name="auto-stories" size={22} color={yellow} />
        </View>
        <Text size="lg" align="center" weight="bold" className="mt-3">
          From Journal
        </Text>
        <Text size="sm" tone="secondary" align="center" className="mt-1">
          Sync your morning thoughts or recent entries to jumpstart the sonic
          synthesis.
        </Text>
        <Button
          variant="secondary"
          size="xs"
          onPress={() =>
            dialog.info({
              title: 'Coming soon',
              message: 'Journal sync will be available soon.',
            })
          }
          className="mt-4 self-center"
        >
          Connect Accounts
        </Button>
      </Card>

      {/* Current Vibe card */}
      <Card className="mt-4 overflow-hidden rounded-3xl p-0">
        <Image
          source={writeVibeImg}
          style={{ width: '100%', height: 120 }}
          contentFit="cover"
        />
        <View className="p-5">
          <Text size="xs" treatment="caption" tone="secondary">
            Current Vibe
          </Text>
          <Text size="lg" weight="bold" className="mt-1">
            Ethereal Melancholy
          </Text>
        </View>
      </Card>

      <GradientText className="mt-6 self-center text-xs uppercase tracking-[0.3em]">
        Sonic Studio
      </GradientText>
    </Screen>
  );
}

import writeVibeImg from '@/assets/images/sound-studio/write-vibe.jpg';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { TextArea } from '@/components/ui/TextArea';
import { accentFor, foregroundFor } from '@/constants/colors';
import { useSound, useUpsertSound } from '@/hooks/sound-generation';
import { useScheme } from '@/hooks/useTheme';
import { uuid } from '@/lib/crypto';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AI_STUDIO_SOURCE, readAiStudioDraft } from '../lib/ai-studio';

const DRAFT_DEBOUNCE_MS = 600;

export default function AiStudioWriteIt() {
  const router = useRouter();
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  const fg = foregroundFor(scheme, 1);

  const { id: idParam } = useLocalSearchParams<{ id?: string }>();
  const [soundId] = useState(() => idParam || uuid());
  const [text, setText] = useState('');

  const upsertMutation = useUpsertSound();
  const { data: existing } = useSound(soundId);

  // Keep the latest persisted meta in a ref so the save effect can merge
  // against it WITHOUT depending on `existing` — otherwise the watched query
  // re-emitting after our own write would retrigger the debounce in a loop.
  const existingMetaRef = useRef(existing?.inputMeta);
  useEffect(() => {
    existingMetaRef.current = existing?.inputMeta;
  }, [existing?.inputMeta]);

  // Hydrate the story once from any existing draft (resume across devices).
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (hydratedRef.current || !existing) return;
    hydratedRef.current = true;
    setText(readAiStudioDraft(existing.inputMeta).story);
  }, [existing]);

  // Debounced draft save — story lives in input_meta (and prompt) so the flow
  // is resumable.
  const upsertRef = useRef(upsertMutation.mutate);
  useEffect(() => {
    upsertRef.current = upsertMutation.mutate;
  }, [upsertMutation.mutate]);
  useEffect(() => {
    if (text.length === 0) return;
    const t = setTimeout(() => {
      upsertRef.current({
        id: soundId,
        source: AI_STUDIO_SOURCE,
        prompt: text,
        inputMeta: {
          ...readAiStudioDraft(existingMetaRef.current),
          story: text,
        },
      });
    }, DRAFT_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [text, soundId]);

  return (
    <Screen
      scroll
      keyboard
      header={<Header variant="back" title="AI Studio" />}
      className="px-6 pt-2"
    >
      {/* Step indicator */}
      <Badge tone="pink" size="sm" className="self-start">
        Step 1 of 3
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
        <TextArea
          variant="minimal"
          rows="md"
          value={text}
          onChangeText={setText}
          placeholder="Describe your day, a specific memory, or your current mood here..."
          autoFocus
        />
        <View className="mt-4 flex-row gap-3">
          <Button
            variant="secondary"
            size="sm"
            onPress={() =>
              dialog.info({
                title: 'Coming soon',
                message: 'AI polishing will be available soon.',
              })
            }
            prefixIcon={
              <MaterialIcons name="auto-fix-high" size={16} color={fg} />
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
        <View className="size-12 items-center justify-center self-center rounded-2xl bg-accent-yellow/15">
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
          size="sm"
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

      {/* Inline primary action (non-sticky) */}
      <Button
        onPress={() => router.push(`/sound-studio/ai/feeling?id=${soundId}`)}
        icon={<MaterialIcons name="arrow-forward" size={18} color="white" />}
        className="mt-6"
      >
        Next
      </Button>

      <GradientText className="mt-6 self-center text-xs uppercase tracking-[0.3em]">
        AI Studio
      </GradientText>
    </Screen>
  );
}

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChipSelect } from '@/components/ui/ChipSelect';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { TextArea } from '@/components/ui/TextArea';
import { accentFor } from '@/constants/colors';
import {
  useCreditGate,
  useGenerateSound,
  useSound,
  useUpsertSound,
} from '@/hooks/sound-generation';
import { useScheme } from '@/hooks/useTheme';
import { uuid } from '@/lib/crypto';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { EMOTIONAL_TAGS, type EmotionalTag } from '../data/sound-studio';
import {
  AI_STUDIO_SOURCE,
  composeAiStudioPrompt,
  readAiStudioDraft,
} from '../lib/ai-studio';

const DRAFT_DEBOUNCE_MS = 600;
const TAG_OPTIONS = EMOTIONAL_TAGS.map((t) => ({ label: t, value: t }));

export default function AiStudioFeeling() {
  const router = useRouter();
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');

  const { id: idParam } = useLocalSearchParams<{ id?: string }>();
  const [soundId] = useState(() => idParam || uuid());

  const [story, setStory] = useState('');
  const [tags, setTags] = useState<EmotionalTag[]>([]);
  const [customMood, setCustomMood] = useState('');
  const [musicPrompt, setMusicPrompt] = useState('');

  const { data: existing } = useSound(soundId);
  const upsertMutation = useUpsertSound();
  const generateMutation = useGenerateSound();
  const { balance, cost, ensureCredits } = useCreditGate();

  // Hydrate once from the persisted draft (resume from WriteIt / another device).
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (hydratedRef.current || !existing) return;
    hydratedRef.current = true;
    const draft = readAiStudioDraft(existing.inputMeta);
    setStory(draft.story);
    setTags(draft.tags);
    setCustomMood(draft.customMood);
    setMusicPrompt(draft.musicPrompt);
  }, [existing]);

  // Debounced draft save of the structured input.
  const upsertRef = useRef(upsertMutation.mutate);
  useEffect(() => {
    upsertRef.current = upsertMutation.mutate;
  }, [upsertMutation.mutate]);
  useEffect(() => {
    if (!hydratedRef.current) return;
    const t = setTimeout(() => {
      upsertRef.current({
        id: soundId,
        source: AI_STUDIO_SOURCE,
        inputMeta: { story, tags, customMood, musicPrompt },
      });
    }, DRAFT_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [story, tags, customMood, musicPrompt, soundId]);

  const handleExpress = async () => {
    if (generateMutation.isPending) return;
    const { prompt, style } = composeAiStudioPrompt({
      story,
      tags,
      customMood,
      musicPrompt,
    });
    if (prompt.trim().length < 20) {
      void dialog.info({
        title: 'A little more to work with',
        message:
          'Add a few more words about what happened or the music you want, so the AI has something to shape.',
      });
      return;
    }
    if (!(await ensureCredits())) return;
    try {
      await generateMutation.mutateAsync({
        id: soundId,
        prompt,
        style,
        source: AI_STUDIO_SOURCE,
      });
      router.replace(`/sound-studio/ai/express?id=${soundId}`);
    } catch (err) {
      void dialog.error({
        title: 'Could not start generation',
        message:
          err instanceof Error ? err.message : 'Please try again in a moment.',
      });
    }
  };

  return (
    <Screen
      scroll
      keyboard
      header={<Header variant="back" title="AI Studio" />}
      sticky={
        <Button
          onPress={handleExpress}
          loading={generateMutation.isPending}
          icon={<MaterialIcons name="auto-awesome" size={18} color="white" />}
        >
          {`Express it · ${cost} credit${cost === 1 ? '' : 's'}`}
        </Button>
      }
      className="px-6 pt-2"
    >
      {/* Step indicator */}
      <Badge tone="pink" size="sm" className="self-start">
        Step 2 of 3
      </Badge>

      {/* Title */}
      <Text size="display" className="mt-4 leading-tight">
        What are you{' '}
        <Text
          size="display"
          className="leading-tight"
          style={{ color: yellow }}
        >
          feeling?
        </Text>
      </Text>
      <Text size="lg" tone="secondary" className="mt-3 leading-relaxed">
        The vibe dictates the architecture. Select the emotional textures that
        define your sonic organism.
      </Text>

      {/* Emotional tags */}
      <Card className="mt-6 rounded-3xl p-5">
        <Text size="xs" treatment="caption" tone="secondary">
          Emotional Tags
        </Text>
        <ChipSelect
          className="mt-3"
          variant="gradient"
          options={TAG_OPTIONS}
          value={tags}
          onChange={(next) => setTags(next as EmotionalTag[])}
        />
      </Card>

      {/* Custom mood */}
      <Card className="mt-4 rounded-3xl p-5">
        <Text size="xs" treatment="caption" tone="secondary">
          Custom Mood or Genre
        </Text>
        <TextArea
          variant="minimal"
          rows="sm"
          className="mt-3"
          value={customMood}
          onChangeText={setCustomMood}
          placeholder="Describe the mood..."
        />
        <Text size="xs" tone="tertiary" className="mt-3 leading-relaxed">
          “A midnight drive through a neon-soaked city under a purple haze.”
        </Text>
      </Card>

      {/* Music prompt */}
      <Card className="mt-4 rounded-3xl p-5">
        <Text size="xs" treatment="caption" tone="secondary">
          Music Prompt
        </Text>
        <TextArea
          variant="minimal"
          rows="sm"
          className="mt-3"
          value={musicPrompt}
          onChangeText={setMusicPrompt}
          placeholder="Describe the musical landscape, instruments, and progression in detail..."
        />
        <Text size="xs" tone="tertiary" className="mt-3 leading-relaxed">
          Example: “A cinematic orchestral piece that begins with a haunting
          cello solo and swells into a triumphant hybrid-electronic climax.”
        </Text>
      </Card>

      {/* Credits row */}
      <View className="mt-5 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="bolt" size={14} color={yellow} />
          <Text size="xs" tone="secondary">
            Your credits:{' '}
            <Text size="xs" weight="bold">
              {balance}
            </Text>
          </Text>
        </View>
        <Button
          variant="ghost"
          size="xs"
          onPress={() => router.push('/sound-studio/credits')}
        >
          Add credits
        </Button>
      </View>
    </Screen>
  );
}

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { AccentPill } from '@/components/ui/AccentPill';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { TextArea } from '@/components/ui/TextArea';
import { uuid } from '@/lib/crypto';
import { dialog } from '@/utils/dialog';
import { toast } from '@/utils/toast';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MIN_POEM_LENGTH,
  POEM_PLACEHOLDER,
  STYLE_PLACEHOLDER,
} from '../data/express-yourself';
import { useDeleteSong } from '../hooks/useDeleteSong';
import { useGenerateSong } from '../hooks/useGenerateSong';
import { useListSongs } from '../hooks/useSong';
import { useUpsertSong } from '../hooks/useUpsertSong';

const DRAFT_DEBOUNCE_MS = 600;

export default function ExpressYourselfCompose() {
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams<{ id?: string }>();
  const [songId] = useState(() => idParam || uuid());
  const [poem, setPoem] = useState('');
  const [style, setStyle] = useState('');
  const hydratedRef = useRef(false);
  const wordCount = useMemo(
    () => poem.trim().split(/\s+/).filter(Boolean).length,
    [poem],
  );

  const upsertMutation = useUpsertSong();
  const generateMutation = useGenerateSong();
  const deleteMutation = useDeleteSong();
  const { data: songs } = useListSongs();

  const inFlightSong = useMemo(
    () =>
      (songs ?? []).find((s) => s.status === 'generating' && s.id !== songId) ??
      null,
    [songs, songId],
  );

  const existingDraft = useMemo(
    () => (songs ?? []).find((s) => s.id === songId) ?? null,
    [songs, songId],
  );

  useEffect(() => {
    if (hydratedRef.current) return;
    if (!existingDraft) return;
    hydratedRef.current = true;
    setPoem(existingDraft.prompt ?? '');
    setStyle(existingDraft.style ?? '');
  }, [existingDraft]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const upsertMutateRef = useRef(upsertMutation.mutate);
  useEffect(() => {
    upsertMutateRef.current = upsertMutation.mutate;
  }, [upsertMutation.mutate]);

  useEffect(() => {
    if (poem.length === 0 && style.length === 0) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      upsertMutateRef.current({ id: songId, prompt: poem, style });
    }, DRAFT_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [poem, style, songId]);

  const handleGenerate = async () => {
    if (poem.trim().length < MIN_POEM_LENGTH) {
      void dialog.info({
        title: 'A few more words',
        message: `Write at least ${MIN_POEM_LENGTH} characters so the AI has something to listen to.`,
      });
      return;
    }
    if (inFlightSong) {
      const choice = await dialog.info({
        title: 'Already generating',
        message:
          'You have a song still being created. Wait for it to finish or view its progress.',
        buttons: [
          { label: 'View Progress', value: 'view', variant: 'primary' },
          { label: 'Cancel', value: 'cancel', variant: 'secondary' },
        ],
      });
      if (choice === 'view') {
        router.replace(
          `/practices/express-yourself/generating?id=${inFlightSong.id}`,
        );
      }
      return;
    }
    try {
      await generateMutation.mutateAsync({ id: songId, prompt: poem, style });
      router.replace(`/practices/express-yourself/generating?id=${songId}`);
    } catch (err) {
      void dialog.error({
        title: 'Could not start generation',
        message:
          err instanceof Error ? err.message : 'Please try again in a moment.',
      });
    }
  };

  const handleDiscard = async () => {
    const choice = await dialog.error({
      title: 'Discard this draft?',
      message: "You'll lose what you've written so far.",
      buttons: [
        { label: 'Discard', value: 'confirm', variant: 'destructive' },
        { label: 'Keep', value: 'cancel', variant: 'secondary' },
      ],
    });
    if (choice !== 'confirm') return;
    try {
      await deleteMutation.mutateAsync({ id: songId });
      router.dismissTo('/practices/express-yourself');
    } catch {
      void dialog.error({
        title: 'Could not discard',
        message: 'Try again in a moment.',
      });
    }
  };

  const hasDraftContent = poem.length > 0 || style.length > 0;

  return (
    <Screen
      variant="default"
      keyboard
      scroll
      header={
        <Header
          variant="back"
          title="Compose"
          progress={{ current: 1, total: 3 }}
        />
      }
      sticky={
        <View className="items-center gap-2">
          <Button
            onPress={handleGenerate}
            disabled={poem.trim().length < MIN_POEM_LENGTH}
            loading={generateMutation.isPending || upsertMutation.isPending}
            icon={
              <MaterialIcons name="arrow-forward" size={18} color="white" />
            }
            fullWidth
          >
            Continue to Song Generation
          </Button>
          <Text size="xs" treatment="caption" tone="tertiary">
            Step 1 of 3 · Emotional Mapping
          </Text>
        </View>
      }
      contentClassName="gap-5 pb-6"
    >
      <View>
        <Text size="h1" weight="bold">
          Connection &
        </Text>
        <GradientText className="text-[32px] font-bold leading-tight">
          Relationships
        </GradientText>
      </View>
      <Text size="sm" tone="secondary">
        Write from the heart. Compose a poem or letter to someone you love.
      </Text>

      <Card variant="raised" size="md">
        <View className="flex-row items-center justify-between">
          <Text size="xs" treatment="caption">
            Composer
          </Text>
          <Button
            variant="ghost"
            size="xs"
            onPress={() => {
              setPoem('');
              toast.success('Cleared');
            }}
          >
            Clear & Reset
          </Button>
        </View>
        <TextArea
          variant="minimal"
          rows="lg"
          value={poem}
          onChangeText={setPoem}
          placeholder={POEM_PLACEHOLDER}
          autoFocus
        />
        <View className="flex-row items-center justify-between">
          <AccentPill
            label="Aura Synced"
            tone="pink"
            variant="tinted"
            size="sm"
          />
          <Text size="xs" tone="tertiary">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </Text>
        </View>
      </Card>

      <Card variant="raised" size="md">
        <Text size="xs" treatment="caption">
          Music Style & Preferences
        </Text>
        <TextArea
          variant="minimal"
          rows="sm"
          value={style}
          onChangeText={setStyle}
          placeholder={STYLE_PLACEHOLDER}
        />
      </Card>

      {hasDraftContent ? (
        <Button
          variant="ghost"
          size="sm"
          onPress={handleDiscard}
          loading={deleteMutation.isPending}
        >
          Discard Draft
        </Button>
      ) : null}
    </Screen>
  );
}

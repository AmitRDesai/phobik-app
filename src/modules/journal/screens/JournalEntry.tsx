import { BackButton } from '@/components/ui/BackButton';
import { GradientButton } from '@/components/ui/GradientButton';
import { alpha, colors } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeelingDropdown } from '../components/FeelingDropdown';
import { NeedDropdown } from '../components/NeedDropdown';
import { TagSection } from '../components/TagSection';
import {
  useCreateEntry,
  useJournalEntry,
  useUpdateEntry,
} from '../hooks/useJournalEntries';
import { journalDraftAtom } from '../store/journal';

type Feeling =
  | 'pleasant'
  | 'connected'
  | 'neutral'
  | 'unpleasant'
  | 'anxious'
  | 'angry';
type Need = 'connection' | 'safety' | 'autonomy' | 'meaning';

export default function JournalEntry() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const isViewMode = !!id;
  const [isEditing, setIsEditing] = useState(false);
  const readOnly = isViewMode && !isEditing;

  const { data: existingEntry } = useJournalEntry(id);
  const createEntry = useCreateEntry();
  const updateEntry = useUpdateEntry();

  const [draft, setDraft] = useAtom(journalDraftAtom);

  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [need, setNeed] = useState<Need | null>(null);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const initialized = useRef(false);

  // Initialize from existing entry or draft
  useEffect(() => {
    if (initialized.current) return;

    if (isViewMode && existingEntry) {
      setFeeling((existingEntry.feeling as Feeling) ?? null);
      setNeed((existingEntry.need as Need) ?? null);
      setContent(existingEntry.content);
      setTags(existingEntry.tags ?? []);
      initialized.current = true;
    } else if (!isViewMode && draft) {
      setFeeling((draft.feeling as Feeling) ?? null);
      setNeed((draft.need as Need) ?? null);
      setContent(draft.content);
      setTags(draft.tags);
      initialized.current = true;
    } else if (!isViewMode) {
      initialized.current = true;
    }
  }, [isViewMode, existingEntry, draft]);

  // Auto-save draft (debounced) for new entries
  const draftTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    if (isViewMode) return;
    if (!initialized.current) return;

    if (draftTimer.current) clearTimeout(draftTimer.current);
    setIsSavingDraft(true);
    draftTimer.current = setTimeout(() => {
      setDraft({ feeling, need, content, tags });
      setIsSavingDraft(false);
    }, 1500);

    return () => {
      if (draftTimer.current) clearTimeout(draftTimer.current);
    };
  }, [feeling, need, content, tags, isViewMode, setDraft]);

  const handleSave = useCallback(async () => {
    if (!content.trim()) return;

    try {
      if (isViewMode && id) {
        await updateEntry.mutateAsync({
          id,
          feeling,
          need,
          content,
          tags,
        });
      } else {
        const today = new Date().toISOString().slice(0, 10);
        await createEntry.mutateAsync({
          feeling,
          need,
          content,
          tags,
          entryDate: today,
        });
        setDraft(null);
      }
      router.back();
    } catch {
      dialog.error({
        title: 'Save failed',
        message: 'Could not save your entry. Please try again.',
      });
    }
  }, [
    content,
    feeling,
    need,
    tags,
    isViewMode,
    id,
    createEntry,
    updateEntry,
    setDraft,
    router,
  ]);

  const isSaving = createEntry.isPending || updateEntry.isPending;

  return (
    <View className="flex-1 bg-background-dashboard">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <BackButton icon="close" onPress={() => router.back()} />
        <Text className="text-lg font-bold tracking-tight text-white">
          Focus on what matters
        </Text>
        {isViewMode && !isEditing ? (
          <Pressable onPress={() => setIsEditing(true)}>
            <Text className="text-sm font-bold text-accent-yellow">Edit</Text>
          </Pressable>
        ) : (
          <Text className="text-sm font-bold text-accent-yellow">Drafts</Text>
        )}
      </View>

      <KeyboardAwareScrollView
        contentContainerClassName="px-6 pt-4 pb-32"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={130}
        extraKeyboardSpace={100}
      >
        {/* Feeling dropdown */}
        <FeelingDropdown
          value={feeling}
          onSelect={(v) => setFeeling(v as Feeling)}
          readOnly={readOnly}
        />

        {/* Need dropdown */}
        <NeedDropdown
          value={need}
          onSelect={(v) => setNeed(v as Need)}
          readOnly={readOnly}
        />

        {/* Tags */}
        <TagSection
          feeling={feeling}
          need={need}
          tags={tags}
          onRemoveFeeling={() => setFeeling(null)}
          onRemoveNeed={() => setNeed(null)}
          onAddTag={(tag) => setTags((prev) => [...prev, tag])}
          onRemoveTag={(tag) =>
            setTags((prev) => prev.filter((t) => t !== tag))
          }
          readOnly={readOnly}
        />

        {/* Entry label */}
        <View className="mb-4 flex-row items-center justify-between px-1">
          <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-pink">
            Private Entry
          </Text>
          {!readOnly && isSavingDraft && (
            <Text className="text-[10px] text-white/30">Auto-saving...</Text>
          )}
        </View>

        {/* Text area */}
        <TextInput
          value={content}
          onChangeText={readOnly ? undefined : setContent}
          placeholder="How is your body feeling right now?"
          placeholderTextColor={alpha.white20}
          multiline
          editable={!readOnly}
          className="min-h-[200px] text-[18px] font-light text-white"
          cursorColor={colors.primary.pink}
          selectionColor={colors.primary.pink}
          textAlignVertical="top"
        />
      </KeyboardAwareScrollView>

      {/* Bottom save button — sticks above keyboard */}
      {!readOnly && (
        <KeyboardStickyView offset={{ opened: 8, closed: 0 }}>
          <View className="px-6" style={{ paddingBottom: insets.bottom + 16 }}>
            <LinearGradient
              colors={['transparent', colors.background.dashboard]}
              style={{
                position: 'absolute',
                top: -40,
                left: 0,
                right: 0,
                height: 40,
              }}
            />
            <GradientButton
              onPress={handleSave}
              loading={isSaving}
              disabled={!content.trim()}
              icon={
                <MaterialIcons name="check-circle" size={20} color="white" />
              }
            >
              Save Reflection
            </GradientButton>
          </View>
        </KeyboardStickyView>
      )}
    </View>
  );
}

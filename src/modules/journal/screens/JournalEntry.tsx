import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Text } from '@/components/themed/Text';
import { Pressable, TextInput, View } from 'react-native';
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

type FormState = {
  feeling: Feeling | null;
  need: Need | null;
  content: string;
  tags: string[];
};

type FormAction =
  | { type: 'SET_FEELING'; feeling: Feeling | null }
  | { type: 'SET_NEED'; need: Need | null }
  | { type: 'SET_CONTENT'; content: string }
  | { type: 'SET_TAGS'; tags: string[] }
  | { type: 'HYDRATE'; state: FormState };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FEELING':
      return { ...state, feeling: action.feeling };
    case 'SET_NEED':
      return { ...state, need: action.need };
    case 'SET_CONTENT':
      return { ...state, content: action.content };
    case 'SET_TAGS':
      return { ...state, tags: action.tags };
    case 'HYDRATE':
      return action.state;
  }
}

export default function JournalEntry() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');

  const isViewMode = !!id;
  const [isEditing, setIsEditing] = useState(false);
  const readOnly = isViewMode && !isEditing;

  const { data: existingEntry } = useJournalEntry(id);
  const createEntry = useCreateEntry();
  const updateEntry = useUpdateEntry();

  const [draft, setDraft] = useAtom(journalDraftAtom);

  // Initialize from draft synchronously for new entries
  const [form, dispatch] = useReducer(formReducer, draft, (d) => ({
    feeling: !isViewMode && d ? ((d.feeling as Feeling) ?? null) : null,
    need: !isViewMode && d ? ((d.need as Need) ?? null) : null,
    content: !isViewMode && d ? d.content : '',
    tags: !isViewMode && d ? d.tags : [],
  }));
  const { feeling, need, content, tags } = form;

  // Hydrate from existing entry when viewing (arrives async from query)
  const [prevEntryId, setPrevEntryId] = useState<string | undefined>(undefined);
  if (isViewMode && existingEntry && existingEntry.id !== prevEntryId) {
    setPrevEntryId(existingEntry.id);
    dispatch({
      type: 'HYDRATE',
      state: {
        feeling: (existingEntry.feeling as Feeling) ?? null,
        need: (existingEntry.need as Need) ?? null,
        content: existingEntry.content,
        tags: existingEntry.tags ?? [],
      },
    });
  }

  // Track whether form has been initialized for draft auto-save
  const isInitialized = !isViewMode || !!prevEntryId;

  // Auto-save draft (debounced) for new entries
  const draftTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  useEffect(() => {
    if (isViewMode || !isInitialized) return;

    if (draftTimer.current) clearTimeout(draftTimer.current);
    setIsSavingDraft(true);
    draftTimer.current = setTimeout(() => {
      setDraft(form);
      setIsSavingDraft(false);
    }, 1500);

    return () => {
      if (draftTimer.current) clearTimeout(draftTimer.current);
    };
  }, [form, isViewMode, isInitialized, setDraft]);

  const handleSave = useCallback(async () => {
    if (!form.content.trim()) return;

    const mutation =
      isViewMode && id
        ? updateEntry.mutateAsync({
            id,
            feeling: form.feeling,
            need: form.need,
            content: form.content,
            tags: form.tags,
          })
        : createEntry.mutateAsync({
            feeling: form.feeling,
            need: form.need,
            content: form.content,
            tags: form.tags,
            entryDate: new Date().toISOString().slice(0, 10),
          });

    try {
      await mutation;
      if (!isViewMode) setDraft(null);
      router.back();
    } catch {
      dialog.error({
        title: 'Save failed',
        message: 'Could not save your entry. Please try again.',
      });
    }
  }, [form, isViewMode, id, createEntry, updateEntry, setDraft, router]);

  const isSaving = createEntry.isPending || updateEntry.isPending;

  return (
    <Screen
      variant="default"
      scroll
      keyboard
      header={
        <Header
          variant="close"
          title="Focus on what matters"
          right={
            isViewMode && !isEditing ? (
              <Pressable onPress={() => setIsEditing(true)}>
                <Text className="text-sm font-bold" style={{ color: yellow }}>
                  Edit
                </Text>
              </Pressable>
            ) : (
              <Text className="text-sm font-bold" style={{ color: yellow }}>
                Drafts
              </Text>
            )
          }
        />
      }
      sticky={
        !readOnly ? (
          <GradientButton
            onPress={handleSave}
            loading={isSaving}
            disabled={!content.trim()}
            icon={<MaterialIcons name="check-circle" size={20} color="white" />}
          >
            Save Reflection
          </GradientButton>
        ) : undefined
      }
      className="px-6 pt-4"
    >
      <FeelingDropdown
        value={feeling}
        onSelect={(v) =>
          dispatch({ type: 'SET_FEELING', feeling: v as Feeling })
        }
        readOnly={readOnly}
      />

      <NeedDropdown
        value={need}
        onSelect={(v) => dispatch({ type: 'SET_NEED', need: v as Need })}
        readOnly={readOnly}
      />

      <TagSection
        feeling={feeling}
        need={need}
        tags={tags}
        onRemoveFeeling={() => dispatch({ type: 'SET_FEELING', feeling: null })}
        onRemoveNeed={() => dispatch({ type: 'SET_NEED', need: null })}
        onAddTag={(tag) => dispatch({ type: 'SET_TAGS', tags: [...tags, tag] })}
        onRemoveTag={(tag) =>
          dispatch({
            type: 'SET_TAGS',
            tags: tags.filter((t) => t !== tag),
          })
        }
        readOnly={readOnly}
      />

      <View className="mb-4 flex-row items-center justify-between px-1">
        <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-pink">
          Private Entry
        </Text>
        {!readOnly && isSavingDraft && (
          <Text className="text-[10px] text-foreground/30">Auto-saving...</Text>
        )}
      </View>

      <TextInput
        value={content}
        onChangeText={
          readOnly
            ? undefined
            : (text) => dispatch({ type: 'SET_CONTENT', content: text })
        }
        placeholder="How is your body feeling right now?"
        placeholderTextColor={foregroundFor(scheme, 0.2)}
        multiline
        editable={!readOnly}
        className="min-h-[200px] text-[18px] font-light text-foreground"
        cursorColor={colors.primary.pink}
        selectionColor={colors.primary.pink}
        textAlignVertical="top"
      />
    </Screen>
  );
}

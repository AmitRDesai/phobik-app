import type { SoundRecord } from '@/hooks/sound-generation';
import type { EmotionalTag } from '../data/sound-studio';

/** The shared `song.source` value for everything created in the AI Studio. */
export const AI_STUDIO_SOURCE = 'ai-studio' as const;

/** Structured AI Studio draft, persisted in `song.input_meta` for resumability. */
export interface AiStudioDraft {
  story: string;
  tags: EmotionalTag[];
  customMood: string;
  musicPrompt: string;
}

const EMPTY_DRAFT: AiStudioDraft = {
  story: '',
  tags: [],
  customMood: '',
  musicPrompt: '',
};

/** Hydrate a draft from a sound row's `inputMeta` (tolerant of missing keys). */
export function readAiStudioDraft(
  meta: SoundRecord['inputMeta'] | undefined,
): AiStudioDraft {
  if (!meta) return { ...EMPTY_DRAFT };
  const m = meta as Record<string, unknown>;
  return {
    story: typeof m.story === 'string' ? m.story : '',
    tags: Array.isArray(m.tags) ? (m.tags as EmotionalTag[]) : [],
    customMood: typeof m.customMood === 'string' ? m.customMood : '',
    musicPrompt: typeof m.musicPrompt === 'string' ? m.musicPrompt : '',
  };
}

/**
 * Compose the provider `prompt` + `style` from the structured draft. The story
 * and music prompt become the narrative; tags + custom mood become the style.
 */
export function composeAiStudioPrompt(draft: AiStudioDraft): {
  prompt: string;
  style: string | null;
} {
  const prompt = [draft.story.trim(), draft.musicPrompt.trim()]
    .filter(Boolean)
    .join('\n\n');
  const styleParts = [draft.tags.join(', '), draft.customMood.trim()].filter(
    Boolean,
  );
  return { prompt, style: styleParts.length ? styleParts.join('. ') : null };
}

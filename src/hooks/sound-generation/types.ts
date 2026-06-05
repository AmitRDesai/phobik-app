/**
 * Shared types for AI sound/song generation. Both Express Yourself and the
 * Sound Studio AI Studio run through the same backend `song` pipeline; the
 * `source` discriminator keeps their libraries and routing separate.
 */
export type SoundSource = 'express-yourself' | 'ai-studio';

/** JSON columns to parse when converting a `song` row via `toCamel`. */
export const SOUND_JSON = { analysis_tags: true, input_meta: true } as const;

/**
 * User-facing fallback cost, used only until `credits.getConfig` resolves.
 * Keep in sync with backend `CREDITS_PER_GENERATION`.
 */
export const DEFAULT_CREDITS_PER_GENERATION = 5;

export interface SoundRecord {
  id: string;
  userId: string;
  source: SoundSource;
  prompt: string;
  style: string | null;
  status: 'draft' | 'generating' | 'ready' | 'failed';
  generationStage: 'queued' | 'text' | 'first' | 'complete' | null;
  providerJobId: string | null;
  audioKey: string | null;
  artworkKey: string | null;
  title: string | null;
  compositionNumber: number | null;
  durationSeconds: number | null;
  analysisTags: string[] | null;
  /** Structured, source-specific draft (AI Studio: story/tags/mood/prompt). */
  inputMeta: Record<string, unknown> | null;
  isFavorite: number;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

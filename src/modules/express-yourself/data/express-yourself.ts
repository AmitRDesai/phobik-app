export type SongStatus = 'draft' | 'generating' | 'ready' | 'failed';

/**
 * Status steps mapped to real provider webhook callbacks so the user sees
 * what the AI is actually doing — not a poetic fabrication.
 *   - `text` callback   → lyrics ready
 *   - `first` callback  → first audio track partial
 *   - `complete`        → mastered final
 */
export const STATUS_STEPS: { id: string; label: string }[] = [
  { id: 'text', label: 'Writing lyrics from your words' },
  { id: 'first', label: 'Composing the audio track' },
  { id: 'complete', label: 'Mastering and finalizing' },
];

export const MIN_POEM_LENGTH = 20;

export const STYLE_PLACEHOLDER =
  'Describe the desired musical mood (e.g. "Soft acoustic folk with a warm, nostalgic feel")';

export const POEM_PLACEHOLDER = 'Start typing here…';

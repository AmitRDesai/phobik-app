import {
  BODY_SUBMENU,
  EMOTION_SUBMENU,
  MIND_SUBMENU,
  RELATIONSHIP_SUBMENU,
  type PillarId,
  type PillarSubItem,
} from '@/modules/practices/data/four-pillars';
import dayjs from 'dayjs';

export type PlanEntry = {
  id: string;
  pillar: PillarId;
  pillarLabel: string;
  item: PillarSubItem;
};

const PILLARS: { id: PillarId; label: string; menu: typeof BODY_SUBMENU }[] = [
  { id: 'body', label: 'Body', menu: BODY_SUBMENU },
  { id: 'mind', label: 'Mind', menu: MIND_SUBMENU },
  { id: 'emotion', label: 'Emotion', menu: EMOTION_SUBMENU },
  { id: 'relationship', label: 'Connection', menu: RELATIONSHIP_SUBMENU },
];

/**
 * Flatten every pillar's sub-menu into a single list of plan-eligible items.
 * Items without a `route` (coming-soon) are excluded so the plan never
 * recommends a dead end.
 */
function flatten(): PlanEntry[] {
  const flat: PlanEntry[] = [];
  for (const p of PILLARS) {
    for (const item of p.menu.items) {
      if (!item.route) continue;
      flat.push({
        id: `${p.id}:${item.id}`,
        pillar: p.id,
        pillarLabel: p.label,
        item,
      });
    }
  }
  return flat;
}

/**
 * Cheap deterministic 32-bit hash. We only need stable ordering per day,
 * not crypto-grade randomness.
 */
function hashSeed(seed: number): number {
  let x = seed | 0;
  x = x ^ 61 ^ (x >>> 16);
  x = (x + (x << 3)) | 0;
  x = x ^ (x >>> 4);
  x = Math.imul(x, 0x27d4eb2d);
  x = x ^ (x >>> 15);
  return x >>> 0;
}

function dateSeed(date: string): number {
  // YYYY-MM-DD → 8-digit number
  return Number(date.replace(/-/g, ''));
}

/**
 * Pick three plan entries deterministically for a given local date.
 * Bias toward pillar variety: prefer one each from three different pillars
 * when the catalog is rich enough.
 */
export function pickDailyPlan(date: string, count = 3): PlanEntry[] {
  const all = flatten();
  if (all.length === 0) return [];

  const seed = dateSeed(date);
  // Stable shuffle: assign a hash-derived score per item and sort.
  const scored = all
    .map((entry, i) => ({
      entry,
      score: hashSeed(seed + i * 31 + entry.pillar.charCodeAt(0)),
    }))
    .sort((a, b) => a.score - b.score);

  const picked: PlanEntry[] = [];
  const seenPillars = new Set<PillarId>();
  for (const { entry } of scored) {
    if (picked.length >= count) break;
    if (seenPillars.has(entry.pillar) && seenPillars.size < PILLARS.length) {
      continue;
    }
    picked.push(entry);
    seenPillars.add(entry.pillar);
  }
  // Backfill if pillars exhausted before count
  if (picked.length < count) {
    for (const { entry } of scored) {
      if (picked.length >= count) break;
      if (!picked.some((p) => p.id === entry.id)) picked.push(entry);
    }
  }
  return picked;
}

export function todayLocal(): string {
  return dayjs().format('YYYY-MM-DD');
}

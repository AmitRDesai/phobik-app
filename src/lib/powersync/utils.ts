export function parseJSON<T>(value: string | null | undefined): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function toJSON(value: unknown): string {
  return JSON.stringify(value);
}

/** Convert snake_case keys to camelCase: { entry_date: "x" } → { entryDate: "x" } */
function snakeToCamel(key: string): string {
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Transform a PowerSync row from snake_case to camelCase keys.
 * Optionally parse specific JSONB columns.
 *
 * Usage:
 *   toCamel(row)
 *   toCamel(row, { tags: true, content: true })
 */
export function toCamel<T extends Record<string, unknown>>(
  row: T,
  jsonColumns?: Record<string, boolean>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in row) {
    const camelKey = snakeToCamel(key);
    const value = row[key];
    if (jsonColumns?.[key] && typeof value === 'string') {
      result[camelKey] = parseJSON(value);
    } else {
      result[camelKey] = value;
    }
  }
  return result;
}

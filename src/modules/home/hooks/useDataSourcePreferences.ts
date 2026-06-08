import type { SelectableDataType } from '@/lib/biometrics/providers';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';

/** dataType → chosen source slug. */
export type DataSourcePrefs = Record<string, string>;

/**
 * The user's per-metric authoritative-source choices, read from the synced
 * local table (offline-first). Empty until the user picks — callers fall back
 * to default precedence / no filtering when a type is absent.
 */
export function useDataSourcePreferences(): {
  prefs: DataSourcePrefs;
  isLoading: boolean;
} {
  const userId = useUserId();
  const { data, isLoading } = useQuery({
    queryKey: ['data-source-preferences', userId],
    query: db
      .selectFrom('data_source_preference')
      .select(['data_type', 'source'])
      .where('user_id', '=', userId ?? ''),
    enabled: !!userId,
  });

  const prefs: DataSourcePrefs = {};
  for (const row of data ?? []) {
    if (row.data_type && row.source) prefs[row.data_type] = row.source;
  }
  return { prefs, isLoading };
}

/**
 * Write a per-metric source choice. Offline-first: writes to local SQLite (the
 * connector uploads it via health.setDataSourcePreference). PowerSync views
 * reject ON CONFLICT, so pre-check existence then insert/update.
 */
export function useSetDataSourcePreference() {
  const userId = useUserId();
  return useMutation({
    mutationFn: async ({
      dataType,
      source,
    }: {
      dataType: SelectableDataType;
      source: string;
    }) => {
      if (!userId) return;
      const id = `${userId}-${dataType}`;
      const now = new Date().toISOString();
      const existing = await db
        .selectFrom('data_source_preference')
        .select('id')
        .where('id', '=', id)
        .executeTakeFirst();
      if (existing) {
        await db
          .updateTable('data_source_preference')
          .set({ source, updated_at: now })
          .where('id', '=', id)
          .execute();
      } else {
        await db
          .insertInto('data_source_preference')
          .values({
            id,
            user_id: userId,
            data_type: dataType,
            source,
            updated_at: now,
          })
          .execute();
      }
    },
  });
}

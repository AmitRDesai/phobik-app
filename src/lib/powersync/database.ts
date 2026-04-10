import { wrapPowerSyncWithKysely } from '@powersync/kysely-driver';
import { powersync } from './index';
import type { Database } from './schema';

export const db = wrapPowerSyncWithKysely<Database>(powersync);

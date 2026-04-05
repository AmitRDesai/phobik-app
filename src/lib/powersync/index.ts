import { PowerSyncDatabase } from '@powersync/react-native';
import { OPSqliteOpenFactory } from '@powersync/op-sqlite';
import { AppSchema } from './schema';
import { PhobikConnector } from './connector';

const factory = new OPSqliteOpenFactory({ dbFilename: 'phobik.db' });

export const powersync = new PowerSyncDatabase({
  schema: AppSchema,
  database: factory,
});

const connector = new PhobikConnector();

export async function connectPowerSync() {
  await powersync.init();
  await powersync.connect(connector);
}

export async function disconnectPowerSync() {
  await powersync.disconnectAndClear();
}

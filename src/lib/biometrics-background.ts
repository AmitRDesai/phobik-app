import { authClient } from '@/lib/auth';
import {
  persistReadings,
  type BiometricSample,
} from '@/modules/home/utils/biometrics-storage';
import { readHealthSamplesInWindow } from '@/modules/home/utils/health-reader';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

export const BIOMETRICS_BACKGROUND_TASK = 'phobik-biometrics-sync';

const BACKGROUND_WINDOW_HOURS = 2;

async function runBiometricsSync(): Promise<BackgroundTask.BackgroundTaskResult> {
  try {
    const session = await authClient.getSession();
    const userId = session.data?.user?.id;
    if (!userId) return BackgroundTask.BackgroundTaskResult.Success;

    const end = new Date();
    const start = new Date(
      end.getTime() - BACKGROUND_WINDOW_HOURS * 60 * 60 * 1000,
    );

    const { hrSamples, hrvSamples, extraSamples } =
      await readHealthSamplesInWindow(start, end);
    const all: BiometricSample[] = [
      ...hrSamples,
      ...hrvSamples,
      ...extraSamples,
    ];
    if (all.length > 0) await persistReadings(userId, all);
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
}

// `defineTask` must be called at module scope so the runtime registers the
// handler before the OS fires the task. Importing this module from the app
// initializer is enough to wire it in.
if (!TaskManager.isTaskDefined(BIOMETRICS_BACKGROUND_TASK)) {
  TaskManager.defineTask(BIOMETRICS_BACKGROUND_TASK, runBiometricsSync);
}

export async function registerBiometricsBackgroundTask(): Promise<void> {
  try {
    const status = await BackgroundTask.getStatusAsync();
    if (status !== BackgroundTask.BackgroundTaskStatus.Available) return;
    if (await TaskManager.isTaskRegisteredAsync(BIOMETRICS_BACKGROUND_TASK)) {
      return;
    }
    await BackgroundTask.registerTaskAsync(BIOMETRICS_BACKGROUND_TASK, {
      // OS-level minimum is 15 min on Android, ~hour on iOS — we ask for 30,
      // the system will collapse to its nearest scheduling window.
      minimumInterval: 30,
    });
  } catch {
    // Task framework can fail on simulators or restricted devices — treat as
    // best-effort. Foreground polling + subscribeToChanges still cover us.
  }
}

export async function unregisterBiometricsBackgroundTask(): Promise<void> {
  try {
    if (await TaskManager.isTaskRegisteredAsync(BIOMETRICS_BACKGROUND_TASK)) {
      await BackgroundTask.unregisterTaskAsync(BIOMETRICS_BACKGROUND_TASK);
    }
  } catch {
    // best effort
  }
}

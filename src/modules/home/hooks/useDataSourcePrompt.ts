import { dialog } from '@/utils/dialog';
import { router } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { dataSourcePromptShownAtom } from '../store/health-connection';

/**
 * Returns a function to call after a successful connect. When a 2nd overlapping
 * source is now connected (and the prompt hasn't fired before), it offers — once
 * — to set per-metric source preferences and deep-links to the selector.
 */
export function useDataSourcePrompt(): (hasOverlap: boolean) => Promise<void> {
  const shown = useAtomValue(dataSourcePromptShownAtom);
  const setShown = useSetAtom(dataSourcePromptShownAtom);

  return async (hasOverlap: boolean) => {
    if (!hasOverlap || shown) return;
    setShown(true);
    const result = await dialog.info({
      title: 'Two sources connected',
      message:
        'You can choose which source feeds each metric — heart rate, sleep, and more. Set your preferences now?',
      buttons: [
        { label: 'Choose sources', value: 'go', variant: 'primary' },
        { label: 'Later', value: 'later', variant: 'secondary' },
      ],
    });
    if (result === 'go') router.push('/settings/data-sources');
  };
}

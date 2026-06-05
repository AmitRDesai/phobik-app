import { dialog } from '@/utils/dialog';
import { useRouter } from 'expo-router';
import { DEFAULT_CREDITS_PER_GENERATION } from './types';
import { useCreditBalance } from './useCreditBalance';
import { useCreditConfig } from './useCreditConfig';

/**
 * Pre-flight credit gating shared by every sound-generation entry point.
 * `ensureCredits()` returns true when the user can proceed, otherwise prompts
 * them to buy more (routing to the global credits screen) and returns false.
 */
export function useCreditGate() {
  const router = useRouter();
  const { balance } = useCreditBalance();
  const { data: config } = useCreditConfig();
  const cost = config?.creditsPerGeneration ?? DEFAULT_CREDITS_PER_GENERATION;
  const hasEnough = balance >= cost;

  const ensureCredits = async (): Promise<boolean> => {
    if (hasEnough) return true;
    const choice = await dialog.info({
      title: 'Not enough credits',
      message: `Creating a sound costs ${cost} credit${cost === 1 ? '' : 's'}. You have ${balance}.`,
      buttons: [
        { label: 'Get Credits', value: 'buy', variant: 'primary' },
        { label: 'Maybe later', value: 'cancel', variant: 'secondary' },
      ],
    });
    if (choice === 'buy') router.push('/sound-studio/credits');
    return false;
  };

  return { balance, cost, hasEnough, ensureCredits };
}

import { BackButton } from '@/components/ui/BackButton';
import { GradientButton } from '@/components/ui/GradientButton';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/constants/colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { AppState, Text, View } from 'react-native';
import { BlurredStats } from '../components/BlurredStats';
import { useJournalLock } from '../hooks/useJournalLock';
import { journalUnlockedAtom } from '../store/journal';

export default function LockedJournal() {
  const router = useRouter();
  const { autoUnlock } = useLocalSearchParams<{ autoUnlock?: string }>();
  const { biometricIcon, unlock } = useJournalLock();
  const isUnlocked = useAtomValue(journalUnlockedAtom);
  const autoUnlockAttempted = useRef(false);

  useEffect(() => {
    if (isUnlocked) {
      router.replace('/journal/dashboard');
    }
  }, [isUnlocked, router]);

  // Auto-trigger biometric when returning from background lock — wait for app
  // to be fully active before prompting.
  useEffect(() => {
    if (!autoUnlock || autoUnlockAttempted.current) return;

    const tryUnlock = () => {
      autoUnlockAttempted.current = true;
      unlock().then((success) => {
        if (success) {
          router.replace('/journal/dashboard');
        }
      });
    };

    if (AppState.currentState === 'active') {
      tryUnlock();
    } else {
      const sub = AppState.addEventListener('change', (state) => {
        if (state === 'active') {
          sub.remove();
          tryUnlock();
        }
      });
      return () => sub.remove();
    }
  }, [autoUnlock, unlock, router]);

  const handleUnlock = async () => {
    const success = await unlock();
    if (success) {
      router.replace('/journal/dashboard');
    }
  };

  return (
    <Screen
      variant="default"
      header={
        <View className="flex-row items-center px-4 py-2">
          <BackButton />
          <View className="flex-1 items-center">
            <Text className="text-sm font-bold uppercase tracking-wide text-foreground/40">
              Secure Journal
            </Text>
          </View>
          <View className="w-8" />
        </View>
      }
      className="items-center justify-center px-8"
    >
      <View className="relative mb-12">
        <View className="h-40 w-40 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5">
          <MaterialIcons
            name="favorite"
            size={80}
            color={colors.primary.pink}
          />
        </View>
        <View className="absolute -bottom-2 -right-2 h-12 w-12 items-center justify-center rounded-full border border-foreground/20 bg-surface-elevated">
          <MaterialIcons name="lock" size={24} color={colors.accent.yellow} />
        </View>
      </View>

      <Text className="mb-2 max-w-[240px] text-center text-3xl font-bold tracking-tight text-foreground">
        Your Thoughts are
      </Text>
      <Text className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground">
        Protected
      </Text>
      <Text className="mx-auto mb-12 max-w-[280px] text-center text-sm leading-relaxed text-foreground/40">
        This journal is locked for your privacy. Unlock to access your
        biometric-linked emotional reflections.
      </Text>

      <View className="mb-12 w-full">
        <BlurredStats />
      </View>

      <View className="w-full max-w-[280px]">
        <GradientButton
          onPress={handleUnlock}
          prefixIcon={<Ionicons name={biometricIcon} size={24} color="white" />}
        >
          Unlock Journal
        </GradientButton>
      </View>

      <View className="mt-6 flex-row items-center gap-2">
        <View className="h-1.5 w-1.5 rounded-full bg-accent-yellow" />
        <Text className="text-[11px] font-bold uppercase tracking-widest text-accent-yellow">
          Secure Biometric Access
        </Text>
      </View>
    </Screen>
  );
}

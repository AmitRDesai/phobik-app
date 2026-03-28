import { BackButton } from '@/components/ui/BackButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { AppState, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurredStats } from '../components/BlurredStats';
import { useJournalLock } from '../hooks/useJournalLock';
import { journalUnlockedAtom } from '../store/journal';

export default function LockedJournal() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { autoUnlock } = useLocalSearchParams<{ autoUnlock?: string }>();
  const { biometricIcon, unlock } = useJournalLock();
  const isUnlocked = useAtomValue(journalUnlockedAtom);
  const autoUnlockAttempted = useRef(false);

  // If already unlocked, redirect to dashboard
  useEffect(() => {
    if (isUnlocked) {
      router.replace('/journal/dashboard');
    }
  }, [isUnlocked, router]);

  // Auto-trigger biometric when returning from background lock
  // Wait for app to be fully active before prompting
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
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-dashboard"
        centerY={0.4}
        intensity={0.6}
      />

      {/* Header */}
      <View
        className="flex-row items-center px-4 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <BackButton />
        <View className="flex-1 items-center">
          <Text className="text-sm font-bold uppercase tracking-wide text-white/40">
            Secure Journal
          </Text>
        </View>
        <View className="w-8" />
      </View>

      {/* Centered content */}
      <View className="flex-1 items-center justify-center px-8">
        {/* Heart with lock badge */}
        <View className="relative mb-12">
          <View className="h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <MaterialIcons
              name="favorite"
              size={80}
              color={colors.primary.pink}
            />
          </View>
          <View
            className="absolute -bottom-2 -right-2 h-12 w-12 items-center justify-center rounded-full border border-white/20"
            style={{ backgroundColor: colors.card.dark }}
          >
            <MaterialIcons name="lock" size={24} color={colors.accent.yellow} />
          </View>
        </View>

        {/* Text */}
        <Text className="mb-2 max-w-[240px] text-center text-3xl font-bold tracking-tight text-white">
          Your Thoughts are
        </Text>
        <Text className="mb-4 text-center text-3xl font-bold tracking-tight text-white">
          Protected
        </Text>
        <Text className="mx-auto mb-12 max-w-[280px] text-center text-sm leading-relaxed text-white/40">
          This journal is locked for your privacy. Unlock to access your
          biometric-linked emotional reflections.
        </Text>

        {/* Blurred stats */}
        <View className="mb-12 w-full">
          <BlurredStats />
        </View>

        {/* Unlock button */}
        <View className="w-full max-w-[280px]">
          <GradientButton
            onPress={handleUnlock}
            prefixIcon={
              <Ionicons name={biometricIcon} size={24} color="white" />
            }
          >
            Unlock Journal
          </GradientButton>
        </View>

        {/* Secure access label */}
        <View className="mt-6 flex-row items-center gap-2">
          <View className="h-1.5 w-1.5 rounded-full bg-accent-yellow" />
          <Text className="text-[11px] font-bold uppercase tracking-widest text-accent-yellow">
            Secure Biometric Access
          </Text>
        </View>
      </View>
    </View>
  );
}

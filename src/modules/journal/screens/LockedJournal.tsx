import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { AppState } from 'react-native';
import { BlurredStats } from '../components/BlurredStats';
import { useJournalLock } from '../hooks/useJournalLock';
import { journalUnlockedAtom } from '../store/journal';

export default function LockedJournal() {
  const router = useRouter();
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
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
      header={
        <Header
          center={
            <Text
              size="xs"
              treatment="caption"
              tone="tertiary"
              weight="bold"
              className="tracking-wide"
            >
              Secure Journal
            </Text>
          }
        />
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
          <MaterialIcons name="lock" size={24} color={yellow} />
        </View>
      </View>

      <Text size="h1" align="center" className="mb-2">
        Your Thoughts are
      </Text>
      <Text size="h1" align="center" className="mb-4">
        Protected
      </Text>
      <Text
        size="sm"
        align="center"
        tone="tertiary"
        className="mx-auto mb-12 max-w-[280px] leading-relaxed"
      >
        This journal is locked for your privacy. Unlock to access your
        biometric-linked emotional reflections.
      </Text>

      <View className="mb-12 w-full">
        <BlurredStats />
      </View>

      <View className="w-full max-w-[280px]">
        <Button
          onPress={handleUnlock}
          prefixIcon={<Ionicons name={biometricIcon} size={24} color="white" />}
        >
          Unlock Journal
        </Button>
      </View>

      <View className="mt-6 flex-row items-center gap-2">
        <View
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: yellow }}
        />
        <Text
          size="xs"
          treatment="caption"
          weight="bold"
          style={{ color: yellow }}
        >
          Secure Biometric Access
        </Text>
      </View>
    </Screen>
  );
}

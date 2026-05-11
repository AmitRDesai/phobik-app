import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import { authClient, getSession, useSession } from '@/lib/auth';
import { dialog } from '@/utils/dialog';
import { env } from '@/utils/env';
import { Ionicons } from '@expo/vector-icons';
import * as IntentLauncher from 'expo-intent-launcher';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { AppState, Linking, Platform } from 'react-native';

const RESEND_COOLDOWN_SECONDS = 60;

export default function EmailVerificationScreen() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? '';
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = useCallback(() => {
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(
    () => () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    },
    [],
  );

  const checkVerification = useCallback(async () => {
    let result;
    try {
      result = await getSession({ query: { disableCookieCache: true } });
    } catch {
      // Ignore — guard will re-evaluate on next session refresh
      return;
    }
    if (result.data?.user?.emailVerified) {
      dialog.info({
        title: 'Email Verified',
        message: 'Your email has been verified successfully.',
      });
    }
  }, []);

  // Foreground return — detect when user switches back to app
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') checkVerification();
    });
    return () => sub.remove();
  }, [checkVerification]);

  const handleOpenEmail = useCallback(async () => {
    if (Platform.OS === 'ios') {
      try {
        const canOpen = await Linking.canOpenURL('message://');
        if (canOpen) {
          await Linking.openURL('message://');
          return;
        }
        const canOpenMailto = await Linking.canOpenURL('mailto:');
        if (canOpenMailto) {
          await Linking.openURL('mailto:');
          return;
        }
      } catch {
        // Scheme query failed — fall through to dialog
      }
      dialog.info({
        title: 'No Email App',
        message:
          'No email app is available on this device. Please open your email manually.',
      });
    } else {
      IntentLauncher.startActivityAsync('android.intent.action.MAIN', {
        category: 'android.intent.category.APP_EMAIL',
        flags: 268435456, // FLAG_ACTIVITY_NEW_TASK
      });
    }
  }, []);

  const handleResend = useCallback(async () => {
    if (resendCooldown > 0 || isSending) return;
    setIsSending(true);
    const callbackURL = `${env.get('APP_SCHEME')}://email-verification`;
    try {
      await authClient.sendVerificationEmail({ email, callbackURL });
      startCooldown();
    } catch {
      // Silently fail — user can try again
    }
    setIsSending(false);
  }, [email, resendCooldown, isSending, startCooldown]);

  return (
    <Screen variant="auth" className="flex-1 items-center justify-center px-8">
      <View className="w-full items-center">
        {/* Icon */}
        <View
          className="mb-8 h-28 w-28 items-center justify-center rounded-full border border-primary-pink/30 bg-primary-pink/10"
          style={{
            boxShadow: [
              {
                offsetX: 0,
                offsetY: 0,
                blurRadius: 30,
                color: withAlpha(colors.primary.pink, 0.15),
              },
            ],
          }}
        >
          <Ionicons name="mail-open" size={48} color={colors.primary.pink} />
        </View>

        {/* Title */}
        <Text size="h1">Verify Your Email</Text>
        <Text size="lg" tone="secondary" align="center" className="mt-3">
          We sent a verification link to
        </Text>
        <Text
          size="lg"
          align="center"
          tone="accent"
          weight="semibold"
          className="mt-1"
        >
          {email}
        </Text>

        {/* Open Email Button */}
        <View className="mt-10 w-full">
          <Button onPress={handleOpenEmail}>Open Email App</Button>
        </View>

        {/* Resend Button */}
        <Button
          variant="ghost"
          onPress={handleResend}
          disabled={resendCooldown > 0 || isSending}
          loading={isSending}
          className="mt-6"
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Email'}
        </Button>

        {/* Hint */}
        <Text size="sm" tone="secondary" align="center" className="mt-10">
          Click the link in the email, then return here.{'\n'}The app will
          detect verification automatically.
        </Text>
      </View>
    </Screen>
  );
}

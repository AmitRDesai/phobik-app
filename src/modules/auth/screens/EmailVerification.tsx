import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { authClient, getSession, useSession } from '@/lib/auth';
import { dialog } from '@/utils/dialog';
import { env } from '@/utils/env';
import { Ionicons } from '@expo/vector-icons';
import * as IntentLauncher from 'expo-intent-launcher';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Linking,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RESEND_COOLDOWN_SECONDS = 60;

export default function EmailVerificationScreen() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? '';
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
      return;
    }
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, [resendCooldown]);

  const checkVerification = useCallback(async () => {
    try {
      const result = await getSession({ query: { disableCookieCache: true } });
      if (result.data?.user?.emailVerified) {
        dialog.info({
          title: 'Email Verified',
          message: 'Your email has been verified successfully.',
        });
      }
    } catch {
      // Ignore — guard will re-evaluate on next session refresh
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
    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: `${env.get('APP_SCHEME')}://email-verification`,
      });
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      // Silently fail — user can try again
    } finally {
      setIsSending(false);
    }
  }, [email, resendCooldown, isSending]);

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <View className="flex-1 items-center justify-center px-8">
        {/* Icon */}
        <View
          className="mb-8 h-28 w-28 items-center justify-center rounded-full border border-primary-pink/30 bg-primary-pink/10"
          style={{
            shadowColor: colors.primary.pink,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 30,
          }}
        >
          <Ionicons name="mail-open" size={48} color={colors.primary.pink} />
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-white">Verify Your Email</Text>
        <Text className="mt-3 text-center text-base leading-6 text-white/50">
          We sent a verification link to
        </Text>
        <Text className="mt-1 text-center text-base font-semibold text-primary-pink">
          {email}
        </Text>

        {/* Open Email Button */}
        <View className="mt-10 w-full">
          <GradientButton onPress={handleOpenEmail}>
            Open Email App
          </GradientButton>
        </View>

        {/* Resend Button */}
        <Pressable
          onPress={handleResend}
          disabled={resendCooldown > 0 || isSending}
          className="mt-6 py-2"
        >
          {isSending ? (
            <ActivityIndicator color={colors.primary.pink} size="small" />
          ) : resendCooldown > 0 ? (
            <Text className="text-sm text-white/30">
              Resend in {resendCooldown}s
            </Text>
          ) : (
            <Text className="text-sm font-semibold text-primary-pink">
              Resend Email
            </Text>
          )}
        </Pressable>

        {/* Hint */}
        <Text className="mt-10 text-center text-xs leading-5 text-white/30">
          Click the link in the email, then return here.{'\n'}The app will
          detect verification automatically.
        </Text>
      </View>
    </SafeAreaView>
  );
}

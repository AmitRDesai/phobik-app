import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Screen } from '@/components/ui/Screen';
import { TextInput } from '@/components/ui/TextInput';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import {
  useAppleSignIn,
  useGoogleSignIn,
  useSignIn,
} from '@/hooks/auth/useAuth';
import {
  useBiometricAuth,
  useBiometricAvailability,
} from '@/hooks/auth/useBiometric';
import { useScheme } from '@/hooks/useTheme';
import { useSession as useBetterAuthSession } from '@/lib/auth';
import { warmServer } from '@/lib/server-warmup';
import { biometricEnabledAtom, isSignedOutAtom } from '@/store/auth';
import { questionnaireAtom } from '@/store/onboarding';
import { isReturningUserAtom } from '@/store/user';
import { dialog } from '@/utils/dialog';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtomValue, useSetAtom, useStore } from 'jotai';
import { RESET } from 'jotai/utils';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Platform, Pressable, TextInput as RNTextInput } from 'react-native';

export default function SignInScreen() {
  const scheme = useScheme();
  const socialIconColor =
    scheme === 'dark' ? foregroundFor(scheme, 0.8) : 'rgba(0,0,0,0.78)';
  const avatarIconColor =
    scheme === 'dark' ? foregroundFor(scheme, 0.3) : 'rgba(0,0,0,0.32)';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const passwordRef = useRef<RNTextInput>(null);

  const store = useStore();
  const biometricEnabled = useAtomValue(biometricEnabledAtom);
  const isSignedOut = useAtomValue(isSignedOutAtom);
  const setIsSignedOut = useSetAtom(isSignedOutAtom);
  const signInMutation = useSignIn();
  const googleSignInMutation = useGoogleSignIn();
  const appleSignInMutation = useAppleSignIn();
  const { data: sessionData } = useBetterAuthSession();
  const { biometricType } = useBiometricAvailability();
  const { authenticate } = useBiometricAuth();

  const hasSession = !!sessionData?.session;
  const showBiometric = biometricEnabled && hasSession;

  const isValid = email.trim() && password.trim();
  const isLoading =
    signInMutation.isPending ||
    googleSignInMutation.isPending ||
    appleSignInMutation.isPending;
  const showWarmingHint = signInMutation.slowResponse;

  useEffect(() => {
    warmServer();
  }, []);

  const handleBiometricSignIn = async () => {
    const result = await authenticate(`Use ${biometricType} to sign in`);
    if (result.success) {
      setIsSignedOut(false);
    } else if (result.error !== 'user_cancel') {
      dialog.error({
        title: `${biometricType} Failed`,
        message: 'Please sign in with your credentials.',
      });
    }
  };

  const handleSignUp = async () => {
    const questionnaire = await store.get(questionnaireAtom);
    if (questionnaire.termsAcceptedAt !== null) {
      // User completed ALL questions (terms is set in step 7/7), go to create-account
      router.replace('/auth/create-account');
    } else {
      // Hasn't completed flow (or atoms were cleared after account creation) → start fresh.
      // Set isReturningUser=false so the nested guard makes account-creation accessible.
      store.set(isReturningUserAtom, false);
      store.set(questionnaireAtom, RESET);
      router.replace('/account-creation');
    }
  };

  // Profile saving handled centrally in useAppInitializer.
  // On sign-in, clear questionnaire to prevent overwriting existing profile.
  // On social auth, don't clear — useAppInitializer checks hasSynced first.

  const handleSignIn = async () => {
    try {
      await signInMutation.mutateAsync({ email, password });
    } catch (error) {
      dialog.error({
        title: 'Sign In Failed',
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignInMutation.mutateAsync();
    } catch (error) {
      dialog.error({
        title: 'Sign In Failed',
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await appleSignInMutation.mutateAsync();
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') return;
      dialog.error({
        title: 'Sign In Failed',
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  return (
    <Screen
      variant="auth"
      scroll
      keyboard
      insetTop={false}
      className="grow justify-center"
      scrollViewProps={{ keyboardDismissMode: 'interactive' }}
    >
      {/* Avatar / Aura Section */}
      <View className="android:pt-10 ios:pt-16 relative items-center pb-8">
        {/* Pink glow behind avatar */}
        <View
          className="absolute top-[30px] h-[280px] w-[280px] rounded-[140px] bg-primary-pink opacity-[0.08]"
          style={{
            boxShadow: `0 0 60px ${withAlpha(colors.primary.pink, 0.15)}`,
          }}
        />
        {/* Yellow inner glow */}
        <View
          className="absolute top-[70px] h-[200px] w-[200px] rounded-full bg-accent-yellow opacity-[0.04]"
          style={{
            boxShadow: `0 0 40px ${withAlpha(colors.accent.yellow, 0.08)}`,
          }}
        />

        {/* Decorative dots */}
        <View className="absolute right-[60px] top-[60px] h-2 w-2 rounded-full bg-accent-yellow" />
        <View className="absolute bottom-[40px] left-[60px] h-1.5 w-1.5 rounded-[3px] bg-primary-pink" />

        {/* Avatar circle */}
        <View className="h-[180px] w-[180px] items-center justify-center rounded-[90px] border-2 border-foreground/10 bg-foreground/10">
          <Ionicons name="person" size={72} color={avatarIconColor} />
        </View>
      </View>

      {/* Welcome Text */}
      <View className="items-center px-4">
        <Text size="h1">Welcome Back</Text>
        <Text size="lg" tone="secondary" className="mt-2">
          We missed your energy today.
        </Text>
      </View>

      {/* Biometric Quick Sign-In */}
      {showBiometric && (
        <View className="items-center px-8 pt-6">
          <Pressable
            onPress={handleBiometricSignIn}
            className="h-16 w-16 items-center justify-center rounded-full border border-primary-pink/30 bg-primary-pink/10"
          >
            <Ionicons
              name={biometricType === 'Face ID' ? 'scan' : 'finger-print'}
              size={32}
              color={colors.primary.pink}
            />
          </Pressable>
          <Text size="sm" className="mt-3 text-foreground/50">
            Tap to sign in with {biometricType}
          </Text>

          {!isSignedOut && (
            <View className="mt-4 flex-row items-center">
              <View className="h-px flex-1 bg-foreground/15" />
              <Text size="sm" className="mx-4 text-foreground/45">
                or use credentials
              </Text>
              <View className="h-px flex-1 bg-foreground/15" />
            </View>
          )}
        </View>
      )}

      {/* Form Section */}
      {!isSignedOut && (
        <View className="px-8 pt-8">
          <View className="gap-5">
            <TextInput
              label="Email Address"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              icon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              labelUppercase={false}
              editable={!isLoading}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            <TextInput
              ref={passwordRef}
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              icon="lock-closed"
              secureTextEntry
              labelUppercase={false}
              editable={!isLoading}
              returnKeyType="done"
              onSubmitEditing={() => {
                if (isValid) handleSignIn();
              }}
            />
          </View>

          <Button
            variant="ghost"
            size="xs"
            className="mt-3 self-end"
            disabled={isLoading}
            onPress={() => router.push('/auth/forgot-password')}
          >
            Forgot Password?
          </Button>

          <View className="mt-6">
            <Button
              onPress={handleSignIn}
              disabled={!isValid}
              loading={isLoading}
            >
              Sign In
            </Button>
            {showWarmingHint && (
              <Text size="sm" tone="secondary" align="center" className="mt-3">
                Hang tight — we&apos;re getting things ready for you.
              </Text>
            )}
          </View>

          {/* Social Sign In */}
          <View className="mt-6">
            <View className="mb-4 flex-row items-center">
              <View className="h-px flex-1 bg-foreground/15" />
              <Text size="sm" className="mx-4 text-foreground/45">
                or continue with
              </Text>
              <View className="h-px flex-1 bg-foreground/15" />
            </View>

            <View className="flex-row justify-center gap-4">
              <Pressable
                onPress={handleGoogleSignIn}
                disabled={isLoading}
                className="h-14 w-14 items-center justify-center rounded-full border border-foreground/10 bg-foreground/10"
              >
                <Ionicons
                  name="logo-google"
                  size={24}
                  color={socialIconColor}
                />
              </Pressable>

              {Platform.OS === 'ios' && (
                <Pressable
                  onPress={handleAppleSignIn}
                  disabled={isLoading}
                  className="h-14 w-14 items-center justify-center rounded-full border border-foreground/10 bg-foreground/10"
                >
                  <Ionicons
                    name="logo-apple"
                    size={24}
                    color={socialIconColor}
                  />
                </Pressable>
              )}
            </View>
          </View>

          <Pressable
            onPress={handleSignUp}
            className="mb-8 mt-6 py-2"
            disabled={isLoading}
          >
            <Text size="sm" tone="secondary" align="center">
              Don&apos;t have an account?{' '}
              <Text size="sm" tone="accent" weight="bold">
                Sign Up
              </Text>
            </Text>
          </Pressable>
        </View>
      )}
    </Screen>
  );
}

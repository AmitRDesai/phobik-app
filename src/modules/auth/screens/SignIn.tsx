import { GradientButton } from '@/components/ui/GradientButton';
import { Screen } from '@/components/ui/Screen';
import { TextInput } from '@/components/ui/TextInput';
import { alpha, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { useSession as useBetterAuthSession } from '@/lib/auth';
import { warmServer } from '@/lib/server-warmup';
import { isReturningUserAtom } from '@/store/user';
import { dialog } from '@/utils/dialog';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtomValue, useSetAtom, useStore } from 'jotai';
import { RESET } from 'jotai/utils';
import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  TextInput as RNTextInput,
  Text,
  View,
} from 'react-native';
import { questionnaireAtom } from '@/store/onboarding';
import {
  useAppleSignIn,
  useGoogleSignIn,
  useSignIn,
} from '@/hooks/auth/useAuth';
import {
  useBiometricAuth,
  useBiometricAvailability,
} from '@/hooks/auth/useBiometric';
import { biometricEnabledAtom, isSignedOutAtom } from '@/store/auth';

export default function SignInScreen() {
  const scheme = useScheme();
  const socialIconColor =
    scheme === 'dark' ? alpha.white80 : 'rgba(0,0,0,0.78)';
  const avatarIconColor =
    scheme === 'dark' ? alpha.white30 : 'rgba(0,0,0,0.32)';

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
      <View
        className={`relative items-center pb-8 ${Platform.OS === 'android' ? 'pt-10' : 'pt-16'}`}
      >
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
        <Text className="text-3xl font-bold text-foreground">Welcome Back</Text>
        <Text className="mt-2 text-lg text-primary-muted/80">
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
          <Text className="mt-3 text-sm text-foreground/50">
            Tap to sign in with {biometricType}
          </Text>

          {!isSignedOut && (
            <View className="mt-4 flex-row items-center">
              <View className="h-px flex-1 bg-primary-muted/20" />
              <Text className="mx-4 text-sm text-primary-muted/50">
                or use credentials
              </Text>
              <View className="h-px flex-1 bg-primary-muted/20" />
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
              labelColor={`${colors.primary.muted}B3`}
              iconColor={`${colors.primary.muted}80`}
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
              labelColor={`${colors.primary.muted}B3`}
              iconColor={`${colors.primary.muted}80`}
              editable={!isLoading}
              returnKeyType="done"
              onSubmitEditing={() => {
                if (isValid) handleSignIn();
              }}
            />
          </View>

          <Pressable
            className="mt-3 self-end"
            disabled={isLoading}
            onPress={() => router.push('/auth/forgot-password')}
          >
            <Text className="text-sm text-primary-muted/80">
              Forgot Password?
            </Text>
          </Pressable>

          <View className="mt-6">
            <GradientButton
              onPress={handleSignIn}
              disabled={!isValid}
              loading={isLoading}
            >
              Sign In
            </GradientButton>
            {showWarmingHint && (
              <Text className="mt-3 text-center text-xs text-primary-muted/70">
                Hang tight — we&apos;re getting things ready for you.
              </Text>
            )}
          </View>

          {/* Social Sign In */}
          <View className="mt-6">
            <View className="mb-4 flex-row items-center">
              <View className="h-px flex-1 bg-primary-muted/20" />
              <Text className="mx-4 text-sm text-primary-muted/50">
                or continue with
              </Text>
              <View className="h-px flex-1 bg-primary-muted/20" />
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
            <Text className="text-center text-sm text-primary-muted/60">
              Don&apos;t have an account?{' '}
              <Text className="font-bold text-primary-pink">Sign Up</Text>
            </Text>
          </Pressable>
        </View>
      )}
    </Screen>
  );
}

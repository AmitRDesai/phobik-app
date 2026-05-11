import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { InlineLink } from '@/components/ui/InlineLink';
import { Screen } from '@/components/ui/Screen';
import { SocialAuthButton } from '@/components/ui/SocialAuthButton';
import { TextField } from '@/components/ui/TextField';
import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { warmServer } from '@/lib/server-warmup';
import { dialog } from '@/utils/dialog';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Platform, TextInput as RNTextInput } from 'react-native';
import {
  useAppleSignIn,
  useGoogleSignIn,
  useSignUp,
} from '@/hooks/auth/useAuth';

const GRADIENT_HEADER_STYLE = {
  paddingTop: Platform.OS === 'android' ? 40 : 60,
  paddingBottom: Platform.OS === 'android' ? 24 : 40,
  alignItems: 'center' as const,
  position: 'relative' as const,
  overflow: 'hidden' as const,
};

export default function CreateAccountScreen() {
  const scheme = useScheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const emailRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);

  const signUpMutation = useSignUp();
  const googleSignInMutation = useGoogleSignIn();
  const appleSignInMutation = useAppleSignIn();
  const isValid = name.trim() && email.trim() && password.trim();
  const isLoading =
    signUpMutation.isPending ||
    googleSignInMutation.isPending ||
    appleSignInMutation.isPending;
  const showWarmingHint = signUpMutation.slowResponse;

  useEffect(() => {
    warmServer();
  }, []);

  const clearFieldErrors = () => setFieldErrors({});

  const parseSignUpError = (error: unknown): string => {
    const message =
      error instanceof Error ? error.message : 'An error occurred';
    const msg = message.toLowerCase();

    if (msg.includes('already') || msg.includes('exists')) {
      setFieldErrors({ email: 'An account with this email already exists' });
      return 'An account with this email already exists';
    }
    if (msg.includes('password') || msg.includes('too short')) {
      setFieldErrors({
        password: 'Password must be at least 8 characters',
      });
      return 'Password must be at least 8 characters';
    }
    if (msg.includes('email') || msg.includes('invalid')) {
      setFieldErrors({ email: 'Please enter a valid email address' });
      return 'Please enter a valid email address';
    }

    return message;
  };

  // Profile saving is handled centrally in useAppInitializer after auth succeeds.
  // These handlers only create the account.

  const handleCreateAccount = async () => {
    clearFieldErrors();
    try {
      await signUpMutation.mutateAsync({ name, email, password });
    } catch (error) {
      const message = parseSignUpError(error);
      dialog.error({ title: 'Sign Up Failed', message });
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await googleSignInMutation.mutateAsync();
    } catch (error) {
      dialog.error({
        title: 'Sign Up Failed',
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  const handleAppleSignUp = async () => {
    try {
      await appleSignInMutation.mutateAsync();
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === 'ERR_REQUEST_CANCELED'
      ) {
        return;
      }
      dialog.error({
        title: 'Sign Up Failed',
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
      className="grow"
      scrollViewProps={{ keyboardDismissMode: 'interactive' }}
    >
      {/* Gradient Header */}
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={GRADIENT_HEADER_STYLE}
      >
        {/* Decorative blur circles — sit on fixed gradient bg, theme-independent */}
        <View className="absolute -right-10 -top-10 h-40 w-40 rounded-[80px] bg-white/10" />
        <View className="absolute -bottom-[30px] -left-[30px] h-[120px] w-[120px] rounded-[60px] bg-black/10" />

        {/* Fingerprint icon in frosted glass */}
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-3xl border border-white/30 bg-white/20">
          <Ionicons name="finger-print" size={40} color="white" />
        </View>

        <Text size="h1" tone="inverse" className="tracking-tight">
          PHOBIK
        </Text>
        <Text size="sm" tone="inverse" className="mt-1 opacity-80">
          Biometric Mental Wellness
        </Text>
      </LinearGradient>

      {/* Form Section */}
      <View className="flex-1 px-8 pt-8">
        <Text size="h1">Create Account</Text>
        <Text size="sm" tone="secondary" className="mb-8 mt-2">
          Join the future of secure health tracking
        </Text>

        <View className="gap-5">
          <TextField
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={(t) => {
              setName(t);
              if (fieldErrors.name) clearFieldErrors();
            }}
            icon={
              <Ionicons
                name="person"
                size={18}
                color={foregroundFor(scheme, 0.55)}
              />
            }
            editable={!isLoading}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            error={fieldErrors.name}
          />
          <TextField
            ref={emailRef}
            label="Email Address"
            placeholder="your@email.com"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              if (fieldErrors.email) clearFieldErrors();
            }}
            type="email"
            icon={
              <Ionicons
                name="mail"
                size={18}
                color={foregroundFor(scheme, 0.55)}
              />
            }
            editable={!isLoading}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            error={fieldErrors.email}
          />
          <TextField
            ref={passwordRef}
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              if (fieldErrors.password) clearFieldErrors();
            }}
            type="password"
            icon={
              <Ionicons
                name="lock-closed"
                size={18}
                color={foregroundFor(scheme, 0.55)}
              />
            }
            editable={!isLoading}
            returnKeyType="done"
            onSubmitEditing={() => {
              if (isValid) handleCreateAccount();
            }}
            error={fieldErrors.password}
          />
        </View>

        <View className="mt-8">
          <Button
            onPress={handleCreateAccount}
            disabled={!isValid}
            loading={isLoading}
          >
            Create Account
          </Button>
          {showWarmingHint && (
            <Text size="sm" tone="secondary" align="center" className="mt-3">
              Hang tight — we&apos;re getting things ready for you.
            </Text>
          )}
        </View>

        {/* Social Sign Up */}
        <View className="mt-6">
          <View className="mb-4 flex-row items-center">
            <View className="h-px flex-1 bg-foreground/10" />
            <Text size="sm" tone="secondary" className="mx-4">
              or continue with
            </Text>
            <View className="h-px flex-1 bg-foreground/10" />
          </View>

          <View className="flex-row justify-center gap-4">
            <SocialAuthButton
              provider="google"
              onPress={handleGoogleSignUp}
              disabled={isLoading}
            />
            {Platform.OS === 'ios' && (
              <SocialAuthButton
                provider="apple"
                onPress={handleAppleSignUp}
                disabled={isLoading}
              />
            )}
          </View>
        </View>

        <Text size="sm" tone="secondary" align="center" className="mt-4">
          By signing up, you agree to our{'\n'}
          <Text
            size="sm"
            tone="accent"
            onPress={() => router.push('/auth/terms-of-service?modal=true')}
          >
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            size="sm"
            tone="accent"
            onPress={() => router.push('/auth/privacy-policy?modal=true')}
          >
            Privacy Policy
          </Text>
          .
        </Text>

        <InlineLink
          prefix="Already have an account?"
          action="Sign In"
          onPress={() => router.replace('/auth/sign-in')}
          disabled={isLoading}
          className="mb-8 mt-6"
        />
      </View>
    </Screen>
  );
}

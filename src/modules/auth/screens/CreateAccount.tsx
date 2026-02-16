import { GradientButton } from '@/components/ui/GradientButton';
import { TextInput } from '@/components/ui/TextInput';
import { colors } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useStore } from 'jotai';
import { RESET } from 'jotai/utils';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { questionnaireAtom } from '../../account-creation/store/account-creation';
import { useAppleSignIn, useGoogleSignIn, useSignUp } from '../hooks/useAuth';
import { useSaveProfile } from '../hooks/useProfile';

export default function CreateAccountScreen() {
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
  const saveProfile = useSaveProfile();
  const store = useStore();

  const isValid = name.trim() && email.trim() && password.trim();
  const isLoading =
    signUpMutation.isPending ||
    googleSignInMutation.isPending ||
    appleSignInMutation.isPending;

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

  const saveProfileFromLocal = async () => {
    const questionnaire = await store.get(questionnaireAtom);
    try {
      await saveProfile.mutateAsync({
        ageRange: questionnaire.age,
        genderIdentity: questionnaire.gender,
        goals: questionnaire.goals,
        termsAcceptedAt: questionnaire.termsAcceptedAt,
        privacyAcceptedAt: questionnaire.privacyAcceptedAt,
      });
      // Clear local questionnaire data on success
      store.set(questionnaireAtom, RESET);
    } catch (error) {
      // Profile save failed — recovery effect in _layout.tsx will retry
      // Do NOT clear questionnaireAtom on failure
      console.warn('Profile save failed after signup:', error);
    }
  };

  const handleCreateAccount = async () => {
    clearFieldErrors();

    // Step 1: Create account
    try {
      await signUpMutation.mutateAsync({ name, email, password });
    } catch (error) {
      const message = parseSignUpError(error);
      dialog.error({ title: 'Sign Up Failed', message });
      return;
    }

    // Step 2: Save profile (non-blocking — root layout retries if this fails)
    await saveProfileFromLocal();
    // Guards handle navigation (email verification, etc.)
  };

  const handleGoogleSignUp = async () => {
    try {
      await googleSignInMutation.mutateAsync();
      await saveProfileFromLocal();
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
      await saveProfileFromLocal();
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') return;
      dialog.error({
        title: 'Sign Up Failed',
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background-dark">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {/* Gradient Header */}
          <LinearGradient
            colors={[colors.primary.pink, colors.accent.yellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingTop: Platform.OS === 'android' ? 40 : 60,
              paddingBottom: Platform.OS === 'android' ? 24 : 40,
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative blur circles */}
            <View className="absolute -right-10 -top-10 h-40 w-40 rounded-[80px] bg-white/10" />
            <View className="absolute -bottom-[30px] -left-[30px] h-[120px] w-[120px] rounded-[60px] bg-black/10" />

            {/* Fingerprint icon in frosted glass */}
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-3xl border border-white/30 bg-white/20">
              <Ionicons name="finger-print" size={40} color="white" />
            </View>

            <Text className="text-3xl font-extrabold tracking-tight text-white">
              PHOBIK
            </Text>
            <Text className="mt-1 text-sm text-white/80">
              Biometric Mental Wellness
            </Text>
          </LinearGradient>

          {/* Form Section */}
          <View className="flex-1 px-8 pt-8">
            <Text className="text-2xl font-bold text-white">
              Create Account
            </Text>
            <Text className="mb-8 mt-2 text-sm text-white/40">
              Join the future of secure health tracking
            </Text>

            <View className="gap-5">
              <TextInput
                label="Full Name"
                placeholder="Enter your name"
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (fieldErrors.name) clearFieldErrors();
                }}
                icon="person"
                autoCapitalize="words"
                labelUppercase={false}
                labelColor={colors.gray[300]}
                editable={!isLoading}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                error={fieldErrors.name}
              />
              <TextInput
                ref={emailRef}
                label="Email Address"
                placeholder="your@email.com"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (fieldErrors.email) clearFieldErrors();
                }}
                icon="at"
                keyboardType="email-address"
                autoCapitalize="none"
                labelUppercase={false}
                labelColor={colors.gray[300]}
                editable={!isLoading}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                error={fieldErrors.email}
              />
              <TextInput
                ref={passwordRef}
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (fieldErrors.password) clearFieldErrors();
                }}
                icon="lock-closed"
                secureTextEntry
                labelUppercase={false}
                labelColor={colors.gray[300]}
                editable={!isLoading}
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (isValid) handleCreateAccount();
                }}
                error={fieldErrors.password}
              />
            </View>

            <View className="mt-8">
              <GradientButton
                onPress={handleCreateAccount}
                disabled={!isValid || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  'Create Account'
                )}
              </GradientButton>
            </View>

            {/* Social Sign Up */}
            <View className="mt-6">
              <View className="mb-4 flex-row items-center">
                <View className="h-px flex-1 bg-white/10" />
                <Text className="mx-4 text-sm text-white/40">
                  or continue with
                </Text>
                <View className="h-px flex-1 bg-white/10" />
              </View>

              <View className="flex-row justify-center gap-4">
                <Pressable
                  onPress={handleGoogleSignUp}
                  disabled={isLoading}
                  className="h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10"
                >
                  <Ionicons
                    name="logo-google"
                    size={24}
                    color="rgba(255,255,255,0.8)"
                  />
                </Pressable>

                {Platform.OS === 'ios' && (
                  <Pressable
                    onPress={handleAppleSignUp}
                    disabled={isLoading}
                    className="h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10"
                  >
                    <Ionicons
                      name="logo-apple"
                      size={24}
                      color="rgba(255,255,255,0.8)"
                    />
                  </Pressable>
                )}
              </View>
            </View>

            <Text className="mt-4 text-center text-xs leading-5 text-white/40">
              By signing up, you agree to our{'\n'}
              <Text
                className="text-primary-pink"
                onPress={() => router.push('/auth/terms-of-service?modal=true')}
              >
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text
                className="text-primary-pink"
                onPress={() => router.push('/auth/privacy-policy?modal=true')}
              >
                Privacy Policy
              </Text>
              .
            </Text>

            <Pressable
              onPress={() => router.replace('/auth/sign-in')}
              className="mb-8 mt-6 py-2"
              disabled={isLoading}
            >
              <Text className="text-center text-sm text-white/50">
                Already have an account?{' '}
                <Text className="font-bold text-accent-purple">Sign In</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

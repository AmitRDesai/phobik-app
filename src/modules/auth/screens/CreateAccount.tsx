import { GradientButton } from '@/components/ui/GradientButton';
import { TextInput } from '@/components/ui/TextInput';
import { colors } from '@/constants/colors';
import { rpcClient } from '@/lib/rpc';
import {
  selectedAgeAtom,
  selectedGenderAtom,
  selectedGoalsAtom,
  termsAcceptedAtom,
  privacyAcceptedAtom,
} from '@/modules/onboarding/store/onboarding';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useRef, useState } from 'react';
import { dialog } from '@/utils/dialog';
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
import { useSignUp } from '../hooks/useAuth';

export default function CreateAccountScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);

  const signUpMutation = useSignUp();

  const ageRange = useAtomValue(selectedAgeAtom);
  const genderIdentity = useAtomValue(selectedGenderAtom);
  const goals = useAtomValue(selectedGoalsAtom);
  const termsAccepted = useAtomValue(termsAcceptedAtom);
  const privacyAccepted = useAtomValue(privacyAcceptedAtom);

  const setAge = useSetAtom(selectedAgeAtom);
  const setGender = useSetAtom(selectedGenderAtom);
  const setGoals = useSetAtom(selectedGoalsAtom);
  const setTerms = useSetAtom(termsAcceptedAtom);
  const setPrivacy = useSetAtom(privacyAcceptedAtom);

  const isValid = name.trim() && email.trim() && password.trim();
  const isLoading = signUpMutation.isPending;

  const handleCreateAccount = async () => {
    try {
      await signUpMutation.mutateAsync({ name, email, password });

      // Save onboarding data to backend
      try {
        await rpcClient.onboarding.saveProfile({
          ageRange,
          genderIdentity,
          goals,
          termsAccepted,
          privacyAccepted,
        });
      } catch {
        // Non-critical: profile save failed, continue with account creation
        console.warn('Failed to save onboarding profile to backend');
      }

      // Clear local onboarding answer atoms (keep onboardingCompleted for routing)
      setAge(RESET);
      setGender(RESET);
      setGoals(RESET);
      setTerms(RESET);
      setPrivacy(RESET);

      const result = await dialog.info({
        title: 'Account Created',
        message: 'Please check your email to verify your account.',
      });
      if (result !== undefined) {
        router.replace('/auth/sign-in');
      }
    } catch (error) {
      console.log(error);
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
                onChangeText={setName}
                icon="person"
                autoCapitalize="words"
                labelUppercase={false}
                labelColor={colors.gray[300]}
                editable={!isLoading}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />
              <TextInput
                ref={emailRef}
                label="Email Address"
                placeholder="your@email.com"
                value={email}
                onChangeText={setEmail}
                icon="at"
                keyboardType="email-address"
                autoCapitalize="none"
                labelUppercase={false}
                labelColor={colors.gray[300]}
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
                labelColor={colors.gray[300]}
                editable={!isLoading}
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (isValid) handleCreateAccount();
                }}
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

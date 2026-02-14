import { GradientButton } from '@/components/ui/GradientButton';
import { TextInput } from '@/components/ui/TextInput';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtomValue } from 'jotai';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSignIn, useSocialSignIn } from '../hooks/useAuth';
import { onboardingCompletedAtom } from '../../onboarding/store/onboarding';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const passwordRef = useRef<RNTextInput>(null);

  const onboardingCompleted = useAtomValue(onboardingCompletedAtom);
  const signInMutation = useSignIn();
  const socialSignInMutation = useSocialSignIn();

  const isValid = email.trim() && password.trim();
  const isLoading = signInMutation.isPending || socialSignInMutation.isPending;

  const handleSignIn = async () => {
    try {
      await signInMutation.mutateAsync({ email, password });
      router.replace('/');
    } catch (error) {
      Alert.alert(
        'Sign In Failed',
        error instanceof Error ? error.message : 'An error occurred',
      );
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    try {
      await socialSignInMutation.mutateAsync({ provider });
      router.replace('/');
    } catch (error) {
      Alert.alert(
        'Sign In Failed',
        error instanceof Error ? error.message : 'An error occurred',
      );
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
          contentContainerClassName="grow justify-center"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {/* Avatar / Aura Section */}
          <View
            className={`relative items-center pb-8 ${Platform.OS === 'android' ? 'pt-10' : 'pt-16'}`}
          >
            {/* Pink glow behind avatar */}
            <View
              className="absolute top-[30px] h-[280px] w-[280px] rounded-[140px] bg-primary-pink opacity-[0.08]"
              style={{
                shadowColor: colors.primary.pink,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.15,
                shadowRadius: 60,
              }}
            />
            {/* Yellow inner glow */}
            <View
              className="absolute top-[70px] h-[200px] w-[200px] rounded-full bg-accent-yellow opacity-[0.04]"
              style={{
                shadowColor: colors.accent.yellow,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.08,
                shadowRadius: 40,
              }}
            />

            {/* Decorative dots */}
            <View className="absolute right-[60px] top-[60px] h-2 w-2 rounded-full bg-accent-yellow" />
            <View className="absolute bottom-[40px] left-[60px] h-1.5 w-1.5 rounded-[3px] bg-primary-pink" />

            {/* Avatar circle */}
            <View className="h-[180px] w-[180px] items-center justify-center rounded-[90px] border-2 border-white/10 bg-white/10">
              <Ionicons name="person" size={72} color="rgba(255,255,255,0.3)" />
            </View>
          </View>

          {/* Welcome Text */}
          <View className="items-center px-4">
            <Text className="text-3xl font-bold text-white">Welcome Back</Text>
            <Text className="mt-2 text-lg text-primary-muted/80">
              We missed your energy today.
            </Text>
          </View>

          {/* Form Section */}
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

            <Pressable className="mt-3 self-end" disabled={isLoading}>
              <Text className="text-sm text-primary-muted/80">
                Forgot Password?
              </Text>
            </Pressable>

            <View className="mt-6">
              <GradientButton
                onPress={handleSignIn}
                disabled={!isValid || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  'Sign In'
                )}
              </GradientButton>
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
                  onPress={() => handleSocialSignIn('google')}
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
                    onPress={() => handleSocialSignIn('apple')}
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

            <Pressable
              onPress={() =>
                router.replace(
                  onboardingCompleted ? '/auth/create-account' : '/onboarding',
                )
              }
              className="mb-8 mt-6 py-2"
              disabled={isLoading}
            >
              <Text className="text-center text-sm text-primary-muted/60">
                Don&apos;t have an account?{' '}
                <Text className="font-bold text-primary-pink">Sign Up</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

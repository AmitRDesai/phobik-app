import { GradientButton } from '@/components/ui/GradientButton';
import { TextInput } from '@/components/ui/TextInput';
import { colors } from '@/constants/colors';
import { authClient } from '@/lib/auth';
import { dialog } from '@/utils/dialog';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResetPasswordScreen() {
  const { token, error: urlError } = useLocalSearchParams<{
    token?: string;
    error?: string;
  }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const confirmRef = useRef<RNTextInput>(null);

  const isValid =
    password.trim().length >= 8 && password === confirmPassword && !!token;
  const hasTokenError = urlError === 'INVALID_TOKEN' || !token;

  const handleSubmit = async () => {
    if (!isValid || isLoading || !token) return;

    if (password !== confirmPassword) {
      dialog.error({
        title: "Passwords Don't Match",
        message: 'Please make sure both passwords are the same.',
      });
      return;
    }

    setIsLoading(true);
    const result = await authClient
      .resetPassword({
        newPassword: password,
        token,
      })
      .catch(() => ({
        error: { message: 'Something went wrong. Please try again.' },
      }));
    setIsLoading(false);
    if (result.error) {
      dialog.error({
        title: 'Reset Failed',
        message:
          result.error.message || 'Something went wrong. Please try again.',
      });
    } else {
      await dialog.info({
        title: 'Password Reset',
        message: 'Your password has been reset successfully. Please sign in.',
      });
      router.replace('/auth/sign-in');
    }
  };

  if (hasTokenError) {
    return (
      <SafeAreaView edges={['bottom']} className="flex-1 bg-background-dark">
        <View className="flex-1 items-center justify-center px-8">
          <View className="mb-8 h-28 w-28 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
            <Ionicons name="alert-circle" size={48} color="#ef4444" />
          </View>

          <Text className="text-3xl font-bold text-white">Invalid Link</Text>
          <Text className="mt-3 text-center text-base leading-6 text-white/50">
            This password reset link is invalid or has expired. Please request a
            new one.
          </Text>

          <Pressable
            onPress={() => router.replace('/auth/forgot-password')}
            className="mt-8 py-2"
          >
            <Text className="text-sm font-semibold text-primary-pink">
              Request New Link
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace('/auth/sign-in')}
            className="mt-4 py-2"
          >
            <Text className="text-sm text-primary-muted/60">
              Back to Sign In
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background-dark">
      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow justify-center"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {/* Title */}
          <View className="items-center px-4 pb-8">
            <Text className="text-3xl font-bold text-white">New Password</Text>
            <Text className="mt-3 text-center text-base leading-6 text-white/50">
              Enter your new password below.
            </Text>
          </View>

          {/* Form */}
          <View className="px-8">
            <View className="gap-5">
              <TextInput
                label="New Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                icon="lock-closed"
                secureTextEntry
                labelUppercase={false}
                labelColor={`${colors.primary.muted}B3`}
                iconColor={`${colors.primary.muted}80`}
                editable={!isLoading}
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
              />
              <TextInput
                ref={confirmRef}
                label="Confirm Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                icon="lock-closed"
                secureTextEntry
                labelUppercase={false}
                labelColor={`${colors.primary.muted}B3`}
                iconColor={`${colors.primary.muted}80`}
                editable={!isLoading}
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (isValid) handleSubmit();
                }}
              />
            </View>

            {password.length > 0 && password.length < 8 && (
              <Text className="mt-2 text-xs text-red-400">
                Password must be at least 8 characters
              </Text>
            )}

            {confirmPassword.length > 0 && password !== confirmPassword && (
              <Text className="mt-2 text-xs text-red-400">
                Passwords don't match
              </Text>
            )}

            <View className="mt-8">
              <GradientButton
                onPress={handleSubmit}
                disabled={!isValid}
                loading={isLoading}
              >
                Reset Password
              </GradientButton>
            </View>

            <Pressable
              onPress={() => router.replace('/auth/sign-in')}
              className="mt-6 py-2"
              disabled={isLoading}
            >
              <Text className="text-center text-sm text-primary-muted/60">
                Remember your password?{' '}
                <Text className="font-bold text-primary-pink">Sign In</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

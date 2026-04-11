import { GradientButton } from '@/components/ui/GradientButton';
import { TextInput } from '@/components/ui/TextInput';
import { colors, withAlpha } from '@/constants/colors';
import { authClient } from '@/lib/auth';
import { dialog } from '@/utils/dialog';
import { env } from '@/utils/env';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const isValid = email.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid || isLoading) return;
    setIsLoading(true);
    const result = await authClient
      .requestPasswordReset({
        email: email.trim(),
        redirectTo: `${env.get('APP_SCHEME')}://auth/reset-password`,
      })
      .catch(() => ({
        error: { message: 'Something went wrong. Please try again.' },
      }));
    setIsLoading(false);
    if (result.error) {
      dialog.error({
        title: 'Request Failed',
        message:
          result.error.message || 'Something went wrong. Please try again.',
      });
    } else {
      setIsSent(true);
    }
  };

  if (isSent) {
    return (
      <SafeAreaView edges={['bottom']} className="flex-1 bg-background-dark">
        <View className="flex-1 items-center justify-center px-8">
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

          <Text className="text-3xl font-bold text-white">
            Check Your Email
          </Text>
          <Text className="mt-3 text-center text-base leading-6 text-white/50">
            We sent a password reset link to
          </Text>
          <Text className="mt-1 text-center text-base font-semibold text-primary-pink">
            {email}
          </Text>

          <Text className="mt-10 text-center text-xs leading-5 text-white/30">
            Click the link in the email to reset your password.{'\n'}If you
            don&apos;t see it, check your spam folder.
          </Text>

          <Pressable onPress={() => router.back()} className="mt-8 py-2">
            <Text className="text-sm font-semibold text-primary-pink">
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
          {/* Back button */}
          <View className="absolute left-4 top-4 z-10">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={colors.primary.muted}
              />
            </Pressable>
          </View>

          {/* Icon */}
          <View className="items-center pb-8">
            <View
              className="h-28 w-28 items-center justify-center rounded-full border border-primary-pink/30 bg-primary-pink/10"
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
              <Ionicons
                name="lock-open"
                size={48}
                color={colors.primary.pink}
              />
            </View>
          </View>

          {/* Title */}
          <View className="items-center px-4">
            <Text className="text-3xl font-bold text-white">
              Forgot Password?
            </Text>
            <Text className="mt-3 text-center text-base leading-6 text-white/50">
              Enter your email and we&apos;ll send you a link to reset your
              password.
            </Text>
          </View>

          {/* Form */}
          <View className="px-8 pt-8">
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
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            <View className="mt-8">
              <GradientButton
                onPress={handleSubmit}
                disabled={!isValid}
                loading={isLoading}
              >
                Send Reset Link
              </GradientButton>
            </View>

            <Pressable
              onPress={() => router.back()}
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

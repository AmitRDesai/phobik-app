import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { TextInput } from '@/components/ui/TextInput';
import { colors, withAlpha } from '@/constants/colors';
import { authClient } from '@/lib/auth';
import { dialog } from '@/utils/dialog';
import { env } from '@/utils/env';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable } from 'react-native';

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
      <Screen
        variant="auth"
        className="flex-1 items-center justify-center px-8"
      >
        <View className="w-full items-center">
          {/* Icon */}
          <View
            className="mb-8 h-28 w-28 items-center justify-center rounded-full border border-primary-pink/30 bg-primary-pink/10"
            style={{
              boxShadow: `0px 0px 12px ${withAlpha(colors.primary.pink, 0.2)}`,
            }}
          >
            <Ionicons name="mail-open" size={48} color={colors.primary.pink} />
          </View>

          <Text variant="h1" className="font-bold">
            Check Your Email
          </Text>
          <Text variant="md" muted className="mt-3 text-center leading-relaxed">
            We sent a password reset link to
          </Text>
          <Text
            variant="md"
            className="mt-1 text-center font-semibold text-primary-pink"
          >
            {email}
          </Text>

          <Text
            variant="sm"
            muted
            className="mt-10 text-center leading-relaxed"
          >
            Click the link in the email to reset your password.{'\n'}If you
            don&apos;t see it, check your spam folder.
          </Text>

          <Button
            variant="ghost"
            size="compact"
            onPress={() => router.back()}
            className="mt-6"
          >
            Back to Sign In
          </Button>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      variant="auth"
      scroll
      keyboard
      header={<Header variant="back" />}
      className="grow justify-center"
      scrollViewProps={{ keyboardDismissMode: 'interactive' }}
    >
      <View className="items-center pb-8">
        <View
          className="h-28 w-28 items-center justify-center rounded-full border border-primary-pink/30 bg-primary-pink/10"
          style={{
            boxShadow: `0px 0px 12px ${withAlpha(colors.primary.pink, 0.2)}`,
          }}
        >
          <Ionicons name="lock-open" size={48} color={colors.primary.pink} />
        </View>
      </View>

      <View className="items-center px-4">
        <Text variant="h1" className="font-bold">
          Forgot Password?
        </Text>
        <Text variant="md" muted className="mt-3 text-center leading-relaxed">
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
      </View>

      <Pressable
        onPress={() => router.back()}
        className="mt-6 py-2"
        disabled={isLoading}
      >
        <Text variant="sm" className="text-center text-foreground/55">
          Remember your password?{' '}
          <Text variant="sm" className="font-bold text-primary-pink">
            Sign In
          </Text>
        </Text>
      </Pressable>
    </Screen>
  );
}

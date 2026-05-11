import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { authClient } from '@/lib/auth';
import { dialog } from '@/utils/dialog';
import { env } from '@/utils/env';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Pressable } from 'react-native';

export default function ForgotPasswordScreen() {
  const scheme = useScheme();
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

          <Text size="h1">Check Your Email</Text>
          <Text
            size="md"
            tone="secondary"
            align="center"
            className="mt-3 leading-relaxed"
          >
            We sent a password reset link to
          </Text>
          <Text
            size="md"
            align="center"
            tone="accent"
            weight="semibold"
            className="mt-1"
          >
            {email}
          </Text>

          <Text
            size="sm"
            tone="secondary"
            align="center"
            className="mt-10 leading-relaxed"
          >
            Click the link in the email to reset your password.{'\n'}If you
            don&apos;t see it, check your spam folder.
          </Text>

          <Button
            variant="ghost"
            size="xs"
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
        <Text size="h1">Forgot Password?</Text>
        <Text
          size="md"
          tone="secondary"
          align="center"
          className="mt-3 leading-relaxed"
        >
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </Text>
      </View>

      {/* Form */}
      <View className="px-8 pt-8">
        <TextField
          label="Email Address"
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          type="email"
          icon={
            <Ionicons
              name="mail"
              size={18}
              color={foregroundFor(scheme, 0.55)}
            />
          }
          editable={!isLoading}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        <View className="mt-8">
          <Button
            onPress={handleSubmit}
            disabled={!isValid}
            loading={isLoading}
          >
            Send Reset Link
          </Button>
        </View>
      </View>

      <Pressable
        onPress={() => router.back()}
        className="mt-6 py-2"
        disabled={isLoading}
      >
        <Text size="sm" align="center" tone="secondary">
          Remember your password?{' '}
          <Text size="sm" tone="accent" weight="bold">
            Sign In
          </Text>
        </Text>
      </Pressable>
    </Screen>
  );
}

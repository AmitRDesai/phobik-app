import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { IconChip } from '@/components/ui/IconChip';
import { InlineLink } from '@/components/ui/InlineLink';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { authClient } from '@/lib/auth';
import { dialog } from '@/utils/dialog';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Pressable, TextInput as RNTextInput } from 'react-native';

export default function ResetPasswordScreen() {
  const scheme = useScheme();
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
      <Screen
        variant="auth"
        className="flex-1 items-center justify-center px-8"
      >
        <View className="w-full items-center">
          <IconChip
            size={112}
            shape="circle"
            bg={withAlpha(colors.status.danger, 0.1)}
            border={withAlpha(colors.status.danger, 0.3)}
            className="mb-8"
          >
            <Ionicons
              name="alert-circle"
              size={48}
              color={colors.status.danger}
            />
          </IconChip>

          <Text size="h1">Invalid Link</Text>
          <Text
            size="md"
            tone="secondary"
            align="center"
            className="mt-3 leading-relaxed"
          >
            This password reset link is invalid or has expired. Please request a
            new one.
          </Text>

          <Button
            variant="ghost"
            size="xs"
            onPress={() => router.replace('/auth/forgot-password')}
            className="mt-6"
          >
            Request New Link
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onPress={() => router.replace('/auth/sign-in')}
            className="mt-2"
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
      className="grow justify-center"
      scrollViewProps={{ keyboardDismissMode: 'interactive' }}
    >
      <View className="items-center px-4 pb-8">
        <Text size="h1">New Password</Text>
        <Text
          size="md"
          tone="secondary"
          align="center"
          className="mt-3 leading-relaxed"
        >
          Enter your new password below.
        </Text>
      </View>

      {/* Form */}
      <View className="px-8">
        <View className="gap-5">
          <TextField
            label="New Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            type="password"
            icon={
              <Ionicons
                name="lock-closed"
                size={18}
                color={foregroundFor(scheme, 0.55)}
              />
            }
            editable={!isLoading}
            returnKeyType="next"
            onSubmitEditing={() => confirmRef.current?.focus()}
          />
          <TextField
            ref={confirmRef}
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
              if (isValid) handleSubmit();
            }}
          />
        </View>

        {password.length > 0 && password.length < 8 && (
          <Text size="sm" tone="danger" className="mt-2">
            Password must be at least 8 characters
          </Text>
        )}

        {confirmPassword.length > 0 && password !== confirmPassword && (
          <Text size="sm" tone="danger" className="mt-2">
            Passwords don&apos;t match
          </Text>
        )}

        <View className="mt-8">
          <Button
            onPress={handleSubmit}
            disabled={!isValid}
            loading={isLoading}
          >
            Reset Password
          </Button>
        </View>

        <InlineLink
          prefix="Remember your password?"
          action="Sign In"
          onPress={() => router.replace('/auth/sign-in')}
          disabled={isLoading}
          className="mt-6"
        />
      </View>
    </Screen>
  );
}

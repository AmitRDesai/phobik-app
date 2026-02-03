import { GradientButton } from '@/components/ui/GradientButton';
import { TextInput } from '@/components/ui/TextInput';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isValid = email.trim() && password.trim();

  const handleSignIn = () => {
    console.log('Sign In:', { email, password });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background-dark"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {/* Avatar / Aura Section */}
        <View
          className="items-center pb-8 pt-16"
          style={{ position: 'relative' }}
        >
          {/* Pink glow behind avatar */}
          <View
            style={{
              position: 'absolute',
              width: 280,
              height: 280,
              borderRadius: 140,
              backgroundColor: colors.primary.pink,
              opacity: 0.08,
              top: 30,
              shadowColor: colors.primary.pink,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.15,
              shadowRadius: 60,
            }}
          />
          {/* Yellow inner glow */}
          <View
            style={{
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: colors.accent.yellow,
              opacity: 0.04,
              top: 70,
              shadowColor: colors.accent.yellow,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.08,
              shadowRadius: 40,
            }}
          />

          {/* Decorative dots */}
          <View
            style={{
              position: 'absolute',
              top: 60,
              right: 60,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.accent.yellow,
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 40,
              left: 60,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.primary.pink,
            }}
          />

          {/* Avatar circle */}
          <View
            className="items-center justify-center"
            style={{
              width: 180,
              height: 180,
              borderRadius: 90,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <Ionicons name="person" size={72} color="rgba(255,255,255,0.3)" />
          </View>
        </View>

        {/* Welcome Text */}
        <View className="items-center px-4">
          <Text className="text-3xl font-bold text-white">Welcome Back</Text>
          <Text
            className="mt-2 text-lg"
            style={{ color: 'rgba(203,144,173,0.8)' }}
          >
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
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              variant="pill"
              labelColor="rgba(203,144,173,0.7)"
              iconColor="rgba(203,144,173,0.5)"
            />
            <TextInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              icon="lock-closed-outline"
              secureTextEntry
              variant="pill"
              labelColor="rgba(203,144,173,0.7)"
              iconColor="rgba(203,144,173,0.5)"
            />
          </View>

          <Pressable className="mt-3 self-end">
            <Text
              className="text-sm"
              style={{ color: 'rgba(203,144,173,0.8)' }}
            >
              Forgot Password?
            </Text>
          </Pressable>

          <View className="mt-6">
            <GradientButton onPress={handleSignIn} disabled={!isValid}>
              Sign In
            </GradientButton>
          </View>

          <Pressable
            onPress={() => router.push('/auth/create-account')}
            className="mb-8 mt-6 py-2"
          >
            <Text
              className="text-center text-sm"
              style={{ color: 'rgba(203,144,173,0.6)' }}
            >
              Don&apos;t have an account?{' '}
              <Text
                className="font-bold"
                style={{ color: colors.primary.pink }}
              >
                Sign Up
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

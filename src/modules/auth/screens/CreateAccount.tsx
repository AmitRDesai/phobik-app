import { GradientButton } from '@/components/ui/GradientButton';
import { TextInput } from '@/components/ui/TextInput';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

export default function CreateAccountScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isValid = name.trim() && email.trim() && password.trim();

  const handleCreateAccount = () => {
    console.log('Create Account:', { name, email, password });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background-dark"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {/* Gradient Header */}
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: 60,
            paddingBottom: 40,
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative blur circles */}
          <View
            style={{
              position: 'absolute',
              top: -40,
              right: -40,
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: 'rgba(255,255,255,0.1)',
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: 'rgba(0,0,0,0.1)',
            }}
          />

          {/* Fingerprint icon in frosted glass */}
          <View
            className="mb-4 items-center justify-center rounded-3xl"
            style={{
              width: 80,
              height: 80,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.3)',
            }}
          >
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
          <Text className="text-2xl font-bold text-white">Create Account</Text>
          <Text className="mb-8 mt-2 text-sm text-white/40">
            Join the future of secure health tracking
          </Text>

          <View className="gap-5">
            <TextInput
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              icon="person-outline"
              autoCapitalize="words"
              labelUppercase={false}
            />
            <TextInput
              label="Email Address"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              icon="at-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              labelUppercase={false}
            />
            <TextInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              icon="lock-closed-outline"
              secureTextEntry
              labelUppercase={false}
            />
          </View>

          <View className="mt-8">
            <GradientButton onPress={handleCreateAccount} disabled={!isValid}>
              Create Account
            </GradientButton>
          </View>

          <Text className="mt-4 text-center text-xs leading-5 text-white/40">
            By signing up, you agree to our{' '}
            <Text style={{ color: colors.primary.pink }}>Terms of Service</Text>{' '}
            and{' '}
            <Text style={{ color: colors.primary.pink }}>Privacy Policy</Text>.
          </Text>

          <Pressable
            onPress={() => router.push('/auth/sign-in')}
            className="mb-8 mt-6 py-2"
          >
            <Text className="text-center text-sm text-white/50">
              Already have an account?{' '}
              <Text className="font-bold" style={{ color: '#c3b5fd' }}>
                Sign In
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

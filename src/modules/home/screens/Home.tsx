import { useAtomValue } from 'jotai';
import { Pressable, Text, View } from 'react-native';
import { biometricEnabledAtom } from '@/modules/auth/store/biometric';
import { useSignOut } from '@/modules/auth/hooks/useAuth';

export default function Index() {
  const biometricEnabled = useAtomValue(biometricEnabledAtom);
  const signOutMutation = useSignOut();

  const handleSignOut = () => {
    signOutMutation.mutate({});
  };

  const handleFullSignOut = () => {
    signOutMutation.mutate({ force: true });
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Phobik!
      </Text>
      <Text className="mt-4 text-gray-600">Onboarding completed</Text>
      <Pressable onPress={handleSignOut} className="mt-4">
        <Text className="text-blue-500">Sign Out</Text>
      </Pressable>
      {biometricEnabled && (
        <Pressable onPress={handleFullSignOut} className="mt-2">
          <Text className="text-red-500">Sign Out Completely</Text>
        </Pressable>
      )}
    </View>
  );
}

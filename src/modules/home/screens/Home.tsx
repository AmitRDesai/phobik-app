import { useSignOut } from '@/modules/auth/hooks/useAuth';
import { biometricEnabledAtom } from '@/modules/auth/store/biometric';
import { useAtomValue } from 'jotai';
import { Pressable, Text, View } from 'react-native';

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
      <Text className="mt-4 text-gray-600">You&apos;re all set</Text>
      {biometricEnabled && (
        <Pressable onPress={handleSignOut} className="mt-4">
          <Text className="text-blue-500">Lock</Text>
        </Pressable>
      )}
      <Pressable onPress={handleFullSignOut} className="mt-4">
        <Text className="text-red-500">Sign Out</Text>
      </Pressable>
    </View>
  );
}

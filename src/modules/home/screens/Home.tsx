import { useSignOut } from '@/modules/auth/hooks/useAuth';
import { biometricEnabledAtom } from '@/modules/auth/store/biometric';
import { dialog } from '@/utils/dialog';
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

  const handleTestError = async () => {
    const result = await dialog.error({
      title: 'Something went wrong',
      message: 'Please try again later.',
    });
    console.log('Error dialog result:', result);
  };

  const handleTestInfo = async () => {
    const result = await dialog.info({
      title: 'Tip',
      message: 'You can swipe to dismiss cards.',
    });
    console.log('Info dialog result:', result);
  };

  const handleTestLoading = () => {
    const close = dialog.loading({ message: 'Loading data...' });
    setTimeout(close, 3000);
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

      {/* Dialog test buttons */}
      <View className="mt-8 gap-3 px-8">
        <Pressable
          onPress={handleTestError}
          className="rounded-lg bg-red-500/20 px-6 py-3"
        >
          <Text className="text-center font-medium text-red-400">
            Test Error Dialog
          </Text>
        </Pressable>
        <Pressable
          onPress={handleTestInfo}
          className="rounded-lg bg-blue-500/20 px-6 py-3"
        >
          <Text className="text-center font-medium text-blue-400">
            Test Info Dialog
          </Text>
        </Pressable>
        <Pressable
          onPress={handleTestLoading}
          className="rounded-lg bg-yellow-500/20 px-6 py-3"
        >
          <Text className="text-center font-medium text-yellow-400">
            Test Loading Dialog
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

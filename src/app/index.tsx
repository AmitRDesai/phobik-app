import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Phobik!
      </Text>
      <Text className="mt-4 text-gray-600">Onboarding completed</Text>
    </View>
  );
}

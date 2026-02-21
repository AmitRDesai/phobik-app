import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { dialog } from '@/utils/dialog';
import { File as ExpoFile } from 'expo-file-system';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuraFilterToggle } from '../components/AuraFilterToggle';
import { ProfilePictureCircle } from '../components/ProfilePictureCircle';
import { useImagePicker } from '../hooks/useImagePicker';
import { useUploadProfilePicture } from '../hooks/useUploadProfilePicture';
import {
  auraFilterEnabledAtom,
  selectedImageUriAtom,
} from '../store/onboarding';

export default function AuraPictureSetup() {
  const [imageUri, setImageUri] = useAtom(selectedImageUriAtom);
  const [auraEnabled, setAuraEnabled] = useAtom(auraFilterEnabledAtom);
  const { pickFromLibrary, takePhoto } = useImagePicker();
  const uploadMutation = useUploadProfilePicture();

  const handleCameraPress = async () => {
    const result = await dialog.info({
      title: 'Profile Picture',
      message: 'Choose how to add your photo',
      buttons: [
        { label: 'Choose from Library', value: 'library', variant: 'primary' },
        { label: 'Take a Photo', value: 'camera', variant: 'secondary' },
      ],
    });

    let uri: string | null = null;
    if (result === 'library') {
      uri = await pickFromLibrary();
    } else if (result === 'camera') {
      uri = await takePhoto();
    }

    if (uri) setImageUri(uri);
  };

  const handleConfirm = async () => {
    if (!imageUri) {
      await dialog.error({
        title: 'No Photo Selected',
        message: 'Please select or take a profile picture before continuing.',
      });
      return;
    }

    try {
      const file = new ExpoFile(imageUri);
      const base64 = await file.base64();
      await uploadMutation.mutateAsync({ base64, mimeType: file.type });
      router.push('/onboarding/welcome');
    } catch (error) {
      console.error(error);
      await dialog.error({
        title: 'Upload Failed',
        message: 'Something went wrong uploading your photo. Please try again.',
      });
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/welcome');
  };

  return (
    <View className="flex-1">
      <GlowBg centerY={0.4} intensity={1.5} radius={0.3} />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1">
          {/* Header */}
          <View className="px-6 pb-2 pt-4">
            <Text className="text-center text-lg font-bold text-white">
              Profile Setup
            </Text>
          </View>

          {/* Title */}
          <View className="px-8 pt-8">
            <Text className="text-center text-3xl font-bold tracking-tight text-white">
              Your Signature Aura
            </Text>
            <Text className="mt-3 text-center text-base leading-relaxed text-primary-muted">
              Express your energy. Upload a photo to see your PHOBIK aura.
            </Text>
          </View>

          {/* Profile Picture */}
          <View className="mt-8 items-center">
            <ProfilePictureCircle
              imageUri={imageUri}
              auraEnabled={auraEnabled}
              onCameraPress={handleCameraPress}
            />
          </View>

          {/* Aura Toggle */}
          <View className="mt-10 px-6">
            <AuraFilterToggle
              enabled={auraEnabled}
              onToggle={() => setAuraEnabled(!auraEnabled)}
            />
          </View>

          {/* Footer */}
          <View className="mt-auto px-8 pb-10">
            <GradientButton
              onPress={handleConfirm}
              loading={uploadMutation.isPending}
            >
              Looks Great
            </GradientButton>
            <Pressable onPress={handleSkip} className="mt-4 py-3">
              <Text className="text-center text-base font-medium text-primary-muted">
                Maybe Later
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Screen } from '@/components/ui/Screen';
import { useImagePicker } from '@/hooks/useImagePicker';
import { useSession } from '@/lib/auth';
import { dialog } from '@/utils/dialog';
import { File as ExpoFile } from 'expo-file-system';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { AuraFilterToggle } from '../components/AuraFilterToggle';
import { ProfilePictureCircle } from '../components/ProfilePictureCircle';
import { useUploadProfilePicture } from '../hooks/useUploadProfilePicture';
import { auraFilterEnabledAtom } from '../store/onboarding';

export default function AuraPictureSetup() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [auraEnabled, setAuraEnabled] = useAtom(auraFilterEnabledAtom);
  const { pickFromLibrary, takePhoto } = useImagePicker();
  const uploadMutation = useUploadProfilePicture();
  const { data: session } = useSession();

  const hasUploadedImage = !!session?.user?.image;

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
      if (hasUploadedImage) {
        router.push('/onboarding/welcome');
        return;
      }
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
    <Screen
      insetTop={false}
      header={
        <View className="px-6 pb-2 pt-4">
          <Text size="h3" align="center" weight="bold">
            Profile Setup
          </Text>
        </View>
      }
      sticky={
        <View className="w-full items-center">
          <Button
            onPress={handleConfirm}
            loading={uploadMutation.isPending}
            fullWidth
          >
            Looks Great
          </Button>
          <Button
            variant="ghost"
            onPress={handleSkip}
            className="mt-2"
            fullWidth
          >
            Maybe Later
          </Button>
        </View>
      }
      className=""
    >
      <View className="px-8 pt-8">
        <Text size="h1" align="center">
          Your Signature Aura
        </Text>
        <Text size="lg" tone="secondary" align="center" className="mt-3">
          Express your energy. Upload a photo to see your PHOBIK aura.
        </Text>
      </View>

      <View className="mt-8 items-center">
        <ProfilePictureCircle
          imageUri={imageUri ?? session?.user?.image ?? null}
          auraEnabled={auraEnabled}
          onCameraPress={handleCameraPress}
        />
      </View>

      <View className="mt-10 px-6">
        <AuraFilterToggle
          enabled={auraEnabled}
          onToggle={() => setAuraEnabled(!auraEnabled)}
        />
      </View>
    </Screen>
  );
}

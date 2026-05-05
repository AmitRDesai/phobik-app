import { GradientButton } from '@/components/ui/GradientButton';
import { Screen } from '@/components/ui/Screen';
import { useSession } from '@/lib/auth';
import { dialog } from '@/utils/dialog';
import { File as ExpoFile } from 'expo-file-system';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AuraFilterToggle } from '../components/AuraFilterToggle';
import { ProfilePictureCircle } from '../components/ProfilePictureCircle';
import { useImagePicker } from '@/hooks/useImagePicker';
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
      variant="onboarding"
      header={
        <View className="px-6 pb-2 pt-4">
          <Text className="text-center text-lg font-bold text-foreground">
            Profile Setup
          </Text>
        </View>
      }
      sticky={
        <View className="items-center">
          <GradientButton
            onPress={handleConfirm}
            loading={uploadMutation.isPending}
          >
            Looks Great
          </GradientButton>
          <Pressable onPress={handleSkip} className="mt-4 py-3">
            <Text className="text-center text-base font-medium text-foreground/55">
              Maybe Later
            </Text>
          </Pressable>
        </View>
      }
      className=""
    >
      <View className="px-8 pt-8">
        <Text className="text-center text-3xl font-bold tracking-tight text-foreground">
          Your Signature Aura
        </Text>
        <Text className="mt-3 text-center text-base leading-relaxed text-foreground/55">
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

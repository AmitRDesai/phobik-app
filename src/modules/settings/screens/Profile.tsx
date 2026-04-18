import { BackButton } from '@/components/ui/BackButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { TextInput } from '@/components/ui/TextInput';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useImagePicker } from '@/hooks/useImagePicker';
import { authClient } from '@/lib/auth';
import { useSession } from '@/modules/auth/hooks/useAuth';
import { useUploadProfilePicture } from '@/modules/onboarding/hooks/useUploadProfilePicture';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { File as ExpoFile } from 'expo-file-system';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { pickFromLibrary, takePhoto } = useImagePicker();
  const uploadMutation = useUploadProfilePicture();

  // Sync name from session when it arrives (adjusting state during render)
  const [prevSessionName, setPrevSessionName] = useState<string | undefined>(
    undefined,
  );
  const sessionName = session?.user?.name;
  if (sessionName && sessionName !== prevSessionName) {
    setPrevSessionName(sessionName);
    setName(sessionName);
  }

  const handleChangePhoto = async () => {
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

    if (uri) {
      setImageUri(uri);
      try {
        const file = new ExpoFile(uri);
        const base64 = await file.base64();
        await uploadMutation.mutateAsync({ base64, mimeType: file.type });
      } catch {
        dialog.error({
          title: 'Upload Failed',
          message:
            'Something went wrong uploading your photo. Please try again.',
        });
        setImageUri(null);
      }
    }
  };

  const updateProfile = useMutation({
    mutationFn: async () => {
      const result = await authClient.updateUser({ name });
      if (result.error) {
        throw new Error(result.error.message || 'Failed to update profile');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      dialog.info({
        title: 'Saved',
        message: 'Your profile has been updated.',
      });
    },
    onError: (error: Error) => {
      dialog.error({ title: 'Error', message: error.message });
    },
  });

  const hasChanges = name.trim() !== (session?.user?.name ?? '');

  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-dashboard"
        centerY={0.15}
        intensity={0.5}
      />

      {/* Header */}
      <View
        className="flex-row items-center gap-3 px-4 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <BackButton />
        <Text className="text-lg font-bold text-white">Edit Profile</Text>
      </View>

      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <ScrollView contentContainerClassName="gap-6 px-4 py-4 pb-8">
          {/* Avatar */}
          <Pressable onPress={handleChangePhoto} className="items-center py-4">
            <View className="relative">
              {imageUri ? (
                <View className="h-24 w-24 overflow-hidden rounded-full border-2 border-primary-pink/40 bg-white/10">
                  <Image source={{ uri: imageUri }} className="h-full w-full" />
                </View>
              ) : (
                <UserAvatar
                  className="h-24 w-24 border-2 border-primary-pink/40 bg-white/10"
                  iconSize={40}
                />
              )}
              <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-background-dark bg-primary-pink">
                <MaterialIcons name="camera-alt" size={16} color="white" />
              </View>
            </View>
            {uploadMutation.isPending && (
              <Text className="mt-2 text-xs text-white/50">Uploading...</Text>
            )}
            <Text className="mt-2 text-sm font-medium text-primary-pink">
              Change Photo
            </Text>
          </Pressable>

          {/* Form */}
          <View className="gap-4">
            <TextInput
              label="Name"
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              icon="person-outline"
              autoCapitalize="words"
              labelUppercase={false}
            />
          </View>

          {/* Save */}
          <View className="mt-4">
            <GradientButton
              onPress={() => updateProfile.mutate()}
              disabled={!hasChanges || !name.trim()}
              loading={updateProfile.isPending}
            >
              Save Changes
            </GradientButton>
          </View>

          <View className="h-4" />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

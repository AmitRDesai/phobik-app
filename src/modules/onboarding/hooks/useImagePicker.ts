import { dialog } from '@/utils/dialog';
import * as ImagePicker from 'expo-image-picker';

const IMAGE_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

export function useImagePicker() {
  const pickFromLibrary = async (): Promise<string | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      await dialog.error({
        title: 'Permission Required',
        message:
          'Please allow access to your photo library in Settings to select a profile picture.',
      });
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync(IMAGE_OPTIONS);
    if (result.canceled) return null;
    return result.assets[0]?.uri ?? null;
  };

  const takePhoto = async (): Promise<string | null> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      await dialog.error({
        title: 'Permission Required',
        message:
          'Please allow camera access in Settings to take a profile picture.',
      });
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      ...IMAGE_OPTIONS,
      cameraType: ImagePicker.CameraType.front,
    });
    if (result.canceled) return null;
    return result.assets[0]?.uri ?? null;
  };

  return { pickFromLibrary, takePhoto };
}

import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

interface UseSaveOnLeaveOptions {
  save: () => void;
  canSave: boolean;
}

export function useSaveOnLeave({ save, canSave }: UseSaveOnLeaveOptions) {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (canSave) {
        save();
      }
    });
    return unsubscribe;
  }, [canSave, save, navigation]);
}

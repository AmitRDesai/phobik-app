import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';
import { AuraFilterOverlay } from './AuraFilterOverlay';

interface ProfilePictureCircleProps {
  imageUri: string | null;
  auraEnabled: boolean;
  onCameraPress: () => void;
}

export function ProfilePictureCircle({
  imageUri,
  auraEnabled,
  onCameraPress,
}: ProfilePictureCircleProps) {
  return (
    <View
      className="relative items-center justify-center"
      style={
        auraEnabled
          ? {
              shadowColor: colors.primary.pink,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.4,
              shadowRadius: 60,
              elevation: 20,
            }
          : undefined
      }
    >
      <View className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-primary-pink/20">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center bg-background-charcoal">
            <Ionicons name="person" size={80} color="rgba(255,255,255,0.15)" />
          </View>
        )}
        {auraEnabled && imageUri && <AuraFilterOverlay />}
      </View>

      {/* Camera FAB */}
      <Pressable
        onPress={onCameraPress}
        className="absolute bottom-2 right-2 items-center justify-center rounded-full border-4 border-background-dark bg-primary-pink p-3"
        style={{
          shadowColor: colors.primary.pink,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="camera" size={20} color="white" />
      </Pressable>
    </View>
  );
}

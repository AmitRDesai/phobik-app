import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
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
  const scheme = useScheme();
  const fallbackIconColor = foregroundFor(scheme, { dark: 0.15, light: 0.18 });

  return (
    <View
      className="relative items-center justify-center"
      style={
        auraEnabled
          ? {
              boxShadow: `0 0 60px ${withAlpha(colors.primary.pink, 0.4)}`,
            }
          : undefined
      }
    >
      <View className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-primary-pink/20">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: '100%', height: '100%', borderRadius: 9999 }}
            contentFit="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center rounded-full bg-foreground/10">
            <Ionicons name="person" size={80} color={fallbackIconColor} />
          </View>
        )}
        {auraEnabled && imageUri && <AuraFilterOverlay />}
      </View>

      {/* Camera FAB */}
      <Pressable
        onPress={onCameraPress}
        className="absolute bottom-2 right-2 items-center justify-center rounded-full border-4 border-surface bg-primary-pink p-3"
        style={{
          boxShadow: `0 4px 8px ${withAlpha(colors.primary.pink, 0.4)}`,
        }}
      >
        <Ionicons name="camera" size={20} color="white" />
      </Pressable>
    </View>
  );
}

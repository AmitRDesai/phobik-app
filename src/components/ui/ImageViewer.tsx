import { Text } from '@/components/themed/Text';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImageViewerProps {
  images: string[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
}

export function ImageViewer({
  images,
  initialIndex,
  visible,
  onClose,
}: ImageViewerProps) {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        {/* Close button */}
        <Pressable
          onPress={onClose}
          className="absolute z-10 h-10 w-10 items-center justify-center rounded-full bg-white/10"
          style={{ top: insets.top + 8, right: 16 }}
        >
          <MaterialIcons name="close" size={24} color="white" />
        </Pressable>

        {/* Image counter */}
        {images.length > 1 && (
          <View
            className="absolute z-10 items-center self-center rounded-full bg-white/10 px-3 py-1"
            style={{ top: insets.top + 12 }}
          >
            <Text tone="inverse" weight="semibold" size="xs">
              {activeIndex + 1} / {images.length}
            </Text>
          </View>
        )}

        {/* Swipeable images */}
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
            );
            setActiveIndex(index);
          }}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ item }) => (
            <View
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
              className="items-center justify-center"
            >
              <Image
                source={{ uri: item }}
                style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.7 }}
                resizeMode="contain"
              />
            </View>
          )}
        />
      </View>
    </Modal>
  );
}

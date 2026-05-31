import { Text } from '@/components/themed/Text';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ImageViewerProps {
  images: string[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
}

function ImageItem({
  item,
  width,
  height,
}: {
  item: string;
  width: number;
  height: number;
}) {
  return (
    <View style={{ width, height }} className="items-center justify-center">
      <Image
        source={{ uri: item }}
        style={{ width, height: height * 0.7 }}
        resizeMode="contain"
      />
    </View>
  );
}

export function ImageViewer({
  images,
  initialIndex,
  visible,
  onClose,
}: ImageViewerProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-950">
        {/* Close button */}
        <Pressable
          onPress={onClose}
          className="absolute z-10 size-10 items-center justify-center rounded-full bg-white/10"
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
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / screenWidth,
            );
            setActiveIndex(index);
          }}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ item }) => (
            <ImageItem item={item} width={screenWidth} height={screenHeight} />
          )}
        />
      </View>
    </Modal>
  );
}

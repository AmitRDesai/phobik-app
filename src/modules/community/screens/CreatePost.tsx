import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { ChipSelect } from '@/components/ui/ChipSelect';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors, foregroundFor } from '@/constants/colors';
import { useImagePicker } from '@/hooks/useImagePicker';
import { useScheme } from '@/hooks/useTheme';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { File as ExpoFile } from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Image, Pressable, ScrollView } from 'react-native';
import { Switch } from '@/components/ui/Switch';
import { TextArea } from '@/components/ui/TextArea';
import { useCreatePost } from '../hooks/useCommunityFeed';

type Circle = '18-24' | '25-34' | '35-44' | '45-54' | '55+';
const CIRCLES: Circle[] = ['18-24', '25-34', '35-44', '45-54', '55+'];
const MAX_CHARS = 500;

export default function CreatePost() {
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  const router = useRouter();
  const createPost = useCreatePost();
  const { pickMultiple } = useImagePicker();
  const { prefill } = useLocalSearchParams<{ prefill?: string }>();

  const [content, setContent] = useState(prefill ?? '');
  const [circle, setCircle] = useState<Circle | undefined>();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imageUris, setImageUris] = useState<string[]>([]);

  const handleAddImages = async () => {
    const remaining = 5 - imageUris.length;
    if (remaining <= 0) return;
    const uris = await pickMultiple(remaining);
    if (uris.length > 0) {
      setImageUris((prev) => [...prev, ...uris].slice(0, 5));
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUris((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!content.trim()) return;

    try {
      let images: { base64: string; mimeType: string }[] | undefined;

      if (imageUris.length > 0) {
        images = await Promise.all(
          imageUris.map(async (uri) => {
            const file = new ExpoFile(uri);
            return { base64: await file.base64(), mimeType: file.type };
          }),
        );
      }

      await createPost.mutateAsync({
        content: content.trim(),
        circle,
        isAnonymous,
        images,
      });

      router.back();
    } catch {
      await dialog.error({
        title: 'Post Failed',
        message: 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <Screen
      keyboard
      scroll
      header={<Header variant="close" title="Share Your Moment" />}
      sticky={
        <View className="px-6 pb-4">
          <Button
            onPress={handlePost}
            loading={createPost.isPending}
            disabled={!content.trim()}
            icon={<MaterialIcons name="send" size={20} color="white" />}
          >
            Post to Wall
          </Button>
        </View>
      }
      className="px-6 py-4"
      contentClassName="gap-6"
    >
      {/* Heading */}
      <View className="gap-1">
        <Text size="h2">What&apos;s going on for you today?</Text>
        <Text size="sm" tone="secondary" className="leading-relaxed">
          Share with awareness, not self-judgment. Your experience is valid.
        </Text>
      </View>

      {/* Text Input */}
      <TextArea
        value={content}
        onChangeText={setContent}
        placeholder="Start writing here..."
        rows="lg"
        maxLength={MAX_CHARS}
      />

      {/* Image Attachments */}
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text size="sm" weight="bold" className="px-1">
            Photos
          </Text>
          {imageUris.length < 5 && (
            <Button
              variant="ghost"
              size="xs"
              onPress={handleAddImages}
              prefixIcon={
                <MaterialIcons
                  name="add-photo-alternate"
                  size={18}
                  color={colors.primary.pink}
                />
              }
            >
              Add
            </Button>
          )}
        </View>
        {imageUris.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-6"
            contentContainerClassName="gap-3 px-6 pt-2 pr-8"
          >
            {imageUris.map((uri, index) => (
              <View key={uri} className="relative mr-1">
                <View className="size-24 overflow-hidden rounded-2xl">
                  <Image
                    source={{ uri }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                </View>
                <Pressable
                  onPress={() => handleRemoveImage(index)}
                  className="absolute -right-2 -top-2 z-10 size-6 items-center justify-center rounded-full bg-red-500"
                >
                  <MaterialIcons name="close" size={14} color="white" />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Your Circle */}
      <View className="gap-3">
        <Text size="sm" weight="bold" className="px-1">
          Your Circle
        </Text>
        <ChipSelect
          options={CIRCLES.map((c) => ({ label: c, value: c }))}
          value={circle ? [circle] : []}
          onChange={(next) => setCircle(next[0] as Circle | undefined)}
          multi={false}
        />
      </View>

      {/* Post Anonymously */}
      <Card className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-3">
          <IconChip size="md" shape="circle" tone="pink">
            <MaterialIcons
              name="shield"
              size={20}
              color={colors.primary.pink}
            />
          </IconChip>
          <View>
            <Text size="sm" weight="bold">
              Post Anonymously
            </Text>
            <Text size="xs" tone="secondary">
              Your identity will be hidden from the wall
            </Text>
          </View>
        </View>
        <Switch value={isAnonymous} onValueChange={setIsAnonymous} />
      </Card>

      {/* Guidance */}
      <View className="flex-row items-start gap-3 px-2">
        <MaterialIcons
          name="auto-awesome"
          size={18}
          color={yellow}
          style={{ marginTop: 2 }}
        />
        <Text size="xs" tone="secondary" className="flex-1 leading-normal">
          Your words are a reflection of your journey. Take a deep breath before
          hitting post.
        </Text>
      </View>
    </Screen>
  );
}

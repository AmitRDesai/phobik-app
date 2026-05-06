import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GradientButton } from '@/components/ui/GradientButton';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { alpha, colors } from '@/constants/colors';
import { useImagePicker } from '@/hooks/useImagePicker';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { File as ExpoFile } from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useCreatePost } from '../hooks/useCommunityFeed';

type Circle = '18-24' | '25-34' | '35-44' | '45-54' | '55+';
const CIRCLES: Circle[] = ['18-24', '25-34', '35-44', '45-54', '55+'];
const MAX_CHARS = 500;

export default function CreatePost() {
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
    <Container
      keyboardAvoiding
      safeAreaClass="bg-surface"
      className="bg-surface"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pb-2 pt-1">
        <BackButton icon="close" />
        <Text className="text-lg font-bold tracking-tight text-foreground">
          Share Your Moment
        </Text>
        <View className="w-12" />
      </View>

      <ScrollFade fadeColor={colors.background.dashboard}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 py-4 gap-6"
          contentContainerStyle={{ paddingBottom: FADE_HEIGHT }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Heading */}
          <View className="gap-1">
            <Text className="text-2xl font-bold tracking-tight text-foreground">
              What&apos;s going on for you today?
            </Text>
            <Text className="text-sm leading-relaxed text-foreground/60">
              Share with awareness, not self-judgment. Your experience is valid.
            </Text>
          </View>

          {/* Text Input */}
          <View>
            <TextInput
              value={content}
              onChangeText={(text) =>
                setContent(
                  text.length <= MAX_CHARS ? text : text.slice(0, MAX_CHARS),
                )
              }
              placeholder="Start writing here..."
              placeholderTextColor={alpha.white20}
              multiline
              textAlignVertical="top"
              className="h-64 rounded-2xl border-2 border-foreground/10 bg-foreground/5 p-5 text-lg leading-relaxed text-foreground"
            />
            <Text className="mt-2 text-right text-xs text-foreground/60">
              {content.length} / {MAX_CHARS}
            </Text>
          </View>

          {/* Image Attachments */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="px-1 text-sm font-bold text-foreground">
                Photos
              </Text>
              {imageUris.length < 5 && (
                <Pressable
                  onPress={handleAddImages}
                  className="flex-row items-center gap-1 rounded-full bg-foreground/5 px-3 py-1.5"
                >
                  <MaterialIcons
                    name="add-photo-alternate"
                    size={18}
                    color={colors.primary.pink}
                  />
                  <Text className="text-xs font-medium text-primary-pink">
                    Add
                  </Text>
                </Pressable>
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
                    <View className="h-24 w-24 overflow-hidden rounded-2xl">
                      <Image
                        source={{ uri }}
                        className="h-full w-full"
                        resizeMode="cover"
                      />
                    </View>
                    <Pressable
                      onPress={() => handleRemoveImage(index)}
                      className="absolute -right-2 -top-2 z-10 h-6 w-6 items-center justify-center rounded-full bg-red-500"
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
            <Text className="px-1 text-sm font-bold text-foreground">
              Your Circle
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-6"
              contentContainerClassName="gap-3 px-6"
            >
              {CIRCLES.map((c) => {
                const isActive = circle === c;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setCircle(isActive ? undefined : c)}
                    className={`rounded-full px-4 py-2 ${
                      isActive
                        ? 'border border-primary-pink bg-primary-pink/10'
                        : 'border border-foreground/10 bg-foreground/5'
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${isActive ? 'font-bold text-foreground' : 'text-foreground/60'}`}
                    >
                      {c}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Post Anonymously */}
          <View className="flex-row items-center justify-between rounded-2xl border border-foreground/10 bg-foreground/5 p-4 gap-2">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-pink/10">
                <MaterialIcons
                  name="shield"
                  size={20}
                  color={colors.primary.pink}
                />
              </View>
              <View>
                <Text className="text-sm font-bold text-foreground">
                  Post Anonymously
                </Text>
                <Text className="text-[11px] text-foreground/60">
                  Your identity will be hidden from the wall
                </Text>
              </View>
            </View>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{
                false: alpha.white10,
                true: colors.primary.pink,
              }}
              thumbColor="white"
            />
          </View>

          {/* Guidance */}
          <View className="flex-row items-start gap-3 px-2">
            <MaterialIcons
              name="auto-awesome"
              size={18}
              color={colors.accent.yellow}
              style={{ marginTop: 2 }}
            />
            <Text className="flex-1 text-xs leading-normal text-foreground/60">
              Your words are a reflection of your journey. Take a deep breath
              before hitting post.
            </Text>
          </View>
        </ScrollView>
      </ScrollFade>

      {/* Post Button */}
      <View className="px-6 pb-4">
        <GradientButton
          onPress={handlePost}
          loading={createPost.isPending}
          disabled={!content.trim()}
          icon={<MaterialIcons name="send" size={20} color="white" />}
        >
          Post to Wall
        </GradientButton>
      </View>
    </Container>
  );
}

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ImageViewer } from '@/components/ui/ImageViewer';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { colors } from '@/constants/colors';
import { formatCount } from '@/modules/practices/lib/format';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useToggleReaction } from '../hooks/useCommunityFeed';

const REACTIONS = [
  { emoji: '\u2764\uFE0F', label: 'I see you', type: 'i_see_you' },
  { emoji: '\uD83D\uDCAA', label: "You've got this", type: 'youve_got_this' },
  { emoji: '\uD83E\uDD1D', label: 'Not alone', type: 'not_alone' },
  { emoji: '\uD83C\uDF31', label: 'Keep going', type: 'keep_going' },
  { emoji: '\uD83D\uDD25', label: 'Courage moment', type: 'courage_moment' },
] as const;

interface FeedCardProps {
  id: string;
  content: string;
  images: (string | null)[];
  author: { name: string; image: string | null };
  createdAt: string;
  reactions: Record<string, number>;
  userReactions: string[];
  circle: string | null;
}

function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Date(dateStr).toLocaleDateString();
}

export function FeedCard({
  id,
  content,
  images,
  author,
  createdAt,
  reactions,
  userReactions,
  circle,
}: FeedCardProps) {
  const toggleReaction = useToggleReaction();
  const [viewerIndex, setViewerIndex] = useState(-1);

  const handleReaction = (type: string) => {
    toggleReaction.mutate({ postId: id, type: type as any });
  };

  const validImages = images.filter(Boolean) as string[];

  return (
    <Card variant="elevated" className="bg-surface-elevated/80 p-5">
      {/* Author row */}
      <View className="flex-row items-center gap-3">
        <UserAvatar
          imageUri={author.image}
          className="h-10 w-10 bg-primary-pink/20"
          iconSize={22}
        />
        <View>
          <Text className="text-sm font-bold text-foreground/80">
            {author.name}
          </Text>
          <Text className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">
            {getRelativeTime(createdAt)}
          </Text>
        </View>
      </View>

      {/* Content */}
      <Text className="mt-4 text-lg font-bold leading-tight text-foreground">
        {content}
      </Text>

      {/* Images */}
      {validImages.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-5 mt-4"
          contentContainerClassName="gap-3 px-5"
        >
          {validImages.map((uri, index) => (
            <Pressable
              key={index}
              onPress={() => setViewerIndex(index)}
              className="h-[160px] w-[240px] overflow-hidden rounded-2xl"
            >
              <Image
                source={{ uri }}
                className="h-full w-full"
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Fullscreen image viewer */}
      {validImages.length > 0 && (
        <ImageViewer
          images={validImages}
          initialIndex={Math.max(viewerIndex, 0)}
          visible={viewerIndex >= 0}
          onClose={() => setViewerIndex(-1)}
        />
      )}

      {/* Circle tag */}
      {circle && (
        <View className="mt-3 flex-row">
          <Badge tone="pink" size="sm">
            {circle}
          </Badge>
        </View>
      )}

      {/* Reactions */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-5 mt-4"
        contentContainerClassName="gap-2 px-5"
      >
        {REACTIONS.map((reaction) => {
          const isActive = userReactions.includes(reaction.type);
          const reactionCount = reactions[reaction.type] ?? 0;

          return (
            <Pressable
              key={reaction.type}
              onPress={() => handleReaction(reaction.type)}
              className={`flex-row items-center rounded-full px-4 py-2 ${
                isActive
                  ? 'bg-primary-pink'
                  : 'border border-primary-pink/10 bg-surface-elevated'
              }`}
              style={
                isActive
                  ? {
                      shadowColor: colors.gradient.magenta,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                    }
                  : undefined
              }
            >
              <Text
                className={`text-xs font-bold ${isActive ? 'text-foreground' : 'text-foreground/80'}`}
              >
                {reaction.emoji} {reaction.label}
                {reactionCount > 0 ? ` ${formatCount(reactionCount)}` : ''}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </Card>
  );
}

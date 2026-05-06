import { FloatingAddButton } from '@/components/ui/FloatingAddButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommunityPrinciples } from '../components/CommunityPrinciples';
import { FeedCard } from '../components/FeedCard';
import { FilterChips } from '../components/FilterChips';
import { NetworkBanner } from '@/components/ui/NetworkBanner';
import { SearchBar } from '../components/SearchBar';
import { useCommunityMember } from '../hooks/useCommunity';
import { useCommunityPosts } from '../hooks/useCommunityFeed';
import {
  communityCircleFilterAtom,
  communitySearchAtom,
} from '../store/community';

export default function Community() {
  const { data: memberData, isLoading: isMemberLoading } = useCommunityMember();

  if (isMemberLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator color={colors.primary.pink} size="large" />
      </View>
    );
  }

  if (!memberData?.isMember) {
    return <JoinCommunityView />;
  }

  return <CommunityFeed />;
}

function JoinCommunityView() {
  const insets = useSafeAreaInsets();

  const handleJoin = () => {
    dialog.open({ component: CommunityPrinciples });
  };

  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-surface"
        intensity={0.3}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />
      <View
        className="flex-1 items-center justify-center gap-6 px-8"
        style={{ paddingTop: insets.top }}
      >
        <MaterialIcons name="groups" size={64} color={colors.accent.yellow} />
        <View className="items-center gap-2">
          <Text className="text-2xl font-bold text-foreground">
            Courage Wall
          </Text>
          <Text className="text-center text-sm leading-relaxed text-primary-muted">
            A safe space to share your brave moments, support others, and grow
            together.
          </Text>
        </View>
        <View className="w-full">
          <GradientButton
            onPress={handleJoin}
            icon={
              <MaterialIcons name="arrow-forward" size={20} color="white" />
            }
          >
            Join Community
          </GradientButton>
        </View>
      </View>
    </View>
  );
}

function CommunityFeed() {
  const scheme = useScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useAtom(communitySearchAtom);
  const [circle, setCircle] = useAtom(communityCircleFilterAtom);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [debounceTimer, setDebounceTimer] =
    useState<ReturnType<typeof setTimeout>>();

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearch(text);
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => setDebouncedSearch(text), 300);
      setDebounceTimer(timer);
    },
    [debounceTimer, setSearch],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useCommunityPosts(debouncedSearch, circle);

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  // Manual pull-to-refresh state
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Auto-refresh when tab becomes active
  const isFirstMount = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (isFirstMount.current) {
        isFirstMount.current = false;
        return;
      }
      refetch();
    }, [refetch]),
  );

  const handleEndReached = () => {
    if (!isFetching && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <GlowBg
        bgClassName="bg-surface"
        intensity={0.2}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        centerY={0.1}
      />

      {/* Header */}
      <View className="gap-3 px-4 pb-6" style={{ paddingTop: insets.top + 8 }}>
        <Text className="text-center text-xl font-bold tracking-tight text-foreground">
          Courage Wall
        </Text>

        <SearchBar value={search} onChangeText={handleSearchChange} />
        <FilterChips selected={circle} onSelect={setCircle} />
      </View>

      <NetworkBanner message="You're offline. Posts will load when you reconnect." />

      {/* Feed */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary.pink} size="large" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FeedCard
              id={item.id}
              content={item.content}
              images={item.images}
              author={item.author}
              createdAt={item.createdAt}
              reactions={item.reactions}
              userReactions={item.userReactions}
              circle={item.circle}
            />
          )}
          contentContainerClassName="px-4 pb-24 gap-6"
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary.pink}
            />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="items-center py-4">
                <ActivityIndicator color={colors.primary.pink} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="items-center py-16">
              <MaterialIcons
                name="edit-note"
                size={48}
                color={foregroundFor(scheme, 0.2)}
              />
              <Text className="mt-4 text-sm text-foreground/30">
                No posts yet. Be the first to share!
              </Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <FloatingAddButton onPress={() => router.push('/community/create')} />
    </View>
  );
}

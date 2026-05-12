import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { EmptyState } from '@/components/ui/EmptyState';
import { FloatingAddButton } from '@/components/ui/FloatingAddButton';
import { NetworkBanner } from '@/components/ui/NetworkBanner';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { accentFor, colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { CommunityPrinciples } from '../components/CommunityPrinciples';
import { FeedCard } from '../components/FeedCard';
import { FilterChips } from '../components/FilterChips';
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
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  const handleJoin = () => {
    dialog.open({ component: CommunityPrinciples });
  };

  return (
    <Screen className="flex-1 items-center justify-center gap-6 px-8">
      <MaterialIcons name="groups" size={64} color={yellow} />
      <View className="items-center gap-2">
        <Text size="h2">Courage Wall</Text>
        <Text
          size="sm"
          tone="secondary"
          align="center"
          className="leading-relaxed"
        >
          A safe space to share your brave moments, support others, and grow
          together.
        </Text>
      </View>
      <View className="w-full">
        <Button
          onPress={handleJoin}
          icon={<MaterialIcons name="arrow-forward" size={20} color="white" />}
        >
          Join Community
        </Button>
      </View>
    </Screen>
  );
}

function CommunityFeed() {
  const scheme = useScheme();
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
    <Screen
      header={
        <View className="gap-3 px-4 pb-6 pt-2">
          <Text size="h3" align="center" weight="bold">
            Courage Wall
          </Text>
          <TextField
            value={search}
            onChangeText={handleSearchChange}
            placeholder="Find inspiration…"
            size="compact"
            icon={
              <MaterialIcons
                name="search"
                size={22}
                color={foregroundFor(scheme, 0.5)}
              />
            }
          />
          <FilterChips selected={circle} onSelect={setCircle} />
          <NetworkBanner message="You're offline. Posts will load when you reconnect." />
        </View>
      }
      className="flex-1"
    >
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
            <View className="py-16">
              <EmptyState
                size="sm"
                icon={(color) => (
                  <MaterialIcons name="edit-note" size={28} color={color} />
                )}
                title="No posts yet"
                description="Be the first to share!"
              />
            </View>
          }
        />
      )}

      {/* FAB */}
      <FloatingAddButton onPress={() => router.push('/community/create')} />
    </Screen>
  );
}

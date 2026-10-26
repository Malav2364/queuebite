import { BottomNav, TabKey } from '@/components/bottom-nav';
import { BrandLogo } from '@/components/brand-logo';
import { FloatingQueueWidget } from '@/components/floating-queue-widget';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS, MOCK_TRENDING_RESTAURANTS } from '@/lib/mock-data';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  ClockIcon,
  FlameIcon,
  HeartIcon,
  MapPinIcon,
  SparklesIcon,
  StarIcon,
  TrendingUpIcon,
  UserPlusIcon,
  UsersIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TrendingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set(['trend-1']));

  const trendingList = [...MOCK_TRENDING_RESTAURANTS, ...MOCK_POPULAR_RESTAURANTS];

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <View className="flex-1 bg-[#faf8f5]">
      <StatusBar barStyle="dark-content" />
      <FloatingQueueWidget />

      {/* Header */}
      <View
        className="px-5 pb-3 bg-white border-b border-neutral-100 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="size-9 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ArrowLeftIcon size={18} color="#18181b" />
          </Pressable>
          <View>
            <View className="flex-row items-center gap-1.5">
              <Text className="text-xl font-black text-neutral-900 tracking-tight">
                Trending This Week
              </Text>
              <FlameIcon size={16} color="#dc2626" />
            </View>
            <Text className="text-xs text-neutral-500 font-medium">
              Most queued & top-rated in Vadodara
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90, paddingTop: 14 }}>
        {/* Curated Feed */}
        <View className="px-5 gap-4">
          {trendingList.map((restaurant, index) => {
            const isFav = favorites.has(restaurant.id);

            return (
              <Pressable
                key={restaurant.id}
                onPress={() =>
                  router.push({
                    pathname: '/restaurant/[id]',
                    params: { id: restaurant.id },
                  })
                }
                className="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm active:opacity-95">
                {/* Hero Image */}
                <View className="relative h-44 w-full bg-neutral-900">
                  <Image
                    source={{ uri: restaurant.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Rank Badge */}
                  <View className="absolute top-3 left-3 flex-row items-center gap-1 bg-[#dc2626] px-3 py-1 rounded-full shadow-md">
                    <TrendingUpIcon size={12} color="#ffffff" />
                    <Text className="text-[11px] font-black text-white">
                      #{index + 1} Trending
                    </Text>
                  </View>

                  {/* Favorite Heart */}
                  <Pressable
                    onPress={() => toggleFavorite(restaurant.id)}
                    className="absolute top-3 right-3 size-9 rounded-full bg-white/90 backdrop-blur-md items-center justify-center active:bg-white shadow-md">
                    <HeartIcon
                      size={18}
                      color={isFav ? '#dc2626' : '#18181b'}
                      fill={isFav ? '#dc2626' : 'transparent'}
                    />
                  </Pressable>

                  {/* Live Wait Badge on Image */}
                  <View className="absolute bottom-3 left-3 flex-row items-center gap-1.5 bg-black/75 px-3 py-1.5 rounded-xl border border-white/20">
                    <ClockIcon size={13} color="#22c55e" />
                    <Text className="text-xs font-black text-white">
                      {restaurant.waitRange}
                    </Text>
                    <Text className="text-[10px] text-neutral-300">
                      ({restaurant.groupsAhead ?? restaurant.partiesInQueue} ahead)
                    </Text>
                  </View>
                </View>

                {/* Details Section */}
                <View className="p-4">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-2">
                      <Text className="text-lg font-bold text-neutral-900" numberOfLines={1}>
                        {restaurant.name}
                      </Text>
                      <Text className="text-xs text-neutral-500 mt-0.5" numberOfLines={1}>
                        {restaurant.categories ? restaurant.categories.join(' • ') : restaurant.cuisine}
                      </Text>
                    </View>

                    <View className="flex-row items-center bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
                      <StarIcon size={13} color="#eab308" fill="#eab308" />
                      <Text className="text-xs font-black text-amber-900 ml-1">
                        {restaurant.rating.toFixed(1)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                    <View className="flex-row items-center">
                      <MapPinIcon size={13} color="#dc2626" />
                      <Text className="text-xs text-neutral-600 ml-1">
                        {restaurant.address.split(',')[0]} • {restaurant.distance}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: '/restaurant/join',
                          params: { id: restaurant.id, initialParty: '2' },
                        })
                      }
                      className="bg-[#dc2626] active:bg-[#b91c1c] px-4 py-1.5 rounded-full flex-row items-center gap-1.5 shadow-sm">
                      <UserPlusIcon size={13} color="#ffffff" strokeWidth={2.2} />
                      <Text className="text-xs font-bold text-white">Join Queue</Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav
        activeTab="EXPLORE"
        onTabChange={(tab: TabKey) => {
          if (tab === 'HOME') router.push('/');
          else if (tab === 'SAVED') router.push('/saved');
          else if (tab === 'MY_QUEUE') router.push({ pathname: '/restaurant/live-queue', params: { id: 'pop-1' } });
          else if (tab === 'PROFILE') Alert.alert('Profile', 'Signed in as Malav.');
        }}
        hasActiveQueue={true}
      />
    </View>
  );
}

import { BottomNav, TabKey } from '@/components/bottom-nav';
import { BrandLogo } from '@/components/brand-logo';
import { FloatingQueueWidget } from '@/components/floating-queue-widget';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS, MOCK_RESTAURANTS, MOCK_TRENDING_RESTAURANTS } from '@/lib/mock-data';
import { Restaurant } from '@/types/queuebite';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  BookmarkCheckIcon,
  ClockIcon,
  CompassIcon,
  HeartIcon,
  MapPinIcon,
  SearchIcon,
  StarIcon,
  Trash2Icon,
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

export default function SavedRestaurantsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Initial favorites set
  const [favoriteIds, setFavoriteIds] = React.useState<string[]>([
    'pop-1', // The Daily Bean
    'search-1', // Spice Route
    'trend-1', // Smoke House Deli
    'pop-2', // La Pizzeria
  ]);

  const [selectedFolder, setSelectedFolder] = React.useState<'ALL' | 'CAFES' | 'DINING'>('ALL');

  const allRestaurants = React.useMemo(() => {
    return [...MOCK_POPULAR_RESTAURANTS, ...MOCK_TRENDING_RESTAURANTS, ...MOCK_RESTAURANTS].filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );
  }, []);

  const savedRestaurants = React.useMemo(() => {
    let list = allRestaurants.filter((r) => favoriteIds.includes(r.id));
    if (selectedFolder === 'CAFES') {
      list = list.filter((r) => r.cuisine.toLowerCase().includes('cafe') || r.cuisine.toLowerCase().includes('coffee'));
    } else if (selectedFolder === 'DINING') {
      list = list.filter((r) => !r.cuisine.toLowerCase().includes('cafe'));
    }
    return list;
  }, [allRestaurants, favoriteIds, selectedFolder]);

  function handleRemoveFavorite(id: string, name: string) {
    Alert.alert('Remove from Saved', `Remove ${name} from your saved restaurants?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setFavoriteIds((prev) => prev.filter((item) => item !== id));
        },
      },
    ]);
  }

  return (
    <View className="flex-1 bg-[#faf8f5]">
      <StatusBar barStyle="dark-content" />
      <FloatingQueueWidget />

      {/* Header Bar */}
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
            <Text className="text-xl font-black text-neutral-900 tracking-tight">
              Saved Places
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              {favoriteIds.length} restaurants bookmarked
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        {/* Collection Filter Chips */}
        <View className="px-5 pt-4 pb-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {[
              { id: 'ALL', label: `All Saved (${favoriteIds.length})` },
              { id: 'CAFES', label: 'Cafes & Work' },
              { id: 'DINING', label: 'Dinner & Family' },
            ].map((folder) => {
              const isSel = selectedFolder === folder.id;
              return (
                <Pressable
                  key={folder.id}
                  onPress={() => setSelectedFolder(folder.id as any)}
                  className={`px-3.5 py-1.5 rounded-full border active:scale-95 ${
                    isSel
                      ? 'bg-[#dc2626] border-[#dc2626]'
                      : 'bg-white border-neutral-200/90'
                  }`}>
                  <Text
                    className={`text-xs font-bold ${
                      isSel ? 'text-white' : 'text-neutral-700'
                    }`}>
                    {folder.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Saved List or Empty State */}
        <View className="px-5 pt-2 gap-3.5">
          {savedRestaurants.length === 0 ? (
            <View className="bg-white rounded-3xl p-8 items-center justify-center border border-neutral-100 shadow-xs mt-6">
              <View className="size-16 rounded-full bg-red-50 items-center justify-center mb-3">
                <HeartIcon size={28} color="#dc2626" />
              </View>
              <Text className="text-lg font-bold text-neutral-900 text-center">
                No Saved Restaurants
              </Text>
              <Text className="text-xs text-neutral-500 text-center mt-1.5 max-w-[260px] leading-relaxed">
                Tap the heart icon on any restaurant to save it here for quick queueing and easy access.
              </Text>
              <Pressable
                onPress={() => router.push('/explore')}
                className="mt-5 px-5 py-2.5 rounded-full bg-[#dc2626] active:bg-[#b91c1c] flex-row items-center gap-2">
                <SearchIcon size={14} color="#ffffff" />
                <Text className="text-xs font-bold text-white">Explore Restaurants</Text>
              </Pressable>
            </View>
          ) : (
            savedRestaurants.map((restaurant) => {
              const isBusy =
                restaurant.tag === 'Busy Now' ||
                restaurant.waitLabel === 'Busy' ||
                (restaurant.waitMinutesEstimated ?? 0) > 30;

              return (
                <Pressable
                  key={restaurant.id}
                  onPress={() =>
                    router.push({
                      pathname: '/restaurant/[id]',
                      params: { id: restaurant.id },
                    })
                  }
                  className="bg-white rounded-3xl p-4 border border-neutral-100 shadow-xs active:bg-neutral-50">
                  {/* Top Details */}
                  <View className="flex-row items-start">
                    <Image
                      source={{ uri: restaurant.image }}
                      className="size-20 rounded-2xl bg-neutral-100"
                      resizeMode="cover"
                    />

                    <View className="flex-1 pl-3.5 justify-between">
                      <View className="flex-row items-start justify-between">
                        <Text className="text-base font-bold text-neutral-900 flex-1 pr-2" numberOfLines={1}>
                          {restaurant.name}
                        </Text>
                        <Pressable
                          onPress={() => handleRemoveFavorite(restaurant.id, restaurant.name)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          className="size-7 rounded-full items-center justify-center -mt-1 active:bg-red-50">
                          <HeartIcon size={18} color="#dc2626" fill="#dc2626" />
                        </Pressable>
                      </View>

                      <Text className="text-xs text-neutral-500 mt-0.5" numberOfLines={1}>
                        {restaurant.categories ? restaurant.categories.join(' • ') : restaurant.cuisine}
                      </Text>

                      <View className="flex-row items-center justify-between mt-1.5">
                        <View className="flex-row items-center">
                          <StarIcon size={12} color="#eab308" fill="#eab308" />
                          <Text className="text-xs font-bold text-neutral-900 ml-1">
                            {restaurant.rating.toFixed(1)}
                          </Text>
                          <Text className="text-xs text-neutral-400 mx-1.5">•</Text>
                          <Text className="text-xs font-semibold text-neutral-700">
                            {restaurant.priceRange.replace(/\$/g, '₹')}
                          </Text>
                        </View>

                        <View
                          className={`px-2 py-0.5 rounded-full border ${
                            isBusy ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'
                          }`}>
                          <Text
                            className={`text-[10px] font-bold ${
                              isBusy ? 'text-red-700' : 'text-emerald-700'
                            }`}>
                            {isBusy ? 'Busy' : 'Live Queue'}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center mt-1.5">
                        <MapPinIcon size={12} color="#dc2626" />
                        <Text className="text-xs text-neutral-500 ml-1 font-medium" numberOfLines={1}>
                          {restaurant.address.split(',')[0]} • {restaurant.distance}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Bottom Queue Stats & Action Button */}
                  <View className="mt-3.5 pt-3 border-t border-neutral-100 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1.5">
                      <ClockIcon size={14} color="#dc2626" />
                      <Text className="text-xs font-extrabold text-neutral-900">
                        {restaurant.waitRange}
                      </Text>
                      <Text className="text-[10px] text-neutral-400">
                        ({restaurant.groupsAhead ?? restaurant.partiesInQueue} ahead)
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
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav
        activeTab="SAVED"
        onTabChange={(tab: TabKey) => {
          if (tab === 'HOME') router.push('/');
          else if (tab === 'EXPLORE') router.push('/explore');
          else if (tab === 'MY_QUEUE') router.push({ pathname: '/restaurant/live-queue', params: { id: 'pop-1' } });
          else if (tab === 'PROFILE') Alert.alert('Profile', 'Signed in as Malav.');
        }}
        hasActiveQueue={true}
      />
    </View>
  );
}

import { BottomNav, TabKey } from '@/components/bottom-nav';
import { BrandLogo } from '@/components/brand-logo';
import { FloatingQueueWidget } from '@/components/floating-queue-widget';
import { Text } from '@/components/ui/text';
import { CUISINE_CATEGORIES, MOCK_RESTAURANTS } from '@/lib/mock-data';
import { Restaurant } from '@/types/queuebite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  CompassIcon,
  FilterIcon,
  HeartIcon,
  MapPinIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  StarIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CuisineResultsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; name?: string }>();

  const cuisineKey = (params.id || params.name || 'pizza').toLowerCase();

  // Find cuisine metadata
  const cuisineMeta = React.useMemo(() => {
    const found = CUISINE_CATEGORIES.find((c) => c.id.toLowerCase() === cuisineKey || c.name.toLowerCase() === cuisineKey);
    if (found) return found;
    return {
      id: cuisineKey,
      name: cuisineKey.charAt(0).toUpperCase() + cuisineKey.slice(1),
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop',
    };
  }, [cuisineKey]);

  // Sub-filter chips
  const [subFilter, setSubFilter] = React.useState<'ALL' | 'FASTEST' | 'TOP_RATED' | 'BUDGET'>('ALL');
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set(['pop-1', 'pop-2']));

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Filter restaurants matching this cuisine
  const matchingRestaurants = React.useMemo(() => {
    let list = MOCK_RESTAURANTS.filter((r) => {
      const inCuisine = r.cuisine.toLowerCase().includes(cuisineKey);
      const inCategories = r.categories?.some((c) => c.toLowerCase().includes(cuisineKey));
      return inCuisine || inCategories;
    });

    // Fallback if none match strictly
    if (list.length === 0) {
      list = MOCK_RESTAURANTS.slice(0, 4);
    }

    if (subFilter === 'FASTEST') {
      list.sort((a, b) => (a.waitMinutesEstimated ?? 99) - (b.waitMinutesEstimated ?? 99));
    } else if (subFilter === 'TOP_RATED') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (subFilter === 'BUDGET') {
      list = list.filter((r) => r.priceRange === '₹' || r.priceRange === '$');
    }

    return list;
  }, [cuisineKey, subFilter]);

  return (
    <View className="flex-1 bg-[#faf8f5]">
      <StatusBar barStyle="light-content" />
      <FloatingQueueWidget />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>
        {/* 1. Category Hero Banner */}
        <View className="relative h-60 w-full bg-neutral-900">
          <Image
            source={{ uri: cuisineMeta.image }}
            className="w-full h-full opacity-80"
            resizeMode="cover"
          />

          {/* Gradient Overlay */}
          <View className="absolute inset-0 bg-black/45" />

          {/* Top Bar Navigation */}
          <View
            className="absolute top-0 left-0 right-0 px-4 flex-row items-center justify-between z-20"
            style={{ paddingTop: insets.top + 8 }}>
            <Pressable
              onPress={() => router.back()}
              className="size-10 rounded-full bg-white/90 backdrop-blur-md items-center justify-center active:bg-white shadow-md"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <ArrowLeftIcon size={18} color="#18181b" />
            </Pressable>

            <BrandLogo size="sm" />
          </View>

          {/* Hero Content */}
          <View className="absolute bottom-5 left-5 right-5">
            <View className="self-start flex-row items-center gap-1.5 bg-[#dc2626] px-3 py-1 rounded-full mb-1.5 shadow-sm">
              <SparklesIcon size={12} color="#ffffff" />
              <Text className="text-[11px] font-bold text-white tracking-wide uppercase">
                Cuisine Spotlight
              </Text>
            </View>
            <Text className="text-3xl font-bold text-white tracking-tight">
              {cuisineMeta.name} in Vadodara
            </Text>
            <Text className="text-xs text-white/80 mt-1">
              {matchingRestaurants.length} restaurants with live queue tracking
            </Text>
          </View>
        </View>

        {/* 2. Sub-Filter Pills */}
        <View className="px-5 pt-4 pb-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {[
              { id: 'ALL', label: 'All Places' },
              { id: 'FASTEST', label: 'Shortest Wait' },
              { id: 'TOP_RATED', label: 'Top Rated 4.5+' },
              { id: 'BUDGET', label: 'Pocket-Friendly' },
            ].map((chip) => {
              const isSel = subFilter === chip.id;
              return (
                <Pressable
                  key={chip.id}
                  onPress={() => setSubFilter(chip.id as any)}
                  className={`px-3.5 py-1.5 rounded-full border active:scale-95 ${
                    isSel
                      ? 'bg-[#dc2626] border-[#dc2626]'
                      : 'bg-white border-neutral-200/90'
                  }`}>
                  <Text
                    className={`text-xs font-bold ${
                      isSel ? 'text-white' : 'text-neutral-700'
                    }`}>
                    {chip.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* 3. Restaurant Feed */}
        <View className="px-5 pt-2 gap-3.5">
          {matchingRestaurants.map((restaurant) => {
            const isFav = favorites.has(restaurant.id);
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
                className="bg-white rounded-xl p-3.5 border border-neutral-100 shadow-xs active:bg-neutral-50">
                <View className="flex-row items-start">
                  <Image
                    source={{ uri: restaurant.image }}
                    className="size-24 rounded-2xl bg-neutral-100"
                    resizeMode="cover"
                  />

                  <View className="flex-1 pl-3.5 justify-between">
                    <View className="flex-row items-start justify-between">
                      <Text className="text-base font-bold text-neutral-900 flex-1 pr-2" numberOfLines={1}>
                        {restaurant.name}
                      </Text>
                      <Pressable
                        onPress={() => toggleFavorite(restaurant.id)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        className="size-7 rounded-full items-center justify-center -mt-1 active:opacity-70">
                        <HeartIcon
                          size={18}
                          color={isFav ? '#dc2626' : '#71717a'}
                          fill={isFav ? '#dc2626' : 'transparent'}
                        />
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
                          {isBusy ? 'Busy' : 'Open Now'}
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

                {/* Queue Stats Box */}
                <View className="mt-3 bg-[#fef7f2] border border-[#fed7aa]/50 rounded-2xl p-2.5 flex-row items-center justify-between">
                  <View className="flex-1 flex-row items-center gap-2 pl-1">
                    <View className="size-8 rounded-full bg-[#fee2e2] items-center justify-center">
                      <UsersIcon size={14} color="#dc2626" />
                    </View>
                    <View>
                      <Text className="text-xs font-extrabold text-neutral-900">
                        {restaurant.waitRange}
                      </Text>
                      <Text className="text-[10px] text-neutral-500 font-medium">Est. wait time</Text>
                    </View>
                  </View>

                  <View className="w-px h-6 bg-neutral-200 mx-1" />

                  <View className="flex-1 flex-row items-center gap-2 pl-2">
                    <View className="size-8 rounded-full bg-[#fee2e2] items-center justify-center">
                      <UsersIcon size={14} color="#dc2626" />
                    </View>
                    <View>
                      <Text className="text-xs font-extrabold text-neutral-900">
                        {restaurant.groupsAhead ?? restaurant.partiesInQueue} groups
                      </Text>
                      <Text className="text-[10px] text-neutral-500 font-medium">ahead</Text>
                    </View>
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

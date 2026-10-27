import { BottomNav, TabKey } from '@/components/bottom-nav';
import { BrandLogo } from '@/components/brand-logo';
import { FilterSortModal, FilterSortState } from '@/components/filter-sort-modal';
import { FloatingQueueWidget } from '@/components/floating-queue-widget';
import { Text } from '@/components/ui/text';
import { MOCK_RESTAURANTS } from '@/lib/mock-data';
import { Restaurant } from '@/types/queuebite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  RotateCcwIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  StarIcon,
  UserPlusIcon,
  UsersIcon,
  UtensilsCrossedIcon,
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

export default function SearchResultsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();

  const [query, setQuery] = React.useState(params.q || '');
  const [showFilterModal, setShowFilterModal] = React.useState(false);

  const [filterState, setFilterState] = React.useState<FilterSortState>({
    sortBy: 'RECOMMENDED',
    maxDistance: null,
    minRating: null,
    price: null,
    maxWait: null,
    openOnly: false,
  });

  const [favorites, setFavorites] = React.useState<Set<string>>(new Set(['pop-1']));

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Filtered results
  const results = React.useMemo(() => {
    let list = [...MOCK_RESTAURANTS];

    if (query.trim().length > 0) {
      const q = query.toLowerCase().trim();
      list = list.filter((r) => {
        const inName = r.name.toLowerCase().includes(q);
        const inCuisine = r.cuisine.toLowerCase().includes(q);
        const inArea = r.address.toLowerCase().includes(q);
        const inTags = r.categories?.some((c) => c.toLowerCase().includes(q));
        const inDishes = r.dishes?.some((d) => d.name.toLowerCase().includes(q));
        return inName || inCuisine || inArea || inTags || inDishes;
      });
    }

    if (filterState.maxDistance !== null) {
      list = list.filter((r) => {
        const km = parseFloat(r.distance) || 0;
        return km <= filterState.maxDistance!;
      });
    }

    if (filterState.minRating !== null) {
      list = list.filter((r) => r.rating >= filterState.minRating!);
    }

    if (filterState.price !== null) {
      list = list.filter((r) => r.priceRange.replace(/\$/g, '₹') === filterState.price);
    }

    if (filterState.maxWait !== null) {
      list = list.filter((r) => {
        if (r.waitMinutesEstimated === null) return false;
        return r.waitMinutesEstimated <= filterState.maxWait!;
      });
    }

    // Sort
    list.sort((a, b) => {
      if (filterState.sortBy === 'WAIT_TIME') {
        return (a.waitMinutesEstimated ?? 999) - (b.waitMinutesEstimated ?? 999);
      }
      if (filterState.sortBy === 'RATING') {
        return b.rating - a.rating;
      }
      if (filterState.sortBy === 'DISTANCE') {
        return (parseFloat(a.distance) || 0) - (parseFloat(b.distance) || 0);
      }
      return 0;
    });

    return list;
  }, [query, filterState]);

  function handleResetFilters() {
    setFilterState({
      sortBy: 'RECOMMENDED',
      maxDistance: null,
      minRating: null,
      price: null,
      maxWait: null,
      openOnly: false,
    });
    setQuery('');
  }

  return (
    <View className="flex-1 bg-[#faf8f5]">
      <StatusBar barStyle="dark-content" />
      <FloatingQueueWidget />

      {/* Header Search Bar */}
      <View
        className="px-5 pb-3 bg-white border-b border-neutral-100"
        style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center gap-2.5">
          <Pressable
            onPress={() => router.back()}
            className="size-9 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ArrowLeftIcon size={18} color="#18181b" />
          </Pressable>

          <View className="flex-1 flex-row items-center bg-neutral-100 h-11 rounded-2xl px-3 border border-neutral-200/80">
            <SearchIcon size={16} color="#71717a" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search dishes, restaurants or cuisines..."
              placeholderTextColor="#a1a1aa"
              className="flex-1 ml-2 text-xs text-neutral-900 font-medium"
              autoFocus={!params.q}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} className="p-1">
                <XIcon size={14} color="#71717a" />
              </Pressable>
            )}
          </View>

          <Pressable
            onPress={() => setShowFilterModal(true)}
            className="size-11 rounded-2xl bg-white border border-neutral-200 items-center justify-center active:bg-neutral-100 shadow-xs">
            <SlidersHorizontalIcon size={18} color="#dc2626" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>
        {/* Results Count & Quick Chips */}
        <View className="px-5 pt-3 pb-2 flex-row items-center justify-between">
          <Text className="text-xs font-bold text-neutral-600">
            {results.length} Results {query ? `for "${query}"` : 'Nearby'}
          </Text>

          <Pressable
            onPress={() => setShowFilterModal(true)}
            className="flex-row items-center gap-1 bg-red-50/80 px-2.5 py-1 rounded-full border border-red-200/70">
            <Text className="text-[11px] font-bold text-[#dc2626]">
              {filterState.sortBy === 'RECOMMENDED'
                ? 'Recommended'
                : filterState.sortBy === 'WAIT_TIME'
                  ? 'Shortest Wait'
                  : 'Sorted'}
            </Text>
          </Pressable>
        </View>

        {/* Results List OR "No Search Results" State */}
        <View className="px-5 pt-1 gap-3.5">
          {results.length === 0 ? (
            /* ========================================================
               NO SEARCH RESULTS SCREEN (Feature #10)
               ======================================================== */
            <View className="bg-white rounded-xl p-7 items-center justify-center border border-neutral-100 shadow-xs mt-6">
              {/* Cute Cloche / Food Illustration */}
              <View className="size-20 rounded-full bg-red-50 items-center justify-center mb-4">
                <UtensilsCrossedIcon size={34} color="#dc2626" strokeWidth={2} />
              </View>

              <Text className="text-xl font-bold text-neutral-900 text-center tracking-tight">
                No Results Found
              </Text>
              <Text className="text-xs text-neutral-500 text-center mt-1.5 max-w-[260px] leading-relaxed">
                We couldn&apos;t find restaurants matching &ldquo;{query}&rdquo;. Check for typos, clear applied filters, or browse suggested cuisines below.
              </Text>

              {/* Quick suggestion chips */}
              <View className="mt-5 w-full">
                <Text className="text-[11px] font-bold text-neutral-400 uppercase text-center mb-2.5">
                  Popular Searches
                </Text>
                <View className="flex-row flex-wrap justify-center gap-2">
                  {['Pizza', 'Coffee & Cafes', 'Burgers', 'North Indian', 'Alkapuri'].map((tag) => (
                    <Pressable
                      key={tag}
                      onPress={() => setQuery(tag)}
                      className="bg-neutral-100 active:bg-neutral-200 px-3.5 py-1.5 rounded-full">
                      <Text className="text-xs font-semibold text-neutral-700">{tag}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable
                onPress={handleResetFilters}
                className="mt-6 px-6 py-3 rounded-full bg-[#dc2626] active:bg-[#b91c1c] flex-row items-center gap-2 shadow-sm">
                <RotateCcwIcon size={14} color="#ffffff" />
                <Text className="text-xs font-bold text-white">Reset All Filters</Text>
              </Pressable>
            </View>
          ) : (
            results.map((restaurant) => {
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
            })
          )}
        </View>
      </ScrollView>

      {/* Filter & Sort Modal */}
      <FilterSortModal
        visible={showFilterModal}
        filters={filterState}
        onClose={() => setShowFilterModal(false)}
        onApply={(newFilters) => setFilterState(newFilters)}
        onReset={handleResetFilters}
      />

      {/* Bottom Navigation */}
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

import { ActiveQueueCard } from '@/components/active-queue-card';
import { BottomNav, TabKey } from '@/components/bottom-nav';
import { CuisineCategories } from '@/components/cuisine-categories';
import { FilterKey } from '@/components/filter-bar';
import { FloatingQueueWidget } from '@/components/floating-queue-widget';
import { HeroPromoBanner } from '@/components/hero-promo-banner';
import { HomeHeader } from '@/components/home-header';
import { JoinQueueModal } from '@/components/join-queue-modal';
import { LocationModal } from '@/components/location-modal';
import { MapDiscoveryCard } from '@/components/map-discovery-card';
import { PopularNearYou } from '@/components/popular-near-you';
import { RestaurantCard } from '@/components/restaurant-card';
import { SearchAndFilterBar } from '@/components/search-and-filter-bar';
import { TrendingThisWeek } from '@/components/trending-this-week';
import { Text } from '@/components/ui/text';
import {
  MOCK_ACTIVE_QUEUE,
  MOCK_POPULAR_RESTAURANTS,
  MOCK_RESTAURANTS,
  MOCK_TRENDING_RESTAURANTS,
} from '@/lib/mock-data';
import { ActiveQueueEntry, Restaurant, UserLocation } from '@/types/queuebite';
import { useUser } from '@clerk/expo';
import { Stack, useRouter } from 'expo-router';
import {
  CompassIcon,
  ListIcon,
  MapPinOffIcon,
  RefreshCwIcon,
  SparklesIcon,
  UsersIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useUser();

  function handleOpenRestaurantDetail(restaurant: Restaurant) {
    router.push({
      pathname: '/restaurant/[id]',
      params: { id: restaurant.id },
    });
  }

  // State: Active Queue Entry (State-driven design: toggleable between active queue card and promo banner)
  const [activeQueue, setActiveQueue] = React.useState<ActiveQueueEntry | null>(null);

  // State: Location (Vadodara default as shown in mock, GPS or manual pincode fallback)
  const [location, setLocation] = React.useState<UserLocation>({
    area: 'Vadodara',
    city: 'Gujarat',
    pincode: '390001',
    isCustom: false,
  });
  const [isLocationModalVisible, setIsLocationModalVisible] = React.useState(false);

  // State: Party size (prefilled from last used, default 2 diners)
  const [partySize, setPartySize] = React.useState<number>(2);

  // State: Search & Filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState<Set<FilterKey>>(new Set());
  const [selectedCuisine, setSelectedCuisine] = React.useState<string | null>(null);

  // State: View Mode (List vs Map toggle for full restaurant list)
  const [viewMode, setViewMode] = React.useState<'LIST' | 'MAP'>('LIST');

  // State: Bottom Tab
  const [activeTab, setActiveTab] = React.useState<TabKey>('HOME');

  // State: Favorites list
  const [favorites, setFavorites] = React.useState<Set<string>>(
    new Set(MOCK_RESTAURANTS.filter((r) => r.isFavorite).map((r) => r.id))
  );

  // State: 3-Tap Join Queue Modal
  const [selectedRestaurantForQueue, setSelectedRestaurantForQueue] =
    React.useState<Restaurant | null>(null);
  const [isJoinModalVisible, setIsJoinModalVisible] = React.useState(false);

  // State: Pull-to-refresh
  const [refreshing, setRefreshing] = React.useState(false);

  // Toggle favorite
  function handleToggleFavorite(restaurantId: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(restaurantId)) {
        next.delete(restaurantId);
      } else {
        next.add(restaurantId);
      }
      return next;
    });
  }

  // Toggle quick filter chip
  function handleToggleFilter(filter: FilterKey) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) {
        next.delete(filter);
      } else {
        next.add(filter);
      }
      return next;
    });
  }

  // Handle pull-to-refresh
  async function onRefresh() {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRefreshing(false);
  }

  // Open 3-tap join queue modal
  function handleInitiateJoinQueue(restaurant: Restaurant) {
    if (restaurant.queueState === 'CLOSED') {
      Alert.alert(
        'Queue Closed',
        `${restaurant.name} is not accepting walk-ins or remote waitlist entries at this time.`
      );
      return;
    }

    if (partySize > restaurant.maxPartySize) {
      Alert.alert(
        'Party Size Limit Exceeded',
        `${restaurant.name} accommodates up to ${restaurant.maxPartySize} guests per queue entry.`
      );
      return;
    }

    setSelectedRestaurantForQueue(restaurant);
    setIsJoinModalVisible(true);
  }

  // Confirm join queue
  function handleConfirmJoinQueue(partySizeChosen: number) {
    if (!selectedRestaurantForQueue) return;

    const newActiveQueue: ActiveQueueEntry = {
      id: `q-${Date.now()}`,
      restaurantId: selectedRestaurantForQueue.id,
      restaurantName: selectedRestaurantForQueue.name,
      restaurantImage: selectedRestaurantForQueue.image,
      status: 'WAITING',
      waitRange: selectedRestaurantForQueue.waitRange,
      updatedAgo: 'Just now',
      partiesAhead: selectedRestaurantForQueue.partiesInQueue,
      partySize: partySizeChosen,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedSeatingTime: new Date(
        Date.now() + (selectedRestaurantForQueue.waitMinutesEstimated || 20) * 60000
      ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setActiveQueue(newActiveQueue);
    setIsJoinModalVisible(false);

    Alert.alert(
      'You are in line!',
      `You have joined the queue at ${selectedRestaurantForQueue.name}. Estimated wait is ${selectedRestaurantForQueue.waitRange}. We’ll notify you when your table is getting ready!`,
      [{ text: 'Great!' }]
    );
  }

  // Filter restaurants based on search, cuisine, and chips
  const filteredRestaurants = React.useMemo(() => {
    return MOCK_RESTAURANTS.filter((r) => {
      // Search text query
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(query);
        const matchesCuisine = r.cuisine.toLowerCase().includes(query);
        const matchesAddress = r.address.toLowerCase().includes(query);
        if (!matchesName && !matchesCuisine && !matchesAddress) return false;
      }

      // Cuisine filter
      if (selectedCuisine) {
        if (!r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase())) {
          return false;
        }
      }

      // Quick filter chips
      if (activeFilters.has('OPEN_NOW') && r.queueState !== 'OPEN') {
        return false;
      }

      if (
        activeFilters.has('SHORTEST_WAIT') &&
        (r.waitMinutesEstimated === null || r.waitMinutesEstimated > 20)
      ) {
        return false;
      }

      if (
        activeFilters.has('FITS_PARTY') &&
        (partySize < r.minPartySize || partySize > r.maxPartySize)
      ) {
        return false;
      }

      if (activeFilters.has('FAVORITES') && !favorites.has(r.id)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCuisine, activeFilters, partySize, favorites]);

  const hasSearchOrFilterActive =
    searchQuery.trim().length > 0 ||
    selectedCuisine !== null ||
    activeFilters.size > 0;

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* 1. Header (Brand, Location selector, Notifications, Profile) */}
      <HomeHeader
        userName={user?.firstName || 'Malav'}
        location={location}
        onOpenLocationModal={() => setIsLocationModalVisible(true)}
        onNotificationPress={() => {
          router.push('/notifications');
        }}
        onProfilePress={() => setActiveTab('PROFILE')}
        hasUnreadNotifications={true}
      />

      {/* Main Scroll Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#dc2626"
            colors={['#dc2626']}
          />
        }
        className="flex-1">
        {/* 2. Search & Filter Bar with Party Size stepper */}
        <SearchAndFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilters={activeFilters}
          onToggleFilter={handleToggleFilter}
          partySize={partySize}
          onPartySizeChange={setPartySize}
        />

        {/* 3. Cuisine Categories Row (Pizza, Burgers, Cafes, Indian, Chinese, Desserts) */}
        <CuisineCategories
          selectedCuisine={selectedCuisine}
          onSelectCuisine={(cuisine) => {
            if (cuisine) {
              router.push({
                pathname: '/cuisine/[id]',
                params: { id: cuisine.toLowerCase(), name: cuisine },
              });
            } else {
              setSelectedCuisine(null);
            }
          }}
        />

        {/* State-Driven Section: Active Queue Card vs Promo Banner */}
        {activeQueue ? (
          <View className="mt-1">
            <View className="px-5 mb-2 flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <View className="size-2 rounded-full bg-[#dc2626] animate-pulse" />
                <Text className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Your Active Waitlist
                </Text>
              </View>
              {/* Dev/Demo toggle to see promo banner */}
              <Pressable
                onPress={() => setActiveQueue(null)}
                className="py-1 px-2.5 bg-neutral-100 rounded-full active:bg-neutral-200">
                <Text className="text-[10px] font-semibold text-neutral-600">
                  Preview Promo Banner
                </Text>
              </Pressable>
            </View>

            <ActiveQueueCard
              entry={activeQueue}
              onStatusPress={(entry) => {
                router.push({
                  pathname: '/restaurant/live-queue',
                  params: { id: entry.restaurantId },
                });
              }}
              onArrivingPress={(entry) => {
                setActiveQueue({ ...entry, status: 'ARRIVING' });
                router.push({
                  pathname: '/restaurant/table-ready',
                  params: {
                    id: entry.restaurantId,
                    queueNumber: 'A12',
                    partySize: entry.partySize.toString(),
                  },
                });
              }}
              onCancelPress={() => {
                setActiveQueue(null);
              }}
            />
          </View>
        ) : (
          <View>
            {/* 4. Hero Promo Banner: Skip the wait */}
            <HeroPromoBanner
              onExplorePress={() => {
                // Focus on shortest wait
                handleToggleFilter('SHORTEST_WAIT');
              }}
            />

            {/* Quick Demo Toggle to preview Active Queue state */}
            <View className="px-5 -mt-1 mb-2 flex-row justify-end">
              <Pressable
                onPress={() => setActiveQueue(MOCK_ACTIVE_QUEUE)}
                className="py-1 px-2.5 bg-neutral-50 rounded-full border border-neutral-200/60 active:bg-neutral-100 flex-row items-center gap-1">
                <SparklesIcon size={11} color="#71717a" />
                <Text className="text-[10px] font-medium text-neutral-500">
                  Simulate in-queue state
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* If user is filtering or searching, show the full filtered results */}
        {hasSearchOrFilterActive ? (
          <View className="px-5 pt-3 pb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-base font-bold text-neutral-900">
                Search Results ({filteredRestaurants.length})
              </Text>
              {(selectedCuisine || activeFilters.size > 0 || searchQuery) && (
                <Pressable
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedCuisine(null);
                    setActiveFilters(new Set());
                  }}
                  className="py-1 px-2.5 bg-neutral-100 rounded-full active:bg-neutral-200">
                  <Text className="text-xs font-semibold text-neutral-700">
                    Clear all
                  </Text>
                </Pressable>
              )}
            </View>

            {filteredRestaurants.length === 0 ? (
              <View className="py-12 items-center justify-center bg-neutral-50 rounded-3xl p-6 border border-neutral-200">
                <MapPinOffIcon size={36} color="#9ca3af" />
                <Text className="text-base font-bold text-neutral-800 mt-3 text-center">
                  No matching restaurants found
                </Text>
                <Text className="text-xs text-neutral-500 mt-1 text-center max-w-xs">
                  Try adjusting your search query, cuisine selection, or party size filter.
                </Text>
              </View>
            ) : (
              <View className="gap-3.5">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    userPartySize={partySize}
                    isFavorite={favorites.has(restaurant.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onPress={handleOpenRestaurantDetail}
                    onJoinQueuePress={handleInitiateJoinQueue}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          /* Default Home Feed matching mock */
          <>
            {/* 5. Popular Near You */}
            <PopularNearYou
              restaurants={MOCK_POPULAR_RESTAURANTS}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectRestaurant={handleOpenRestaurantDetail}
              onSeeAllPress={() => handleToggleFilter('OPEN_NOW')}
            />

            {/* 6. Discover Restaurants Around You Map Banner */}
            <MapDiscoveryCard
              onOpenMap={() => setActiveTab('MAP')}
            />

            {/* Group Dining Feature Card */}
            <View className="px-5 my-3">
              <View className="bg-gradient-to-r from-red-600 to-rose-700 bg-[#dc2626] rounded-3xl p-5 shadow-md shadow-red-500/20">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-2">
                    <UsersIcon size={18} color="#ffffff" />
                    <Text className="text-xs font-black text-white uppercase tracking-wider">
                      Group Dining Mode
                    </Text>
                  </View>
                  <View className="px-2.5 py-0.5 rounded-full bg-white/20">
                    <Text className="text-[10px] font-bold text-white">Smart Sync</Text>
                  </View>
                </View>

                <Text className="text-lg font-black text-white tracking-tight">
                  Dining out with friends or family?
                </Text>
                <Text className="text-xs text-red-100 mt-0.5 leading-relaxed">
                  Coordinate party arrivals, sync your live queue ticket, and get seated together with zero confusion.
                </Text>

                <View className="flex-row gap-2.5 mt-4">
                  <Pressable
                    onPress={() => router.push('/group/create')}
                    className="flex-1 py-2.5 rounded-xl bg-white items-center justify-center active:bg-neutral-100">
                    <Text className="text-xs font-black text-[#dc2626]">Create Group</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => router.push('/group/join')}
                    className="flex-1 py-2.5 rounded-xl bg-black/25 border border-white/30 items-center justify-center active:bg-black/40">
                    <Text className="text-xs font-black text-white">Join via Code</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* 7. Trending This Week */}
            <TrendingThisWeek
              restaurants={MOCK_TRENDING_RESTAURANTS}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectRestaurant={handleOpenRestaurantDetail}
              onSeeAllPress={() => router.push('/trending')}
            />

            {/* 8. All Restaurants List Header with List/Map toggle */}
            <View className="px-5 pt-2 pb-6">
              <View className="flex-row items-center justify-between mb-3.5">
                <View>
                  <Text className="text-lg font-bold text-neutral-900 tracking-tight">
                    All Restaurants in {location.area || 'Vadodara'}
                  </Text>
                  <Text className="text-xs text-neutral-500 mt-0.5">
                    Live wait times personalized for party of {partySize}
                  </Text>
                </View>

                {/* List / Map view mode toggle */}
                <View className="flex-row items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                  <Pressable
                    onPress={() => setViewMode('LIST')}
                    className={`size-7 rounded-lg items-center justify-center ${
                      viewMode === 'LIST' ? 'bg-white shadow-xs' : ''
                    }`}>
                    <ListIcon
                      size={15}
                      color={viewMode === 'LIST' ? '#dc2626' : '#71717a'}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => setViewMode('MAP')}
                    className={`size-7 rounded-lg items-center justify-center ${
                      viewMode === 'MAP' ? 'bg-white shadow-xs' : ''
                    }`}>
                    <CompassIcon
                      size={15}
                      color={viewMode === 'MAP' ? '#dc2626' : '#71717a'}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Restaurants Vertical Feed */}
              <View className="gap-3.5">
                {MOCK_RESTAURANTS.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    userPartySize={partySize}
                    isFavorite={favorites.has(restaurant.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onPress={handleOpenRestaurantDetail}
                    onJoinQueuePress={handleInitiateJoinQueue}
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* 9. Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'EXPLORE') {
            router.push('/explore');
          } else if (tab === 'JOIN_QUEUE') {
            const fastest = MOCK_RESTAURANTS.find((r) => r.queueState === 'OPEN') || MOCK_RESTAURANTS[0];
            router.push({
              pathname: '/restaurant/join',
              params: { id: fastest.id, initialParty: partySize.toString() },
            });
          } else if (tab === 'MAP') {
            Alert.alert(
              'Interactive Map',
              `Showing live restaurants and wait times around ${location.area || 'Vadodara'}.`
            );
          } else if (tab === 'MY_QUEUE') {
            if (activeQueue) {
              router.push({
                pathname: '/restaurant/live-queue',
                params: { id: activeQueue.restaurantId },
              });
            } else {
              Alert.alert(
                'My Queue',
                'You have no active queue entries right now. Select a restaurant to join the waitlist!'
              );
            }
          } else if (tab === 'SAVED') {
            router.push('/saved');
          } else if (tab === 'PROFILE') {
            Alert.alert(
              'Profile & Preferences',
              `Signed in as ${user?.firstName || 'Malav'}.\nDefault party size: ${partySize}\nDietary preference: All cuisines`
            );
          }
        }}
        hasActiveQueue={activeQueue !== null}
      />

      {/* 10. Location Permission & Pincode Modal */}
      <LocationModal
        visible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
        currentLocation={location}
        onSelectLocation={(newLoc) => {
          setLocation(newLoc);
        }}
      />

      {/* 11. 3-Tap Join Queue Confirmation Modal */}
      <JoinQueueModal
        visible={isJoinModalVisible}
        restaurant={selectedRestaurantForQueue}
        partySize={partySize}
        onClose={() => setIsJoinModalVisible(false)}
        onConfirmJoin={(rest, size) => handleConfirmJoinQueue(size)}
      />

      {/* 12. Floating Live Queue Tracking Widget (Across the app) */}
      <FloatingQueueWidget
        visible={true}
        restaurantName={activeQueue ? activeQueue.restaurantName : 'The Daily Bean'}
        queueNumber="A12"
        position={5}
        waitRange={activeQueue ? activeQueue.waitRange : '15–25m'}
        restaurantId={activeQueue ? activeQueue.restaurantId : 'pop-1'}
      />
    </View>
  );
}

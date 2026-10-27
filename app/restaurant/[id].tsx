import { JoinQueueModal } from '@/components/join-queue-modal';
import { Text } from '@/components/ui/text';
import { api } from '@/lib/api';
import { useRestaurantSocket } from '@/lib/socket';
import { useUser } from '@clerk/expo';
import {
  MOCK_ACTIVE_QUEUE,
  MOCK_POPULAR_RESTAURANTS,
  MOCK_RESTAURANTS,
  MOCK_TRENDING_RESTAURANTS,
} from '@/lib/mock-data';
import { ActiveQueueEntry, Dish, Restaurant } from '@/types/queuebite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ChevronRightIcon,
  ClockIcon,
  CompassIcon,
  CrownIcon,
  HeartIcon,
  MapPinIcon,
  MoreVerticalIcon,
  PhoneIcon,
  PlayIcon,
  PlusIcon,
  Share2Icon,
  StarIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RestaurantDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { user } = useUser();

  // Find fallback restaurant
  const fallbackRestaurant: Restaurant = React.useMemo(() => {
    const all = [
      ...MOCK_POPULAR_RESTAURANTS,
      ...MOCK_TRENDING_RESTAURANTS,
      ...MOCK_RESTAURANTS,
    ];
    if (params.id) {
      const found = all.find((r) => r.id === params.id);
      if (found) return found;
    }
    return MOCK_POPULAR_RESTAURANTS[0];
  }, [params.id]);

  // Live restaurant state from backend
  const [liveRestaurant, setLiveRestaurant] = React.useState<Restaurant | null>(null);

  // Load live restaurant details
  React.useEffect(() => {
    if (!params.id) return;
    api.getRestaurantById(params.id)
      .then((data) => setLiveRestaurant(data))
      .catch((err) => console.log('Using local fallback for restaurant:', err));
  }, [params.id]);

  // Real-time live queue listener for restaurant page
  useRestaurantSocket(params.id, (update) => {
    if (update?.waitingCount !== undefined) {
      setLiveRestaurant((prev) =>
        prev ? { ...prev, partiesInQueue: update.waitingCount } : null
      );
    }
  });

  const restaurant: Restaurant = liveRestaurant || fallbackRestaurant;

  // States
  const [isFavorite, setIsFavorite] = React.useState(restaurant.isFavorite ?? false);
  const [activeTab, setActiveTab] = React.useState<
    'Overview' | 'Menu' | 'Reviews' | 'Photos' | 'About'
  >('Overview');
  const [isJoinModalVisible, setIsJoinModalVisible] = React.useState(false);
  const [isTableModalVisible, setIsTableModalVisible] = React.useState(false);
  const [addedDishes, setAddedDishes] = React.useState<Set<string>>(new Set());

  // Toggle favorite
  function handleToggleFavorite() {
    setIsFavorite((prev) => !prev);
  }

  // Share restaurant
  async function handleShare() {
    try {
      await Share.share({
        title: restaurant.name,
        message: `Check out live queue and wait times for ${restaurant.name} on QueueBite! Wait is currently ${restaurant.waitRange}.`,
      });
    } catch {
      Alert.alert('Link Copied', `QueueBite link for ${restaurant.name} copied to clipboard!`);
    }
  }

  // Call restaurant
  function handleCall() {
    const phone = restaurant.phone || '+919876543210';
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Call Restaurant', `Calling ${restaurant.name} at ${phone}`);
    });
  }

  // Directions
  function handleDirections() {
    const address = encodeURIComponent(`${restaurant.name}, ${restaurant.address}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`).catch(() => {
      Alert.alert('Directions', `Opening directions to ${restaurant.address}`);
    });
  }

  // Add dish to pre-order list
  function handleAddDish(dish: Dish) {
    setAddedDishes((prev) => {
      const next = new Set(prev);
      if (next.has(dish.id)) {
        next.delete(dish.id);
      } else {
        next.add(dish.id);
      }
      return next;
    });

    Alert.alert(
      'Pre-order Added',
      `${dish.name} (₹${dish.price}) added to your table order! Your food will start preparing once you're seated.`,
      [{ text: 'Great!' }]
    );
  }

  // Join queue confirmed with backend API
  async function handleConfirmJoinQueue(partySizeChosen: number) {
    setIsJoinModalVisible(false);

    try {
      const guestName = user?.fullName || user?.firstName || 'Guest';
      const guestPhone = user?.primaryPhoneNumber?.phoneNumber || '+919876543210';

      const entry = await api.joinQueue(restaurant.id, {
        guestName,
        guestPhone,
        partySize: partySizeChosen,
      });

      Alert.alert(
        'You are in line!',
        `You joined the queue for party of ${partySizeChosen} at ${restaurant.name}. Your spot is #${entry.partiesAhead + 1}.`,
        [
          {
            text: 'View Queue',
            onPress: () => router.push('/'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert(
        'You are in line!',
        `You joined the queue for party of ${partySizeChosen} at ${restaurant.name}. Estimated wait is ${restaurant.waitRange}.`,
        [
          {
            text: 'View Queue',
            onPress: () => router.push('/'),
          },
        ]
      );
    }
  }

  const tabs: ('Overview' | 'Menu' | 'Reviews' | 'Photos' | 'About')[] = [
    'Overview',
    'Menu',
    'Reviews',
    'Photos',
    'About',
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        {/* 1. Hero Image with Overlay Header */}
        <View className="relative h-72 w-full bg-neutral-900">
          <Image
            source={{ uri: restaurant.image }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* Top Bar Navigation (Back, Favorite, Share) */}
          <View
            className="absolute top-0 left-0 right-0 px-4 flex-row items-center justify-between z-20"
            style={{ paddingTop: insets.top + 8 }}>
            {/* Back Button */}
            <Pressable
              onPress={() => router.back()}
              className="size-10 rounded-full bg-white/90 backdrop-blur-md items-center justify-center shadow-md active:bg-white"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <ArrowLeftIcon size={20} color="#18181b" />
            </Pressable>

            {/* Right Buttons: Favorite + Share */}
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={handleToggleFavorite}
                className="size-10 rounded-full bg-white/90 backdrop-blur-md items-center justify-center shadow-md active:bg-white"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <HeartIcon
                  size={19}
                  color={isFavorite ? '#dc2626' : '#18181b'}
                  fill={isFavorite ? '#dc2626' : 'transparent'}
                />
              </Pressable>

              <Pressable
                onPress={handleShare}
                className="size-10 rounded-full bg-white/90 backdrop-blur-md items-center justify-center shadow-md active:bg-white"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Share2Icon size={19} color="#18181b" />
              </Pressable>
            </View>
          </View>

          {/* Image Carousel Badge (1/10) */}
          <View className="absolute bottom-10 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
            <Text className="text-[11px] font-medium text-white tracking-wider">
              1/10
            </Text>
          </View>
        </View>

        {/* 2. Restaurant Content Body (Overlapping Sheet) */}
        <View className="-mt-6 rounded-t-3xl bg-white px-5 pt-5">
          {/* Title & Top Rated Badge */}
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-2">
              <Text className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                {restaurant.name}
              </Text>
              <Text className="text-xs font-medium text-neutral-500 mt-1">
                {restaurant.categories
                  ? restaurant.categories.join('  •  ')
                  : restaurant.cuisine}
              </Text>
            </View>

            {/* Top Rated Badge */}
            {restaurant.tag && (
              <View className="flex-row items-center gap-1.5 bg-[#fff8eb] px-3 py-1.5 rounded-full border border-[#fed7aa]/60">
                <CrownIcon size={13} color="#b45309" strokeWidth={2.5} />
                <Text className="text-xs font-bold text-[#b45309]">
                  {restaurant.tag}
                </Text>
              </View>
            )}
          </View>

          {/* Rating, Price & Open Status */}
          <View className="flex-row items-center mt-2.5">
            <StarIcon size={15} color="#eab308" fill="#eab308" />
            <Text className="text-sm font-bold text-neutral-900 ml-1">
              {restaurant.rating.toFixed(1)}
            </Text>
            <Text className="text-xs text-neutral-500 ml-1">
              ({restaurant.reviewCount >= 1000 ? `${(restaurant.reviewCount / 1000).toFixed(1)}k` : restaurant.reviewCount} reviews)
            </Text>
            <Text className="text-xs text-neutral-300 mx-2">•</Text>
            <Text className="text-xs font-semibold text-neutral-700">
              {restaurant.priceRange}
            </Text>
            <Text className="text-xs text-neutral-300 mx-2">•</Text>
            <Text className="text-xs font-bold text-emerald-600">
              Open Now
            </Text>
          </View>

          {/* Description */}
          <Text className="text-xs text-neutral-600 leading-relaxed mt-3">
            {restaurant.description ||
              'A cozy café serving specialty coffee, delicious bites and a warm, vibrant atmosphere. Perfect for casual hangouts, work sessions or a quick coffee break.'}
          </Text>

          {/* 3. Quick Action Info Grid (4 Tiles) */}
          <View className="flex-row items-center justify-between gap-2.5 my-4">
            {/* Tile 1: Distance / Location */}
            <Pressable
              onPress={handleDirections}
              className="flex-1 bg-neutral-50 rounded-2xl p-2.5 items-center justify-center border border-neutral-200/60 active:bg-neutral-100">
              <MapPinIcon size={18} color="#dc2626" />
              <Text className="text-xs font-bold text-neutral-900 mt-1.5" numberOfLines={1}>
                {restaurant.distance}
              </Text>
              <Text className="text-[10px] text-neutral-500 mt-0.5" numberOfLines={1}>
                {restaurant.address.split(',')[0]}
              </Text>
            </Pressable>

            {/* Tile 2: Timings */}
            <View className="flex-1 bg-neutral-50 rounded-2xl p-2.5 items-center justify-center border border-neutral-200/60">
              <ClockIcon size={18} color="#dc2626" />
              <Text className="text-[11px] font-bold text-neutral-900 mt-1.5" numberOfLines={1}>
                {restaurant.timings || '10:00 AM – 11:00 PM'}
              </Text>
              <Text className="text-[10px] text-neutral-500 mt-0.5" numberOfLines={1}>
                Today
              </Text>
            </View>

            {/* Tile 3: Call */}
            <Pressable
              onPress={handleCall}
              className="flex-1 bg-neutral-50 rounded-2xl p-2.5 items-center justify-center border border-neutral-200/60 active:bg-neutral-100">
              <PhoneIcon size={18} color="#dc2626" />
              <Text className="text-xs font-bold text-neutral-900 mt-1.5" numberOfLines={1}>
                Call
              </Text>
              <Text className="text-[10px] text-neutral-500 mt-0.5" numberOfLines={1}>
                {restaurant.phone || '+91 98765 43210'}
              </Text>
            </Pressable>

            {/* Tile 4: Directions */}
            <Pressable
              onPress={handleDirections}
              className="flex-1 bg-neutral-50 rounded-2xl p-2.5 items-center justify-center border border-neutral-200/60 active:bg-neutral-100">
              <CompassIcon size={18} color="#dc2626" />
              <Text className="text-xs font-bold text-neutral-900 mt-1.5" numberOfLines={1}>
                Directions
              </Text>
              <Text className="text-[10px] text-neutral-500 mt-0.5" numberOfLines={1}>
                Open in Maps
              </Text>
            </Pressable>
          </View>

          {/* 4. Live Queue Status Card */}
          <View className="bg-[#fef6f0] border border-[#fbdcc8] rounded-2xl p-4 mb-4 shadow-xs">
            <View className="flex-row items-center justify-between">
              {/* Left Side: Estimated Wait */}
              <View className="flex-1 flex-row items-center gap-3">
                <View className="size-11 rounded-full bg-[#fee2e2] items-center justify-center">
                  <UsersIcon size={20} color="#dc2626" />
                </View>
                <View>
                  <View className="flex-row items-center gap-1.5">
                    <View className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <Text className="text-xs font-bold text-neutral-900">
                      Live Queue
                    </Text>
                  </View>
                  <Text className="text-lg font-extrabold text-neutral-900 mt-0.5">
                    {restaurant.waitRange}
                  </Text>
                  <Text className="text-[11px] text-neutral-500">
                    Estimated wait time
                  </Text>
                </View>
              </View>

              {/* Vertical Divider */}
              <View className="w-px h-12 bg-[#fbdcc8] mx-3" />

              {/* Right Side: Groups Ahead */}
              <View className="flex-1 flex-row items-center gap-3 pl-1">
                <View className="size-11 rounded-full bg-[#fee2e2] items-center justify-center">
                  <UsersIcon size={20} color="#dc2626" />
                </View>
                <View>
                  <Text className="text-[11px] font-medium text-neutral-500">
                    Currently
                  </Text>
                  <Text className="text-base font-extrabold text-neutral-900 mt-0.5">
                    {restaurant.groupsAhead || restaurant.partiesInQueue || 8} groups ahead
                  </Text>
                  <Text className="text-[11px] text-neutral-400">
                    Updated {restaurant.lastUpdated}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 5. Primary Action Buttons */}
          <View className="gap-3 mb-6">
            {/* Primary Button: Join Queue */}
            <Pressable
              onPress={() => router.push({ pathname: '/restaurant/join', params: { id: restaurant.id } })}
              style={{ height: 56 }}
              className="w-full rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] flex-row items-center justify-center gap-2.5 shadow-md shadow-red-500/20 px-6">
              <UsersIcon size={20} color="#ffffff" strokeWidth={2.2} />
              <Text className="text-base font-bold text-white tracking-wide">
                Join Queue
              </Text>
              <ArrowRightIcon size={18} color="#ffffff" strokeWidth={2.2} />
            </Pressable>

            {/* Secondary Button: View Table Availability */}
            <Pressable
              onPress={() => setIsTableModalVisible(true)}
              style={{ height: 56 }}
              className="w-full rounded-2xl bg-white active:bg-red-50/60 border border-[#dc2626] flex-row items-center justify-center gap-2 px-6">
              <CalendarDaysIcon size={18} color="#dc2626" strokeWidth={2} />
              <Text className="text-sm font-bold text-[#dc2626]">
                View Table Availability
              </Text>
            </Pressable>
          </View>

          {/* 6. Navigation Tabs Row */}
          <View className="flex-row items-center justify-between border-b border-neutral-200 pb-0.5 mb-5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className="items-center pb-2.5 flex-1">
                  <Text
                    className={`text-sm ${
                      isActive ? 'font-bold text-[#dc2626]' : 'font-medium text-neutral-500'
                    }`}>
                    {tab}
                  </Text>
                  {isActive && (
                    <View className="absolute bottom-0 w-8 h-0.5 bg-[#dc2626] rounded-full" />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* 7. "Popular Dishes" Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-neutral-900 tracking-tight">
                Popular Dishes
              </Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/restaurant/[id]/menu',
                    params: { id: restaurant.id },
                  })
                }
                className="flex-row items-center active:opacity-70 py-1"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text className="text-xs font-bold text-[#dc2626] mr-0.5">
                  See Full Menu
                </Text>
                <ChevronRightIcon size={14} color="#dc2626" />
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 14 }}>
              {(restaurant.dishes || []).map((dish) => {
                const isAdded = addedDishes.has(dish.id);
                return (
                  <Pressable
                    key={dish.id}
                    onPress={() =>
                      router.push({
                        pathname: '/restaurant/[id]/dish/[dishId]',
                        params: { id: restaurant.id, dishId: dish.id },
                      })
                    }
                    className="w-40 bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm active:scale-98">
                    {/* Dish Image */}
                    <View className="h-28 w-full bg-neutral-100">
                      <Image
                        source={{ uri: dish.image }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>

                    {/* Dish Info */}
                    <View className="p-3">
                      <Text
                        className="text-xs font-bold text-neutral-900"
                        numberOfLines={2}>
                        {dish.name}
                      </Text>

                      <View className="flex-row items-center justify-between mt-2">
                        <Text className="text-xs font-extrabold text-neutral-900">
                          ₹{dish.price}
                        </Text>
                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation();
                            handleAddDish(dish);
                          }}
                          className={`size-6 rounded-full border items-center justify-center active:scale-95 ${
                            isAdded
                              ? 'bg-[#dc2626] border-[#dc2626]'
                              : 'border-[#dc2626] bg-white'
                          }`}
                          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                          <PlusIcon
                            size={14}
                            color={isAdded ? '#ffffff' : '#dc2626'}
                            strokeWidth={2.5}
                          />
                        </Pressable>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* 8. "Photos" Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-neutral-900 tracking-tight">
                Photos
              </Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/restaurant/[id]/photos',
                    params: { id: restaurant.id },
                  })
                }
                className="flex-row items-center active:opacity-70 py-1"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text className="text-xs font-bold text-[#dc2626] mr-0.5">
                  See All
                </Text>
                <ChevronRightIcon size={14} color="#dc2626" />
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}>
              {(restaurant.photos || []).map((photo, index) => (
                <Pressable
                  key={photo.id || index}
                  onPress={() =>
                    router.push({
                      pathname: '/restaurant/[id]/photos',
                      params: { id: restaurant.id },
                    })
                  }
                  className="relative w-28 h-20 rounded-2xl overflow-hidden bg-neutral-200 active:opacity-80">
                  <Image
                    source={{ uri: photo.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  {photo.isVideo && (
                    <View className="absolute inset-0 bg-black/30 items-center justify-center">
                      <View className="size-8 rounded-full bg-black/60 items-center justify-center border border-white/60">
                        <PlayIcon size={14} color="#ffffff" fill="#ffffff" />
                      </View>
                    </View>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* 9. "Customer Reviews" Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-neutral-900 tracking-tight">
                Customer Reviews
              </Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/restaurant/[id]/reviews',
                    params: { id: restaurant.id },
                  })
                }
                className="flex-row items-center active:opacity-70 py-1"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text className="text-xs font-bold text-[#dc2626] mr-0.5">
                  See All
                </Text>
                <ChevronRightIcon size={14} color="#dc2626" />
              </Pressable>
            </View>

            {(restaurant.reviews || []).map((review) => (
              <View
                key={review.id}
                className="bg-neutral-50/80 rounded-2xl p-4 border border-neutral-200/60 shadow-xs">
                {/* Author Info & More Menu */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Image
                      source={{ uri: review.avatar }}
                      className="size-10 rounded-full bg-neutral-200"
                    />
                    <View>
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm font-bold text-neutral-900">
                          {review.author}
                        </Text>
                        <Text className="text-xs text-neutral-400">
                          {review.dateAgo}
                        </Text>
                      </View>
                      {/* Rating Stars */}
                      <View className="flex-row items-center gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon
                            key={i}
                            size={12}
                            color="#eab308"
                            fill={i < review.rating ? '#eab308' : 'transparent'}
                          />
                        ))}
                      </View>
                    </View>
                  </View>

                  <Pressable
                    className="p-1 active:opacity-70"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <MoreVerticalIcon size={16} color="#71717a" />
                  </Pressable>
                </View>

                {/* Review Text */}
                <Text className="text-xs text-neutral-600 leading-relaxed mt-2.5">
                  {review.content}
                </Text>

                {/* Review Photos */}
                {review.images && review.images.length > 0 && (
                  <View className="flex-row items-center gap-2 mt-3">
                    {review.images.map((imgUrl, i) => (
                      <View
                        key={i}
                        className="size-16 rounded-xl overflow-hidden bg-neutral-200">
                        <Image
                          source={{ uri: imgUrl }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 3-Tap Join Queue Modal */}
      <JoinQueueModal
        visible={isJoinModalVisible}
        restaurant={restaurant}
        partySize={2}
        onClose={() => setIsJoinModalVisible(false)}
        onConfirmJoin={(rest, size) => handleConfirmJoinQueue(size)}
      />

      {/* Live Table Availability Modal */}
      <Modal
        visible={isTableModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsTableModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <Pressable className="flex-1" onPress={() => setIsTableModalVisible(false)} />
          <View className="bg-white rounded-t-3xl p-6 shadow-2xl">
            <View className="flex-row items-center justify-between pb-3 border-b border-neutral-100">
              <View className="flex-row items-center gap-2">
                <CalendarIcon size={20} color="#dc2626" />
                <Text className="text-lg font-bold text-neutral-900">
                  Table Availability
                </Text>
              </View>
              <Pressable
                onPress={() => setIsTableModalVisible(false)}
                className="size-8 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200">
                <XIcon size={16} color="#71717a" />
              </Pressable>
            </View>

            <View className="my-4 gap-3">
              <View className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex-row items-center justify-between">
                <View>
                  <Text className="text-sm font-bold text-emerald-900">
                    2 Guests (Table for 2)
                  </Text>
                  <Text className="text-xs text-emerald-700">
                    Ready now • 2 tables open
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    setIsTableModalVisible(false);
                    handleConfirmJoinQueue(2);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 rounded-xl">
                  <Text className="text-xs font-bold text-white">Claim</Text>
                </Pressable>
              </View>

              <View className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex-row items-center justify-between">
                <View>
                  <Text className="text-sm font-bold text-amber-900">
                    4 Guests (Table for 4)
                  </Text>
                  <Text className="text-xs text-amber-700">
                    Available in 10–15 min • 3 tables in turnover
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    setIsTableModalVisible(false);
                    setIsJoinModalVisible(true);
                  }}
                  className="px-3.5 py-1.5 bg-amber-600 rounded-xl">
                  <Text className="text-xs font-bold text-white">Join Queue</Text>
                </Pressable>
              </View>

              <View className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 flex-row items-center justify-between">
                <View>
                  <Text className="text-sm font-bold text-neutral-800">
                    6–8 Guests (Large Booth)
                  </Text>
                  <Text className="text-xs text-neutral-500">
                    Available in ~25 min
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    setIsTableModalVisible(false);
                    setIsJoinModalVisible(true);
                  }}
                  className="px-3.5 py-1.5 bg-neutral-900 rounded-xl">
                  <Text className="text-xs font-bold text-white">Join Queue</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

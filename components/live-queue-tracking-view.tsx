import { Text } from '@/components/ui/text';
import {
  MOCK_POPULAR_RESTAURANTS,
  MOCK_RESTAURANTS,
  MOCK_TRENDING_RESTAURANTS,
} from '@/lib/mock-data';
import { Restaurant } from '@/types/queuebite';
import { triggerTableReadyNotification } from '@/lib/notification-service';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BarChart3Icon,
  BellIcon,
  CheckIcon,
  ClockIcon,
  FileTextIcon,
  InfoIcon,
  LogOutIcon,
  MapPinIcon,
  MoreVerticalIcon,
  NavigationIcon,
  PencilIcon,
  StarIcon,
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
  Switch,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LiveQueueTrackingViewProps {
  onClose?: () => void;
  isModal?: boolean;
  restaurantId?: string;
}

export function LiveQueueTrackingView({
  onClose,
  isModal = false,
  restaurantId,
}: LiveQueueTrackingViewProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Find restaurant or fallback to The Daily Bean
  const restaurant: Restaurant = React.useMemo(() => {
    const all = [
      ...MOCK_POPULAR_RESTAURANTS,
      ...MOCK_TRENDING_RESTAURANTS,
      ...MOCK_RESTAURANTS,
    ];
    if (restaurantId) {
      const found = all.find((r) => r.id === restaurantId);
      if (found) return found;
    }
    return MOCK_POPULAR_RESTAURANTS[0];
  }, [restaurantId]);

  // States
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  // Close handler
  function handleClose() {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  }

  // Leave queue handler
  function handleLeaveQueue() {
    Alert.alert(
      'Leave Queue',
      `Are you sure you want to give up your position #5 at ${restaurant.name}?`,
      [
        { text: 'Keep Spot', style: 'cancel' },
        {
          text: 'Leave Queue',
          style: 'destructive',
          onPress: () => {
            if (onClose) onClose();
            router.push('/');
          },
        },
      ]
    );
  }

  // Table ready transition & notification trigger
  async function handleTriggerTableReady() {
    await triggerTableReadyNotification(restaurant.name, 'A12');
    if (onClose) onClose();
    router.push({
      pathname: '/restaurant/table-ready',
      params: { id: restaurant.id, queueNumber: 'A12', partySize: '2' },
    });
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}>
        {/* 1. Hero Image Header with Overlay */}
        <View className="relative h-60 w-full bg-neutral-900">
          <Image
            source={{ uri: restaurant.image }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* Top Bar Navigation (Back/Close, Bell, More) */}
          <View
            className="absolute top-0 left-0 right-0 px-4 flex-row items-center justify-between z-20"
            style={{ paddingTop: insets.top + (isModal ? 4 : 8) }}>
            {/* Back / Close Button */}
            <Pressable
              onPress={handleClose}
              className="size-10 rounded-full bg-white/90 backdrop-blur-md items-center justify-center shadow-md active:bg-white"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              {isModal ? (
                <XIcon size={20} color="#18181b" />
              ) : (
                <ArrowLeftIcon size={20} color="#18181b" />
              )}
            </Pressable>

            {/* Right Buttons: Bell with Red Dot + More Menu */}
            <View className="flex-row items-center gap-2.5">
              <Pressable
                onPress={() =>
                  Alert.alert(
                    'Queue Alerts',
                    `You will be notified as soon as you reach position #1.`
                  )
                }
                className="size-10 rounded-full bg-white/90 backdrop-blur-md items-center justify-center shadow-md active:bg-white relative"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <BellIcon size={18} color="#18181b" />
                <View className="absolute top-2 right-2.5 size-2 rounded-full bg-[#dc2626] border border-white" />
              </Pressable>

              <Pressable
                onPress={() =>
                  Alert.alert(
                    'Queue Options',
                    `${restaurant.name}\nTicket #A12\nJoined at 7:24 PM`
                  )
                }
                className="size-10 rounded-full bg-white/90 backdrop-blur-md items-center justify-center shadow-md active:bg-white"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <MoreVerticalIcon size={18} color="#18181b" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* 2. Restaurant Summary Card (Overlapping) */}
        <View className="-mt-7 mx-4 bg-white rounded-xl p-3.5 shadow-sm border border-neutral-100 flex-row items-center justify-between mb-4">
          {/* Left Thumbnail & Info */}
          <View className="flex-row items-center gap-3 flex-1 pr-2">
            <Image
              source={{ uri: restaurant.image }}
              className="size-16 rounded-2xl bg-neutral-100"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text
                className="text-base font-bold text-neutral-900"
                numberOfLines={1}>
                {restaurant.name}
              </Text>
              <Text
                className="text-xs text-neutral-500 mt-0.5"
                numberOfLines={1}>
                {restaurant.categories
                  ? restaurant.categories.join('  •  ')
                  : restaurant.cuisine}
              </Text>

              {/* Rating */}
              <View className="flex-row items-center mt-1">
                <StarIcon size={13} color="#eab308" fill="#eab308" />
                <Text className="text-xs font-bold text-neutral-900 ml-1">
                  {restaurant.rating.toFixed(1)}
                </Text>
                <Text className="text-xs text-neutral-400 ml-1">
                  ({restaurant.reviewCount >= 1000 ? `${(restaurant.reviewCount / 1000).toFixed(1)}k` : restaurant.reviewCount} reviews)
                </Text>
              </View>

              {/* Location */}
              <View className="flex-row items-center mt-1">
                <MapPinIcon size={12} color="#dc2626" />
                <Text
                  className="text-xs text-neutral-600 ml-1"
                  numberOfLines={1}>
                  {restaurant.address.split(',')[0]} • {restaurant.distance}
                </Text>
              </View>
            </View>
          </View>

          {/* Right Status Badge & View Details Button */}
          <View className="items-end justify-between self-stretch py-0.5">
            <View className="bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
              <Text className="text-[11px] font-bold text-emerald-700">
                Open Now
              </Text>
            </View>

            <Pressable
              onPress={() => {
                if (onClose) onClose();
                router.push({
                  pathname: '/restaurant/[id]',
                  params: { id: restaurant.id },
                });
              }}
              className="bg-red-50/70 border border-red-200/60 rounded-full px-2.5 py-1.5 flex-row items-center gap-1 active:bg-red-100">
              <Text className="text-xs font-bold text-[#dc2626]">
                View Details
              </Text>
              <ArrowRightIcon size={12} color="#dc2626" />
            </Pressable>
          </View>
        </View>

        {/* 3. Queue Position & Live Estimate Card */}
        <View className="mx-4 bg-[#fdf6f0] border border-[#fbdcc8] rounded-xl p-5 mb-4 shadow-xs">
          <View className="flex-row items-center justify-between">
            {/* Left Column: Circular Position Progress Ring */}
            <View className="items-center justify-center">
              <View className="relative size-36 items-center justify-center">
                {/* Outer Ring Background */}
                <View className="absolute inset-0 rounded-full border-[10px] border-[#fee2e2]" />

                {/* Simulated Circular Arc (Red Border on top/right quadrants) */}
                <View className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-[#dc2626] border-r-[#dc2626] rotate-45" />

                {/* Inner Content */}
                <View className="items-center">
                  <Text className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                    YOUR POSITION
                  </Text>
                  <Text className="text-5xl font-extrabold text-[#dc2626] my-0.5">
                    5
                  </Text>
                  <Text className="text-[10px] text-neutral-500">
                    Groups ahead
                  </Text>
                  <Text className="text-sm font-extrabold text-neutral-900">
                    4
                  </Text>
                </View>
              </View>
            </View>

            {/* Right Column: Wait Time & Position Disclaimer */}
            <View className="flex-1 pl-4">
              {/* Estimated Wait */}
              <View className="flex-row items-start gap-2.5 mb-3">
                <View className="size-8 rounded-full bg-[#fee2e2] items-center justify-center mt-0.5">
                  <ClockIcon size={16} color="#dc2626" />
                </View>
                <View>
                  <Text className="text-xs font-medium text-neutral-500">
                    Estimated Wait Time
                  </Text>
                  <Text className="text-xl font-extrabold text-neutral-900 mt-0.5">
                    15 – 25 min
                  </Text>
                  <Text className="text-[10px] text-neutral-400 mt-0.5">
                    Updated 2 mins ago
                  </Text>
                </View>
              </View>

              {/* Disclaimer Box */}
              <View className="bg-white/80 border border-[#f5d5c0] rounded-2xl p-2.5 flex-row items-start gap-2">
                <View className="size-4 rounded-full bg-[#fee2e2] items-center justify-center mt-0.5">
                  <InfoIcon size={10} color="#dc2626" />
                </View>
                <Text className="text-[10px] text-neutral-600 leading-snug flex-1">
                  Your position may change based on restaurant operations, table availability and party sizes.
                </Text>
              </View>
            </View>
          </View>

          {/* Stepper Progress */}
          <View className="mt-5 pt-3 border-t border-[#f4d1bc]">
            {/* Stepper Dots & Line */}
            <View className="flex-row items-center justify-between px-3">
              {/* Step 1: Joined */}
              <View className="size-6 rounded-full bg-[#dc2626] items-center justify-center z-10">
                <CheckIcon size={13} color="#ffffff" strokeWidth={3} />
              </View>

              {/* Red Line */}
              <View className="flex-1 h-0.5 bg-[#dc2626] -mx-1" />

              {/* Step 2: Waiting */}
              <View className="size-6 rounded-full bg-[#dc2626] items-center justify-center z-10">
                <CheckIcon size={13} color="#ffffff" strokeWidth={3} />
              </View>

              {/* Gray Line */}
              <View className="flex-1 h-0.5 bg-neutral-200 -mx-1" />

              {/* Step 3: Your Turn */}
              <View className="size-6 rounded-full bg-neutral-200 items-center justify-center z-10" />

              {/* Gray Line */}
              <View className="flex-1 h-0.5 bg-neutral-200 -mx-1" />

              {/* Step 4: Ready (Tap to trigger table ready) */}
              <Pressable
                onPress={handleTriggerTableReady}
                className="size-6 rounded-full bg-red-100 border border-[#dc2626] items-center justify-center z-10 active:scale-95"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <View className="size-2 rounded-full bg-[#dc2626] animate-pulse" />
              </Pressable>
            </View>

            {/* Labels under stepper */}
            <View className="flex-row items-start justify-between mt-2">
              <View className="w-16 items-center">
                <Text className="text-[10px] font-bold text-neutral-800 text-center leading-tight">
                  Joined Queue{'\n'}7:24 PM
                </Text>
              </View>

              <View className="w-24 items-center">
                <Text className="text-[10px] font-bold text-neutral-800 text-center leading-tight">
                  Waiting{'\n'}(4 groups ahead)
                </Text>
              </View>

              <View className="w-16 items-center">
                <Text className="text-[10px] text-neutral-400 text-center leading-tight">
                  Your Turn{'\n'}Soon
                </Text>
              </View>

              <Pressable
                onPress={handleTriggerTableReady}
                className="w-20 items-center active:opacity-70"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text className="text-[10px] font-bold text-[#dc2626] text-center leading-tight">
                  Get Notified{'\n'}When Ready
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* 4. "Live Queue Updates" Section */}
        <View className="mx-4 mb-4">
          <View className="flex-row items-center justify-between mb-2.5">
            <Text className="text-base font-bold text-neutral-900 tracking-tight">
              Live Queue Updates
            </Text>
            <Pressable
              onPress={() =>
                Alert.alert(
                  'Queue History',
                  'Showing recent dining group turnover for The Daily Bean.'
                )
              }
              className="flex-row items-center active:opacity-70 py-1"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text className="text-xs font-bold text-[#dc2626] mr-0.5">
                View All
              </Text>
              <ArrowRightIcon size={12} color="#dc2626" />
            </Pressable>
          </View>

          <View className="bg-white rounded-xl p-4 border border-neutral-100 shadow-sm flex-row items-start justify-between">
            {/* Left: Event Timeline */}
            <View className="flex-1 pr-2">
              {/* Event 1 */}
              <View className="flex-row items-start gap-2.5">
                <View className="items-center">
                  <View className="size-2 rounded-full bg-neutral-400 mt-1" />
                  <View className="w-0.5 h-6 bg-neutral-200" />
                </View>
                <View>
                  <Text className="text-xs font-semibold text-neutral-800">
                    Group of 3 seated
                  </Text>
                  <Text className="text-[10px] text-neutral-400">
                    2 mins ago
                  </Text>
                </View>
              </View>

              {/* Event 2 (You're now 5th) */}
              <View className="flex-row items-start gap-2.5">
                <View className="items-center">
                  <View className="size-2 rounded-full bg-[#dc2626] mt-1" />
                  <View className="w-0.5 h-6 bg-neutral-200" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-[#dc2626]">
                    You&apos;re now 5th in queue
                  </Text>
                  <Text className="text-[10px] text-neutral-400">
                    5 mins ago
                  </Text>
                </View>
              </View>

              {/* Event 3 */}
              <View className="flex-row items-start gap-2.5">
                <View className="items-center">
                  <View className="size-2 rounded-full bg-neutral-400 mt-1" />
                  <View className="w-0.5 h-6 bg-neutral-200" />
                </View>
                <View>
                  <Text className="text-xs font-semibold text-neutral-800">
                    Group of 4 seated
                  </Text>
                  <Text className="text-[10px] text-neutral-400">
                    8 mins ago
                  </Text>
                </View>
              </View>

              {/* Event 4 */}
              <View className="flex-row items-start gap-2.5">
                <View className="items-center">
                  <View className="size-2 rounded-full bg-neutral-400 mt-1" />
                </View>
                <View>
                  <Text className="text-xs font-semibold text-neutral-800">
                    Group of 2 seated
                  </Text>
                  <Text className="text-[10px] text-neutral-400">
                    12 mins ago
                  </Text>
                </View>
              </View>
            </View>

            {/* Right: Moving at normal pace card */}
            <View className="bg-[#fef6f0] border border-[#fbdcc8] rounded-2xl p-3 w-40 ml-1">
              <BarChart3Icon size={20} color="#dc2626" />
              <Text className="text-xs font-bold text-neutral-900 mt-1.5 leading-snug">
                Queue is moving at a normal pace
              </Text>
              <Text className="text-[10px] text-neutral-500 mt-1 leading-snug">
                On average, a group is seated every 5–7 minutes.
              </Text>
            </View>
          </View>
        </View>

        {/* 5. "Your Party" Card with Avatars */}
        <View className="mx-4 bg-white border border-neutral-200/80 rounded-2xl p-3.5 shadow-xs mb-3">
          <View className="flex-row items-center justify-between mb-2.5">
            <View className="flex-row items-center gap-3">
              <View className="size-10 rounded-full bg-[#fee2e2] items-center justify-center">
                <UsersIcon size={18} color="#dc2626" />
              </View>
              <View>
                <Text className="text-sm font-bold text-neutral-900">
                  Your Party
                </Text>
                <Text className="text-xs text-neutral-500 mt-0.5">
                  2 People
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/restaurant/join',
                  params: { id: restaurant.id, initialParty: '2' },
                })
              }
              className="border border-neutral-200 px-3 py-1.5 rounded-xl flex-row items-center gap-1 active:bg-neutral-50"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <PencilIcon size={13} color="#18181b" />
              <Text className="text-xs font-semibold text-neutral-800">Edit</Text>
            </Pressable>
          </View>

          {/* Members Row */}
          <View className="flex-row items-center gap-4 pl-12 pt-1">
            {/* Host: You */}
            <View className="flex-row items-center gap-2">
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
                }}
                className="size-8 rounded-full border border-neutral-200"
              />
              <View>
                <Text className="text-xs font-bold text-neutral-900">You</Text>
                <Text className="text-[10px] text-neutral-400">Host</Text>
              </View>
            </View>

            {/* Member: Riya */}
            <View className="flex-row items-center gap-2">
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
                }}
                className="size-8 rounded-full border border-neutral-200"
              />
              <View>
                <Text className="text-xs font-bold text-neutral-900">Riya</Text>
                <Text className="text-[10px] text-neutral-400">Member</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 6. "Special Requests" Card */}
        <View className="mx-4 bg-white border border-neutral-200/80 rounded-2xl p-3.5 shadow-xs mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="size-10 rounded-full bg-[#fee2e2] items-center justify-center">
              <FileTextIcon size={18} color="#dc2626" />
            </View>
            <View>
              <Text className="text-sm font-bold text-neutral-900">
                Special Requests
              </Text>
              <Text className="text-xs text-neutral-500 mt-0.5">
                None
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() =>
              router.push({
                pathname: '/restaurant/join',
                params: { id: restaurant.id, initialParty: '2' },
              })
            }
            className="border border-neutral-200 px-3 py-1.5 rounded-xl flex-row items-center gap-1 active:bg-neutral-50"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <PencilIcon size={13} color="#18181b" />
            <Text className="text-xs font-semibold text-neutral-800">Edit</Text>
          </Pressable>
        </View>

        {/* 7. Notification Push Switch Banner */}
        <View className="mx-4 mb-4 bg-[#fef4ec] border border-[#fcdbc7] rounded-2xl p-3.5 flex-row items-center justify-between shadow-xs">
          <View className="flex-row items-center gap-3 flex-1 pr-2">
            <View className="size-10 rounded-full bg-[#dc2626] items-center justify-center">
              <BellIcon size={18} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-neutral-900">
                We&apos;ll notify you when it&apos;s your turn!
              </Text>
              <Text className="text-[10px] text-neutral-500 mt-0.5">
                Keep notifications on so you don&apos;t miss your table.
              </Text>
            </View>
          </View>

          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ true: '#dc2626', false: '#e4e4e7' }}
            thumbColor="#ffffff"
          />
        </View>

        {/* 8. Action Buttons */}
        <View className="px-4 gap-2.5">
          {/* View on Map Button */}
          <Pressable
            onPress={() => {
              if (onClose) onClose();
              router.push('/');
            }}
            style={{ height: 56 }}
            className="w-full rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] flex-row items-center justify-center gap-2 shadow-md shadow-red-500/20 px-6">
            <NavigationIcon size={18} color="#ffffff" strokeWidth={2.2} />
            <Text className="text-sm font-bold text-white tracking-wide">
              View on Map
            </Text>
          </Pressable>

          {/* Leave Queue Button */}
          <Pressable
            onPress={handleLeaveQueue}
            style={{ height: 56 }}
            className="w-full rounded-2xl bg-white border border-[#dc2626] active:bg-red-50/60 flex-row items-center justify-center gap-2 px-6">
            <LogOutIcon size={18} color="#dc2626" strokeWidth={2} />
            <Text className="text-sm font-bold text-[#dc2626]">
              Leave Queue
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

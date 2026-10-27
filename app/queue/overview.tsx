import { BottomNav, TabKey } from '@/components/bottom-nav';
import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { Restaurant } from '@/types/queuebite';
import { useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BellIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ClockIcon,
  CompassIcon,
  Edit3Icon,
  HeartHandshakeIcon,
  HistoryIcon,
  InfoIcon,
  LogOutIcon,
  MapPinIcon,
  NavigationIcon,
  PhoneIcon,
  QrCodeIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  UserCheckIcon,
  UsersIcon,
  UtensilsCrossedIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Animated,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

export default function MyQueueOverviewScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Active queue state
  const [hasActiveQueue, setHasActiveQueue] = React.useState(true);
  const [position, setPosition] = React.useState(5);
  const [partiesAhead, setPartiesAhead] = React.useState(4);
  const [partySize, setPartySize] = React.useState(2);
  const [specialNote, setSpecialNote] = React.useState('High chair needed, quiet booth');

  const restaurant: Restaurant = MOCK_POPULAR_RESTAURANTS[0]; // The Daily Bean

  // Gauge animation
  const animatedProgress = React.useRef(new Animated.Value(0.4)).current;

  // Circular gauge calculations
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * (10 - position)) / 10;

  function handleCall() {
    const phone = restaurant.phone || '+919876543210';
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Call Restaurant', `Calling ${restaurant.name} at ${phone}`);
    });
  }

  function handleDirections() {
    const address = encodeURIComponent(`${restaurant.name}, ${restaurant.address}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`).catch(() => {
      Alert.alert('Directions', `Opening directions to ${restaurant.address}`);
    });
  }

  return (
    <View className="flex-1 bg-[#faf8f5]">
      <StatusBar barStyle="dark-content" />

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
            <Text className="text-xl font-bold text-neutral-900 tracking-tight">
              My Live Queue
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Real-time waitlist tracker
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          {/* Notifications Icon */}
          <Pressable
            onPress={() => router.push('/notifications')}
            className="size-9 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200">
            <BellIcon size={18} color="#18181b" />
          </Pressable>
          {/* History Icon */}
          <Pressable
            onPress={() => router.push('/queue/history')}
            className="size-9 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200">
            <HistoryIcon size={18} color="#18181b" />
          </Pressable>
          <BrandLogo size="sm" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>
        {!hasActiveQueue ? (
          /* Empty Queue State */
          <View className="px-5 pt-12 items-center justify-center">
            <View className="size-20 rounded-full bg-red-50 items-center justify-center mb-4">
              <UtensilsCrossedIcon size={36} color="#dc2626" />
            </View>
            <Text className="text-xl font-bold text-neutral-900 text-center">
              No Active Queue
            </Text>
            <Text className="text-xs text-neutral-500 text-center mt-1.5 max-w-[260px] leading-relaxed">
              You are not currently in any waiting line. Browse popular restaurants nearby and skip the wait!
            </Text>

            <Pressable
              onPress={() => router.push('/explore')}
              className="mt-6 px-6 py-3.5 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] shadow-md shadow-red-500/25">
              <Text className="text-xs font-bold text-white tracking-wide">
                Explore Restaurants
              </Text>
            </Pressable>

            {/* Dev Simulator Button */}
            <Pressable
              onPress={() => setHasActiveQueue(true)}
              className="mt-8 py-2 px-4 rounded-full bg-neutral-200/80 active:bg-neutral-300">
              <Text className="text-[11px] font-bold text-neutral-700">
                Simulate Joining Queue
              </Text>
            </Pressable>
          </View>
        ) : (
          /* Active Queue View */
          <View className="px-5 pt-4">
            {/* 1. Restaurant Summary Card */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/restaurant/[id]',
                  params: { id: restaurant.id },
                })
              }
              className="bg-white rounded-xl p-4 border border-neutral-100 shadow-sm flex-row items-center justify-between mb-4 active:bg-neutral-50">
              <View className="flex-row items-center gap-3 flex-1 pr-2">
                <Image
                  source={{ uri: restaurant.image }}
                  className="size-16 rounded-2xl bg-neutral-100"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <View className="flex-row items-center gap-1.5">
                    <View className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <Text className="text-xs font-bold text-emerald-700">In Line</Text>
                  </View>
                  <Text className="text-base font-bold text-neutral-900" numberOfLines={1}>
                    {restaurant.name}
                  </Text>
                  <Text className="text-xs text-neutral-500 mt-0.5" numberOfLines={1}>
                    {restaurant.address.split(',')[0]} • {restaurant.distance}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-1.5">
                <Pressable
                  onPress={handleCall}
                  className="size-9 rounded-full bg-red-50 border border-red-200/80 items-center justify-center active:bg-red-100">
                  <PhoneIcon size={14} color="#dc2626" />
                </Pressable>
                <Pressable
                  onPress={handleDirections}
                  className="size-9 rounded-full bg-red-50 border border-red-200/80 items-center justify-center active:bg-red-100">
                  <CompassIcon size={14} color="#dc2626" />
                </Pressable>
              </View>
            </Pressable>

            {/* 2. Position Circular Gauge Card */}
            <View className="bg-white rounded-xl p-6 border border-neutral-100 shadow-sm items-center mb-4">
              <View className="relative items-center justify-center mb-3">
                <Svg width={size} height={size}>
                  {/* Background Track */}
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#fee2e2"
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  {/* Active Progress Arc */}
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#dc2626"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  />
                </Svg>

                {/* Center Badge Content */}
                <View className="absolute items-center justify-center">
                  <Text className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Your Spot
                  </Text>
                  <Text className="text-5xl font-bold text-neutral-900 tracking-tight my-0.5">
                    #{position}
                  </Text>
                  <Text className="text-[11px] font-bold text-[#dc2626]">
                    {partiesAhead} parties ahead
                  </Text>
                </View>
              </View>

              {/* Estimated Seating Time Callout */}
              <View className="w-full bg-[#fef7f2] border border-[#fed7aa]/50 rounded-2xl p-3.5 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="size-8 rounded-full bg-[#fee2e2] items-center justify-center">
                    <ClockIcon size={16} color="#dc2626" />
                  </View>
                  <View>
                    <Text className="text-xs font-bold text-neutral-900">Estimated Seating</Text>
                    <Text className="text-[10px] text-neutral-500">Based on live table turnover</Text>
                  </View>
                </View>
                <Text className="text-sm font-bold text-[#dc2626]">~12 mins</Text>
              </View>
            </View>

            {/* 3. Ticket Info & Quick Actions */}
            <View className="bg-white rounded-xl p-4 border border-neutral-100 shadow-sm mb-4">
              <View className="flex-row items-center justify-between pb-3 border-b border-neutral-100">
                <View>
                  <Text className="text-[10px] font-semibold text-neutral-400">Queue Token</Text>
                  <Text className="text-lg font-bold text-neutral-900">A12</Text>
                </View>

                <View>
                  <Text className="text-[10px] font-semibold text-neutral-400">Party Size</Text>
                  <Text className="text-base font-bold text-neutral-900">{partySize} Guests</Text>
                </View>

                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/queue/[id]',
                      params: { id: restaurant.id },
                    })
                  }
                  className="px-3 py-1.5 rounded-full bg-neutral-100 flex-row items-center gap-1 active:bg-neutral-200">
                  <QrCodeIcon size={12} color="#18181b" />
                  <Text className="text-xs font-bold text-neutral-800">Pass</Text>
                </Pressable>
              </View>

              {/* Action Rows: Edit Party & Special Requests */}
              <View className="pt-2 gap-1">
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/queue/edit-party',
                      params: { currentSize: partySize.toString() },
                    })
                  }
                  className="py-2.5 flex-row items-center justify-between active:opacity-70">
                  <View className="flex-row items-center gap-2.5">
                    <UsersIcon size={16} color="#dc2626" />
                    <Text className="text-xs font-bold text-neutral-800">
                      Edit Party Size ({partySize} People)
                    </Text>
                  </View>
                  <ChevronRightIcon size={14} color="#71717a" />
                </Pressable>

                <View className="h-px bg-neutral-100" />

                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/queue/special-requests',
                      params: { note: specialNote },
                    })
                  }
                  className="py-2.5 flex-row items-center justify-between active:opacity-70">
                  <View className="flex-row items-center gap-2.5">
                    <Edit3Icon size={16} color="#dc2626" />
                    <Text className="text-xs font-bold text-neutral-800">
                      Special Requests & Seating
                    </Text>
                  </View>
                  <ChevronRightIcon size={14} color="#71717a" />
                </Pressable>

                <View className="h-px bg-neutral-100" />

                <Pressable
                  onPress={() => router.push('/group/queue')}
                  className="py-2.5 flex-row items-center justify-between active:opacity-70">
                  <View className="flex-row items-center gap-2.5">
                    <UsersIcon size={16} color="#dc2626" />
                    <Text className="text-xs font-bold text-neutral-800">
                      Group Dining Mode (Shared Token)
                    </Text>
                  </View>
                  <ChevronRightIcon size={14} color="#71717a" />
                </Pressable>

                <View className="h-px bg-neutral-100" />

                <Pressable
                  onPress={() => router.push('/order/menu')}
                  className="py-2.5 flex-row items-center justify-between active:opacity-70">
                  <View className="flex-row items-center gap-2.5">
                    <UtensilsCrossedIcon size={16} color="#dc2626" />
                    <Text className="text-xs font-bold text-neutral-800">
                      Pre-Order Food (Kitchen Sync)
                    </Text>
                  </View>
                  <ChevronRightIcon size={14} color="#71717a" />
                </Pressable>
              </View>
            </View>

            {/* 4. Queue Stage Stepper */}
            <View className="bg-white rounded-xl p-4 border border-neutral-100 shadow-sm mb-4">
              <Text className="text-xs font-bold text-neutral-900 mb-3">Live Queue Milestones</Text>

              {/* Step 1: Confirmed */}
              <View className="flex-row items-start gap-2.5">
                <View className="items-center">
                  <View className="size-5 rounded-full bg-[#16a34a] items-center justify-center">
                    <CheckCircle2Icon size={12} color="#ffffff" strokeWidth={3} />
                  </View>
                  <View className="w-0.5 h-6 bg-[#16a34a]" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-neutral-900">Waitlist Confirmed</Text>
                  <Text className="text-[10px] text-neutral-400">Ticket A12 assigned at 7:15 PM</Text>
                </View>
              </View>

              {/* Step 2: In Queue */}
              <View className="flex-row items-start gap-2.5">
                <View className="items-center">
                  <View className="size-5 rounded-full bg-[#dc2626] items-center justify-center">
                    <ClockIcon size={11} color="#ffffff" strokeWidth={3} />
                  </View>
                  <View className="w-0.5 h-6 bg-neutral-200" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-[#dc2626]">Advancing in Line (Spot #5)</Text>
                  <Text className="text-[10px] text-neutral-500">Host managing tables</Text>
                </View>
              </View>

              {/* Step 3: Table Ready */}
              <View className="flex-row items-start gap-2.5">
                <View className="items-center">
                  <View className="size-5 rounded-full bg-neutral-200 items-center justify-center" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-neutral-500">Table Ready Notice</Text>
                  <Text className="text-[10px] text-neutral-400">10-min arrival countdown</Text>
                </View>
              </View>
            </View>

            {/* 5. Simulation & Transition Shortcuts */}
            <View className="mb-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5">
              <View className="flex-row items-center gap-1.5 mb-2">
                <SparklesIcon size={14} color="#b45309" />
                <Text className="text-xs font-bold text-amber-900">Queue Stage Simulator</Text>
              </View>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => router.push('/queue/nearly-up')}
                  className="flex-1 py-2 rounded-xl bg-white border border-amber-300 items-center justify-center active:bg-amber-100">
                  <Text className="text-[11px] font-bold text-amber-900">Nearly Up (#1)</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/restaurant/table-ready')}
                  className="flex-1 py-2 rounded-xl bg-white border border-amber-300 items-center justify-center active:bg-amber-100">
                  <Text className="text-[11px] font-bold text-amber-900">Table Ready!</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/queue/expired')}
                  className="flex-1 py-2 rounded-xl bg-white border border-amber-300 items-center justify-center active:bg-amber-100">
                  <Text className="text-[11px] font-bold text-amber-900">Expired Turn</Text>
                </Pressable>
              </View>
            </View>

            {/* 6. Leave Queue Action */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/queue/leave-confirm',
                  params: {
                    restaurantName: restaurant.name,
                    position: position.toString(),
                  },
                })
              }
              className="w-full h-12 rounded-2xl bg-white border border-neutral-300 active:bg-red-50 flex-row items-center justify-center gap-2">
              <LogOutIcon size={16} color="#dc2626" />
              <Text className="text-xs font-bold text-[#dc2626]">Leave Queue</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav
        activeTab="MY_QUEUE"
        onTabChange={(tab: TabKey) => {
          if (tab === 'HOME') router.push('/');
          else if (tab === 'EXPLORE') router.push('/explore');
          else if (tab === 'SAVED') router.push('/saved');
          else if (tab === 'PROFILE') router.push('/profile/overview');
        }}
        hasActiveQueue={hasActiveQueue}
      />
    </View>
  );
}

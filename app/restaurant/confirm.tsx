import { Text } from '@/components/ui/text';
import {
  MOCK_POPULAR_RESTAURANTS,
  MOCK_RESTAURANTS,
  MOCK_TRENDING_RESTAURANTS,
} from '@/lib/mock-data';
import { Restaurant } from '@/types/queuebite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BellIcon,
  CheckIcon,
  ClockIcon,
  CompassIcon,
  FileTextIcon,
  LogOutIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  Share2Icon,
  StarIcon,
  UsersIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function QueueConfirmScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    partySize?: string;
    queueNumber?: string;
    requests?: string;
  }>();

  // Find restaurant or fallback to The Daily Bean
  const restaurant: Restaurant = React.useMemo(() => {
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

  const partySize = params.partySize || '2';
  const queueNumber = params.queueNumber || 'A12';
  const specialRequests = params.requests || 'None';

  // Confetti float animation
  const confettiAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(confettiAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [confettiAnim]);

  // Share queue status
  async function handleShare() {
    try {
      await Share.share({
        title: `Queue Ticket: ${queueNumber}`,
        message: `I'm in line at ${restaurant.name}! Queue ticket #${queueNumber}. Estimated wait is ${restaurant.waitRange}. Track with QueueBite.`,
      });
    } catch {
      Alert.alert('Link Copied', `Queue ticket #${queueNumber} link copied!`);
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

  // Notify Me / Live Tracking
  function handleNotifyMe() {
    router.push({
      pathname: '/restaurant/live-queue',
      params: { id: restaurant.id },
    });
  }

  // Leave Queue with confirmation
  function handleLeaveQueue() {
    Alert.alert(
      'Leave Queue',
      `Are you sure you want to cancel ticket #${queueNumber} at ${restaurant.name}? You will lose your spot in line.`,
      [
        { text: 'Keep My Spot', style: 'cancel' },
        {
          text: 'Leave Queue',
          style: 'destructive',
          onPress: () => router.push('/'),
        },
      ]
    );
  }

  // Confetti particles definition
  const confettiParticles = [
    { top: 25, left: 45, width: 7, height: 16, rotate: '-25deg', color: '#16a34a' },
    { top: 15, left: 110, width: 8, height: 18, rotate: '30deg', color: '#f87171' },
    { top: 75, left: 40, width: 8, height: 14, rotate: '45deg', color: '#dc2626' },
    { top: 65, left: 95, width: 14, height: 6, rotate: '-15deg', color: '#86efac' },
    { top: 110, left: 30, width: 7, height: 18, rotate: '-40deg', color: '#16a34a' },
    { top: 30, right: 90, width: 7, height: 16, rotate: '40deg', color: '#16a34a' },
    { top: 75, right: 60, width: 8, height: 16, rotate: '-35deg', color: '#fca5a5' },
    { top: 60, right: 20, width: 8, height: 8, rotate: '15deg', color: '#fecaca', rounded: true },
    { top: 115, right: 35, width: 7, height: 18, rotate: '45deg', color: '#dc2626' },
  ];

  return (
    <View className="flex-1 bg-[#faf8f5]">
      <StatusBar barStyle="dark-content" />

      {/* Top Navigation Bar */}
      <View
        className="px-4 flex-row items-center justify-between z-20"
        style={{ paddingTop: insets.top + 8 }}>
        <Pressable
          onPress={() => router.push('/')}
          className="size-10 rounded-full bg-white items-center justify-center border border-neutral-200/80 shadow-xs active:bg-neutral-100"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ArrowLeftIcon size={20} color="#18181b" />
        </Pressable>

        <Pressable
          onPress={handleShare}
          className="bg-white border border-neutral-200/80 rounded-full px-3.5 py-1.5 flex-row items-center gap-1.5 shadow-xs active:bg-neutral-100"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Share2Icon size={15} color="#18181b" />
          <Text className="text-xs font-bold text-neutral-800">Share</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}>
        {/* 1. Header with Success Ring and Confetti Celebration */}
        <View className="relative items-center pt-2 pb-6 px-5">
          {/* Confetti Sprinkles */}
          {confettiParticles.map((p, index) => (
            <Animated.View
              key={index}
              style={{
                position: 'absolute',
                top: p.top,
                left: p.left,
                right: p.right,
                width: p.width,
                height: p.height,
                backgroundColor: p.color,
                borderRadius: p.rounded ? 99 : 3,
                transform: [
                  { rotate: p.rotate },
                  {
                    translateY: confettiAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, index % 2 === 0 ? 5 : -5],
                    }),
                  },
                ],
              }}
            />
          ))}

          {/* Concentric Success Circles */}
          <View className="size-28 rounded-full bg-[#fde8e8]/70 items-center justify-center my-3">
            <View className="size-20 rounded-full bg-[#fcd4d4]/90 items-center justify-center">
              <View className="size-12 rounded-full bg-[#16a34a] items-center justify-center shadow-sm">
                <CheckIcon size={24} color="#ffffff" strokeWidth={3} />
              </View>
            </View>
          </View>

          {/* Headline & Subtitle */}
          <Text className="text-2xl font-extrabold text-neutral-900 tracking-tight text-center">
            You&apos;re in the Queue!
          </Text>
          <Text className="text-xs text-neutral-500 text-center mt-1.5 max-w-[260px] leading-relaxed">
            We&apos;ve added you to the live queue at {restaurant.name}.
          </Text>
        </View>

        {/* 2. Restaurant Summary Card */}
        <View className="mx-4 bg-white rounded-3xl p-3.5 shadow-sm border border-neutral-100 flex-row items-center justify-between mb-4">
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
                <StarIcon size={12} color="#eab308" fill="#eab308" />
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

          {/* Action Buttons: Call & Directions */}
          <View className="gap-2">
            <Pressable
              onPress={handleCall}
              className="bg-red-50/70 border border-red-200/70 rounded-full px-3 py-1.5 flex-row items-center gap-1.5 active:bg-red-100">
              <PhoneIcon size={12} color="#dc2626" />
              <Text className="text-xs font-bold text-[#dc2626]">Call</Text>
            </Pressable>

            <Pressable
              onPress={handleDirections}
              className="bg-red-50/70 border border-red-200/70 rounded-full px-3 py-1.5 flex-row items-center gap-1.5 active:bg-red-100">
              <CompassIcon size={12} color="#dc2626" />
              <Text className="text-xs font-bold text-[#dc2626]">Directions</Text>
            </Pressable>
          </View>
        </View>

        {/* 3. YOUR QUEUE NUMBER Card */}
        <View className="mx-4 bg-[#fdf6f0] border border-[#fcdbc7] rounded-3xl p-5 mb-4 shadow-xs">
          {/* Header Row: Label + Active Chip */}
          <View className="flex-row items-center justify-between">
            <Text className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider">
              YOUR QUEUE NUMBER
            </Text>
            <View className="flex-row items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
              <View className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <Text className="text-xs font-bold text-emerald-700">
                Active
              </Text>
            </View>
          </View>

          {/* Ticket Number & Joined Time */}
          <View className="flex-row items-baseline justify-between mt-1 mb-3">
            <Text className="text-5xl font-extrabold text-[#dc2626] tracking-tight">
              {queueNumber}
            </Text>
            <View className="items-end">
              <Text className="text-xs font-semibold text-neutral-600">
                Joined at 7:24 PM
              </Text>
              <Text className="text-xs text-neutral-400 mt-0.5">
                Today, 4 Oct 2026
              </Text>
            </View>
          </View>

          {/* Metrics Sub-card */}
          <View className="bg-[#fef8f4] border border-[#fbdcc8] rounded-2xl p-3 flex-row items-center justify-between">
            {/* Left: Estimated Wait */}
            <View className="flex-1 flex-row items-center gap-3">
              <View className="size-11 rounded-full bg-[#fee2e2] items-center justify-center">
                <ClockIcon size={20} color="#dc2626" />
              </View>
              <View>
                <Text className="text-xs text-neutral-500 font-medium">
                  Estimated Wait Time
                </Text>
                <Text className="text-base font-extrabold text-neutral-900 mt-0.5">
                  15 – 25 min
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View className="w-px h-10 bg-[#fbdcc8] mx-2" />

            {/* Right: Groups Ahead */}
            <View className="flex-1 flex-row items-center gap-3 pl-2">
              <View className="size-11 rounded-full bg-[#fee2e2] items-center justify-center">
                <UsersIcon size={20} color="#dc2626" />
              </View>
              <View>
                <Text className="text-xs text-neutral-500 font-medium">
                  Groups Ahead
                </Text>
                <Text className="text-lg font-extrabold text-neutral-900 mt-0.5">
                  4
                </Text>
              </View>
            </View>
          </View>

          {/* Queue Progress Stepper */}
          <View className="mt-5">
            <Text className="text-xs font-bold text-neutral-900 mb-3.5">
              Queue Progress
            </Text>

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

              {/* Step 4: Ready */}
              <View className="size-6 rounded-full bg-neutral-200 items-center justify-center z-10" />
            </View>

            {/* Labels under stepper */}
            <View className="flex-row items-start justify-between mt-2">
              <View className="w-16 items-center">
                <Text className="text-[10px] font-bold text-neutral-800 text-center leading-tight">
                  Joined{'\n'}Queue
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

              <View className="w-20 items-center">
                <Text className="text-[10px] text-neutral-400 text-center leading-tight">
                  Get Notified{'\n'}When Ready
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 4. Please Note Card */}
        <View className="mx-4 mb-3">
          <View className="bg-[#fef9ee] border border-[#fef08a] rounded-2xl p-3.5 flex-row items-start gap-3 shadow-xs">
            <View className="size-6 rounded-full bg-[#facc15] items-center justify-center mt-0.5">
              <ClockIcon size={14} color="#ffffff" strokeWidth={2.5} />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-neutral-900">
                Please Note
              </Text>
              <Text className="text-[11px] text-neutral-600 leading-relaxed mt-0.5">
                Waiting times are estimates and may vary based on restaurant operations, table availability and party sizes.
              </Text>
            </View>
          </View>
        </View>

        {/* 5. Party Details Card */}
        <View className="mx-4 bg-white border border-neutral-200/80 rounded-2xl p-3.5 flex-row items-center justify-between shadow-xs mb-3">
          <View className="flex-row items-center gap-3">
            <View className="size-10 rounded-full bg-[#fee2e2] items-center justify-center">
              <UsersIcon size={18} color="#dc2626" />
            </View>
            <View>
              <Text className="text-sm font-bold text-neutral-900">
                Party Details
              </Text>
              <Text className="text-xs text-neutral-500 mt-0.5">
                {partySize} People
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push({ pathname: '/restaurant/join', params: { id: restaurant.id, initialParty: partySize } })}
            className="border border-neutral-200 px-3 py-1.5 rounded-xl flex-row items-center gap-1 active:bg-neutral-50"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <PencilIcon size={13} color="#18181b" />
            <Text className="text-xs font-semibold text-neutral-800">Edit</Text>
          </Pressable>
        </View>

        {/* 6. Special Requests Card */}
        <View className="mx-4 bg-white border border-neutral-200/80 rounded-2xl p-3.5 flex-row items-center justify-between shadow-xs mb-5">
          <View className="flex-row items-center gap-3">
            <View className="size-10 rounded-full bg-[#fee2e2] items-center justify-center">
              <FileTextIcon size={18} color="#dc2626" />
            </View>
            <View>
              <Text className="text-sm font-bold text-neutral-900">
                Special Requests
              </Text>
              <Text className="text-xs text-neutral-500 mt-0.5">
                {specialRequests}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push({ pathname: '/restaurant/join', params: { id: restaurant.id, initialParty: partySize } })}
            className="border border-neutral-200 px-3 py-1.5 rounded-xl flex-row items-center gap-1 active:bg-neutral-50"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <PencilIcon size={13} color="#18181b" />
            <Text className="text-xs font-semibold text-neutral-800">Edit</Text>
          </Pressable>
        </View>

        {/* 7. Action Buttons */}
        <View className="px-4 gap-2.5">
          {/* Notify Me Button */}
          <Pressable
            onPress={handleNotifyMe}
            style={{ height: 56 }}
            className="w-full rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] flex-row items-center justify-center gap-2 shadow-md shadow-red-500/20 px-6">
            <BellIcon size={18} color="#ffffff" strokeWidth={2.2} />
            <Text className="text-sm font-bold text-white tracking-wide">
              Notify Me When It&apos;s My Turn
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

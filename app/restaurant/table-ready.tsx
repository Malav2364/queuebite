import { Text } from '@/components/ui/text';
import { triggerTableReadyNotification } from '@/lib/notification-service';
import {
  MOCK_POPULAR_RESTAURANTS,
  MOCK_RESTAURANTS,
  MOCK_TRENDING_RESTAURANTS,
} from '@/lib/mock-data';
import { Restaurant } from '@/types/queuebite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  CompassIcon,
  InfoIcon,
  MapPinIcon,
  NavigationIcon,
  PhoneIcon,
  StarIcon,
  UsersIcon,
  UtensilsCrossedIcon,
  XIcon,
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

export default function TableReadyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; queueNumber?: string; partySize?: string }>();

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

  const queueNumber = params.queueNumber || 'A12';
  const partySize = params.partySize || '2';

  // Countdown Timer: 10:00 minutes (600 seconds)
  const [secondsLeft, setSecondsLeft] = React.useState(600);

  React.useEffect(() => {
    // Send immediate push notification & vibration when this screen loads
    triggerTableReadyNotification(restaurant.name, queueNumber);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [restaurant.name, queueNumber]);

  // Format seconds into MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  // Can't Make It / Release Table
  function handleReleaseTable() {
    Alert.alert(
      'Release Table',
      `Are you sure you can't make it to ${restaurant.name}? Releasing your table lets the next waiting party get seated.`,
      [
        { text: 'Keep My Table', style: 'cancel' },
        {
          text: 'Release Table',
          style: 'destructive',
          onPress: () => router.push('/'),
        },
      ]
    );
  }

  // Confetti particle specs
  const confettiParticles = [
    { top: 20, left: 45, width: 7, height: 16, rotate: '-25deg', color: '#16a34a' },
    { top: 15, left: 110, width: 8, height: 18, rotate: '30deg', color: '#f87171' },
    { top: 75, left: 40, width: 8, height: 14, rotate: '45deg', color: '#dc2626' },
    { top: 65, left: 95, width: 14, height: 6, rotate: '-15deg', color: '#86efac' },
    { top: 110, left: 30, width: 7, height: 18, rotate: '-40deg', color: '#16a34a' },
    { top: 25, right: 90, width: 7, height: 16, rotate: '40deg', color: '#16a34a' },
    { top: 75, right: 60, width: 8, height: 16, rotate: '-35deg', color: '#fca5a5' },
    { top: 55, right: 25, width: 8, height: 8, rotate: '15deg', color: '#fecaca', rounded: true },
    { top: 115, right: 35, width: 7, height: 18, rotate: '45deg', color: '#dc2626' },
    { top: 125, left: 50, width: 7, height: 14, rotate: '-30deg', color: '#eab308' },
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
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}>
        {/* 1. Header with Serving Platter & Celebration */}
        <View className="relative items-center pt-1 pb-5 px-5">
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

          {/* Concentric Cloche Badge with Radiating Speed Lines */}
          <View className="relative size-32 rounded-full bg-[#fae2e2]/70 items-center justify-center my-3">
            {/* Speed / Radiance Lines */}
            <View className="absolute top-3 w-1.5 h-3 rounded-full bg-[#dc2626]" />
            <View className="absolute top-5 left-8 w-1.5 h-3 rounded-full bg-[#dc2626] -rotate-45" />
            <View className="absolute top-5 right-8 w-1.5 h-3 rounded-full bg-[#dc2626] rotate-45" />
            <View className="absolute top-10 left-5 w-1.5 h-3 rounded-full bg-[#dc2626] -rotate-70" />
            <View className="absolute top-10 right-5 w-1.5 h-3 rounded-full bg-[#dc2626] rotate-70" />

            {/* Inner Circle with Red Cloche Dome */}
            <View className="size-24 rounded-full bg-[#fbd4d4] items-center justify-center">
              {/* Cloche Illustration */}
              <View className="items-center justify-center">
                {/* Knob */}
                <View className="size-3.5 rounded-full bg-[#dc2626] mb-[-2px] z-10" />
                {/* Cloche Dome */}
                <View
                  style={{
                    width: 52,
                    height: 26,
                    borderTopLeftRadius: 26,
                    borderTopRightRadius: 26,
                    backgroundColor: '#dc2626',
                  }}
                />
                {/* Platter Rim */}
                <View
                  style={{
                    width: 60,
                    height: 5,
                    borderRadius: 2.5,
                    backgroundColor: '#ffffff',
                    marginTop: 2,
                    borderWidth: 1,
                    borderColor: '#fca5a5',
                  }}
                />
              </View>
            </View>
          </View>

          {/* Headline & Subtitle */}
          <Text className="text-2xl font-extrabold text-neutral-900 tracking-tight text-center">
            Your Table is <Text className="text-[#dc2626]">Ready!</Text>
          </Text>
          <Text className="text-xs text-neutral-500 text-center mt-1.5 max-w-[270px] leading-relaxed">
            Head to {restaurant.name} now. We&apos;ve reserved your table for a limited time.
          </Text>
        </View>

        {/* 2. Restaurant Summary Card */}
        <View className="mx-4 bg-white rounded-xl p-3.5 shadow-sm border border-neutral-100 flex-row items-center justify-between mb-4">
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

        {/* 3. "Table Reserved" Countdown Card */}
        <View className="mx-4 bg-[#fef7f2] border border-[#fcdbc7] rounded-xl p-5 mb-4 shadow-xs flex-row items-center justify-between">
          {/* Left: Cozy Dining Table Illustration */}
          <View className="size-32 rounded-2xl overflow-hidden bg-[#faeee5] items-center justify-center p-2">
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400&auto=format&fit=crop',
              }}
              className="w-full h-full rounded-xl"
              resizeMode="cover"
            />
          </View>

          {/* Right: Table Reserved Tag & Countdown */}
          <View className="flex-1 pl-4">
            <View className="self-start flex-row items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
              <CheckIcon size={12} color="#15803d" strokeWidth={3} />
              <Text className="text-xs font-bold text-emerald-700">
                Table Reserved
              </Text>
            </View>

            <Text className="text-xs font-bold text-neutral-900 mt-2">
              Please reach the restaurant within
            </Text>

            {/* Giant Live Countdown Timer */}
            <Text className="text-5xl font-extrabold text-[#dc2626] tracking-tight my-1">
              {formatTime(secondsLeft)}
            </Text>

            <Text className="text-[10px] text-neutral-500 leading-snug">
              Your table may be released if you don&apos;t arrive within this time.
            </Text>
          </View>
        </View>

        {/* 4. Info Metrics Row (3 Columns) */}
        <View className="mx-4 bg-white border border-neutral-200/80 rounded-2xl p-3.5 mb-4 flex-row items-center justify-between shadow-xs">
          {/* Col 1: Queue Number */}
          <View className="flex-1 flex-row items-center gap-2.5">
            <View className="size-10 rounded-full bg-[#fee2e2] items-center justify-center">
              <UsersIcon size={17} color="#dc2626" />
            </View>
            <View>
              <Text className="text-[10px] text-neutral-400 font-medium">
                Your Queue Number
              </Text>
              <Text className="text-base font-extrabold text-neutral-900">
                {queueNumber}
              </Text>
            </View>
          </View>

          <View className="w-px h-9 bg-neutral-200 mx-2" />

          {/* Col 2: Party Size */}
          <View className="flex-1 flex-row items-center gap-2.5">
            <View className="size-10 rounded-full bg-[#fee2e2] items-center justify-center">
              <UsersIcon size={17} color="#dc2626" />
            </View>
            <View>
              <Text className="text-[10px] text-neutral-400 font-medium">
                Party Size
              </Text>
              <Text className="text-sm font-extrabold text-neutral-900">
                {partySize} People
              </Text>
            </View>
          </View>

          <View className="w-px h-9 bg-neutral-200 mx-2" />

          {/* Col 3: Arrival */}
          <View className="flex-1 flex-row items-center gap-2.5">
            <View className="size-10 rounded-full bg-[#fee2e2] items-center justify-center">
              <ClockIcon size={17} color="#dc2626" />
            </View>
            <View>
              <Text className="text-[10px] text-neutral-400 font-medium">
                Estimated Arrival
              </Text>
              <Text className="text-sm font-extrabold text-neutral-900">
                Now
              </Text>
            </View>
          </View>
        </View>

        {/* 5. Check-in at the Restaurant Info Card */}
        <View className="mx-4 mb-4">
          <View className="bg-[#fef9ee] border border-[#fef08a] rounded-2xl p-4 flex-row items-start gap-3 shadow-xs">
            <View className="size-6 rounded-full bg-[#facc15] items-center justify-center mt-0.5">
              <InfoIcon size={14} color="#ffffff" strokeWidth={2.5} />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-neutral-900">
                Check-in at the Restaurant
              </Text>
              <Text className="text-[11px] text-neutral-600 leading-relaxed mt-0.5">
                Inform the staff about your Queue Number ({queueNumber}) when you arrive. Show this screen if needed.
              </Text>
            </View>
          </View>
        </View>

        {/* 6. "What's Next?" Section */}
        <View className="mx-4 mb-5">
          <Text className="text-base font-bold text-neutral-900 mb-3">
            What&apos;s Next?
          </Text>

          <View className="flex-row items-center justify-between">
            {/* Timeline Steps */}
            <View className="flex-1 pr-3">
              {/* Step 1: Table is Ready */}
              <View className="flex-row items-start gap-2.5">
                <View className="items-center">
                  <View className="size-5 rounded-full bg-[#dc2626] items-center justify-center">
                    <CheckIcon size={12} color="#ffffff" strokeWidth={3} />
                  </View>
                  <View className="w-0.5 h-7 bg-[#dc2626]" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-neutral-900">
                    Table is Ready
                  </Text>
                  <Text className="text-[10px] text-neutral-500">
                    Head to the restaurant now
                  </Text>
                </View>
              </View>

              {/* Step 2: Check in with Staff */}
              <View className="flex-row items-start gap-2.5">
                <View className="items-center">
                  <View className="size-5 rounded-full bg-neutral-300 items-center justify-center" />
                  <View className="w-0.5 h-7 bg-neutral-200" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-neutral-800">
                    Check in with Staff
                  </Text>
                  <Text className="text-[10px] text-neutral-500">
                    Show your queue number ({queueNumber})
                  </Text>
                </View>
              </View>

              {/* Step 3: Enjoy Meal */}
              <View className="flex-row items-start gap-2.5">
                <View className="items-center">
                  <View className="size-5 rounded-full bg-neutral-300 items-center justify-center" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-neutral-800">
                    Enjoy Your Meal
                  </Text>
                  <Text className="text-[10px] text-neutral-500">
                    Have a great time!
                  </Text>
                </View>
              </View>
            </View>

            {/* Right: Table Setting Photo */}
            <View className="size-32 rounded-2xl overflow-hidden bg-neutral-200 shadow-xs">
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=400&auto=format&fit=crop',
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* 7. Action Buttons */}
        <View className="px-4 gap-2.5">
          {/* Primary: Get Directions */}
          <Pressable
            onPress={handleDirections}
            style={{ height: 56 }}
            className="w-full rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] flex-row items-center justify-center gap-2 shadow-md shadow-red-500/20 px-6">
            <NavigationIcon size={18} color="#ffffff" strokeWidth={2.2} />
            <Text className="text-sm font-bold text-white tracking-wide">
              Get Directions
            </Text>
          </Pressable>

          {/* Secondary: Can't Make It */}
          <Pressable
            onPress={handleReleaseTable}
            style={{ height: 56 }}
            className="w-full rounded-2xl bg-white border border-[#dc2626] active:bg-red-50/60 items-center justify-center py-2 px-6">
            <View className="flex-row items-center gap-1.5">
              <XIcon size={16} color="#dc2626" strokeWidth={2.2} />
              <Text className="text-sm font-bold text-[#dc2626]">
                Can&apos;t Make It
              </Text>
            </View>
            <Text className="text-[10px] text-neutral-500 mt-0.5">
              Release this table so others can be seated
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

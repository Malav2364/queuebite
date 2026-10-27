import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BellRingIcon,
  CheckCircle2Icon,
  ClockIcon,
  CompassIcon,
  FootprintsIcon,
  MapPinIcon,
  NavigationIcon,
  PhoneIcon,
  SparklesIcon,
  UsersIcon,
  Volume2Icon,
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

export default function NearlyUpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const restaurant = MOCK_POPULAR_RESTAURANTS[0];
  const [minutesRemaining, setMinutesRemaining] = React.useState(3);
  const [secondsRemaining, setSecondsRemaining] = React.useState(45);
  const [isAtPodium, setIsAtPodium] = React.useState(false);

  // Pulsing animation
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulseAnim]);

  // Countdown timer effect
  React.useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((sec) => {
        if (sec > 0) return sec - 1;
        if (minutesRemaining > 0) {
          setMinutesRemaining((min) => min - 1);
          return 59;
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [minutesRemaining]);

  function handleAtPodium() {
    setIsAtPodium(true);
    Alert.alert(
      'Host Notified',
      'The host stand has been notified that you are at the entrance. They will call your party shortly!',
      [
        {
          text: 'Great',
          onPress: () => router.push('/restaurant/table-ready'),
        },
      ]
    );
  }

  function handleRequestDelay() {
    Alert.alert(
      'Request 5-Min Delay',
      'Need extra time to arrive? We will hold your spot and seat the party right behind you first.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Delay',
          onPress: () => {
            setMinutesRemaining((prev) => prev + 5);
            Alert.alert('Delay Granted', 'Added +5 minutes grace time to your waitlist.');
          },
        },
      ]
    );
  }

  function handleDirections() {
    const address = encodeURIComponent(`${restaurant.name}, ${restaurant.address}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`).catch(() => {
      Alert.alert('Directions', `Opening directions to ${restaurant.address}`);
    });
  }

  return (
    <View className="flex-1 bg-[#fef7f2]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        className="px-5 pb-3 bg-white border-b border-orange-100 flex-row items-center justify-between"
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
              Nearly Up!
            </Text>
            <Text className="text-xs text-orange-600 font-bold">
              Spot #1 • Table Being Prepared
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>
        <View className="px-5 pt-5">
          {/* Urgency Pulsing Radar Card */}
          <View className="bg-white rounded-xl p-6 border border-orange-200/80 shadow-md shadow-orange-500/10 items-center mb-4">
            <View className="relative items-center justify-center size-32 mb-4">
              <Animated.View
                style={{
                  transform: [{ scale: pulseAnim }],
                  position: 'absolute',
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: '#fee2e2',
                }}
              />
              <View className="size-24 rounded-full bg-[#dc2626] items-center justify-center shadow-lg shadow-red-500/30">
                <BellRingIcon size={38} color="#ffffff" />
              </View>
            </View>

            <View className="px-3 py-1 rounded-full bg-red-100 mb-2">
              <Text className="text-[11px] font-bold text-red-700 uppercase tracking-widest">
                You are next in line!
              </Text>
            </View>

            <Text className="text-3xl font-bold text-neutral-900 tracking-tight text-center">
              Spot #1 on Waitlist
            </Text>

            <Text className="text-xs text-neutral-500 text-center mt-1.5 leading-relaxed max-w-[280px]">
              Table is currently being bussed and sanitized for your party. Please head to the host
              stand immediately.
            </Text>

            {/* Live Arrival Countdown */}
            <View className="w-full mt-5 bg-[#faf8f5] rounded-2xl p-4 border border-neutral-200 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2.5">
                <ClockIcon size={18} color="#dc2626" />
                <View>
                  <Text className="text-xs font-bold text-neutral-900">Estimated Call Time</Text>
                  <Text className="text-[10px] text-neutral-500">Host will announce Token #A12</Text>
                </View>
              </View>

              <Text className="text-xl font-bold text-[#dc2626]">
                {minutesRemaining}:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
              </Text>
            </View>
          </View>

          {/* Restaurant & Walking Distance Card */}
          <View className="bg-white rounded-xl p-4 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center gap-3">
              <Image
                source={{ uri: restaurant.image }}
                className="size-16 rounded-2xl bg-neutral-100"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-base font-bold text-neutral-900" numberOfLines={1}>
                  {restaurant.name}
                </Text>
                <Text className="text-xs text-neutral-500 mt-0.5" numberOfLines={1}>
                  {restaurant.address}
                </Text>

                <View className="flex-row items-center gap-2 mt-2">
                  <View className="flex-row items-center gap-1 bg-neutral-100 px-2 py-0.5 rounded-md">
                    <FootprintsIcon size={11} color="#52525b" />
                    <Text className="text-[10px] font-bold text-neutral-700">~50m away</Text>
                  </View>
                  <View className="flex-row items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <Text className="text-[10px] font-bold text-emerald-700">1 min walk</Text>
                  </View>
                </View>
              </View>
            </View>

            <Pressable
              onPress={handleDirections}
              className="mt-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex-row items-center justify-center gap-2 active:bg-neutral-100">
              <NavigationIcon size={14} color="#18181b" />
              <Text className="text-xs font-bold text-neutral-800">
                Open Walking Directions in Maps
              </Text>
            </Pressable>
          </View>

          {/* Host Stand Check-In Instructions */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-3">
              Host Stand Check-In Steps
            </Text>

            <View className="gap-3">
              <View className="flex-row items-start gap-3">
                <View className="size-6 rounded-full bg-red-100 items-center justify-center mt-0.5">
                  <Text className="text-xs font-bold text-[#dc2626]">1</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold text-neutral-900">
                    Walk to the restaurant entrance
                  </Text>
                  <Text className="text-[11px] text-neutral-500">
                    Locate the QueueBite tablet or host podium
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start gap-3">
                <View className="size-6 rounded-full bg-red-100 items-center justify-center mt-0.5">
                  <Text className="text-xs font-bold text-[#dc2626]">2</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold text-neutral-900">
                    Show your Token #A12
                  </Text>
                  <Text className="text-[11px] text-neutral-500">
                    Or state your name to the host for seating
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Table Ready Simulation Link */}
          <Pressable
            onPress={() => router.push('/restaurant/table-ready')}
            className="mb-4 py-3 rounded-2xl bg-amber-100/70 border border-amber-300 flex-row items-center justify-center gap-2 active:bg-amber-200">
            <SparklesIcon size={14} color="#b45309" />
            <Text className="text-xs font-bold text-amber-900">
              Simulate Table Ready Trigger
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100 gap-2.5"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Pressable
          onPress={handleAtPodium}
          className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center flex-row gap-2 shadow-md shadow-red-500/25">
          <CheckCircle2Icon size={18} color="#ffffff" />
          <Text className="text-xs font-bold text-white tracking-wide">
            {isAtPodium ? 'Host Stand Notified' : "I'm at the Host Stand"}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleRequestDelay}
          className="w-full h-12 rounded-2xl bg-white border border-neutral-300 active:bg-neutral-100 items-center justify-center flex-row gap-2">
          <ClockIcon size={16} color="#71717a" />
          <Text className="text-xs font-bold text-neutral-700">Need 5 More Minutes</Text>
        </Pressable>
      </View>
    </View>
  );
}

import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  ClockIcon,
  CompassIcon,
  HistoryIcon,
  PhoneIcon,
  RotateCcwIcon,
  SparklesIcon,
  TimerOffIcon,
  UtensilsCrossedIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function QueueExpiredScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const restaurant = MOCK_POPULAR_RESTAURANTS[0];
  const [isRequestingGrace, setIsRequestingGrace] = React.useState(false);

  function handleRequestGrace() {
    setIsRequestingGrace(true);
    setTimeout(() => {
      setIsRequestingGrace(false);
      Alert.alert(
        'Grace Request Sent',
        'We notified the host stand that you are arriving now. If a table opens up in the next 5 minutes, you will get top priority.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/queue/overview'),
          },
        ]
      );
    }, 600);
  }

  function handlePriorityRejoin() {
    Alert.alert(
      'Priority Re-entry',
      'You have been added back to the waitlist at Priority Spot #2.',
      [
        {
          text: 'View Queue',
          onPress: () => router.replace('/queue/overview'),
        },
      ]
    );
  }

  function handleCallHost() {
    const phone = restaurant.phone || '+919876543210';
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Call Host Stand', `Calling ${restaurant.name} at ${phone}`);
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
            onPress={() => router.replace('/queue/overview')}
            className="size-9 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ArrowLeftIcon size={18} color="#18181b" />
          </Pressable>
          <View>
            <Text className="text-xl font-bold text-neutral-900 tracking-tight">
              Hold Expired
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Missed table call
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View className="px-5 pt-5 items-center">
          {/* Expired Status Icon */}
          <View className="size-20 rounded-full bg-amber-100 items-center justify-center mb-4">
            <TimerOffIcon size={40} color="#b45309" />
          </View>

          <View className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 mb-2">
            <Text className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              10-Minute Window Elapsed
            </Text>
          </View>

          <Text className="text-2xl font-bold text-neutral-900 text-center tracking-tight">
            We Missed You!
          </Text>

          <Text className="text-xs text-neutral-500 text-center mt-1.5 leading-relaxed max-w-[280px]">
            Your table was ready, but the 10-minute hold window elapsed. To keep wait times fair,
            the table was offered to the next party.
          </Text>

          {/* Ticket Information Card */}
          <View className="w-full bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mt-5 mb-4">
            <View className="flex-row items-center gap-3 pb-3 border-b border-neutral-100">
              <Image
                source={{ uri: restaurant.image }}
                className="size-12 rounded-xl bg-neutral-100"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-base font-bold text-neutral-900" numberOfLines={1}>
                  {restaurant.name}
                </Text>
                <Text className="text-xs text-neutral-500">
                  Token #A12 • Party of 2 Guests
                </Text>
              </View>
            </View>

            <View className="pt-3 gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-500">Table Ready At</Text>
                <Text className="text-xs font-semibold text-neutral-800">7:25 PM</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-500">Hold Ended At</Text>
                <Text className="text-xs font-semibold text-amber-800">7:35 PM (10 mins)</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-500">Policy</Text>
                <Text className="text-xs font-semibold text-neutral-800">10-min table release</Text>
              </View>
            </View>

            {/* Direct Call to Host Stand */}
            <Pressable
              onPress={handleCallHost}
              className="mt-4 pt-3 border-t border-neutral-100 flex-row items-center justify-center gap-2 active:opacity-70">
              <PhoneIcon size={14} color="#dc2626" />
              <Text className="text-xs font-bold text-[#dc2626]">
                Call Restaurant Host Stand Directly
              </Text>
            </Pressable>
          </View>

          {/* Recovery Options Box */}
          <View className="w-full bg-[#fef7f2] border border-orange-200/80 rounded-xl p-5 mb-5">
            <View className="flex-row items-center gap-2 mb-2">
              <SparklesIcon size={16} color="#c2410c" />
              <Text className="text-xs font-bold text-orange-950 uppercase tracking-wide">
                Recovery Options
              </Text>
            </View>
            <Text className="text-[11px] text-orange-800 mb-4 leading-relaxed">
              Are you already outside or parking? You can request a brief grace extension or jump
              back into a priority spot.
            </Text>

            {/* Option 1: Request Grace */}
            <Pressable
              onPress={handleRequestGrace}
              disabled={isRequestingGrace}
              className="mb-2.5 p-3.5 rounded-2xl bg-white border border-orange-200 flex-row items-center justify-between active:bg-orange-50">
              <View>
                <Text className="text-xs font-bold text-neutral-900">
                  Request 5-Min Grace Extension
                </Text>
                <Text className="text-[10px] text-neutral-500">If you are arriving at the door now</Text>
              </View>
              <View className="px-3 py-1 rounded-xl bg-orange-100">
                <Text className="text-[10px] font-bold text-orange-800">+5 mins</Text>
              </View>
            </Pressable>

            {/* Option 2: Priority Re-entry */}
            <Pressable
              onPress={handlePriorityRejoin}
              className="p-3.5 rounded-2xl bg-white border border-orange-200 flex-row items-center justify-between active:bg-orange-50">
              <View>
                <Text className="text-xs font-bold text-neutral-900">
                  Rejoin at Priority Spot #2
                </Text>
                <Text className="text-[10px] text-neutral-500">
                  Skip the back of the queue (valid 15 mins)
                </Text>
              </View>
              <RotateCcwIcon size={16} color="#dc2626" />
            </Pressable>
          </View>

          {/* Alternative Navigation */}
          <View className="w-full gap-2.5">
            <Pressable
              onPress={() => router.push('/explore')}
              className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center flex-row gap-2 shadow-md shadow-red-500/25">
              <CompassIcon size={16} color="#ffffff" />
              <Text className="text-xs font-bold text-white tracking-wide">
                Explore Other Restaurants
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/queue/history')}
              className="w-full h-12 rounded-2xl bg-white border border-neutral-200 active:bg-neutral-100 items-center justify-center flex-row gap-2">
              <HistoryIcon size={16} color="#18181b" />
              <Text className="text-xs font-bold text-neutral-800">View Queue History</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

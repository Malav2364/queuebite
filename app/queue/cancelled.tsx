import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  CheckCircle2Icon,
  ClockIcon,
  CompassIcon,
  HomeIcon,
  RotateCcwIcon,
  SparklesIcon,
  UtensilsCrossedIcon,
  XCircleIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function QueueCancelledScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    restaurantName?: string;
    reason?: string;
  }>();

  const restaurantName = params.restaurantName || 'The Daily Bean';
  const reason = params.reason || 'Requested by guest';

  // Fast alternatives (restaurants with low wait times)
  const lowWaitPlaces = MOCK_POPULAR_RESTAURANTS.slice(1, 4);

  function handleRejoin() {
    Alert.alert(
      'Rejoining Waitlist',
      `You are being re-added to the waitlist at ${restaurantName}.`,
      [
        {
          text: 'OK',
          onPress: () => router.replace('/queue/overview'),
        },
      ]
    );
  }

  return (
    <View className="flex-1 bg-[#faf8f5]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        className="px-5 pb-3 bg-white border-b border-neutral-100 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 8 }}>
        <Text className="text-xl font-bold text-neutral-900 tracking-tight">
          Queue Cancelled
        </Text>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        <View className="px-5 pt-6 items-center">
          {/* Cancellation Icon Badge */}
          <View className="size-20 rounded-full bg-neutral-100 items-center justify-center mb-4">
            <XCircleIcon size={44} color="#71717a" />
          </View>

          <Text className="text-2xl font-bold text-neutral-900 text-center tracking-tight">
            Spot Successfully Released
          </Text>

          <Text className="text-xs text-neutral-500 text-center mt-1.5 leading-relaxed max-w-[280px]">
            Your table reservation has been cancelled and the spot offered to the next diner in line.
          </Text>

          {/* Cancellation Receipt Card */}
          <View className="w-full bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mt-6 mb-5">
            <View className="flex-row items-center justify-between pb-3 border-b border-neutral-100">
              <View>
                <Text className="text-[10px] font-semibold text-neutral-400">Restaurant</Text>
                <Text className="text-base font-bold text-neutral-900">{restaurantName}</Text>
              </View>
              <View className="items-end">
                <Text className="text-[10px] font-semibold text-neutral-400">Released Token</Text>
                <Text className="text-sm font-bold text-neutral-500 line-through">#A12</Text>
              </View>
            </View>

            <View className="pt-3 gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-500">Status</Text>
                <View className="px-2.5 py-0.5 rounded-full bg-neutral-100">
                  <Text className="text-[11px] font-bold text-neutral-600">Cancelled</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-500">Time of Cancellation</Text>
                <Text className="text-xs font-semibold text-neutral-800">Just now</Text>
              </View>
              <View className="flex-row items-start justify-between">
                <Text className="text-xs text-neutral-500">Reason</Text>
                <Text
                  className="text-xs font-semibold text-neutral-800 max-w-[180px] text-right"
                  numberOfLines={2}>
                  {reason}
                </Text>
              </View>
            </View>

            {/* Quick Rejoin Action */}
            <Pressable
              onPress={handleRejoin}
              className="mt-4 pt-3 border-t border-neutral-100 flex-row items-center justify-center gap-2 active:opacity-70">
              <RotateCcwIcon size={14} color="#dc2626" />
              <Text className="text-xs font-bold text-[#dc2626]">
                Changed your mind? Rejoin Waitlist
              </Text>
            </Pressable>
          </View>

          {/* Zero/Low Wait Places Suggestion */}
          <View className="w-full mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-1.5">
                <SparklesIcon size={16} color="#dc2626" />
                <Text className="text-sm font-bold text-neutral-900">
                  Need food fast? Low wait spots
                </Text>
              </View>
            </View>

            <View className="gap-2.5">
              {lowWaitPlaces.map((place) => (
                <Pressable
                  key={place.id}
                  onPress={() =>
                    router.push({
                      pathname: '/restaurant/[id]',
                      params: { id: place.id },
                    })
                  }
                  className="bg-white rounded-2xl p-3 border border-neutral-100 shadow-sm flex-row items-center justify-between active:bg-neutral-50">
                  <View className="flex-row items-center gap-3 flex-1 pr-2">
                    <Image
                      source={{ uri: place.image }}
                      className="size-12 rounded-xl bg-neutral-100"
                    />
                    <View className="flex-1">
                      <Text className="text-xs font-bold text-neutral-900" numberOfLines={1}>
                        {place.name}
                      </Text>
                      <Text className="text-[10px] text-neutral-500">
                        {place.cuisine} • {place.distance}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <View className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                      <Text className="text-[10px] font-bold text-emerald-700">0–5 min wait</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
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
              onPress={() => router.replace('/')}
              className="w-full h-12 rounded-2xl bg-white border border-neutral-200 active:bg-neutral-100 items-center justify-center flex-row gap-2">
              <HomeIcon size={16} color="#18181b" />
              <Text className="text-xs font-bold text-neutral-800">Return to Home</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

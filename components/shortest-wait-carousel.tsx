import { Text } from '@/components/ui/text';
import { Restaurant } from '@/types/queuebite';
import { ClockIcon, MapPinIcon } from 'lucide-react-native';
import * as React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

interface ShortestWaitCarouselProps {
  restaurants: Restaurant[];
  userPartySize: number;
  onPress: (restaurant: Restaurant) => void;
  onJoinQueuePress: (restaurant: Restaurant) => void;
}

export function ShortestWaitCarousel({
  restaurants,
  userPartySize,
  onPress,
  onJoinQueuePress,
}: ShortestWaitCarouselProps) {
  // Sort restaurants by lowest estimated wait (ignoring null/closed)
  const shortestWaitList = React.useMemo(() => {
    return [...restaurants]
      .filter((r) => r.queueState === 'OPEN' && r.waitMinutesEstimated !== null)
      .sort((a, b) => (a.waitMinutesEstimated ?? 999) - (b.waitMinutesEstimated ?? 999))
      .slice(0, 5);
  }, [restaurants]);

  if (shortestWaitList.length === 0) return null;

  return (
    <View className="mb-5">
      <View className="px-4 mb-2.5 flex-row items-center justify-between">
        <View>
          <Text className="text-base font-bold text-neutral-900 tracking-tight">
            Shortest wait near you
          </Text>
          <Text className="text-xs text-neutral-500">
            Seated fastest based on live queue speed
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 gap-3">
        {shortestWaitList.map((restaurant) => (
          <Pressable
            key={restaurant.id}
            onPress={() => onPress(restaurant)}
            className="w-64 bg-white rounded-2xl overflow-hidden border border-neutral-200/90 shadow-xs active:opacity-95">
            {/* Image Banner */}
            <View className="relative h-28 w-full bg-neutral-200">
              <Image
                source={{ uri: restaurant.image }}
                className="size-full"
                resizeMode="cover"
              />
              <View className="absolute top-2 left-2 bg-emerald-600/90 px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
                  Fast Seating
                </Text>
              </View>
            </View>

            {/* Details */}
            <View className="p-3 gap-2">
              <View>
                <Text className="text-sm font-bold text-neutral-900" numberOfLines={1}>
                  {restaurant.name}
                </Text>
                <Text className="text-[11px] text-neutral-500" numberOfLines={1}>
                  {restaurant.cuisine}
                </Text>
              </View>

              <View className="flex-row items-center justify-between bg-neutral-50 rounded-xl p-2 border border-neutral-100">
                <View className="flex-row items-center gap-1.5">
                  <ClockIcon size={13} color="#059669" />
                  <Text className="text-xs font-bold text-emerald-800">
                    {restaurant.waitRange}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <MapPinIcon size={12} color="#737373" />
                  <Text className="text-[10px] font-medium text-neutral-600">
                    {restaurant.distance}
                  </Text>
                </View>
              </View>

              {/* Quick Join */}
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onJoinQueuePress(restaurant);
                }}
                className="w-full h-8 rounded-xl bg-neutral-900 active:bg-neutral-800 items-center justify-center">
                <Text className="text-[11px] font-bold text-white uppercase tracking-wider">
                  Join for party of {userPartySize}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

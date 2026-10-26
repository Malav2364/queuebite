import { Text } from '@/components/ui/text';
import { Restaurant } from '@/types/queuebite';
import { ChevronRightIcon, ClockIcon, HeartIcon, StarIcon } from 'lucide-react-native';
import * as React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

interface TrendingThisWeekProps {
  restaurants: Restaurant[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onSeeAllPress: () => void;
}

export function TrendingThisWeek({
  restaurants,
  favorites,
  onToggleFavorite,
  onSelectRestaurant,
  onSeeAllPress,
}: TrendingThisWeekProps) {
  return (
    <View className="pt-2 pb-6">
      {/* Header */}
      <View className="px-5 flex-row items-center justify-between mb-3">
        <Text className="text-lg font-bold text-neutral-900 tracking-tight">
          Trending This Week
        </Text>
        <Pressable
          onPress={onSeeAllPress}
          className="flex-row items-center active:opacity-70 py-1"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text className="text-xs font-bold text-[#dc2626] mr-0.5">
            See All
          </Text>
          <ChevronRightIcon size={14} color="#dc2626" />
        </Pressable>
      </View>

      {/* Cards List (Horizontal) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
        {restaurants.map((restaurant) => {
          const isFav = favorites.has(restaurant.id);

          return (
            <Pressable
              key={restaurant.id}
              onPress={() => onSelectRestaurant(restaurant)}
              className="w-56 bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm active:opacity-95">
              {/* Cover Image */}
              <View className="relative h-32 w-full bg-neutral-200">
                <Image
                  source={{ uri: restaurant.image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />

                {/* Top Left Tag Badge */}
                {restaurant.tag && (
                  <View className="absolute top-2.5 left-2.5 bg-[#dc2626] px-2.5 py-0.5 rounded-full shadow-xs">
                    <Text className="text-[10px] font-bold text-white">
                      {restaurant.tag}
                    </Text>
                  </View>
                )}

                {/* Heart Toggle */}
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(restaurant.id);
                  }}
                  className="absolute top-2.5 right-2.5 size-7 rounded-full bg-black/30 backdrop-blur-md items-center justify-center active:scale-90"
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                  <HeartIcon
                    size={15}
                    color={isFav ? '#dc2626' : '#ffffff'}
                    fill={isFav ? '#dc2626' : 'transparent'}
                  />
                </Pressable>
              </View>

              {/* Body */}
              <View className="p-3">
                <Text
                  className="text-sm font-bold text-neutral-900"
                  numberOfLines={1}>
                  {restaurant.name}
                </Text>

                <Text
                  className="text-xs text-neutral-500 mt-0.5 mb-2"
                  numberOfLines={1}>
                  {restaurant.cuisine} • {restaurant.address.split(',')[0]}
                </Text>

                {/* Meta row: Rating + Estimated Wait Time */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <StarIcon size={13} color="#eab308" fill="#eab308" />
                    <Text className="text-xs font-bold text-neutral-800 ml-1">
                      {restaurant.rating.toFixed(1)}
                    </Text>
                    <Text className="text-xs text-neutral-400 ml-1">
                      ({restaurant.reviewCount >= 1000 ? `${(restaurant.reviewCount / 1000).toFixed(1)}k` : restaurant.reviewCount})
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <ClockIcon size={12} color="#71717a" />
                    <Text className="text-xs font-semibold text-neutral-600 ml-1">
                      {restaurant.waitRange}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

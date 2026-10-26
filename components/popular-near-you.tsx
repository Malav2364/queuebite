import { Text } from '@/components/ui/text';
import { Restaurant } from '@/types/queuebite';
import { ChevronRightIcon, HeartIcon, StarIcon } from 'lucide-react-native';
import * as React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

interface PopularNearYouProps {
  restaurants: Restaurant[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onSeeAllPress: () => void;
}

export function PopularNearYou({
  restaurants,
  favorites,
  onToggleFavorite,
  onSelectRestaurant,
  onSeeAllPress,
}: PopularNearYouProps) {
  return (
    <View className="pt-2 pb-3">
      {/* Section Header */}
      <View className="px-5 flex-row items-center justify-between mb-3">
        <Text className="text-lg font-bold text-neutral-900 tracking-tight">
          Popular Near You
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

      {/* Cards Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
        {restaurants.map((restaurant) => {
          const isFav = favorites.has(restaurant.id);

          // Badge status color
          const isLive = restaurant.waitLabel === 'Live' || (restaurant.waitMinutesEstimated && restaurant.waitMinutesEstimated <= 15);
          const isModerate = restaurant.waitLabel === 'Moderate' || (restaurant.waitMinutesEstimated && restaurant.waitMinutesEstimated > 15 && restaurant.waitMinutesEstimated <= 30);
          
          let badgeDotColor = '#16a34a'; // green
          let badgeTextColor = '#15803d';
          let badgeBgColor = '#ffffff';

          if (isModerate) {
            badgeDotColor = '#d97706'; // amber
            badgeTextColor = '#b45309';
          } else if (!isLive) {
            badgeDotColor = '#dc2626'; // red
            badgeTextColor = '#b91c1c';
          }

          return (
            <Pressable
              key={restaurant.id}
              onPress={() => onSelectRestaurant(restaurant)}
              className="w-44 bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm active:opacity-95">
              {/* Cover Image & Overlays */}
              <View className="relative h-28 w-full bg-neutral-200">
                <Image
                  source={{ uri: restaurant.image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />

                {/* Heart Favorite Toggle Button */}
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

                {/* Floating Wait Badge at Bottom Left */}
                <View className="absolute bottom-2 left-2 flex-row items-center bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full shadow-xs border border-white">
                  <View
                    className="size-1.5 rounded-full mr-1.5"
                    style={{ backgroundColor: badgeDotColor }}
                  />
                  <Text
                    className="text-[10px] font-bold mr-1.5"
                    style={{ color: badgeTextColor }}>
                    {restaurant.waitLabel || (isLive ? 'Live' : isModerate ? 'Moderate' : 'Busy')}
                  </Text>
                  <Text className="text-[10px] font-bold text-neutral-800">
                    {restaurant.waitRange}
                  </Text>
                </View>
              </View>

              {/* Card Body */}
              <View className="p-3">
                <Text
                  className="text-sm font-bold text-neutral-900"
                  numberOfLines={1}>
                  {restaurant.name}
                </Text>

                <Text
                  className="text-xs text-neutral-500 mt-0.5 mb-1.5"
                  numberOfLines={1}>
                  {restaurant.cuisine} • {restaurant.address.split(',')[0]}
                </Text>

                {/* Rating */}
                <View className="flex-row items-center">
                  <StarIcon size={13} color="#eab308" fill="#eab308" />
                  <Text className="text-xs font-bold text-neutral-800 ml-1">
                    {restaurant.rating.toFixed(1)}
                  </Text>
                  <Text className="text-xs text-neutral-400 ml-1">
                    ({restaurant.reviewCount >= 1000 ? `${(restaurant.reviewCount / 1000).toFixed(1)}k` : restaurant.reviewCount})
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

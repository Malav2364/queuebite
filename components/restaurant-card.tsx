import { Text } from '@/components/ui/text';
import { QueueState, Restaurant } from '@/types/queuebite';
import {
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  StarIcon,
  UsersIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { Image, Pressable, View } from 'react-native';

interface RestaurantCardProps {
  restaurant: Restaurant;
  userPartySize: number;
  onPress: (restaurant: Restaurant) => void;
  onJoinQueuePress: (restaurant: Restaurant) => void;
  onToggleFavorite?: (restaurantId: string) => void;
  isFavorite?: boolean;
}

export function RestaurantCard({
  restaurant,
  userPartySize,
  onPress,
  onJoinQueuePress,
  onToggleFavorite,
  isFavorite = false,
}: RestaurantCardProps) {
  // Spec requirement:
  // Color-coded wait badge: green under 15 min, amber 15-30, red over 30, grey if unknown
  function getWaitBadgeColor(minutes: number | null) {
    if (minutes === null) return { bg: 'bg-neutral-100', text: 'text-neutral-600', dot: 'bg-neutral-400' };
    if (minutes < 15) return { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', dot: 'bg-emerald-500' };
    if (minutes <= 30) return { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', dot: 'bg-amber-500' };
    return { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-800', dot: 'bg-rose-500' };
  }

  // Spec requirement:
  // Queue state badge: “Queue open”, “Paused”, or “Closed”
  function getQueueStateBadge(state: QueueState) {
    switch (state) {
      case 'OPEN':
        return { label: 'Queue open', bg: 'bg-emerald-500/15', text: 'text-emerald-700' };
      case 'PAUSED':
        return { label: 'Paused', bg: 'bg-amber-500/15', text: 'text-amber-800' };
      case 'CLOSED':
        return { label: 'Closed', bg: 'bg-neutral-200', text: 'text-neutral-700' };
      default:
        return { label: 'Wait unavailable', bg: 'bg-neutral-200', text: 'text-neutral-600' };
    }
  }

  const waitColor = getWaitBadgeColor(restaurant.waitMinutesEstimated);
  const queueBadge = getQueueStateBadge(restaurant.queueState);

  // Check if join queue is disabled and why
  const fitsParty = userPartySize >= restaurant.minPartySize && userPartySize <= restaurant.maxPartySize;
  const isQueueOpen = restaurant.queueState === 'OPEN';

  let joinDisabled = false;
  let disabledReason = '';

  if (!isQueueOpen) {
    joinDisabled = true;
    disabledReason = restaurant.queueState === 'PAUSED' ? 'Queue Paused' : 'Closed';
  } else if (!fitsParty) {
    joinDisabled = true;
    disabledReason = `Max ${restaurant.maxPartySize} guests`;
  }

  return (
    <Pressable
      onPress={() => onPress(restaurant)}
      className="bg-white rounded-xl overflow-hidden border border-neutral-200/90 shadow-sm active:opacity-95 mb-4">
      {/* Hero Cover Image */}
      <View className="relative h-44 w-full bg-neutral-200">
        <Image
          source={{ uri: restaurant.image }}
          className="size-full"
          resizeMode="cover"
        />

        {/* Top Badges Overlay */}
        <View className="absolute top-3 left-3 right-3 flex-row items-center justify-between z-10">
          {/* Queue State Pill */}
          <View className={`px-2.5 py-1 rounded-full backdrop-blur-md ${queueBadge.bg}`}>
            <Text className={`text-[11px] font-extrabold ${queueBadge.text} uppercase tracking-wider`}>
              {queueBadge.label}
            </Text>
          </View>

          {/* Favorite Button */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(restaurant.id);
            }}
            className="size-9 rounded-full bg-white/90 active:bg-white items-center justify-center shadow-xs">
            <HeartIcon
              size={17}
              color={isFavorite ? '#dc2626' : '#262626'}
              fill={isFavorite ? '#dc2626' : 'none'}
            />
          </Pressable>
        </View>

        {/* Rating Floating Tag */}
        <View className="absolute bottom-3 right-3 flex-row items-center gap-1 bg-black/75 px-2.5 py-1 rounded-xl">
          <StarIcon size={13} color="#f59e0b" fill="#f59e0b" />
          <Text className="text-xs font-bold text-white">{restaurant.rating.toFixed(1)}</Text>
          <Text className="text-[10px] text-neutral-300">({restaurant.reviewCount})</Text>
        </View>
      </View>

      {/* Card Body */}
      <View className="p-4 gap-3">
        {/* Name and Cuisine */}
        <View>
          <Text className="text-lg font-bold text-neutral-900 leading-snug">
            {restaurant.name}
          </Text>
          <Text className="text-xs text-neutral-500 mt-0.5">
            {restaurant.cuisine} • {restaurant.priceRange}
          </Text>
        </View>

        {/* Wait Range & Travel Times (Kept SEPARATE per product specification) */}
        <View className="flex-row items-center justify-between bg-neutral-50 rounded-2xl p-3 border border-neutral-100">
          {/* Wait at restaurant */}
          <View className="flex-row items-center gap-2">
            <View className={`size-2.5 rounded-full ${waitColor.dot}`} />
            <View>
              <Text className={`text-sm font-extrabold ${waitColor.text}`}>
                {restaurant.waitRange}
              </Text>
              <Text className="text-[10px] text-neutral-400">
                Wait time • {restaurant.lastUpdated}
              </Text>
            </View>
          </View>

          <View className="h-6 w-px bg-neutral-200" />

          {/* Distance & Travel time */}
          <View className="flex-row items-center gap-1.5">
            <MapPinIcon size={14} color="#737373" />
            <View>
              <Text className="text-xs font-bold text-neutral-800">
                {restaurant.distance}
              </Text>
              <Text className="text-[10px] text-neutral-400">
                {restaurant.travelTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Capacity Info + Join Queue CTA (3-Tap flow in bottom half for thumb reach) */}
        <View className="flex-row items-center justify-between pt-1 gap-2">
          <View className="flex-row items-center gap-1.5">
            <UsersIcon size={13} color={fitsParty ? '#059669' : '#dc2626'} />
            <Text
              className={`text-xs font-semibold ${
                fitsParty ? 'text-emerald-700' : 'text-rose-600'
              }`}>
              {fitsParty
                ? `Seats your party of ${userPartySize}`
                : `Seats max ${restaurant.maxPartySize} guests`}
            </Text>
          </View>

          {/* Join Queue Button */}
          <Pressable
            disabled={joinDisabled}
            onPress={(e) => {
              e.stopPropagation();
              onJoinQueuePress(restaurant);
            }}
            className={`px-5 py-2.5 rounded-xl flex-row items-center justify-center ${
              joinDisabled
                ? 'bg-neutral-100 border border-neutral-200 opacity-60'
                : 'bg-[#dc2626] active:bg-[#b91c1c] shadow-sm'
            }`}>
            <Text
              className={`text-xs font-bold uppercase tracking-wider ${
                joinDisabled ? 'text-neutral-500' : 'text-white'
              }`}>
              {joinDisabled ? disabledReason : 'Join Queue'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

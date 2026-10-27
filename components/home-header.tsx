import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { UserLocation } from '@/types/queuebite';
import {
  BellIcon,
  ChevronDownIcon,
  MapPinIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { Image, Pressable, View } from 'react-native';

interface HomeHeaderProps {
  userName?: string;
  userAvatar?: string;
  location: UserLocation;
  onOpenLocationModal: () => void;
  onNotificationPress: () => void;
  onProfilePress?: () => void;
  hasUnreadNotifications?: boolean;
}

export function HomeHeader({
  userName = 'Malav',
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  location,
  onOpenLocationModal,
  onNotificationPress,
  onProfilePress,
  hasUnreadNotifications = true,
}: HomeHeaderProps) {
  const displayLocation = location.area
    ? `${location.area}, ${location.city || 'Gujarat'}`
    : `${location.city || 'Vadodara'}, Gujarat`;

  return (
    <View className="px-5 pt-2 pb-2">
      <View className="flex-row items-center justify-between">
        {/* Brand & Location on Left */}
        <View className="flex-1 items-start">
          {/* Unified Brand Logo */}
          <BrandLogo size="md" style={{ marginLeft: -3 }} />

          {/* Location Chip */}
          <Pressable
            onPress={onOpenLocationModal}
            className="flex-row items-center mt-0.5 active:opacity-70 py-0.5"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MapPinIcon size={14} color="#dc2626" />
            <Text className="text-[13px] font-semibold text-neutral-800 ml-1.5 mr-1" numberOfLines={1}>
              {displayLocation}
            </Text>
            <ChevronDownIcon size={14} color="#4b5563" />
          </Pressable>
        </View>

        {/* Right Actions: Notification Bell + User Avatar */}
        <View className="flex-row items-center gap-3">
          {/* Notification Bell */}
          <Pressable
            onPress={onNotificationPress}
            className="relative size-10 rounded-full bg-neutral-100/90 active:bg-neutral-200/80 items-center justify-center border border-neutral-200/60"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <BellIcon size={19} color="#18181b" />
            {hasUnreadNotifications && (
              <View className="absolute top-2 right-2.5 size-2 rounded-full bg-[#dc2626] border-2 border-white" />
            )}
          </Pressable>

          {/* Profile Avatar */}
          <Pressable
            onPress={onProfilePress}
            className="size-10 rounded-full overflow-hidden border border-neutral-200 bg-neutral-200 active:opacity-80">
            <Image
              source={{ uri: userAvatar }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

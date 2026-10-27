import { Text } from '@/components/ui/text';
import { ArrowRightIcon, MapPinIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

interface MapDiscoveryCardProps {
  onOpenMap: () => void;
}

export function MapDiscoveryCard({ onOpenMap }: MapDiscoveryCardProps) {
  return (
    <View className="px-5 py-2.5">
      <View className="relative bg-[#fcf8f5] rounded-xl p-4 border border-[#f5e8df] overflow-hidden flex-row items-center justify-between shadow-xs">
        {/* Left: Map Pin Icon in white circle */}
        <View className="size-11 rounded-xl bg-white items-center justify-center border border-neutral-200/60 shadow-xs mr-3">
          <MapPinIcon size={20} color="#dc2626" fill="#dc2626" />
        </View>

        {/* Center: Title & Subtitle */}
        <View className="flex-1 pr-2">
          <Text className="text-sm font-bold text-neutral-900 leading-tight">
            Discover restaurants around you
          </Text>
          <Text className="text-[11px] text-neutral-500 mt-1 leading-[15px]">
            See live queues on the map and find the best time to visit.
          </Text>
        </View>

        {/* Right: Open Map Button */}
        <Pressable
          onPress={onOpenMap}
          className="flex-row items-center bg-[#dc2626] active:bg-[#b91c1c] px-3 py-2 rounded-lg shadow-xs">
          <Text className="text-xs font-bold text-white mr-1">
            Open Map
          </Text>
          <ArrowRightIcon size={12} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

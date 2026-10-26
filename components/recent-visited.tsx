import { Text } from '@/components/ui/text';
import { Restaurant } from '@/types/queuebite';
import { ClockIcon, HeartIcon, RotateCcwIcon, UsersIcon } from 'lucide-react-native';
import * as React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

interface RecentVisitedProps {
  restaurants: Restaurant[];
  userPartySize: number;
  onPress: (restaurant: Restaurant) => void;
  onJoinQueuePress: (restaurant: Restaurant) => void;
}

export function RecentVisited({
  restaurants,
  userPartySize,
  onPress,
  onJoinQueuePress,
}: RecentVisitedProps) {
  // Show first 3 as recent visits
  const recents = restaurants.slice(0, 3);

  if (recents.length === 0) return null;

  return (
    <View className="mb-5">
      <View className="px-4 mb-2 flex-row items-center gap-1.5">
        <RotateCcwIcon size={14} color="#d94148" />
        <Text className="text-base font-bold text-neutral-900 tracking-tight">
          Recently visited
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 gap-3">
        {recents.map((item) => (
          <Pressable
            key={`recent-${item.id}`}
            onPress={() => onPress(item)}
            className="w-56 bg-white rounded-2xl p-2.5 border border-neutral-200/80 shadow-xs flex-row gap-2.5 active:opacity-95">
            <Image
              source={{ uri: item.image }}
              className="size-16 rounded-xl bg-neutral-200"
              resizeMode="cover"
            />
            <View className="flex-1 justify-between">
              <View>
                <Text className="text-xs font-bold text-neutral-900" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text className="text-[10px] text-neutral-500" numberOfLines={1}>
                  {item.cuisine}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1">
                  <ClockIcon size={11} color="#d94148" />
                  <Text className="text-[10px] font-bold text-neutral-800">
                    {item.waitRange}
                  </Text>
                </View>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onJoinQueuePress(item);
                  }}
                  className="bg-[#d94148] px-2 py-1 rounded-lg">
                  <Text className="text-[9px] font-bold text-white uppercase">Re-join</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

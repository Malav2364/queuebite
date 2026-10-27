import { Text } from '@/components/ui/text';
import { Restaurant } from '@/types/queuebite';
import { CheckCircle2Icon, UsersIcon, XIcon, ClockIcon } from 'lucide-react-native';
import * as React from 'react';
import { Image, Modal, Pressable, View } from 'react-native';

interface JoinQueueModalProps {
  visible: boolean;
  restaurant: Restaurant | null;
  partySize: number;
  onClose: () => void;
  onConfirmJoin: (restaurant: Restaurant, partySize: number) => void;
}

export function JoinQueueModal({
  visible,
  restaurant,
  partySize,
  onClose,
  onConfirmJoin,
}: JoinQueueModalProps) {
  if (!restaurant) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 gap-5 shadow-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-bold text-neutral-900">Join Virtual Queue</Text>
              <Text className="text-xs text-neutral-500">Step 2 of 2: Confirm your party</Text>
            </View>
            <Pressable
              onPress={onClose}
              className="size-8 rounded-full bg-neutral-100 items-center justify-center">
              <XIcon size={18} color="#525252" />
            </Pressable>
          </View>

          {/* Restaurant Snapshot */}
          <View className="flex-row items-center gap-3.5 bg-neutral-50 rounded-2xl p-3 border border-neutral-100">
            <Image
              source={{ uri: restaurant.image }}
              className="size-14 rounded-xl bg-neutral-200"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="text-base font-bold text-neutral-900" numberOfLines={1}>
                {restaurant.name}
              </Text>
              <Text className="text-xs text-neutral-500" numberOfLines={1}>
                {restaurant.cuisine} • {restaurant.priceRange}
              </Text>
              <View className="flex-row items-center gap-1.5 mt-1">
                <ClockIcon size={12} color="#059669" />
                <Text className="text-xs font-bold text-emerald-800">
                  Current wait: {restaurant.waitRange}
                </Text>
              </View>
            </View>
          </View>

          {/* Summary Box */}
          <View className="bg-[#faf5f0] rounded-2xl p-4 border border-[#f0e6dc] gap-2">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <UsersIcon size={16} color="#dc2626" />
                <Text className="text-sm font-bold text-neutral-900">Party Size:</Text>
              </View>
              <Text className="text-sm font-extrabold text-neutral-900">
                {partySize} {partySize === 1 ? 'Guest' : 'Guests'}
              </Text>
            </View>

            <View className="flex-row items-center justify-between pt-1 border-t border-neutral-200/60">
              <Text className="text-xs text-neutral-500">Estimated seating:</Text>
              <Text className="text-xs font-bold text-neutral-800">
                In ~{restaurant.waitMinutesEstimated ?? 15} minutes
              </Text>
            </View>
          </View>

          <Text className="text-[11px] text-neutral-400 text-center leading-relaxed">
            By joining, you will receive real-time notifications as tables become ready. No penalty for reporting delay.
          </Text>

          {/* 3rd Tap: Confirm Join Action */}
          <Pressable
            onPress={() => onConfirmJoin(restaurant, partySize)}
            style={{ height: 56 }}
            className="w-full rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] flex-row items-center justify-center gap-2.5 shadow-md shadow-red-500/20">
            <CheckCircle2Icon size={20} color="white" />
            <Text className="text-base font-bold text-white uppercase tracking-wider">
              Confirm &amp; Join Queue
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

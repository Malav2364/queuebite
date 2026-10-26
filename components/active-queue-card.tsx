import { Text } from '@/components/ui/text';
import { ActiveQueueEntry, QueueStatus } from '@/types/queuebite';
import {
  ClockIcon,
  NavigationIcon,
  UsersIcon,
  UtensilsCrossedIcon,
  XCircleIcon,
  ChevronRightIcon,
  CheckCircle2Icon,
} from 'lucide-react-native';
import * as React from 'react';
import { Alert, Image, Pressable, View } from 'react-native';

interface ActiveQueueCardProps {
  entry: ActiveQueueEntry | null;
  onStatusPress: (entry: ActiveQueueEntry) => void;
  onArrivingPress: (entry: ActiveQueueEntry) => void;
  onCancelPress: (entry: ActiveQueueEntry) => void;
  onFindTablePress?: () => void;
}

export function ActiveQueueCard({
  entry,
  onStatusPress,
  onArrivingPress,
  onCancelPress,
  onFindTablePress,
}: ActiveQueueCardProps) {
  // If user has NO active queue entry, show the welcoming prompt
  if (!entry) {
    return (
      <View className="px-4 mb-3">
        <Pressable
          onPress={onFindTablePress}
          className="flex-row items-center justify-between p-4 rounded-2xl bg-gradient-to-r bg-[#faf5f0] border border-[#f0e6dc] shadow-xs">
          <View className="flex-row items-center gap-3.5">
            <View className="size-11 rounded-full bg-[#d94148]/10 items-center justify-center">
              <UtensilsCrossedIcon size={20} color="#d94148" />
            </View>
            <View>
              <Text className="text-sm font-bold text-neutral-900">
                Hungry? Find a table nearby
              </Text>
              <Text className="text-xs text-neutral-500">
                Join a live line & get seated right on time
              </Text>
            </View>
          </View>
          <ChevronRightIcon size={18} color="#a3a3a3" />
        </Pressable>
      </View>
    );
  }

  // Color & label based on queue status
  const statusConfig: Record<QueueStatus, { label: string; bg: string; text: string }> = {
    WAITING: {
      label: 'IN LINE',
      bg: 'bg-amber-100',
      text: 'text-amber-800',
    },
    NOTIFIED: {
      label: 'TABLE READY',
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
    },
    ARRIVING: {
      label: 'ON MY WAY',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
    },
    SEATED: {
      label: 'SEATED',
      bg: 'bg-neutral-100',
      text: 'text-neutral-700',
    },
    CANCELLED: {
      label: 'CANCELLED',
      bg: 'bg-red-100',
      text: 'text-red-700',
    },
  };

  const currentStatus = statusConfig[entry.status] || statusConfig.WAITING;

  return (
    <View className="px-4 mb-4">
      <View className="bg-white rounded-3xl p-4 border border-neutral-200/90 shadow-md shadow-black/5 gap-3.5">
        {/* Top Header Row: Restaurant Info & Status Badge */}
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: entry.restaurantImage }}
            className="size-12 rounded-2xl bg-neutral-100"
            resizeMode="cover"
          />
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-bold text-neutral-900 flex-1 mr-2" numberOfLines={1}>
                {entry.restaurantName}
              </Text>
              <View className={`px-2.5 py-0.5 rounded-full ${currentStatus.bg}`}>
                <Text className={`text-[10px] font-bold ${currentStatus.text} tracking-wider`}>
                  {currentStatus.label}
                </Text>
              </View>
            </View>
            <Text className="text-xs text-neutral-500">
              Party of {entry.partySize} • Joined {entry.joinedAt}
            </Text>
          </View>
        </View>

        {/* Live Metrics Row: Wait Time & Position */}
        <View className="flex-row items-center justify-between bg-neutral-50 rounded-2xl p-3 border border-neutral-100">
          <View className="flex-row items-center gap-2">
            <ClockIcon size={16} color="#d94148" />
            <View>
              <Text className="text-sm font-extrabold text-neutral-900 tracking-tight">
                {entry.waitRange}
              </Text>
              <Text className="text-[10px] text-neutral-400">
                Updated {entry.updatedAgo}
              </Text>
            </View>
          </View>

          <View className="h-6 w-px bg-neutral-200" />

          <View className="flex-row items-center gap-2">
            <UsersIcon size={16} color="#525252" />
            <View>
              <Text className="text-sm font-bold text-neutral-800">
                {entry.partiesAhead} {entry.partiesAhead === 1 ? 'party' : 'parties'} ahead
              </Text>
              <Text className="text-[10px] text-neutral-400">
                Est. seat {entry.estimatedSeatingTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions Row */}
        <View className="flex-row items-center gap-2.5 pt-0.5">
          {/* Primary Action: "I'm on my way" or "View status" */}
          {entry.status === 'NOTIFIED' ? (
            <Pressable
              onPress={() => onArrivingPress(entry)}
              className="flex-1 h-11 rounded-xl bg-emerald-600 active:bg-emerald-700 flex-row items-center justify-center gap-2 shadow-xs">
              <CheckCircle2Icon size={16} color="white" />
              <Text className="text-xs font-bold text-white uppercase tracking-wider">
                I&apos;m on my way
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => onStatusPress(entry)}
              className="flex-1 h-11 rounded-xl bg-[#1c1c1e] active:bg-neutral-800 flex-row items-center justify-center gap-2 shadow-xs">
              <NavigationIcon size={15} color="white" />
              <Text className="text-xs font-bold text-white uppercase tracking-wider">
                View live queue
              </Text>
            </Pressable>
          )}

          {/* Secondary Action: Cancel */}
          <Pressable
            onPress={() => {
              Alert.alert(
                'Leave Queue',
                `Are you sure you want to give up your spot at ${entry.restaurantName}?`,
                [
                  { text: 'Keep Spot', style: 'cancel' },
                  {
                    text: 'Leave Queue',
                    style: 'destructive',
                    onPress: () => onCancelPress(entry),
                  },
                ]
              );
            }}
            className="h-11 px-4 rounded-xl bg-neutral-100 active:bg-neutral-200 border border-neutral-200/80 items-center justify-center">
            <Text className="text-xs font-semibold text-neutral-700">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

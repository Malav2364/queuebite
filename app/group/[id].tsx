import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_ACTIVE_GROUP } from '@/types/group';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ClockIcon,
  CompassIcon,
  LockIcon,
  MapPinIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  PhoneIcon,
  QrCodeIcon,
  Share2Icon,
  ShieldCheckIcon,
  SparklesIcon,
  UserPlusIcon,
  UsersIcon,
  UtensilsCrossedIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GroupDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const group = MOCK_ACTIVE_GROUP;
  const readyMembersCount = group.members.filter(
    (m) => m.status === 'arrived' || m.status === 'parking'
  ).length;
  const readinessPercent = Math.round((readyMembersCount / group.members.length) * 100);

  function handleShare() {
    Share.share({
      title: `Join ${group.name} on QueueBite`,
      message: `Join our dining group "${group.name}" at ${group.restaurantName}! Use code ${group.inviteCode} or open: https://queuebite.app/join/${group.inviteCode}`,
    }).catch(() => {});
  }

  return (
    <View className="flex-1 bg-[#faf8f5]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        className="px-5 pb-3 bg-white border-b border-neutral-100 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="size-9 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ArrowLeftIcon size={18} color="#18181b" />
          </Pressable>
          <View>
            <Text className="text-xl font-black text-neutral-900 tracking-tight" numberOfLines={1}>
              {group.name}
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Invite Code: <Text className="font-bold text-neutral-900">{group.inviteCode}</Text>
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={handleShare}
            className="size-9 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200">
            <Share2Icon size={16} color="#18181b" />
          </Pressable>
          <BrandLogo size="sm" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>
        <View className="px-5 pt-4">
          {/* 1. Live Shared Waitlist Status Card */}
          <Pressable
            onPress={() => router.push('/group/queue')}
            className="bg-[#dc2626] rounded-3xl p-5 mb-4 shadow-lg shadow-red-500/20 active:opacity-95">
            <View className="flex-row items-center justify-between pb-3 border-b border-red-500/40">
              <View className="flex-row items-center gap-2">
                <View className="size-2 rounded-full bg-white animate-pulse" />
                <Text className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Waitlist Active
                </Text>
              </View>
              <View className="px-2.5 py-0.5 rounded-full bg-white/20">
                <Text className="text-xs font-black text-white">Token #{group.queueToken}</Text>
              </View>
            </View>

            <View className="pt-3 flex-row items-center justify-between">
              <View>
                <Text className="text-3xl font-black text-white tracking-tight">
                  Spot #{group.queuePosition}
                </Text>
                <Text className="text-xs text-red-100 font-medium">
                  {group.partiesAhead} party ahead • Est. {group.estimatedWaitMinutes} mins
                </Text>
              </View>

              <View className="px-3.5 py-2 rounded-2xl bg-white flex-row items-center gap-1.5 shadow-sm">
                <Text className="text-xs font-bold text-[#dc2626]">View Live Queue</Text>
                <ChevronRightIcon size={14} color="#dc2626" />
              </View>
            </View>
          </Pressable>

          {/* 2. Group Readiness Meter Card */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2">
                <ShieldCheckIcon size={16} color="#059669" />
                <Text className="text-xs font-bold text-neutral-900">Group Arrival Readiness</Text>
              </View>
              <Text className="text-xs font-black text-neutral-900">
                {readyMembersCount}/{group.members.length} Present ({readinessPercent}%)
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden my-1.5">
              <View
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${readinessPercent}%` }}
              />
            </View>

            <Text className="text-[11px] text-neutral-500 mt-1">
              Host requires all 4 diners at entrance before table is seated.
            </Text>

            <Pressable
              onPress={() => router.push('/group/readiness')}
              className="mt-3 pt-2.5 border-t border-neutral-100 flex-row items-center justify-between active:opacity-70">
              <Text className="text-xs font-bold text-[#dc2626]">Update My Readiness & ETAs</Text>
              <ChevronRightIcon size={14} color="#dc2626" />
            </Pressable>
          </View>

          {/* 3. Destination Restaurant Card */}
          <View className="bg-white rounded-3xl p-4 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center gap-3">
              <Image
                source={{ uri: group.restaurantImage }}
                className="size-16 rounded-2xl bg-neutral-100"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-base font-bold text-neutral-900" numberOfLines={1}>
                  {group.restaurantName}
                </Text>
                <Text className="text-xs text-neutral-500 mt-0.5" numberOfLines={1}>
                  {group.restaurantAddress}
                </Text>
                <Text className="text-[11px] text-neutral-400 mt-0.5">
                  Target Time: {group.targetTime}
                </Text>
              </View>
            </View>

            {/* Quick Actions Row */}
            <View className="flex-row gap-2 mt-3 pt-3 border-t border-neutral-100">
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/restaurant/[id]/menu',
                    params: { id: group.restaurantId },
                  })
                }
                className="flex-1 py-2 rounded-xl bg-neutral-100 items-center justify-center flex-row gap-1.5 active:bg-neutral-200">
                <UtensilsCrossedIcon size={12} color="#18181b" />
                <Text className="text-xs font-bold text-neutral-800">Browse Menu</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  const address = encodeURIComponent(
                    `${group.restaurantName}, ${group.restaurantAddress}`
                  );
                  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`);
                }}
                className="flex-1 py-2 rounded-xl bg-neutral-100 items-center justify-center flex-row gap-1.5 active:bg-neutral-200">
                <CompassIcon size={12} color="#18181b" />
                <Text className="text-xs font-bold text-neutral-800">Directions</Text>
              </Pressable>
            </View>
          </View>

          {/* 4. Group Members List */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <UsersIcon size={16} color="#dc2626" />
                <Text className="text-xs font-bold text-neutral-900">
                  Party Members ({group.members.length})
                </Text>
              </View>

              <Pressable
                onPress={() => router.push('/group/members')}
                className="flex-row items-center gap-1 active:opacity-70">
                <Text className="text-xs font-bold text-[#dc2626]">Manage</Text>
                <ChevronRightIcon size={12} color="#dc2626" />
              </Pressable>
            </View>

            <View className="gap-3">
              {group.members.map((member) => {
                const isArrived = member.status === 'arrived';
                const isParking = member.status === 'parking';

                return (
                  <View
                    key={member.id}
                    className="flex-row items-center justify-between py-1.5 border-b border-neutral-50 last:border-0">
                    <View className="flex-row items-center gap-3 flex-1 pr-2">
                      <Image
                        source={{ uri: member.avatar }}
                        className="size-10 rounded-full bg-neutral-200"
                      />
                      <View className="flex-1">
                        <View className="flex-row items-center gap-1.5">
                          <Text className="text-xs font-bold text-neutral-900" numberOfLines={1}>
                            {member.name}
                          </Text>
                          {member.role === 'host' && (
                            <View className="px-1.5 py-0.2 rounded-md bg-red-100">
                              <Text className="text-[9px] font-bold text-[#dc2626]">Host</Text>
                            </View>
                          )}
                        </View>
                        {member.dietary && member.dietary.length > 0 && (
                          <Text className="text-[10px] text-neutral-400 mt-0.5">
                            {member.dietary.join(', ')}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Status Pill */}
                    <View
                      className={`px-2.5 py-1 rounded-full ${
                        isArrived
                          ? 'bg-emerald-50 border border-emerald-200'
                          : isParking
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-amber-50 border border-amber-200'
                      }`}>
                      <Text
                        className={`text-[10px] font-bold ${
                          isArrived
                            ? 'text-emerald-700'
                            : isParking
                            ? 'text-blue-700'
                            : 'text-amber-700'
                        }`}>
                        {member.eta}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Invite More Action */}
            <Pressable
              onPress={() => router.push('/group/invite')}
              className="mt-4 pt-3 border-t border-neutral-100 flex-row items-center justify-center gap-2 active:opacity-70">
              <UserPlusIcon size={14} color="#dc2626" />
              <Text className="text-xs font-bold text-[#dc2626]">Invite More Friends</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100 flex-row items-center gap-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Pressable
          onPress={() => router.push('/group/readiness')}
          className="flex-1 h-12 rounded-2xl bg-neutral-100 items-center justify-center active:bg-neutral-200">
          <Text className="text-xs font-bold text-neutral-800">Check Readiness</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/group/queue')}
          className="flex-[1.5] h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center shadow-md shadow-red-500/25">
          <Text className="text-xs font-bold text-white tracking-wide">
            Open Shared Queue (#G-14)
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

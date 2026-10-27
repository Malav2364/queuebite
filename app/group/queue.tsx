import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_ACTIVE_GROUP } from '@/types/group';
import { useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BellRingIcon,
  CheckCircle2Icon,
  ClockIcon,
  CompassIcon,
  Edit3Icon,
  InfoIcon,
  MapPinIcon,
  PhoneIcon,
  QrCodeIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  SparklesIcon,
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
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

export default function SharedGroupQueueScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const group = MOCK_ACTIVE_GROUP;
  const position = group.queuePosition || 2;
  const partiesAhead = group.partiesAhead || 1;

  // Gauge calculations
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * (10 - position)) / 10;

  function handleCheckIn() {
    Alert.alert(
      'Group Check-in Confirmed',
      'The host stand has been informed that your party is ready at the podium!',
      [
        {
          text: 'Great',
          onPress: () => router.push('/restaurant/table-ready'),
        },
      ]
    );
  }

  function handleCall() {
    const phone = '+919876543210';
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Call Restaurant', `Calling ${group.restaurantName} at ${phone}`);
    });
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
            <Text className="text-xl font-bold text-neutral-900 tracking-tight">
              Shared Group Queue
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Token #{group.queueToken} • {group.name}
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View className="px-5 pt-4">
          {/* Restaurant Card */}
          <View className="bg-white rounded-xl p-4 border border-neutral-100 shadow-sm flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3 flex-1 pr-2">
              <Image
                source={{ uri: group.restaurantImage }}
                className="size-14 rounded-2xl bg-neutral-100"
                resizeMode="cover"
              />
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <View className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <Text className="text-xs font-bold text-emerald-700">Group In Line</Text>
                </View>
                <Text className="text-base font-bold text-neutral-900" numberOfLines={1}>
                  {group.restaurantName}
                </Text>
                <Text className="text-xs text-neutral-500 mt-0.5">
                  Party of {group.members.length} Guests
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleCall}
              className="size-10 rounded-full bg-red-50 border border-red-200/80 items-center justify-center active:bg-red-100">
              <PhoneIcon size={16} color="#dc2626" />
            </Pressable>
          </View>

          {/* Position Circular Gauge */}
          <View className="bg-white rounded-xl p-6 border border-neutral-100 shadow-sm items-center mb-4">
            <View className="relative items-center justify-center mb-3">
              <Svg width={size} height={size}>
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="#fee2e2"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="#dc2626"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
              </Svg>

              <View className="absolute items-center justify-center">
                <Text className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Group Spot
                </Text>
                <Text className="text-5xl font-bold text-neutral-900 tracking-tight my-0.5">
                  #{position}
                </Text>
                <Text className="text-[11px] font-bold text-[#dc2626]">
                  {partiesAhead} party ahead
                </Text>
              </View>
            </View>

            {/* Estimated Seating Banner */}
            <View className="w-full bg-[#fef7f2] border border-[#fed7aa]/50 rounded-2xl p-3.5 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <ClockIcon size={16} color="#dc2626" />
                <View>
                  <Text className="text-xs font-bold text-neutral-900">Estimated Seating</Text>
                  <Text className="text-[10px] text-neutral-500">Host prepping 4-top table</Text>
                </View>
              </View>
              <Text className="text-sm font-bold text-[#dc2626]">~8 mins</Text>
            </View>
          </View>

          {/* Group Presence Strip */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <ShieldCheckIcon size={16} color="#059669" />
                <Text className="text-xs font-bold text-neutral-900">Party Arrival Readiness</Text>
              </View>
              <Pressable
                onPress={() => router.push('/group/readiness')}
                className="flex-row items-center gap-1 active:opacity-70">
                <Text className="text-xs font-bold text-[#dc2626]">Update</Text>
              </Pressable>
            </View>

            <View className="flex-row justify-between items-center">
              {group.members.map((member) => {
                const isArrived = member.status === 'arrived';
                const isParking = member.status === 'parking';

                return (
                  <View key={member.id} className="items-center">
                    <View className="relative">
                      <Image
                        source={{ uri: member.avatar }}
                        className="size-12 rounded-full border-2 border-white bg-neutral-200"
                      />
                      <View
                        className={`absolute -bottom-1 -right-1 size-5 rounded-full items-center justify-center border-2 border-white ${
                          isArrived ? 'bg-emerald-500' : isParking ? 'bg-blue-500' : 'bg-amber-500'
                        }`}>
                        <CheckCircle2Icon size={10} color="#ffffff" strokeWidth={3} />
                      </View>
                    </View>
                    <Text className="text-[10px] font-bold text-neutral-800 mt-1.5" numberOfLines={1}>
                      {member.name.split(' ')[0]}
                    </Text>
                    <Text className="text-[9px] text-neutral-400">{member.eta.split(' ')[0]}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Group Food Pre-Order / Menu Shortcut */}
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/restaurant/[id]/menu',
                params: { id: group.restaurantId },
              })
            }
            className="bg-white rounded-xl p-4 border border-neutral-100 shadow-sm flex-row items-center justify-between mb-4 active:bg-neutral-50">
            <View className="flex-row items-center gap-3">
              <View className="size-10 rounded-2xl bg-red-50 items-center justify-center">
                <UtensilsCrossedIcon size={18} color="#dc2626" />
              </View>
              <View>
                <Text className="text-xs font-bold text-neutral-900">Browse Menu While Waiting</Text>
                <Text className="text-[10px] text-neutral-500">Pick dishes with your group</Text>
              </View>
            </View>

            <View className="px-3 py-1.5 rounded-xl bg-neutral-100">
              <Text className="text-xs font-bold text-neutral-800">Menu</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100 flex-row items-center gap-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/group/[id]',
              params: { id: 'grp-01' },
            })
          }
          className="flex-1 h-12 rounded-2xl bg-neutral-100 items-center justify-center active:bg-neutral-200">
          <Text className="text-xs font-bold text-neutral-800">Group Details</Text>
        </Pressable>

        <Pressable
          onPress={handleCheckIn}
          className="flex-[1.6] h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center shadow-md shadow-red-500/25">
          <Text className="text-xs font-bold text-white tracking-wide">
            I'm at Host Stand
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

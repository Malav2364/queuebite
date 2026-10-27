import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ClockIcon,
  CompassIcon,
  Edit3Icon,
  InfoIcon,
  LogOutIcon,
  MapPinIcon,
  PhoneIcon,
  QrCodeIcon,
  Share2Icon,
  SparklesIcon,
  UsersIcon,
  UtensilsCrossedIcon,
  WalletIcon,
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

export default function QueueDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const restaurant =
    MOCK_POPULAR_RESTAURANTS.find((r) => r.id === params.id) ||
    MOCK_POPULAR_RESTAURANTS[0];

  function handleShare() {
    Share.share({
      title: `QueueBite Pass - ${restaurant.name}`,
      message: `Join me at ${restaurant.name}! Queue token #A12, estimated seating at 7:42 PM. Track waitlist live on QueueBite.`,
    }).catch(() => {});
  }

  function handleCall() {
    const phone = restaurant.phone || '+919876543210';
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Call Restaurant', `Calling ${restaurant.name} at ${phone}`);
    });
  }

  function handleDirections() {
    const address = encodeURIComponent(`${restaurant.name}, ${restaurant.address}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`).catch(() => {
      Alert.alert('Directions', `Opening directions to ${restaurant.address}`);
    });
  }

  return (
    <View className="flex-1 bg-[#18181b]">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View
        className="px-5 pb-3 border-b border-neutral-800 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="size-9 rounded-full bg-neutral-800 items-center justify-center active:bg-neutral-700"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ArrowLeftIcon size={18} color="#ffffff" />
          </Pressable>
          <View>
            <Text className="text-xl font-bold text-white tracking-tight">
              Digital Queue Pass
            </Text>
            <Text className="text-xs text-neutral-400 font-medium">
              Token #A12 • Live Waitlist Ticket
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleShare}
          className="size-9 rounded-full bg-neutral-800 items-center justify-center active:bg-neutral-700">
          <Share2Icon size={16} color="#ffffff" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        <View className="px-5 pt-4">
          {/* Main Boarding Pass Card */}
          <View className="bg-white rounded-xl overflow-hidden shadow-2xl">
            {/* Top Pass Header */}
            <View className="p-5 bg-gradient-to-r from-red-600 to-rose-700 bg-[#dc2626]">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2">
                  <View className="size-2 rounded-full bg-emerald-300 animate-pulse" />
                  <Text className="text-[11px] font-bold text-white uppercase tracking-wider">
                    Active in Queue • Spot #5
                  </Text>
                </View>
                <BrandLogo size="sm" />
              </View>

              <Text className="text-2xl font-bold text-white tracking-tight" numberOfLines={1}>
                {restaurant.name}
              </Text>
              <Text className="text-xs text-red-100 mt-0.5">
                {restaurant.address.split(',')[0]} • {restaurant.cuisine}
              </Text>
            </View>

            {/* Middle Perforation Line */}
            <View className="relative h-6 bg-white flex-row items-center justify-between px-[-12px]">
              <View className="size-6 rounded-full bg-[#18181b] -ml-3" />
              <View className="flex-1 h-px border-b border-dashed border-neutral-300 mx-2" />
              <View className="size-6 rounded-full bg-[#18181b] -mr-3" />
            </View>

            {/* QR Code and Token Card Body */}
            <View className="p-6 items-center">
              {/* Token Number */}
              <Text className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                Priority Queue Token
              </Text>
              <Text className="text-5xl font-bold text-neutral-900 tracking-tight my-1">
                #A12
              </Text>

              {/* Scannable QR Code Graphic */}
              <View className="size-48 p-3 rounded-2xl bg-neutral-50 border-2 border-neutral-200 items-center justify-center my-3">
                <QrCodeIcon size={160} color="#18181b" />
              </View>

              <Text className="text-[11px] text-neutral-400 text-center font-medium">
                Scan at the host podium upon arrival to claim your table
              </Text>

              {/* Ticket Key Metadata Grid */}
              <View className="w-full mt-5 pt-4 border-t border-neutral-100 grid grid-cols-2 gap-3">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-[10px] font-semibold text-neutral-400">Guests</Text>
                    <Text className="text-sm font-bold text-neutral-900">2 Diners</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-[10px] font-semibold text-neutral-400">Joined At</Text>
                    <Text className="text-sm font-bold text-neutral-900">7:15 PM</Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between pt-2">
                  <View>
                    <Text className="text-[10px] font-semibold text-neutral-400">Est. Seating</Text>
                    <Text className="text-sm font-bold text-[#dc2626]">~7:42 PM (~12m)</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-[10px] font-semibold text-neutral-400">Seating Area</Text>
                    <Text className="text-sm font-bold text-neutral-900">Main Dining</Text>
                  </View>
                </View>

                <View className="pt-2 border-t border-neutral-100">
                  <Text className="text-[10px] font-semibold text-neutral-400">Special Notes</Text>
                  <Text className="text-xs font-medium text-neutral-700 mt-0.5">
                    High chair needed, quiet booth
                  </Text>
                </View>
              </View>
            </View>

            {/* Bottom Pass Bar: Wallet Button */}
            <Pressable
              onPress={() =>
                Alert.alert(
                  'Saved to Wallet',
                  'QueueBite Live Token #A12 has been synced with your device wallet.'
                )
              }
              className="bg-neutral-900 py-3.5 flex-row items-center justify-center gap-2 active:bg-neutral-800">
              <WalletIcon size={14} color="#ffffff" />
              <Text className="text-xs font-bold text-white">Add Pass to Device Wallet</Text>
            </Pressable>
          </View>

          {/* Action Grid */}
          <View className="flex-row gap-3 mt-4 mb-4">
            <Pressable
              onPress={handleCall}
              className="flex-1 p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 items-center justify-center flex-row gap-2 active:bg-neutral-800">
              <PhoneIcon size={14} color="#dc2626" />
              <Text className="text-xs font-bold text-white">Call Host</Text>
            </Pressable>

            <Pressable
              onPress={handleDirections}
              className="flex-1 p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 items-center justify-center flex-row gap-2 active:bg-neutral-800">
              <CompassIcon size={14} color="#dc2626" />
              <Text className="text-xs font-bold text-white">Directions</Text>
            </Pressable>
          </View>

          {/* Edit / Manage Links */}
          <View className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 mb-4">
            <Pressable
              onPress={() => router.push('/queue/edit-party')}
              className="py-2.5 flex-row items-center justify-between active:opacity-70">
              <View className="flex-row items-center gap-2.5">
                <UsersIcon size={16} color="#ffffff" />
                <Text className="text-xs font-bold text-neutral-200">Modify Party Size</Text>
              </View>
              <ChevronRightIcon size={14} color="#71717a" />
            </Pressable>

            <View className="h-px bg-neutral-800 my-1" />

            <Pressable
              onPress={() => router.push('/queue/special-requests')}
              className="py-2.5 flex-row items-center justify-between active:opacity-70">
              <View className="flex-row items-center gap-2.5">
                <Edit3Icon size={16} color="#ffffff" />
                <Text className="text-xs font-bold text-neutral-200">Update Special Notes</Text>
              </View>
              <ChevronRightIcon size={14} color="#71717a" />
            </Pressable>

            <View className="h-px bg-neutral-800 my-1" />

            <Pressable
              onPress={() => router.push('/queue/leave-confirm')}
              className="py-2.5 flex-row items-center justify-between active:opacity-70">
              <View className="flex-row items-center gap-2.5">
                <LogOutIcon size={16} color="#dc2626" />
                <Text className="text-xs font-bold text-[#dc2626]">Cancel / Leave Queue</Text>
              </View>
              <ChevronRightIcon size={14} color="#dc2626" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

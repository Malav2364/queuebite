import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { MOCK_CART_ITEMS } from '@/types/order';
import { useRouter } from 'expo-router';
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ClockIcon,
  CompassIcon,
  FlameIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  QrCodeIcon,
  ReceiptIcon,
  Share2Icon,
  SparklesIcon,
  UtensilsCrossedIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OrderConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const restaurant = MOCK_POPULAR_RESTAURANTS[0];
  const items = MOCK_CART_ITEMS;

  return (
    <View className="flex-1 bg-[#faf8f5]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        className="px-5 pb-3 bg-white border-b border-neutral-100 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 8 }}>
        <Text className="text-xl font-bold text-neutral-900 tracking-tight">
          Order Confirmed
        </Text>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>
        <View className="px-5 pt-6 items-center">
          {/* Confetti & Success Badge */}
          <View className="size-20 rounded-full bg-emerald-100 items-center justify-center mb-3">
            <CheckCircle2Icon size={44} color="#059669" />
          </View>

          <Text className="text-2xl font-bold text-neutral-900 tracking-tight text-center">
            Pre-Order Confirmed!
          </Text>

          <Text className="text-xs text-neutral-500 text-center mt-1 leading-relaxed max-w-[280px]">
            Your kitchen order has been locked and synchronized with Queue Token #A12.
          </Text>

          {/* Ticket Information Card */}
          <View className="w-full bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mt-5 mb-4">
            <View className="flex-row items-center justify-between pb-3 border-b border-neutral-100">
              <View>
                <Text className="text-[10px] font-semibold text-neutral-400">Order Reference</Text>
                <Text className="text-base font-bold text-neutral-900">QB-ORD-9281</Text>
              </View>
              <View className="items-end">
                <Text className="text-[10px] font-semibold text-neutral-400">Linked Queue</Text>
                <Text className="text-sm font-bold text-[#dc2626]">Token #A12 (Spot #5)</Text>
              </View>
            </View>

            {/* Preparation Pipeline Stepper */}
            <View className="pt-4 pb-2">
              <Text className="text-xs font-bold text-neutral-900 mb-3">Kitchen Progress</Text>

              {/* Step 1: Confirmed */}
              <View className="flex-row items-start gap-2.5">
                <View className="items-center">
                  <View className="size-5 rounded-full bg-emerald-500 items-center justify-center">
                    <CheckCircle2Icon size={12} color="#ffffff" strokeWidth={3} />
                  </View>
                  <View className="w-0.5 h-6 bg-emerald-500" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-neutral-900">Order Received & Paid</Text>
                  <Text className="text-[10px] text-neutral-400">Paid ₹1,353 via UPI</Text>
                </View>
              </View>

              {/* Step 2: Standby */}
              <View className="flex-row items-start gap-2.5">
                <View className="items-center">
                  <View className="size-5 rounded-full bg-[#dc2626] items-center justify-center">
                    <ClockIcon size={11} color="#ffffff" strokeWidth={3} />
                  </View>
                  <View className="w-0.5 h-6 bg-neutral-200" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-[#dc2626]">Kitchen on Standby</Text>
                  <Text className="text-[10px] text-neutral-500">
                    Fires stove 10 mins before seating (Spot #1)
                  </Text>
                </View>
              </View>

              {/* Step 3: Plating & Table Serve */}
              <View className="flex-row items-start gap-2.5">
                <View className="items-center">
                  <View className="size-5 rounded-full bg-neutral-200 items-center justify-center" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-neutral-400">Served at Table</Text>
                  <Text className="text-[10px] text-neutral-400">Piping hot upon arrival</Text>
                </View>
              </View>
            </View>

            {/* QR Code for Table Server */}
            <View className="mt-3 pt-3 border-t border-neutral-100 flex-row items-center justify-between">
              <View>
                <Text className="text-[10px] font-semibold text-neutral-400">Digital Server Pass</Text>
                <Text className="text-xs font-bold text-neutral-800">Scan at Table #14</Text>
              </View>

              <View className="size-12 rounded-xl bg-neutral-50 border border-neutral-200 items-center justify-center">
                <QrCodeIcon size={30} color="#18181b" />
              </View>
            </View>
          </View>

          {/* Ordered Dishes Summary */}
          <View className="w-full bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-2">Order Items</Text>
            {items.map((item) => (
              <View
                key={item.id}
                className="py-1.5 flex-row items-center justify-between border-b border-neutral-50 last:border-0">
                <Text className="text-xs text-neutral-700 font-medium">
                  {item.quantity}x {item.name}
                </Text>
                <Text className="text-xs font-bold text-neutral-900">
                  ₹{item.price * item.quantity}
                </Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View className="w-full gap-2.5 mb-4">
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/order/tracking/[id]',
                  params: { id: 'QB-ORD-9281' },
                })
              }
              className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center flex-row gap-2 shadow-md shadow-red-500/25">
              <FlameIcon size={16} color="#ffffff" />
              <Text className="text-xs font-bold text-white tracking-wide">
                Track Live Kitchen Status
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace('/queue/overview')}
              className="w-full h-12 rounded-2xl bg-white border border-neutral-200 active:bg-neutral-100 items-center justify-center flex-row gap-2">
              <HomeIcon size={16} color="#18181b" />
              <Text className="text-xs font-bold text-neutral-800">Return to Live Queue</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

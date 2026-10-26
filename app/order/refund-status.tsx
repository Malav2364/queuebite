import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  ClockIcon,
  CompassIcon,
  HelpCircleIcon,
  HomeIcon,
  MessageCircleIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  WalletIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RefundStatusScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    orderId?: string;
    refundAmount?: string;
    reason?: string;
  }>();

  const refundAmount = params.refundAmount || '1353';
  const orderId = params.orderId || 'QB-ORD-9281';

  return (
    <View className="flex-1 bg-[#faf8f5]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        className="px-5 pb-3 bg-white border-b border-neutral-100 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.replace('/')}
            className="size-9 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ArrowLeftIcon size={18} color="#18181b" />
          </Pressable>
          <View>
            <Text className="text-xl font-black text-neutral-900 tracking-tight">
              Refund Status
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Ref #REF-88412
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        <View className="px-5 pt-6 items-center">
          {/* Refund Amount Badge */}
          <View className="size-20 rounded-full bg-emerald-100 items-center justify-center mb-3">
            <RotateCcwIcon size={40} color="#059669" />
          </View>

          <Text className="text-3xl font-black text-neutral-900 tracking-tight">
            ₹{refundAmount}
          </Text>

          <View className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 mt-1 mb-2">
            <Text className="text-[11px] font-bold text-emerald-800">
              Refund Processed Successfully
            </Text>
          </View>

          <Text className="text-xs text-neutral-500 text-center max-w-[280px]">
            Amount initiated to original payment source (Google Pay UPI / HDFC Bank).
          </Text>

          {/* Refund Progress Timeline Card */}
          <View className="w-full bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mt-5 mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-4">Refund Journey</Text>

            {/* Step 1: Approved */}
            <View className="flex-row items-start gap-3">
              <View className="items-center">
                <View className="size-6 rounded-full bg-emerald-500 items-center justify-center">
                  <CheckCircle2Icon size={14} color="#ffffff" strokeWidth={3} />
                </View>
                <View className="w-0.5 h-7 bg-emerald-500" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-neutral-900">
                  Cancellation & Refund Approved
                </Text>
                <Text className="text-[10px] text-neutral-400">Order #{orderId} cancelled</Text>
              </View>
            </View>

            {/* Step 2: QueueBite Processed */}
            <View className="flex-row items-start gap-3">
              <View className="items-center">
                <View className="size-6 rounded-full bg-emerald-500 items-center justify-center">
                  <CheckCircle2Icon size={14} color="#ffffff" strokeWidth={3} />
                </View>
                <View className="w-0.5 h-7 bg-emerald-500" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-neutral-900">
                  Instant Release by QueueBite
                </Text>
                <Text className="text-[10px] text-neutral-400">
                  Zero cancellation fee applied
                </Text>
              </View>
            </View>

            {/* Step 3: Bank Transfer */}
            <View className="flex-row items-start gap-3">
              <View className="items-center">
                <View className="size-6 rounded-full bg-[#dc2626] items-center justify-center">
                  <ClockIcon size={12} color="#ffffff" strokeWidth={3} />
                </View>
                <View className="w-0.5 h-7 bg-neutral-200" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-[#dc2626]">
                  Banking Gateway Clearance
                </Text>
                <Text className="text-[10px] text-neutral-500">
                  NPCI UPI network processing (Usually 2-4 hours)
                </Text>
              </View>
            </View>

            {/* Step 4: Account Credit */}
            <View className="flex-row items-start gap-3">
              <View className="items-center">
                <View className="size-6 rounded-full bg-neutral-200 items-center justify-center" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-neutral-400">
                  Credited to Bank Account
                </Text>
                <Text className="text-[10px] text-neutral-400">
                  Expected in account ending in 4102 by tonight
                </Text>
              </View>
            </View>
          </View>

          {/* Refund Details */}
          <View className="w-full bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="gap-2.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-500">Destination</Text>
                <Text className="text-xs font-bold text-neutral-900">Google Pay (UPI)</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-500">Bank Reference (ARN)</Text>
                <Text className="text-xs font-mono text-neutral-900">ARN-99120481</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-500">Order Reference</Text>
                <Text className="text-xs font-bold text-neutral-900">{orderId}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="w-full gap-2.5">
            <Pressable
              onPress={() => router.push('/explore')}
              className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center flex-row gap-2 shadow-md shadow-red-500/25">
              <CompassIcon size={16} color="#ffffff" />
              <Text className="text-xs font-bold text-white tracking-wide">
                Explore Other Restaurants
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace('/')}
              className="w-full h-12 rounded-2xl bg-white border border-neutral-200 active:bg-neutral-100 items-center justify-center flex-row gap-2">
              <HomeIcon size={16} color="#18181b" />
              <Text className="text-xs font-bold text-neutral-800">Return to Home</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

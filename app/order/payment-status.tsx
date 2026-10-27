import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  ClockIcon,
  HelpCircleIcon,
  RotateCcwIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  SparklesIcon,
  XCircleIcon,
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

export default function PaymentStatusScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    status?: 'success' | 'failure';
    amount?: string;
    method?: string;
  }>();

  const isSuccess = params.status !== 'failure';
  const amount = params.amount || '1353';
  const method = params.method || 'Google Pay UPI';

  return (
    <View className="flex-1 bg-[#faf8f5]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        className="px-5 pb-3 bg-white border-b border-neutral-100 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 8 }}>
        <Text className="text-xl font-bold text-neutral-900 tracking-tight">
          Payment Status
        </Text>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        <View className="px-5 pt-8 items-center">
          {isSuccess ? (
            /* Success State */
            <>
              <View className="size-20 rounded-full bg-emerald-100 items-center justify-center mb-4">
                <CheckCircle2Icon size={44} color="#059669" />
              </View>

              <Text className="text-2xl font-bold text-neutral-900 tracking-tight text-center">
                Payment Successful!
              </Text>

              <Text className="text-xs text-neutral-500 text-center mt-1 max-w-[280px]">
                Your pre-order has been placed and synchronized with Queue Token #A12.
              </Text>

              {/* Receipt Summary Card */}
              <View className="w-full bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mt-6 mb-5">
                <View className="flex-row items-center justify-between pb-3 border-b border-neutral-100">
                  <View>
                    <Text className="text-[10px] font-semibold text-neutral-400">Amount Paid</Text>
                    <Text className="text-2xl font-bold text-[#dc2626]">₹{amount}</Text>
                  </View>
                  <View className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                    <Text className="text-[10px] font-bold text-emerald-800">Paid in Full</Text>
                  </View>
                </View>

                <View className="pt-3 gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-neutral-500">Transaction ID</Text>
                    <Text className="text-xs font-bold text-neutral-900">TXN-7749201</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-neutral-500">Payment Mode</Text>
                    <Text className="text-xs font-semibold text-neutral-800">{method}</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-neutral-500">Linked Queue Token</Text>
                    <Text className="text-xs font-bold text-neutral-900">Token #A12</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-neutral-500">Kitchen Stove Fire</Text>
                    <Text className="text-xs font-bold text-[#dc2626]">10 mins before seating</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="w-full gap-2.5">
                <Pressable
                  onPress={() => router.replace('/order/confirmation')}
                  className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center flex-row gap-2 shadow-md shadow-red-500/25">
                  <Text className="text-xs font-bold text-white tracking-wide">
                    View Order Confirmation
                  </Text>
                  <ArrowRightIcon size={16} color="#ffffff" />
                </Pressable>

                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/order/tracking/[id]',
                      params: { id: 'QB-ORD-9281' },
                    })
                  }
                  className="w-full h-12 rounded-2xl bg-white border border-neutral-200 active:bg-neutral-100 items-center justify-center">
                  <Text className="text-xs font-bold text-neutral-800">Track Kitchen Prep</Text>
                </Pressable>
              </View>
            </>
          ) : (
            /* Failure State */
            <>
              <View className="size-20 rounded-full bg-red-100 items-center justify-center mb-4">
                <XCircleIcon size={44} color="#dc2626" />
              </View>

              <Text className="text-2xl font-bold text-neutral-900 tracking-tight text-center">
                Payment Declined
              </Text>

              <Text className="text-xs text-neutral-500 text-center mt-1 max-w-[280px]">
                The issuing bank timed out or declined the transaction. No funds were deducted from your account.
              </Text>

              {/* Error Detail Card */}
              <View className="w-full bg-white rounded-xl p-5 border border-red-200 shadow-sm mt-6 mb-5">
                <View className="flex-row items-center gap-2 mb-2">
                  <AlertCircleIcon size={16} color="#dc2626" />
                  <Text className="text-xs font-bold text-red-950">Bank Gateway Message</Text>
                </View>
                <Text className="text-xs text-neutral-600 leading-relaxed">
                  UPI PSP Timeout: Request was not approved within 60 seconds. You may retry or select an alternate payment method.
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="w-full gap-2.5">
                <Pressable
                  onPress={() => router.back()}
                  className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center flex-row gap-2 shadow-md shadow-red-500/25">
                  <RotateCcwIcon size={16} color="#ffffff" />
                  <Text className="text-xs font-bold text-white tracking-wide">
                    Retry Payment (₹{amount})
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    router.replace({
                      pathname: '/order/confirmation',
                      params: { method: 'Pay at Table' },
                    })
                  }
                  className="w-full h-12 rounded-2xl bg-white border border-neutral-200 active:bg-neutral-100 items-center justify-center">
                  <Text className="text-xs font-bold text-neutral-800">Pay at Table Instead</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

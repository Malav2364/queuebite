import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { MOCK_CART_ITEMS } from '@/types/order';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ClockIcon,
  Edit3Icon,
  FlameIcon,
  InfoIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
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

export default function OrderReviewScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ timing?: string }>();

  const restaurant = MOCK_POPULAR_RESTAURANTS[0];
  const items = MOCK_CART_ITEMS;
  const timing = params.timing || 'ten_mins_before';

  const timingLabels: Record<string, string> = {
    ten_mins_before: 'Fire 10 mins before seating (Hot upon arrival)',
    upon_seating: 'Hold until seated at table (Scan QR to start)',
    immediate: 'Immediate kitchen cook (Express dine)',
    scheduled: 'Scheduled for 8:30 PM tonight',
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxes = Math.round(subtotal * 0.05);
  const service = 35;
  const discount = 100;
  const grandTotal = subtotal + taxes + service - discount;

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
            <Text className="text-xl font-black text-neutral-900 tracking-tight">
              Order Review
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Review before payment
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        <View className="px-5 pt-4">
          {/* Restaurant & Queue Sync Card */}
          <View className="bg-white rounded-3xl p-4 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center gap-3 pb-3 border-b border-neutral-100">
              <Image
                source={{ uri: restaurant.image }}
                className="size-14 rounded-2xl bg-neutral-100"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-base font-bold text-neutral-900" numberOfLines={1}>
                  {restaurant.name}
                </Text>
                <Text className="text-xs text-neutral-500 mt-0.5" numberOfLines={1}>
                  {restaurant.address}
                </Text>
              </View>
            </View>

            <View className="pt-3 gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-500">Live Waitlist Token</Text>
                <Text className="text-xs font-black text-neutral-900">#A12 (Spot #5)</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-500">Kitchen Timing Mode</Text>
                <Text className="text-xs font-bold text-[#dc2626] max-w-[200px] text-right" numberOfLines={1}>
                  {timingLabels[timing] || 'Fire 10 mins before seating'}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-500">Diner</Text>
                <Text className="text-xs font-bold text-neutral-900">Malav • Party of 2</Text>
              </View>
            </View>
          </View>

          {/* Itemized Food List */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xs font-bold text-neutral-900">
                Dishes in Order ({items.length})
              </Text>
              <Pressable
                onPress={() => router.push('/order/cart')}
                className="flex-row items-center gap-1 active:opacity-70">
                <Edit3Icon size={12} color="#dc2626" />
                <Text className="text-xs font-bold text-[#dc2626]">Edit Items</Text>
              </Pressable>
            </View>

            <View className="gap-3">
              {items.map((item) => (
                <View
                  key={item.id}
                  className="flex-row items-center justify-between py-1.5 border-b border-neutral-50 last:border-0">
                  <View className="flex-row items-center gap-2 flex-1 pr-2">
                    <Text className="text-xs font-bold text-neutral-500">{item.quantity}x</Text>
                    <View className="flex-1">
                      <Text className="text-xs font-bold text-neutral-900" numberOfLines={1}>
                        {item.name}
                      </Text>
                      {item.selectedOptions && (
                        <Text className="text-[10px] text-neutral-400">
                          {Object.values(item.selectedOptions).flat().filter(Boolean).join(', ')}
                        </Text>
                      )}
                    </View>
                  </View>

                  <Text className="text-xs font-bold text-neutral-900">
                    ₹{item.price * item.quantity}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Cancellation Policy Banner */}
          <View className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex-row items-start gap-2.5 mb-4">
            <ShieldCheckIcon size={16} color="#059669" style={{ marginTop: 2 }} />
            <Text className="text-xs text-emerald-950 flex-1 leading-relaxed">
              <Text className="font-bold">100% Risk-Free Pre-Order: </Text>
              Cancel anytime with full refund before the kitchen fires your food at Spot #1.
            </Text>
          </View>

          {/* Final Price Breakdown */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-3">Price Summary</Text>

            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-600">Subtotal</Text>
                <Text className="text-xs font-bold text-neutral-900">₹{subtotal}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-600">GST (5%)</Text>
                <Text className="text-xs font-bold text-neutral-900">₹{taxes}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-600">Service Charge</Text>
                <Text className="text-xs font-bold text-neutral-900">₹{service}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-emerald-700 font-bold">Coupon (QUEUEFIRST)</Text>
                <Text className="text-xs font-bold text-emerald-700">-₹{discount}</Text>
              </View>

              <View className="h-px bg-neutral-100 my-1" />

              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-black text-neutral-900">Total Payable</Text>
                <Text className="text-lg font-black text-[#dc2626]">₹{grandTotal}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100 flex-row items-center justify-between"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <View>
          <Text className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
            Total Payable
          </Text>
          <Text className="text-xl font-black text-neutral-900">₹{grandTotal}</Text>
        </View>

        <Pressable
          onPress={() =>
            router.push({
              pathname: '/order/payment-method',
              params: { amount: grandTotal.toString() },
            })
          }
          className="h-12 px-6 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] flex-row items-center gap-2 shadow-md shadow-red-500/25">
          <Text className="text-xs font-bold text-white tracking-wide">
            Proceed to Payment
          </Text>
          <ChevronRightIcon size={16} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

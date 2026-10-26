import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { MOCK_CART_ITEMS, OrderItem } from '@/types/order';
import { useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  MinusIcon,
  PlusIcon,
  ReceiptIcon,
  SparklesIcon,
  TagIcon,
  Trash2Icon,
  UtensilsCrossedIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PreOrderCartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const restaurant = MOCK_POPULAR_RESTAURANTS[0];
  const [cartItems, setCartItems] = React.useState<OrderItem[]>(MOCK_CART_ITEMS);
  const [promoCode, setPromoCode] = React.useState('');
  const [appliedDiscount, setAppliedDiscount] = React.useState<number>(100);
  const [kitchenNote, setKitchenNote] = React.useState('Serve drinks right away upon seating');

  function updateQuantity(itemId: string, delta: number) {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  }

  function handleApplyCoupon() {
    if (promoCode.trim().toUpperCase() === 'QUEUEFIRST' || promoCode.trim().length > 0) {
      setAppliedDiscount(100);
      Alert.alert('Coupon Applied!', 'Enjoy ₹100 OFF on your pre-order dine-in meal.');
    } else {
      Alert.alert('Invalid Code', 'Please enter a valid discount code.');
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxes = Math.round(subtotal * 0.05);
  const serviceFee = 35;
  const grandTotal = Math.max(0, subtotal + taxes + serviceFee - appliedDiscount);

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
              Pre-Order Cart
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              {restaurant.name} • Token #A12
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>
        <View className="px-5 pt-4">
          {/* Queue Synchronization Card */}
          <View className="bg-red-50/80 border border-red-200/80 rounded-3xl p-4 flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2.5 flex-1 pr-2">
              <View className="size-9 rounded-2xl bg-red-100 items-center justify-center">
                <ClockIcon size={18} color="#dc2626" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-red-950">Synced with Queue #A12</Text>
                <Text className="text-[10px] text-red-800">
                  Spot #5 in line • ~12 mins estimated wait
                </Text>
              </View>
            </View>

            <View className="px-2.5 py-1 rounded-full bg-white border border-red-200">
              <Text className="text-[10px] font-bold text-[#dc2626]">Dine-In Sync</Text>
            </View>
          </View>

          {/* Cart Items List */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-3">
              Order Items ({cartItems.length})
            </Text>

            <View className="gap-3.5">
              {cartItems.map((item) => (
                <View
                  key={item.id}
                  className="pb-3 border-b border-neutral-100 last:border-0 last:pb-0">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-row items-start gap-3 flex-1 pr-2">
                      <Image
                        source={{ uri: item.image }}
                        className="size-14 rounded-2xl bg-neutral-100"
                        resizeMode="cover"
                      />
                      <View className="flex-1">
                        <Text className="text-xs font-bold text-neutral-900" numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text className="text-xs font-black text-[#dc2626] mt-0.5">
                          ₹{item.price}
                        </Text>

                        {/* Customizations Tag */}
                        {item.selectedOptions && (
                          <Text className="text-[10px] text-neutral-500 mt-1">
                            {Object.values(item.selectedOptions)
                              .flat()
                              .filter(Boolean)
                              .join(' • ')}
                          </Text>
                        )}
                        {item.specialInstructions && (
                          <Text className="text-[10px] text-neutral-400 italic mt-0.5">
                            "{item.specialInstructions}"
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Quantity Stepper */}
                    <View className="flex-row items-center gap-2 bg-neutral-100 px-2.5 py-1.5 rounded-xl border border-neutral-200">
                      <Pressable
                        onPress={() => updateQuantity(item.id, -1)}
                        className="size-6 rounded-lg bg-white items-center justify-center active:bg-neutral-200">
                        <MinusIcon size={12} color="#18181b" />
                      </Pressable>
                      <Text className="text-xs font-black text-neutral-900 w-4 text-center">
                        {item.quantity}
                      </Text>
                      <Pressable
                        onPress={() => updateQuantity(item.id, 1)}
                        className="size-6 rounded-lg bg-white items-center justify-center active:bg-neutral-200">
                        <PlusIcon size={12} color="#18181b" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Add More Items Button */}
            <Pressable
              onPress={() => router.push('/order/menu')}
              className="mt-4 pt-3 border-t border-neutral-100 flex-row items-center justify-center gap-2 active:opacity-70">
              <PlusIcon size={14} color="#dc2626" />
              <Text className="text-xs font-bold text-[#dc2626]">Add More Food & Drinks</Text>
            </Pressable>
          </View>

          {/* Kitchen Serving Notes */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-1">
              Table Serving Instructions
            </Text>
            <Text className="text-[11px] text-neutral-400 mb-2">
              How would you like the kitchen to sequence your food?
            </Text>

            <TextInput
              value={kitchenNote}
              onChangeText={setKitchenNote}
              placeholder="e.g. Serve drinks first, all mains together..."
              placeholderTextColor="#a1a1aa"
              className="h-11 bg-neutral-50 border border-neutral-200 rounded-2xl px-3.5 text-xs text-neutral-900 font-medium"
            />
          </View>

          {/* Promo Code Box */}
          <View className="bg-white rounded-3xl p-4 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center gap-2 mb-2">
              <TagIcon size={14} color="#dc2626" />
              <Text className="text-xs font-bold text-neutral-900">Offers & Promo Codes</Text>
            </View>

            <View className="flex-row gap-2">
              <TextInput
                value={promoCode}
                onChangeText={setPromoCode}
                placeholder="Enter coupon code (QUEUEFIRST)"
                placeholderTextColor="#a1a1aa"
                autoCapitalize="characters"
                className="flex-1 h-11 bg-neutral-50 border border-neutral-200 rounded-2xl px-3.5 text-xs font-bold text-neutral-900"
              />

              <Pressable
                onPress={handleApplyCoupon}
                className="px-4 h-11 bg-neutral-900 rounded-2xl items-center justify-center active:bg-neutral-800">
                <Text className="text-xs font-bold text-white">Apply</Text>
              </Pressable>
            </View>
          </View>

          {/* Bill Summary Breakdown */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-3">Bill Breakdown</Text>

            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-600">Items Subtotal</Text>
                <Text className="text-xs font-bold text-neutral-900">₹{subtotal}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-600">Restaurant GST (5%)</Text>
                <Text className="text-xs font-bold text-neutral-900">₹{taxes}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-600">Kitchen Service Fee</Text>
                <Text className="text-xs font-bold text-neutral-900">₹{serviceFee}</Text>
              </View>
              {appliedDiscount > 0 && (
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs text-emerald-700 font-bold">QueueFirst Promo</Text>
                  <Text className="text-xs font-bold text-emerald-700">-₹{appliedDiscount}</Text>
                </View>
              )}

              <View className="h-px bg-neutral-100 my-1.5" />

              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-black text-neutral-900">To Pay</Text>
                <Text className="text-base font-black text-[#dc2626]">₹{grandTotal}</Text>
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
            Total Amount
          </Text>
          <Text className="text-xl font-black text-neutral-900">₹{grandTotal}</Text>
        </View>

        <Pressable
          onPress={() => router.push('/order/timing')}
          className="h-12 px-6 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] flex-row items-center gap-2 shadow-md shadow-red-500/25">
          <Text className="text-xs font-bold text-white tracking-wide">
            Select Kitchen Timing
          </Text>
          <ChevronRightIcon size={16} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

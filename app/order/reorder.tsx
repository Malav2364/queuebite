import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { MOCK_CART_ITEMS, OrderItem } from '@/types/order';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  MinusIcon,
  PlusIcon,
  RotateCcwIcon,
  ShoppingBagIcon,
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

export default function InstantReorderScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string }>();

  const restaurant = MOCK_POPULAR_RESTAURANTS[0];
  const [items, setItems] = React.useState<OrderItem[]>(MOCK_CART_ITEMS);
  const [selectedItemIds, setSelectedItemIds] = React.useState<Set<string>>(
    new Set(items.map((i) => i.id))
  );

  function toggleItem(id: string) {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function updateQuantity(id: string, delta: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  }

  const selectedItems = items.filter((i) => selectedItemIds.has(i.id));
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleReorderNow() {
    Alert.alert(
      'Reorder Added to Cart',
      `${selectedItems.length} items added to your pre-order cart for ${restaurant.name}!`,
      [
        {
          text: 'View Cart',
          onPress: () => router.push('/order/cart'),
        },
      ]
    );
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
              Instant Reorder
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              1-tap repeat meal from past order
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        <View className="px-5 pt-4">
          {/* Restaurant Status Card */}
          <View className="bg-white rounded-xl p-4 border border-neutral-100 shadow-sm flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3 flex-1 pr-2">
              <Image
                source={{ uri: restaurant.image }}
                className="size-14 rounded-2xl bg-neutral-100"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-base font-bold text-neutral-900" numberOfLines={1}>
                  {restaurant.name}
                </Text>
                <Text className="text-xs text-neutral-500 mt-0.5">
                  Live Queue Wait: {restaurant.waitRange}
                </Text>
              </View>
            </View>

            <View className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              <Text className="text-[10px] font-bold text-emerald-800">Kitchen Open</Text>
            </View>
          </View>

          {/* Dishes Selection List */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-1">
              Select Items to Reorder
            </Text>
            <Text className="text-[11px] text-neutral-400 mb-3">
              Uncheck any items you do not wish to reorder
            </Text>

            <View className="gap-3.5">
              {items.map((item) => {
                const isSelected = selectedItemIds.has(item.id);
                return (
                  <View
                    key={item.id}
                    className={`p-3.5 rounded-2xl border ${
                      isSelected
                        ? 'bg-neutral-50/80 border-neutral-200'
                        : 'bg-white border-neutral-100 opacity-50'
                    }`}>
                    <View className="flex-row items-center justify-between">
                      <Pressable
                        onPress={() => toggleItem(item.id)}
                        className="flex-row items-center gap-3 flex-1 pr-2">
                        <View
                          className={`size-5 rounded-md items-center justify-center border ${
                            isSelected
                              ? 'bg-[#dc2626] border-[#dc2626]'
                              : 'border-neutral-300 bg-white'
                          }`}>
                          {isSelected && <CheckIcon size={12} color="#ffffff" strokeWidth={3} />}
                        </View>

                        <View className="flex-1">
                          <Text className="text-xs font-bold text-neutral-900" numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text className="text-xs font-bold text-[#dc2626] mt-0.5">
                            ₹{item.price}
                          </Text>
                        </View>
                      </Pressable>

                      {/* Quantity Stepper */}
                      {isSelected && (
                        <View className="flex-row items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-neutral-200 shadow-xs">
                          <Pressable
                            onPress={() => updateQuantity(item.id, -1)}
                            className="size-6 rounded-lg bg-neutral-100 items-center justify-center active:bg-neutral-200">
                            <MinusIcon size={12} color="#18181b" />
                          </Pressable>
                          <Text className="text-xs font-bold text-neutral-900 w-4 text-center">
                            {item.quantity}
                          </Text>
                          <Pressable
                            onPress={() => updateQuantity(item.id, 1)}
                            className="size-6 rounded-lg bg-neutral-100 items-center justify-center active:bg-neutral-200">
                            <PlusIcon size={12} color="#18181b" />
                          </Pressable>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
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
            Reorder Total
          </Text>
          <Text className="text-xl font-bold text-neutral-900">₹{subtotal}</Text>
        </View>

        <Pressable
          onPress={handleReorderNow}
          disabled={selectedItems.length === 0}
          className="h-12 px-6 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] flex-row items-center gap-2 shadow-md shadow-red-500/25">
          <RotateCcwIcon size={14} color="#ffffff" />
          <Text className="text-xs font-bold text-white tracking-wide">
            Add All to Pre-Order
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

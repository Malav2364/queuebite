import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
  UtensilsIcon,
  XIcon,
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

export default function DishCustomizationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  // Mock dish details
  const dish = {
    id: params.id || 'd-1',
    name: 'Truffle Mushroom Risotto',
    basePrice: 490,
    image:
      'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=800&auto=format&fit=crop&q=80',
    description:
      'Creamy Italian arborio rice slow-cooked with fresh wild porcini mushrooms, finished with aromatic black truffle paste, butter, and 24-month aged parmesan.',
    isVeg: true,
  };

  // State
  const [selectedSize, setSelectedSize] = React.useState<'regular' | 'large'>('regular');
  const [selectedSpice, setSelectedSpice] = React.useState<'mild' | 'medium' | 'hot'>('medium');
  const [selectedAddOns, setSelectedAddOns] = React.useState<string[]>(['Extra Truffle Oil (+₹60)']);
  const [specialInstructions, setSpecialInstructions] = React.useState('Less garlic, please');
  const [quantity, setQuantity] = React.useState(1);

  // Price calculation
  const sizeSurcharge = selectedSize === 'large' ? 90 : 0;
  const addOnsSurcharge = selectedAddOns.reduce((sum, item) => {
    if (item.includes('+₹60')) return sum + 60;
    if (item.includes('+₹50')) return sum + 50;
    if (item.includes('+₹70')) return sum + 70;
    if (item.includes('+₹45')) return sum + 45;
    return sum;
  }, 0);

  const unitPrice = dish.basePrice + sizeSurcharge + addOnsSurcharge;
  const totalPrice = unitPrice * quantity;

  function toggleAddOn(addon: string) {
    setSelectedAddOns((prev) =>
      prev.includes(addon) ? prev.filter((item) => item !== addon) : [...prev, addon]
    );
  }

  function handleAddToCart() {
    Alert.alert(
      'Added to Pre-order Cart',
      `${quantity}x ${dish.name} added. Your cart has been updated!`,
      [
        {
          text: 'View Cart',
          onPress: () => router.push('/order/cart'),
        },
        {
          text: 'Add More Food',
          onPress: () => router.back(),
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
            <XIcon size={18} color="#18181b" />
          </Pressable>
          <View>
            <Text className="text-xl font-bold text-neutral-900 tracking-tight">
              Customize Dish
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Tailor to your taste
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        {/* Dish Hero Card */}
        <View className="bg-white border-b border-neutral-100 pb-5">
          <Image
            source={{ uri: dish.image }}
            className="w-full h-56 bg-neutral-100"
            resizeMode="cover"
          />

          <View className="px-5 pt-4">
            <View className="flex-row items-center gap-2 mb-1.5">
              <View className="size-3.5 rounded-sm border border-emerald-600 items-center justify-center p-0.5">
                <View className="size-2 rounded-full bg-emerald-600" />
              </View>
              <Text className="text-xs font-bold text-emerald-800">Pure Vegetarian</Text>
            </View>

            <Text className="text-2xl font-bold text-neutral-900 tracking-tight">
              {dish.name}
            </Text>
            <Text className="text-base font-bold text-[#dc2626] my-1">
              ₹{dish.basePrice}
            </Text>
            <Text className="text-xs text-neutral-600 leading-relaxed">
              {dish.description}
            </Text>
          </View>
        </View>

        <View className="px-5 pt-4">
          {/* Section 1: Portion Size */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="text-xs font-bold text-neutral-900">Portion Size</Text>
                <Text className="text-[10px] text-neutral-400">Select 1 option (Required)</Text>
              </View>
              <View className="px-2 py-0.5 rounded-full bg-neutral-100">
                <Text className="text-[10px] font-bold text-neutral-600">Required</Text>
              </View>
            </View>

            <View className="gap-2">
              {[
                { id: 'regular', name: 'Regular Serving', extra: 0 },
                { id: 'large', name: 'Large / Sharing Size (+₹90)', extra: 90 },
              ].map((opt) => {
                const isSelected = selectedSize === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setSelectedSize(opt.id as any)}
                    className={`p-3.5 rounded-2xl border flex-row items-center justify-between ${
                      isSelected
                        ? 'bg-red-50/70 border-[#dc2626]'
                        : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                    }`}>
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? 'text-[#dc2626]' : 'text-neutral-900'
                      }`}>
                      {opt.name}
                    </Text>

                    <View
                      className={`size-5 rounded-full items-center justify-center border ${
                        isSelected ? 'bg-[#dc2626] border-[#dc2626]' : 'border-neutral-300 bg-white'
                      }`}>
                      {isSelected && <CheckIcon size={12} color="#ffffff" strokeWidth={3} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Section 2: Spice Level */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="text-xs font-bold text-neutral-900">Spice Preference</Text>
                <Text className="text-[10px] text-neutral-400">Adjust kitchen seasoning</Text>
              </View>
            </View>

            <View className="flex-row gap-2">
              {[
                { id: 'mild', label: 'Mild' },
                { id: 'medium', label: 'Medium' },
                { id: 'hot', label: 'Spicy' },
              ].map((spice) => {
                const isSelected = selectedSpice === spice.id;
                return (
                  <Pressable
                    key={spice.id}
                    onPress={() => setSelectedSpice(spice.id as any)}
                    className={`flex-1 py-2.5 rounded-2xl border items-center justify-center ${
                      isSelected
                        ? 'bg-neutral-900 border-neutral-900'
                        : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                    }`}>
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? 'text-white' : 'text-neutral-700'
                      }`}>
                      {spice.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Section 3: Add-Ons */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-1">
              Optional Add-Ons
            </Text>
            <Text className="text-[11px] text-neutral-400 mb-3">
              Elevate your dish with gourmet toppings
            </Text>

            <View className="gap-2">
              {[
                'Extra Truffle Oil (+₹60)',
                'Shaved Aged Parmesan (+₹50)',
                'Wild Porcini Mushrooms (+₹70)',
                'Garlic Herb Toast (+₹45)',
              ].map((addon) => {
                const isSelected = selectedAddOns.includes(addon);
                return (
                  <Pressable
                    key={addon}
                    onPress={() => toggleAddOn(addon)}
                    className={`p-3 rounded-2xl border flex-row items-center justify-between ${
                      isSelected
                        ? 'bg-red-50/70 border-[#dc2626]'
                        : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                    }`}>
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? 'text-[#dc2626]' : 'text-neutral-800'
                      }`}>
                      {addon}
                    </Text>

                    <View
                      className={`size-5 rounded-md items-center justify-center border ${
                        isSelected ? 'bg-[#dc2626] border-[#dc2626]' : 'border-neutral-300 bg-white'
                      }`}>
                      {isSelected && <CheckIcon size={12} color="#ffffff" strokeWidth={3} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Section 4: Kitchen Notes */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-1">
              Special Instructions to Chef
            </Text>
            <Text className="text-[11px] text-neutral-400 mb-2">
              e.g., Less salt, extra crispy, gluten sensitive
            </Text>

            <TextInput
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              placeholder="Add your note here..."
              placeholderTextColor="#a1a1aa"
              className="h-11 bg-neutral-50 border border-neutral-200 rounded-2xl px-3 text-xs text-neutral-900 font-medium"
            />
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100 flex-row items-center gap-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        {/* Quantity Stepper */}
        <View className="flex-row items-center gap-2 bg-neutral-100 px-3 py-2 rounded-2xl border border-neutral-200">
          <Pressable
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            className="size-7 rounded-xl bg-white items-center justify-center active:bg-neutral-200">
            <MinusIcon size={14} color="#18181b" />
          </Pressable>
          <Text className="text-sm font-bold text-neutral-900 min-w-[20px] text-center">
            {quantity}
          </Text>
          <Pressable
            onPress={() => setQuantity((q) => q + 1)}
            className="size-7 rounded-xl bg-white items-center justify-center active:bg-neutral-200">
            <PlusIcon size={14} color="#18181b" />
          </Pressable>
        </View>

        {/* Add Button with Total */}
        <Pressable
          onPress={handleAddToCart}
          className="flex-1 h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] flex-row items-center justify-between px-5 shadow-md shadow-red-500/25">
          <Text className="text-xs font-bold text-white tracking-wide">
            Add to Pre-Order
          </Text>
          <Text className="text-sm font-bold text-white">₹{totalPrice}</Text>
        </Pressable>
      </View>
    </View>
  );
}

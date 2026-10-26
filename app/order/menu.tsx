import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { MOCK_CART_ITEMS, OrderItem } from '@/types/order';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  FlameIcon,
  LeafIcon,
  PlusIcon,
  SearchIcon,
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
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FullMenuPreOrderScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const restaurant = MOCK_POPULAR_RESTAURANTS[0];
  const [cart, setCart] = React.useState<OrderItem[]>(MOCK_CART_ITEMS);
  const [selectedCategory, setSelectedCategory] = React.useState('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [vegOnly, setVegOnly] = React.useState(false);

  const categories = ['ALL', 'Mains', 'Pizza & Pasta', 'Coffee', 'Desserts', 'Starters'];

  const menuDishes = [
    {
      id: 'd-1',
      name: 'Truffle Mushroom Risotto',
      category: 'Mains',
      price: 490,
      image:
        'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=600&auto=format&fit=crop&q=80',
      description: 'Creamy arborio rice with black truffle paste, wild porcini, and aged parmesan.',
      isVeg: true,
      isBestseller: true,
      customisable: true,
    },
    {
      id: 'd-2',
      name: 'Woodfired Margherita Pizza',
      category: 'Pizza & Pasta',
      price: 420,
      image:
        'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80',
      description: 'San Marzano tomato base, fresh fior di latte, extra virgin olive oil, and sweet basil.',
      isVeg: true,
      isBestseller: true,
      customisable: true,
    },
    {
      id: 'd-3',
      name: 'Classic Cappuccino',
      category: 'Coffee',
      price: 220,
      image:
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80',
      description: 'Double shot arabica espresso with micro-foamed organic steamed milk.',
      isVeg: true,
      isBestseller: false,
      customisable: true,
    },
    {
      id: 'd-4',
      name: 'Loaded Nachos Grande',
      category: 'Starters',
      price: 360,
      image:
        'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&auto=format&fit=crop&q=80',
      description: 'Crisp tortilla chips baked with cheddar, jalapenos, sour cream, and fresh pico de gallo.',
      isVeg: true,
      isBestseller: false,
      customisable: true,
    },
    {
      id: 'd-5',
      name: 'Belgian Chocolate Waffle',
      category: 'Desserts',
      price: 310,
      image:
        'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80',
      description: 'Fresh golden waffle drizzled with melted dark Belgian chocolate and vanilla bean gelato.',
      isVeg: true,
      isBestseller: true,
      customisable: true,
    },
  ];

  const filteredDishes = menuDishes.filter((dish) => {
    const matchesCategory = selectedCategory === 'ALL' || dish.category === selectedCategory;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = !vegOnly || dish.isVeg;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleAddDish(dish: (typeof menuDishes)[0]) {
    router.push({
      pathname: '/order/customize/[id]',
      params: { id: dish.id },
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
            <Text className="text-xl font-black text-neutral-900 tracking-tight">
              Pre-Order Food
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
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        {/* Queue Synchronization Notice */}
        <View className="px-5 pt-3">
          <View className="bg-red-50/70 border border-red-200/80 rounded-2xl p-3.5 flex-row items-center gap-2.5">
            <SparklesIcon size={16} color="#dc2626" />
            <Text className="text-xs text-red-950 flex-1 leading-relaxed">
              <Text className="font-bold">Queue Sync Active: </Text>
              Pre-ordered dishes are prepared to arrive hot the moment your table is ready!
            </Text>
          </View>
        </View>

        {/* Search & Veg Filter */}
        <View className="px-5 pt-3">
          <View className="flex-row gap-2.5 items-center">
            <View className="flex-1 h-11 bg-white rounded-2xl border border-neutral-200/80 px-3.5 flex-row items-center gap-2 shadow-sm">
              <SearchIcon size={16} color="#71717a" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search food, coffee, desserts..."
                placeholderTextColor="#a1a1aa"
                className="flex-1 text-xs text-neutral-900 font-medium h-full"
              />
            </View>

            <Pressable
              onPress={() => setVegOnly((prev) => !prev)}
              className={`h-11 px-3.5 rounded-2xl border flex-row items-center gap-1.5 ${
                vegOnly
                  ? 'bg-emerald-50 border-emerald-500'
                  : 'bg-white border-neutral-200 active:bg-neutral-50'
              }`}>
              <LeafIcon size={14} color={vegOnly ? '#059669' : '#71717a'} />
              <Text
                className={`text-xs font-bold ${
                  vegOnly ? 'text-emerald-700' : 'text-neutral-700'
                }`}>
                Veg
              </Text>
            </Pressable>
          </View>

          {/* Category Horizontal Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3 gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full border ${
                    isSelected
                      ? 'bg-neutral-900 border-neutral-900'
                      : 'bg-white border-neutral-200/80 active:bg-neutral-50'
                  }`}>
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-neutral-600'
                    }`}>
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Dish List */}
        <View className="px-5 pt-4 gap-3.5">
          {filteredDishes.map((dish) => (
            <View
              key={dish.id}
              className="bg-white rounded-3xl p-4 border border-neutral-100 shadow-sm flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <View className="flex-row items-center gap-2 mb-1">
                  <View className="size-3.5 rounded-sm border border-emerald-600 items-center justify-center p-0.5">
                    <View className="size-2 rounded-full bg-emerald-600" />
                  </View>
                  {dish.isBestseller && (
                    <View className="px-2 py-0.5 rounded-full bg-amber-100 flex-row items-center gap-0.5">
                      <FlameIcon size={10} color="#b45309" />
                      <Text className="text-[9px] font-bold text-amber-900">Bestseller</Text>
                    </View>
                  )}
                </View>

                <Text className="text-base font-bold text-neutral-900">{dish.name}</Text>
                <Text className="text-sm font-black text-neutral-900 my-0.5">₹{dish.price}</Text>
                <Text className="text-xs text-neutral-500 leading-relaxed" numberOfLines={2}>
                  {dish.description}
                </Text>

                {dish.customisable && (
                  <Text className="text-[10px] text-neutral-400 font-bold mt-1.5">
                    Customisable Options Available
                  </Text>
                )}
              </View>

              {/* Right Dish Image & Add Button */}
              <View className="relative items-center">
                <Image
                  source={{ uri: dish.image }}
                  className="size-24 rounded-2xl bg-neutral-100"
                  resizeMode="cover"
                />
                <Pressable
                  onPress={() => handleAddDish(dish)}
                  className="absolute -bottom-2 bg-white px-4 py-1.5 rounded-xl border border-red-200 shadow-md flex-row items-center gap-1 active:bg-red-50">
                  <PlusIcon size={12} color="#dc2626" strokeWidth={3} />
                  <Text className="text-xs font-black text-[#dc2626]">ADD</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Bottom Cart Bar (if items in cart) */}
      {cartTotalItems > 0 && (
        <View
          className="absolute bottom-0 left-0 right-0 px-5 pt-3 bg-white border-t border-neutral-100 shadow-2xl"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
          <Pressable
            onPress={() => router.push('/order/cart')}
            className="w-full h-13 py-3 px-4 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] flex-row items-center justify-between shadow-lg shadow-red-500/25">
            <View className="flex-row items-center gap-3">
              <View className="size-8 rounded-xl bg-white/20 items-center justify-center">
                <ShoppingBagIcon size={16} color="#ffffff" />
              </View>
              <View>
                <Text className="text-xs font-bold text-white">
                  {cartTotalItems} {cartTotalItems === 1 ? 'Item' : 'Items'} Added
                </Text>
                <Text className="text-sm font-black text-white">₹{cartSubtotal}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-1">
              <Text className="text-xs font-bold text-white">View Cart</Text>
              <ChevronRightIcon size={16} color="#ffffff" />
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
}

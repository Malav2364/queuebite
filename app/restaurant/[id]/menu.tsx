import { BrandLogo } from '@/components/brand-logo';
import { FloatingQueueWidget } from '@/components/floating-queue-widget';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS, MOCK_RESTAURANTS, MOCK_TRENDING_RESTAURANTS } from '@/lib/mock-data';
import { Dish, Restaurant } from '@/types/queuebite';
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
  SparklesIcon,
  StarIcon,
  UtensilsCrossedIcon,
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

export default function RestaurantMenuScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const restaurant: Restaurant = React.useMemo(() => {
    const all = [...MOCK_POPULAR_RESTAURANTS, ...MOCK_TRENDING_RESTAURANTS, ...MOCK_RESTAURANTS];
    if (params.id) {
      const match = all.find((r) => r.id === params.id);
      if (match) return match;
    }
    return MOCK_POPULAR_RESTAURANTS[0];
  }, [params.id]);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('ALL');
  const [vegOnly, setVegOnly] = React.useState(false);

  // Fallback dishes if restaurant has minimal dishes
  const menuDishes: (Dish & { isVeg?: boolean; description?: string; isBestseller?: boolean })[] = React.useMemo(() => {
    const list = restaurant.dishes || [
      {
        id: 'd-1',
        name: 'Classic Cappuccino',
        price: 220,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&auto=format&fit=crop',
        category: 'Coffee',
        isVeg: true,
        isBestseller: true,
        description: 'Rich espresso poured with velvety steamed whole milk and topped with dense foam.',
      },
      {
        id: 'd-2',
        name: 'Truffle Alfredo Pasta',
        price: 380,
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?q=80&w=400&auto=format&fit=crop',
        category: 'Mains',
        isVeg: true,
        isBestseller: true,
        description: 'Handcrafted fettuccine tossed in aromatic black truffle cream and aged parmesan.',
      },
      {
        id: 'd-3',
        name: 'Signature Bean Burger',
        price: 320,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop',
        category: 'Mains',
        isVeg: true,
        description: 'Crispy herb bean patty, smoked chipotle sauce, caramelized onions on brioche.',
      },
      {
        id: 'd-4',
        name: 'Belgian Chocolate Waffle',
        price: 280,
        image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?q=80&w=400&auto=format&fit=crop',
        category: 'Desserts',
        isVeg: true,
        description: 'Golden crispy waffle drizzled with melted Belgian dark chocolate and vanilla gelato.',
      },
      {
        id: 'd-5',
        name: 'Avocado Sourdough Toast',
        price: 310,
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&auto=format&fit=crop',
        category: 'Starters',
        isVeg: true,
        description: 'Toasted artisanal sourdough topped with fresh guacamole, feta crumble, and chili flakes.',
      },
    ];

    let filtered = list.map((d) => ({
      ...d,
      isVeg: true,
      description:
        d.name.includes('Pasta')
          ? 'Handcrafted fettuccine tossed in aromatic black truffle cream and aged parmesan.'
          : 'Chef crafted signature specialty made fresh with authentic ingredients.',
    }));

    if (searchQuery.trim().length > 0) {
      filtered = filtered.filter((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }

    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(
        (d) => d.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    return filtered;
  }, [restaurant.dishes, searchQuery, selectedCategory]);

  const categories = ['ALL', 'Starters', 'Mains', 'Coffee', 'Desserts'];

  return (
    <View className="flex-1 bg-[#faf8f5]">
      <StatusBar barStyle="dark-content" />
      <FloatingQueueWidget />

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
            <Text className="text-xl font-black text-neutral-900 tracking-tight" numberOfLines={1}>
              {restaurant.name} Menu
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Explore dishes & pre-order preferences
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>
        {/* Search Bar in Menu */}
        <View className="px-5 pt-3 pb-2">
          <View className="flex-row items-center bg-white h-11 rounded-2xl px-3 border border-neutral-200/90 shadow-xs">
            <SearchIcon size={16} color="#71717a" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search in menu (e.g. Pasta, Coffee)..."
              placeholderTextColor="#a1a1aa"
              className="flex-1 ml-2 text-xs text-neutral-900 font-medium"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} className="p-1">
                <XIcon size={14} color="#71717a" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Categories Carousel */}
        <View className="px-5 py-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {categories.map((cat) => {
              const isSel = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full border active:scale-95 ${
                    isSel
                      ? 'bg-[#dc2626] border-[#dc2626]'
                      : 'bg-white border-neutral-200/90'
                  }`}>
                  <Text
                    className={`text-xs font-bold ${
                      isSel ? 'text-white' : 'text-neutral-700'
                    }`}>
                    {cat === 'ALL' ? 'Full Menu' : cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Menu Items List */}
        <View className="px-5 pt-2 gap-3">
          {menuDishes.map((dish) => (
            <Pressable
              key={dish.id}
              onPress={() =>
                router.push({
                  pathname: '/restaurant/[id]/dish/[dishId]',
                  params: { id: restaurant.id, dishId: dish.id },
                })
              }
              className="bg-white rounded-3xl p-4 border border-neutral-100 shadow-xs flex-row items-start justify-between active:bg-neutral-50">
              {/* Left Info */}
              <View className="flex-1 pr-3">
                <View className="flex-row items-center gap-2 mb-1">
                  {/* Veg indicator badge */}
                  <View className="size-4 rounded-sm border border-emerald-600 items-center justify-center p-0.5">
                    <View className="size-2 rounded-full bg-emerald-600" />
                  </View>
                  {dish.isBestseller && (
                    <View className="flex-row items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
                      <SparklesIcon size={10} color="#b45309" />
                      <Text className="text-[10px] font-bold text-amber-900">Bestseller</Text>
                    </View>
                  )}
                </View>

                <Text className="text-base font-bold text-neutral-900">{dish.name}</Text>
                <Text className="text-sm font-extrabold text-[#dc2626] mt-0.5">
                  ₹{dish.price}
                </Text>
                <Text className="text-xs text-neutral-500 mt-1 leading-relaxed" numberOfLines={2}>
                  {dish.description}
                </Text>

                <View className="flex-row items-center gap-1 mt-2">
                  <Text className="text-[11px] font-bold text-[#dc2626]">View Details</Text>
                  <ChevronRightIcon size={12} color="#dc2626" />
                </View>
              </View>

              {/* Right Dish Image with Add Button */}
              <View className="relative">
                <Image
                  source={{ uri: dish.image }}
                  className="size-24 rounded-2xl bg-neutral-100"
                  resizeMode="cover"
                />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Floating Bottom Join Queue Prompt */}
      <View
        className="px-5 py-3 bg-white border-t border-neutral-200/80 shadow-lg flex-row items-center justify-between"
        style={{ paddingBottom: insets.bottom + 8 }}>
        <View>
          <Text className="text-xs text-neutral-500 font-medium">Ready to dine?</Text>
          <Text className="text-sm font-black text-neutral-900">
            Wait: {restaurant.waitRange}
          </Text>
        </View>

        <Pressable
          onPress={() =>
            router.push({
              pathname: '/restaurant/join',
              params: { id: restaurant.id, initialParty: '2' },
            })
          }
          className="bg-[#dc2626] active:bg-[#b91c1c] px-6 py-3 rounded-2xl flex-row items-center gap-2 shadow-md shadow-red-500/30">
          <UtensilsCrossedIcon size={16} color="#ffffff" strokeWidth={2.2} />
          <Text className="text-xs font-bold text-white tracking-wide">Join Queue</Text>
        </Pressable>
      </View>
    </View>
  );
}

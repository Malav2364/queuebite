import { BrandLogo } from '@/components/brand-logo';
import { FloatingQueueWidget } from '@/components/floating-queue-widget';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS, MOCK_RESTAURANTS, MOCK_TRENDING_RESTAURANTS } from '@/lib/mock-data';
import { Restaurant } from '@/types/queuebite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  ChefHatIcon,
  ClockIcon,
  FlameIcon,
  HeartIcon,
  InfoIcon,
  LeafIcon,
  MessageSquareIcon,
  Share2Icon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
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

export default function DishDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; dishId?: string }>();

  const restaurant: Restaurant = React.useMemo(() => {
    const all = [...MOCK_POPULAR_RESTAURANTS, ...MOCK_TRENDING_RESTAURANTS, ...MOCK_RESTAURANTS];
    if (params.id) {
      const match = all.find((r) => r.id === params.id);
      if (match) return match;
    }
    return MOCK_POPULAR_RESTAURANTS[0];
  }, [params.id]);

  const dish = React.useMemo(() => {
    const found = restaurant.dishes?.find((d) => d.id === params.dishId);
    if (found) return found;
    return {
      id: 'd-1',
      name: 'Classic Truffle Alfredo Pasta',
      price: 380,
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?q=80&w=800&auto=format&fit=crop',
      category: 'Mains',
    };
  }, [restaurant.dishes, params.dishId]);

  const [preOrderNotes, setPreOrderNotes] = React.useState('');
  const [isSaved, setIsSaved] = React.useState(false);

  return (
    <View className="flex-1 bg-[#faf8f5]">
      <StatusBar barStyle="light-content" />
      <FloatingQueueWidget />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        {/* 1. Hero Dish Photo */}
        <View className="relative h-72 w-full bg-neutral-900">
          <Image
            source={{ uri: dish.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

          {/* Navigation Bar */}
          <View
            className="absolute top-0 left-0 right-0 px-4 flex-row items-center justify-between z-20"
            style={{ paddingTop: insets.top + 8 }}>
            <Pressable
              onPress={() => router.back()}
              className="size-10 rounded-full bg-white/90 backdrop-blur-md items-center justify-center active:bg-white shadow-md"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <ArrowLeftIcon size={18} color="#18181b" />
            </Pressable>

            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => setIsSaved(!isSaved)}
                className="size-10 rounded-full bg-white/90 backdrop-blur-md items-center justify-center active:bg-white shadow-md">
                <HeartIcon
                  size={18}
                  color={isSaved ? '#dc2626' : '#18181b'}
                  fill={isSaved ? '#dc2626' : 'transparent'}
                />
              </Pressable>
              <Pressable
                onPress={() => Alert.alert('Share Dish', `Sharing ${dish.name} from ${restaurant.name}`)}
                className="size-10 rounded-full bg-white/90 backdrop-blur-md items-center justify-center active:bg-white shadow-md">
                <Share2Icon size={18} color="#18181b" />
              </Pressable>
            </View>
          </View>

          {/* Category Chip */}
          <View className="absolute bottom-4 left-5 flex-row items-center gap-1.5 bg-[#dc2626] px-3 py-1 rounded-full shadow-md">
            <SparklesIcon size={12} color="#ffffff" />
            <Text className="text-[11px] font-bold text-white tracking-wide uppercase">
              {dish.category || 'Chef Signature'}
            </Text>
          </View>
        </View>

        {/* 2. Dish Title & Price Card */}
        <View className="mx-4 -mt-4 bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <View className="flex-row items-center gap-2 mb-1">
                <View className="size-4 rounded-sm border border-emerald-600 items-center justify-center p-0.5">
                  <View className="size-2 rounded-full bg-emerald-600" />
                </View>
                <Text className="text-xs font-bold text-emerald-700">100% Vegetarian</Text>
              </View>

              <Text className="text-2xl font-black text-neutral-900 tracking-tight">
                {dish.name}
              </Text>
              <Text className="text-xs text-neutral-500 mt-0.5 font-medium">
                Served at {restaurant.name}
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-2xl font-black text-[#dc2626]">
                ₹{dish.price}
              </Text>
              <Text className="text-[10px] text-neutral-400">Taxes inclusive</Text>
            </View>
          </View>

          {/* Quick Metrics Bar */}
          <View className="mt-4 pt-3 border-t border-neutral-100 flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5">
              <StarIcon size={14} color="#eab308" fill="#eab308" />
              <Text className="text-xs font-bold text-neutral-900">4.8</Text>
              <Text className="text-xs text-neutral-400">(140+ reviews)</Text>
            </View>

            <View className="w-px h-4 bg-neutral-200" />

            <View className="flex-row items-center gap-1.5">
              <ClockIcon size={14} color="#16a34a" />
              <Text className="text-xs font-semibold text-neutral-700">Prep time ~15 mins</Text>
            </View>

            <View className="w-px h-4 bg-neutral-200" />

            <View className="flex-row items-center gap-1.5">
              <FlameIcon size={14} color="#ea580c" />
              <Text className="text-xs font-semibold text-neutral-700">420 kcal</Text>
            </View>
          </View>
        </View>

        {/* 3. Description & Ingredients */}
        <View className="mx-4 mt-3 bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs">
          <Text className="text-sm font-bold text-neutral-900 mb-2">Description</Text>
          <Text className="text-xs text-neutral-600 leading-relaxed font-normal">
            Handcrafted artisan pasta prepared fresh every morning. Tossed in a rich emulsion of black Italian winter truffles, cultured cream butter, and 24-month aged Parmigiano Reggiano. Garnished with freshly cracked Tellicherry black pepper and micro herbs.
          </Text>

          {/* Dietary Badges */}
          <View className="mt-4 pt-3 border-t border-neutral-100">
            <Text className="text-xs font-bold text-neutral-800 mb-2">Dietary & Allergens</Text>
            <View className="flex-row flex-wrap gap-2">
              {['Fresh Pasta', 'Contains Dairy', 'No Preservatives', 'Customizable Spice'].map((tag, idx) => (
                <View key={idx} className="bg-neutral-100 px-3 py-1 rounded-full flex-row items-center gap-1">
                  <CheckCircle2Icon size={11} color="#16a34a" />
                  <Text className="text-[11px] font-medium text-neutral-700">{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 4. Pre-Order Queue Note */}
        <View className="mx-4 mt-3 bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs">
          <View className="flex-row items-center gap-2 mb-2">
            <MessageSquareIcon size={16} color="#dc2626" />
            <Text className="text-sm font-bold text-neutral-900">
              Kitchen Notes for Your Queue
            </Text>
          </View>
          <Text className="text-xs text-neutral-500 mb-3">
            Add dietary requests, extra cheese, or cooking preferences to pass to the chef once seated.
          </Text>
          <TextInput
            value={preOrderNotes}
            onChangeText={setPreOrderNotes}
            placeholder="e.g. Less spicy, dressing on the side..."
            placeholderTextColor="#a1a1aa"
            multiline
            numberOfLines={3}
            className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-xs text-neutral-900 font-medium"
          />
        </View>
      </ScrollView>

      {/* Floating Bottom Join Queue Button */}
      <View
        className="px-5 py-3.5 bg-white border-t border-neutral-200/80 shadow-lg flex-row items-center justify-between"
        style={{ paddingBottom: insets.bottom + 8 }}>
        <View>
          <Text className="text-xs text-neutral-500">Queue at {restaurant.name}</Text>
          <Text className="text-sm font-black text-neutral-900">Wait: {restaurant.waitRange}</Text>
        </View>

        <Pressable
          onPress={() =>
            router.push({
              pathname: '/restaurant/join',
              params: {
                id: restaurant.id,
                initialParty: '2',
                specialNote: preOrderNotes ? `Pre-order: ${dish.name} (${preOrderNotes})` : `Pre-order interest: ${dish.name}`,
              },
            })
          }
          className="bg-[#dc2626] active:bg-[#b91c1c] px-6 py-3 rounded-2xl flex-row items-center gap-2 shadow-md shadow-red-500/30">
          <UtensilsCrossedIcon size={16} color="#ffffff" strokeWidth={2.2} />
          <Text className="text-xs font-bold text-white tracking-wide">
            Join Queue with Dish
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

import { BrandLogo } from '@/components/brand-logo';
import { FloatingQueueWidget } from '@/components/floating-queue-widget';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS, MOCK_RESTAURANTS, MOCK_TRENDING_RESTAURANTS } from '@/lib/mock-data';
import { Restaurant, ReviewItem } from '@/types/queuebite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  CheckCircle2Icon,
  FilterIcon,
  Image as ImageIcon,
  MessageSquarePlusIcon,
  StarIcon,
  ThumbsUpIcon,
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

export default function RestaurantReviewsScreen() {
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

  const [filterType, setFilterType] = React.useState<'ALL' | 'PHOTOS' | '5_STAR' | 'FOOD'>('ALL');
  const [upvotes, setUpvotes] = React.useState<Record<string, number>>({});

  const reviewsList: ReviewItem[] = React.useMemo(() => {
    const defaultList: ReviewItem[] = [
      {
        id: 'rev-1',
        author: 'Riya Shah',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        dateAgo: '2 days ago',
        rating: 5,
        content:
          'QueueBite made visiting this place effortless! We queued remotely while driving through Alkapuri and arrived exactly when our table was ready. The Truffle Pasta and Coffee were phenomenal!',
        images: [
          'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400&auto=format&fit=crop',
        ],
      },
      {
        id: 'rev-2',
        author: 'Aarav Patel',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        dateAgo: '1 week ago',
        rating: 4,
        content:
          'Great ambiance and very polite staff. Live wait notifications were spot on. Loved the handcrafted desserts!',
        images: [
          'https://images.unsplash.com/photo-1562376552-0d160a2f238d?q=80&w=400&auto=format&fit=crop',
        ],
      },
      {
        id: 'rev-3',
        author: 'Priya Joshi',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        dateAgo: '2 weeks ago',
        rating: 5,
        content:
          'One of our favorite weekend spots. Perfect lighting, smooth music and consistent food quality every single time.',
      },
    ];

    let list = restaurant.reviews && restaurant.reviews.length > 0 ? restaurant.reviews : defaultList;

    if (filterType === 'PHOTOS') {
      list = list.filter((r) => r.images && r.images.length > 0);
    } else if (filterType === '5_STAR') {
      list = list.filter((r) => r.rating === 5);
    }

    return list;
  }, [restaurant.reviews, filterType]);

  function handleUpvote(revId: string) {
    setUpvotes((prev) => ({
      ...prev,
      [revId]: (prev[revId] || 0) + 1,
    }));
  }

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
            <Text className="text-xl font-bold text-neutral-900 tracking-tight" numberOfLines={1}>
              {restaurant.name}
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">Customer Reviews & Ratings</Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>
        {/* 1. Rating Overview Card */}
        <View className="m-4 bg-white rounded-xl p-5 border border-neutral-100 shadow-sm">
          <View className="flex-row items-center justify-between">
            {/* Big Score */}
            <View className="items-center pr-4 border-r border-neutral-100">
              <Text className="text-4xl font-bold text-neutral-900">
                {restaurant.rating.toFixed(1)}
              </Text>
              <View className="flex-row items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon key={i} size={14} color="#eab308" fill="#eab308" />
                ))}
              </View>
              <Text className="text-[11px] text-neutral-400 mt-1">
                {restaurant.reviewCount}+ ratings
              </Text>
            </View>

            {/* Rating Breakdown Bars */}
            <View className="flex-1 pl-4 gap-1.5">
              {[
                { stars: '5', percent: '75%' },
                { stars: '4', percent: '18%' },
                { stars: '3', percent: '5%' },
                { stars: '2', percent: '1%' },
                { stars: '1', percent: '1%' },
              ].map((row) => (
                <View key={row.stars} className="flex-row items-center gap-2">
                  <Text className="text-[11px] font-bold text-neutral-600 w-3">{row.stars}</Text>
                  <View className="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <View
                      style={{ width: row.percent as any }}
                      className="h-full bg-amber-400 rounded-full"
                    />
                  </View>
                  <Text className="text-[10px] text-neutral-400 w-7">{row.percent}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Verified diners trust badge */}
          <View className="mt-4 pt-3 border-t border-neutral-100 flex-row items-center gap-2">
            <CheckCircle2Icon size={14} color="#16a34a" />
            <Text className="text-xs text-neutral-600 font-medium">
              100% verified diners seated via QueueBite
            </Text>
          </View>
        </View>

        {/* 2. Review Filter Chips */}
        <View className="px-5 pb-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {[
              { id: 'ALL', label: 'All Reviews' },
              { id: 'PHOTOS', label: 'With Photos' },
              { id: '5_STAR', label: '5-Star Only' },
            ].map((chip) => {
              const isSel = filterType === chip.id;
              return (
                <Pressable
                  key={chip.id}
                  onPress={() => setFilterType(chip.id as any)}
                  className={`px-3.5 py-1.5 rounded-full border active:scale-95 ${
                    isSel
                      ? 'bg-[#dc2626] border-[#dc2626]'
                      : 'bg-white border-neutral-200/90'
                  }`}>
                  <Text
                    className={`text-xs font-bold ${
                      isSel ? 'text-white' : 'text-neutral-700'
                    }`}>
                    {chip.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* 3. Review Cards */}
        <View className="px-4 gap-3">
          {reviewsList.map((rev) => (
            <View
              key={rev.id}
              className="bg-white rounded-xl p-4 border border-neutral-100 shadow-xs">
              {/* User row */}
              <View className="flex-row items-center justify-between mb-2.5">
                <View className="flex-row items-center gap-2.5">
                  <Image
                    source={{ uri: rev.avatar }}
                    className="size-10 rounded-full bg-neutral-200"
                    resizeMode="cover"
                  />
                  <View>
                    <View className="flex-row items-center gap-1">
                      <Text className="text-xs font-bold text-neutral-900">{rev.author}</Text>
                      <BadgeCheckIcon size={13} color="#2563eb" />
                    </View>
                    <Text className="text-[10px] text-neutral-400">{rev.dateAgo}</Text>
                  </View>
                </View>

                {/* Stars Badge */}
                <View className="flex-row items-center bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <StarIcon size={11} color="#eab308" fill="#eab308" />
                  <Text className="text-xs font-bold text-amber-900 ml-1">{rev.rating}.0</Text>
                </View>
              </View>

              {/* Review Text */}
              <Text className="text-xs text-neutral-700 leading-relaxed font-normal">
                {rev.content}
              </Text>

              {/* Photos if any */}
              {rev.images && rev.images.length > 0 && (
                <View className="flex-row gap-2 mt-3">
                  {rev.images.map((imgUrl, i) => (
                    <Image
                      key={i}
                      source={{ uri: imgUrl }}
                      className="size-16 rounded-xl bg-neutral-100"
                      resizeMode="cover"
                    />
                  ))}
                </View>
              )}

              {/* Bottom Helpful Action */}
              <View className="mt-3 pt-2.5 border-t border-neutral-100 flex-row items-center justify-between">
                <Text className="text-[11px] text-neutral-400">Verified Visit</Text>

                <Pressable
                  onPress={() => handleUpvote(rev.id)}
                  className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-50 active:bg-neutral-100">
                  <ThumbsUpIcon size={12} color="#71717a" />
                  <Text className="text-[10px] font-semibold text-neutral-600">
                    Helpful {upvotes[rev.id] ? `(${upvotes[rev.id]})` : ''}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Write a Review button */}
      <View
        className="px-5 py-3 bg-white border-t border-neutral-200/80 shadow-lg"
        style={{ paddingBottom: insets.bottom + 8 }}>
        <Pressable
          onPress={() =>
            Alert.alert(
              'Write a Review',
              `Share your dining experience at ${restaurant.name} to help other QueueBite foodies!`
            )
          }
          className="w-full bg-[#dc2626] active:bg-[#b91c1c] h-12 rounded-2xl flex-row items-center justify-center gap-2 shadow-md shadow-red-500/20">
          <MessageSquarePlusIcon size={16} color="#ffffff" strokeWidth={2.2} />
          <Text className="text-xs font-bold text-white tracking-wide">Write a Review</Text>
        </Pressable>
      </View>
    </View>
  );
}

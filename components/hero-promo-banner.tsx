import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { ArrowRightIcon, StarIcon } from 'lucide-react-native';
import * as React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HeroPromoBannerProps {
  onExplorePress?: () => void;
  onRestaurantPress?: (restaurantId: string) => void;
}

interface CarouselSlide {
  id: string;
  restaurantId: string;
  name: string;
  image: string;
  cuisine: string;
  address: string;
  rating: number;
  waitRange: string;
  partiesAhead: number;
  ctaText: string;
}

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: 'slide-1',
    restaurantId: 'pop-1',
    name: 'The Daily Bean',
    image:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop',
    cuisine: 'Specialty Coffee & Bakes',
    address: 'Alkapuri',
    rating: 4.5,
    waitRange: '10–20m wait',
    partiesAhead: 8,
    ctaText: 'Join Waitlist',
  },
  {
    id: 'slide-2',
    restaurantId: 'pop-2',
    name: 'Peshawri Royal',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    cuisine: 'North Indian & Mughlai',
    address: 'Sayajigunj',
    rating: 4.8,
    waitRange: '20–30m wait',
    partiesAhead: 6,
    ctaText: 'Join Queue',
  },
  {
    id: 'slide-3',
    restaurantId: 'pop-4',
    name: 'Little Italy Trattoria',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
    cuisine: 'Woodfired Pizza & Pasta',
    address: 'Akota',
    rating: 4.4,
    waitRange: '15–20m wait',
    partiesAhead: 3,
    ctaText: 'View Restaurant',
  },
  {
    id: 'slide-4',
    restaurantId: 'pop-3',
    name: 'Spice Villa',
    image:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop',
    cuisine: 'Kathiyawadi & Gujarati Thali',
    address: 'Manjalpur',
    rating: 4.6,
    waitRange: '25–35m wait',
    partiesAhead: 9,
    ctaText: 'Explore Menu',
  },
];

export function HeroPromoBanner({
  onExplorePress,
  onRestaurantPress,
}: HeroPromoBannerProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const flatListRef = React.useRef<FlatList>(null);
  const isInteracting = React.useRef(false);

  // Auto-scroll carousel every 4.5 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (isInteracting.current) return;
      const nextIndex = (activeIndex + 1) % CAROUSEL_SLIDES.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 4500);

    return () => clearInterval(timer);
  }, [activeIndex]);

  function handleMomentumScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / SCREEN_WIDTH);
    if (newIndex >= 0 && newIndex < CAROUSEL_SLIDES.length) {
      setActiveIndex(newIndex);
    }
    isInteracting.current = false;
  }

  function handleSlidePress(slide: CarouselSlide) {
    if (onRestaurantPress) {
      onRestaurantPress(slide.restaurantId);
    } else if (onExplorePress) {
      onExplorePress();
    }
  }

  return (
    <View className="w-full mb-3" style={{ borderRadius: 0 }}>
      {/* End-to-End Carousel: Full screen width, 0 corner radius */}
      <FlatList
        ref={flatListRef}
        data={CAROUSEL_SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScrollBeginDrag={() => {
          isInteracting.current = true;
        }}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSlidePress(item)}
            style={{ width: SCREEN_WIDTH, height: 230, borderRadius: 0 }}
            className="relative overflow-hidden bg-neutral-900 active:opacity-95">
            {/* Background Image */}
            <Image
              source={{ uri: item.image }}
              style={{ width: SCREEN_WIDTH, height: 230, borderRadius: 0 }}
              resizeMode="cover"
            />

            {/* Smooth Cinema Gradient Overlay */}
            <Svg
              height="230"
              width={SCREEN_WIDTH}
              style={StyleSheet.absoluteFill}>
              <Defs>
                <LinearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#000000" stopOpacity="0.15" />
                  <Stop offset="0.4" stopColor="#000000" stopOpacity="0.25" />
                  <Stop offset="0.75" stopColor="#000000" stopOpacity="0.78" />
                  <Stop offset="1" stopColor="#000000" stopOpacity="0.94" />
                </LinearGradient>
              </Defs>
              <Rect width={SCREEN_WIDTH} height="230" fill="url(#heroGradient)" />
            </Svg>

            {/* Bottom Content: Clean Authentic Info + CTA Button */}
            <View className="absolute bottom-4 left-4 right-4 z-10">
              <View className="flex-row items-end justify-between">
                {/* Left Info Column */}
                <View className="flex-1 mr-3">
                  {/* Restaurant Name + Rating */}
                  <View className="flex-row items-center gap-2">
                    <Text
                      className="text-xl font-bold text-white tracking-tight"
                      numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View className="flex-row items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-white/20">
                      <StarIcon size={11} color="#f59e0b" fill="#f59e0b" />
                      <Text className="text-[11px] font-bold text-white">
                        {item.rating}
                      </Text>
                    </View>
                  </View>

                  {/* Cuisine & Location */}
                  <Text
                    className="text-[12px] text-neutral-200 mt-1 font-medium"
                    numberOfLines={1}>
                    {item.cuisine} • {item.address}
                  </Text>

                  {/* Live Wait Status with clean indicator */}
                  <View className="flex-row items-center gap-1.5 mt-1.5">
                    <View className="size-2 rounded-full bg-emerald-400" />
                    <Text className="text-[11px] font-semibold text-emerald-300">
                      {item.waitRange} • {item.partiesAhead} ahead in line
                    </Text>
                  </View>
                </View>

                {/* Right Action Button */}
                <Pressable
                  onPress={() => handleSlidePress(item)}
                  className="bg-[#dc2626] active:bg-[#b91c1c] px-3.5 py-2.5 flex-row items-center gap-1.5 shadow-md">
                  <Text className="text-xs font-bold text-white">
                    {item.ctaText}
                  </Text>
                  <ArrowRightIcon size={13} color="#ffffff" />
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
      />

      {/* Pagination Line / Dots Indicator */}
      <View className="flex-row items-center justify-center gap-1.5 mt-2">
        {CAROUSEL_SLIDES.map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <Pressable
              key={`dot-${index}`}
              onPress={() => {
                flatListRef.current?.scrollToIndex({
                  index,
                  animated: true,
                });
                setActiveIndex(index);
              }}
              style={{
                width: isActive ? 20 : 6,
                height: 4,
                backgroundColor: isActive ? '#dc2626' : '#d4d4d8',
                borderRadius: 2,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

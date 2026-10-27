import { BrandLogo } from '@/components/brand-logo';
import { FloatingQueueWidget } from '@/components/floating-queue-widget';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS, MOCK_RESTAURANTS, MOCK_TRENDING_RESTAURANTS } from '@/lib/mock-data';
import { PhotoItem, Restaurant } from '@/types/queuebite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Image as ImageIcon,
  SparklesIcon,
  XIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_SIZE = (SCREEN_WIDTH - 44) / 3;

export default function RestaurantPhotoGalleryScreen() {
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

  const [activeTab, setActiveTab] = React.useState<'ALL' | 'FOOD' | 'AMBIENCE'>('ALL');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = React.useState<number | null>(null);

  const allPhotos: { id: string; image: string; tag: 'FOOD' | 'AMBIENCE' }[] = React.useMemo(() => {
    return [
      { id: '1', image: restaurant.image, tag: 'AMBIENCE' },
      { id: '2', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop', tag: 'AMBIENCE' },
      { id: '3', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop', tag: 'AMBIENCE' },
      { id: '4', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop', tag: 'FOOD' },
      { id: '5', image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?q=80&w=800&auto=format&fit=crop', tag: 'FOOD' },
      { id: '6', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop', tag: 'FOOD' },
      { id: '7', image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?q=80&w=800&auto=format&fit=crop', tag: 'FOOD' },
      { id: '8', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop', tag: 'AMBIENCE' },
      { id: '9', image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=800&auto=format&fit=crop', tag: 'AMBIENCE' },
      { id: '10', image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=800&auto=format&fit=crop', tag: 'AMBIENCE' },
      { id: '11', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop', tag: 'AMBIENCE' },
      { id: '12', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop', tag: 'FOOD' },
    ];
  }, [restaurant.image]);

  const filteredPhotos = React.useMemo(() => {
    if (activeTab === 'ALL') return allPhotos;
    return allPhotos.filter((p) => p.tag === activeTab);
  }, [allPhotos, activeTab]);

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
              Photos & Ambience
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              {restaurant.name} ({allPhotos.length} photos)
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        {/* Category Tabs */}
        <View className="px-5 pt-3 pb-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {[
              { id: 'ALL', label: `All Photos (${allPhotos.length})` },
              { id: 'FOOD', label: 'Dishes & Food (5)' },
              { id: 'AMBIENCE', label: 'Interior & Seating (7)' },
            ].map((tab) => {
              const isSel = activeTab === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full border active:scale-95 ${
                    isSel
                      ? 'bg-[#dc2626] border-[#dc2626]'
                      : 'bg-white border-neutral-200/90'
                  }`}>
                  <Text
                    className={`text-xs font-bold ${
                      isSel ? 'text-white' : 'text-neutral-700'
                    }`}>
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* 3-Column Photo Grid */}
        <View className="px-4 pt-2 flex-row flex-wrap gap-1.5">
          {filteredPhotos.map((item, idx) => (
            <Pressable
              key={item.id}
              onPress={() => setSelectedPhotoIndex(idx)}
              style={{ width: PHOTO_SIZE, height: PHOTO_SIZE }}
              className="rounded-2xl overflow-hidden bg-neutral-200 active:opacity-85 shadow-2xs">
              <Image
                source={{ uri: item.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Full-Screen Lightbox Modal */}
      <Modal
        visible={selectedPhotoIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhotoIndex(null)}>
        <View className="flex-1 bg-black justify-between" style={{ paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20 }}>
          {/* Top Bar with Close */}
          <View className="px-5 flex-row items-center justify-between">
            <Text className="text-white text-xs font-bold">
              {selectedPhotoIndex !== null ? `${selectedPhotoIndex + 1} of ${filteredPhotos.length}` : ''}
            </Text>
            <Pressable
              onPress={() => setSelectedPhotoIndex(null)}
              className="size-9 rounded-full bg-white/20 items-center justify-center active:bg-white/30">
              <XIcon size={20} color="#ffffff" />
            </Pressable>
          </View>

          {/* Main Full Image */}
          {selectedPhotoIndex !== null && (
            <View className="flex-1 items-center justify-center px-2">
              <Image
                source={{ uri: filteredPhotos[selectedPhotoIndex].image }}
                className="w-full h-[70%]"
                resizeMode="contain"
              />
            </View>
          )}

          {/* Prev / Next controls */}
          <View className="px-8 flex-row items-center justify-between">
            <Pressable
              onPress={() =>
                setSelectedPhotoIndex((prev) =>
                  prev !== null && prev > 0 ? prev - 1 : filteredPhotos.length - 1
                )
              }
              className="size-11 rounded-full bg-white/20 items-center justify-center active:bg-white/30">
              <ChevronLeftIcon size={22} color="#ffffff" />
            </Pressable>

            <Pressable
              onPress={() =>
                setSelectedPhotoIndex((prev) =>
                  prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : 0
                )
              }
              className="size-11 rounded-full bg-white/20 items-center justify-center active:bg-white/30">
              <ChevronRightIcon size={22} color="#ffffff" />
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

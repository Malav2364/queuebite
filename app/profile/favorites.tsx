import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS, MOCK_TRENDING_RESTAURANTS } from '@/lib/mock-data';
import { Restaurant } from '@/types/queuebite';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  BookmarkCheckIcon,
  ClockIcon,
  CompassIcon,
  HeartIcon,
  MapPinIcon,
  SearchIcon,
  StarIcon,
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

export default function ProfileFavoritesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [savedPlaces, setSavedPlaces] = React.useState<Restaurant[]>([
    ...MOCK_POPULAR_RESTAURANTS.slice(0, 3),
    ...MOCK_TRENDING_RESTAURANTS.slice(0, 2),
  ]);
  const [selectedFolder, setSelectedFolder] = React.useState('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');

  const folders = [
    { id: 'ALL', name: 'All Saved' },
    { id: 'FINE_DINING', name: 'Fine Dining' },
    { id: 'CAFES', name: 'Quick Cafes' },
    { id: 'FAMILY', name: 'Family Spots' },
  ];

  function handleRemoveFavorite(id: string, name: string) {
    Alert.alert('Remove Favorite', `Remove ${name} from your saved places?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setSavedPlaces((prev) => prev.filter((p) => p.id !== id));
        },
      },
    ]);
  }

  const filtered = savedPlaces.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Favorites
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              {savedPlaces.length} saved restaurants
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        {/* Search Bar */}
        <View className="px-5 pt-4">
          <View className="h-11 bg-white rounded-2xl border border-neutral-200/80 px-3.5 flex-row items-center gap-2.5 shadow-sm mb-3">
            <SearchIcon size={16} color="#71717a" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search saved restaurants..."
              placeholderTextColor="#a1a1aa"
              className="flex-1 text-xs text-neutral-900 font-medium h-full"
            />
          </View>

          {/* Folder Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2 mb-2">
            {folders.map((f) => {
              const isSelected = selectedFolder === f.id;
              return (
                <Pressable
                  key={f.id}
                  onPress={() => setSelectedFolder(f.id)}
                  className={`px-3.5 py-1.5 rounded-full border ${
                    isSelected
                      ? 'bg-neutral-900 border-neutral-900'
                      : 'bg-white border-neutral-200/80 active:bg-neutral-50'
                  }`}>
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-neutral-600'
                    }`}>
                    {f.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Places List */}
        <View className="px-5 pt-2">
          {filtered.length === 0 ? (
            <View className="bg-white rounded-xl p-8 border border-neutral-100 shadow-sm items-center my-6">
              <View className="size-16 rounded-full bg-red-50 items-center justify-center mb-3">
                <HeartIcon size={28} color="#dc2626" />
              </View>
              <Text className="text-base font-bold text-neutral-900 text-center">
                No Favorites Saved
              </Text>
              <Text className="text-xs text-neutral-500 text-center mt-1 max-w-[240px]">
                Bookmark restaurants you love to quickly join queues or pre-order.
              </Text>
              <Pressable
                onPress={() => router.push('/explore')}
                className="mt-5 px-5 py-2.5 rounded-xl bg-[#dc2626] active:bg-[#b91c1c]">
                <Text className="text-xs font-bold text-white">Explore Restaurants</Text>
              </Pressable>
            </View>
          ) : (
            filtered.map((place) => (
              <View
                key={place.id}
                className="bg-white rounded-xl p-4 border border-neutral-100 shadow-sm mb-3.5">
                <View className="flex-row items-center gap-3">
                  <Image
                    source={{ uri: place.image }}
                    className="size-18 rounded-2xl bg-neutral-100"
                    resizeMode="cover"
                  />
                  <View className="flex-1 pr-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm font-bold text-neutral-900" numberOfLines={1}>
                        {place.name}
                      </Text>
                      <Pressable
                        onPress={() => handleRemoveFavorite(place.id, place.name)}
                        className="p-1 active:opacity-60">
                        <HeartIcon size={18} color="#dc2626" fill="#dc2626" />
                      </Pressable>
                    </View>

                    <Text className="text-xs text-neutral-500 mt-0.5" numberOfLines={1}>
                      {place.cuisine} • {place.distance}
                    </Text>

                    <View className="flex-row items-center gap-2 mt-2">
                      <View className="flex-row items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md">
                        <StarIcon size={11} color="#f59e0b" fill="#f59e0b" />
                        <Text className="text-[10px] font-bold text-amber-900">
                          {place.rating}
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-1 bg-red-50 px-2 py-0.5 rounded-md">
                        <ClockIcon size={10} color="#dc2626" />
                        <Text className="text-[10px] font-bold text-[#dc2626]">
                          {place.waitRange}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Actions Row */}
                <View className="pt-3 mt-3 border-t border-neutral-100 flex-row gap-2">
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/restaurant/join',
                        params: { id: place.id },
                      })
                    }
                    className="flex-1 py-2 rounded-xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center">
                    <Text className="text-xs font-bold text-white">Join Queue</Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/order/menu',
                        params: { id: place.id },
                      })
                    }
                    className="flex-1 py-2 rounded-xl bg-neutral-100 active:bg-neutral-200 items-center justify-center">
                    <Text className="text-xs font-bold text-neutral-800">Pre-Order Food</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

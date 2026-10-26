import { BottomNav, TabKey } from '@/components/bottom-nav';
import { BrandLogo } from '@/components/brand-logo';
import { FloatingQueueWidget } from '@/components/floating-queue-widget';
import { LocationModal } from '@/components/location-modal';
import { Text } from '@/components/ui/text';
import { MOCK_RESTAURANTS } from '@/lib/mock-data';
import { Restaurant } from '@/types/queuebite';
import { useRouter } from 'expo-router';
import {
  ArrowDownIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  CoffeeIcon,
  CrosshairIcon,
  HeartIcon,
  IndianRupeeIcon,
  LandmarkIcon,
  LayoutGridIcon,
  ListIcon,
  MapIcon,
  MapPinIcon,
  MinusIcon,
  PlusIcon,
  RotateCcwIcon,
  SearchIcon,
  ShoppingBagIcon,
  SlidersHorizontalIcon,
  SoupIcon,
  StarIcon,
  TrainIcon,
  TreeDeciduousIcon,
  UserPlusIcon,
  UsersIcon,
  UtensilsCrossedIcon,
  UtensilsIcon,
  XIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line, Path, Rect } from 'react-native-svg';

// Dynamically import react-native-maps only on native platforms
let MapView: any = null;
let Marker: any = null;
let PROVIDER_DEFAULT: any = null;
if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    PROVIDER_DEFAULT = Maps.PROVIDER_DEFAULT;
  } catch (e) {
    console.warn('Native maps module not available:', e);
  }
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Coordinates for Alkapuri, Vadodara
const VADODARA_REGION = {
  latitude: 22.3106,
  longitude: 73.1812,
  latitudeDelta: 0.035,
  longitudeDelta: 0.035,
};

// Cuisine categories matching mock
const CUISINES = [
  { id: 'ALL', label: 'All', icon: LayoutGridIcon },
  { id: 'Cafe', label: 'Cafe', icon: CoffeeIcon },
  { id: 'Indian', label: 'Indian', icon: UtensilsIcon },
  { id: 'Italian', label: 'Italian', icon: UtensilsIcon },
  { id: 'Chinese', label: 'Chinese', icon: SoupIcon },
  { id: 'Fast Food', label: 'Fast Food', icon: UtensilsIcon },
  { id: 'Desserts', label: 'Desserts', icon: CoffeeIcon },
];

type SortOption = 'RECOMMENDED' | 'WAIT_TIME' | 'RATING' | 'DISTANCE';
type FilterType = 'DISTANCE' | 'RATING' | 'PRICE' | 'WAIT_TIME' | null;
type ViewMode = 'MAP' | 'LIST';

// Map markers definition matching mock image with real geographical coordinates
interface MapPinData {
  id: string;
  name: string;
  wait: string;
  rating: number;
  latitude: number;
  longitude: number;
  type: 'cutlery' | 'coffee' | 'burger' | 'pizza' | 'soup';
  // Percentage coordinates for web fallback
  topPercent: number;
  leftPercent: number;
}

const MAP_PINS: MapPinData[] = [
  {
    id: 'pop-1', // The Daily Bean (Center, Alkapuri)
    name: 'The Daily Bean',
    wait: '5–15 min',
    rating: 4.5,
    type: 'cutlery',
    latitude: 22.3106,
    longitude: 73.1812,
    topPercent: 47,
    leftPercent: 50,
  },
  {
    id: 'search-1', // Spice Route (North-East, Sayajigunj)
    name: 'Spice Route',
    wait: '25–35 min',
    rating: 4.3,
    type: 'cutlery',
    latitude: 22.3188,
    longitude: 73.1892,
    topPercent: 37,
    leftPercent: 59,
  },
  {
    id: 'search-3', // The Burger Club (West, Manjalpur)
    name: 'The Burger Club',
    wait: '10–15 min',
    rating: 4.2,
    type: 'burger',
    latitude: 22.3045,
    longitude: 73.1702,
    topPercent: 44,
    leftPercent: 18,
  },
  {
    id: 'rest-2', // Brew & Bean (North-West)
    name: 'Brew & Bean',
    wait: '12–18 min',
    rating: 4.4,
    type: 'coffee',
    latitude: 22.3195,
    longitude: 73.1725,
    topPercent: 33,
    leftPercent: 20,
  },
  {
    id: 'search-2', // Pizza Project (South-West)
    name: 'Pizza Project',
    wait: '20–30 min',
    rating: 4.4,
    type: 'pizza',
    latitude: 22.3015,
    longitude: 73.1735,
    topPercent: 62,
    leftPercent: 26,
  },
  {
    id: 'search-4', // Noodle Nation (South-East)
    name: 'Noodle Nation',
    wait: '15–25 min',
    rating: 4.3,
    type: 'soup',
    latitude: 22.3035,
    longitude: 73.1865,
    topPercent: 59,
    leftPercent: 58,
  },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const mapRef = React.useRef<any>(null);

  // View mode: 'MAP' or 'LIST'
  const [viewMode, setViewMode] = React.useState<ViewMode>('MAP');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCuisine, setSelectedCuisine] = React.useState('ALL');
  const [selectedDistance, setSelectedDistance] = React.useState<number | null>(null);
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = React.useState<string | null>(null);
  const [selectedMaxWait, setSelectedMaxWait] = React.useState<number | null>(null);
  const [sortBy, setSortBy] = React.useState<SortOption>('RECOMMENDED');

  // Map selection state (default to The Daily Bean)
  const [selectedPinId, setSelectedPinId] = React.useState<string>('pop-1');
  const [currentRegion, setCurrentRegion] = React.useState(VADODARA_REGION);

  // Favorites state
  const [favorites, setFavorites] = React.useState<Set<string>>(
    new Set(['rest-1', 'trend-1', 'pop-2'])
  );

  // Active filter modal state
  const [activeFilterModal, setActiveFilterModal] = React.useState<FilterType>(null);
  const [showSortModal, setShowSortModal] = React.useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = React.useState(false);
  const [locationName, setLocationName] = React.useState('Vadodara');
  const [areaName, setAreaName] = React.useState('Alkapuri, Vadodara');

  // Beacon pulse animation for selected pin
  const pulseAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Handle marker selection and pan to pin
  function handleSelectPin(pin: MapPinData) {
    setSelectedPinId(pin.id);
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: pin.latitude,
          longitude: pin.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        500
      );
    }
  }

  // Handle GPS recenter
  function handleRecenter() {
    setSelectedPinId('pop-1');
    if (mapRef.current) {
      mapRef.current.animateToRegion(VADODARA_REGION, 600);
    }
    Alert.alert(
      'GPS Recentered',
      'Centered on your current location in Alkapuri, Vadodara.'
    );
  }

  // Handle Zoom In / Zoom Out
  function handleZoom(direction: 'in' | 'out') {
    if (mapRef.current) {
      const factor = direction === 'in' ? 0.6 : 1.6;
      mapRef.current.animateToRegion(
        {
          ...currentRegion,
          latitudeDelta: Math.max(0.005, currentRegion.latitudeDelta * factor),
          longitudeDelta: Math.max(0.005, currentRegion.longitudeDelta * factor),
        },
        300
      );
    }
  }

  // Toggle Favorite
  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  }

  // Currently selected restaurant for map card
  const selectedRestaurant: Restaurant = React.useMemo(() => {
    const found = MOCK_RESTAURANTS.find((r) => r.id === selectedPinId);
    return found || MOCK_RESTAURANTS[0];
  }, [selectedPinId]);

  // Filter & sort logic
  const filteredRestaurants = React.useMemo(() => {
    let list = [...MOCK_RESTAURANTS];

    // 1. Search Query
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter((r) => {
        const matchName = r.name.toLowerCase().includes(query);
        const matchCuisine = r.cuisine.toLowerCase().includes(query);
        const matchArea = r.address.toLowerCase().includes(query);
        const matchCategories = r.categories?.some((c) =>
          c.toLowerCase().includes(query)
        );
        return matchName || matchCuisine || matchArea || matchCategories;
      });
    }

    // 2. Cuisine Filter
    if (selectedCuisine !== 'ALL') {
      list = list.filter((r) => {
        const inCuisine = r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase());
        const inCategories = r.categories?.some(
          (c) => c.toLowerCase() === selectedCuisine.toLowerCase()
        );
        return inCuisine || inCategories;
      });
    }

    // 3. Distance Filter
    if (selectedDistance !== null) {
      list = list.filter((r) => {
        const kmMatch = r.distance.match(/([\d.]+)\s*km/);
        if (kmMatch) {
          const km = parseFloat(kmMatch[1]);
          return km <= selectedDistance;
        }
        return true;
      });
    }

    // 4. Rating Filter
    if (selectedRating !== null) {
      list = list.filter((r) => r.rating >= selectedRating);
    }

    // 5. Price Filter
    if (selectedPrice !== null) {
      list = list.filter((r) => {
        const normR = r.priceRange.replace(/\$/g, '₹');
        return normR === selectedPrice;
      });
    }

    // 6. Wait Time Filter
    if (selectedMaxWait !== null) {
      list = list.filter((r) => {
        if (r.waitMinutesEstimated === null) return false;
        return r.waitMinutesEstimated <= selectedMaxWait;
      });
    }

    // 7. Sort
    list.sort((a, b) => {
      if (sortBy === 'WAIT_TIME') {
        const waitA = a.waitMinutesEstimated ?? 999;
        const waitB = b.waitMinutesEstimated ?? 999;
        return waitA - waitB;
      }
      if (sortBy === 'RATING') {
        return b.rating - a.rating;
      }
      if (sortBy === 'DISTANCE') {
        const kmA = parseFloat(a.distance) || 0;
        const kmB = parseFloat(b.distance) || 0;
        return kmA - kmB;
      }
      return 0;
    });

    return list;
  }, [
    searchQuery,
    selectedCuisine,
    selectedDistance,
    selectedRating,
    selectedPrice,
    selectedMaxWait,
    sortBy,
  ]);

  // Reset all filters
  function resetAllFilters() {
    setSelectedCuisine('ALL');
    setSelectedDistance(null);
    setSelectedRating(null);
    setSelectedPrice(null);
    setSelectedMaxWait(null);
    setSearchQuery('');
    setSortBy('RECOMMENDED');
  }

  const hasActiveFilters =
    selectedCuisine !== 'ALL' ||
    selectedDistance !== null ||
    selectedRating !== null ||
    selectedPrice !== null ||
    selectedMaxWait !== null ||
    searchQuery.length > 0;

  // Custom marker pin element
  function renderPinMarker(pin: MapPinData, isSelected: boolean) {
    return (
      <View className="flex-row items-center">
        {/* Left: Red Pin Icon with Arrow */}
        <View className="items-center">
          <View
            className={`size-8 rounded-full bg-[#dc2626] items-center justify-center border-2 border-white shadow-md ${
              isSelected ? 'scale-110' : ''
            }`}>
            {pin.type === 'coffee' && (
              <CoffeeIcon size={14} color="#ffffff" strokeWidth={2.3} />
            )}
            {pin.type === 'burger' && (
              <UtensilsIcon size={14} color="#ffffff" strokeWidth={2.3} />
            )}
            {pin.type === 'pizza' && (
              <UtensilsCrossedIcon size={14} color="#ffffff" strokeWidth={2.3} />
            )}
            {pin.type === 'soup' && (
              <SoupIcon size={14} color="#ffffff" strokeWidth={2.3} />
            )}
            {pin.type === 'cutlery' && (
              <UtensilsCrossedIcon size={14} color="#ffffff" strokeWidth={2.3} />
            )}
          </View>
          {/* Downward triangle indicator */}
          <View
            style={{
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              borderLeftWidth: 4,
              borderRightWidth: 4,
              borderBottomWidth: 0,
              borderTopWidth: 5,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: '#dc2626',
            }}
          />
        </View>

        {/* Right: White Speech Bubble Callout */}
        <View
          className={`ml-1.5 bg-white rounded-xl px-2.5 py-1 shadow-md border ${
            isSelected
              ? 'border-[#dc2626] shadow-red-500/20'
              : 'border-neutral-200/90'
          }`}>
          <Text
            className={`text-xs font-black ${
              isSelected ? 'text-[#dc2626]' : 'text-neutral-900'
            }`}>
            {pin.wait}
          </Text>
          <Text
            className="text-[10px] font-bold text-neutral-800"
            numberOfLines={1}>
            {pin.name}
          </Text>
          <View className="flex-row items-center mt-0.5">
            <StarIcon size={9} color="#eab308" fill="#eab308" />
            <Text className="text-[10px] font-bold text-neutral-700 ml-0.5">
              {pin.rating}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#faf8f5]">
      <StatusBar barStyle="dark-content" />

      {/* Floating Active Queue Widget across app */}
      <FloatingQueueWidget />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 90,
        }}>
        {/* 1. Header Row (Official QueueBite Brand Logo + Location Selector) */}
        <View className="px-5 flex-row items-center justify-between mb-3">
          {/* Unified QueueBite Brand Logo */}
          <BrandLogo size="md" />

          {/* Location Chip */}
          <Pressable
            onPress={() => setIsLocationModalVisible(true)}
            className="flex-row items-center gap-2 active:opacity-70"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <View className="size-8 rounded-full bg-[#fee2e2] items-center justify-center">
              <MapPinIcon size={16} color="#dc2626" />
            </View>
            <View>
              <View className="flex-row items-center gap-1">
                <Text className="text-sm font-extrabold text-neutral-900">
                  {locationName}
                </Text>
                <ChevronDownIcon size={14} color="#18181b" strokeWidth={2.5} />
              </View>
              <Text className="text-[10px] text-neutral-500 font-medium">
                {areaName}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* 2. Headline & Subtitle */}
        <View className="px-5 mb-4">
          <Text className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            {viewMode === 'MAP' ? 'Explore Nearby' : 'Find Your Next Bite'}
          </Text>
          <Text className="text-sm text-neutral-500 mt-1">
            {viewMode === 'MAP'
              ? 'Great food is closer than you think.'
              : 'Skip the wait, not the cravings.'}
          </Text>
        </View>

        {/* 3. Search Bar */}
        <View className="px-5 mb-4">
          <View className="flex-row items-center bg-white h-12 rounded-2xl px-3.5 border border-neutral-200/90 shadow-xs">
            <SearchIcon size={18} color="#71717a" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for restaurants, cuisines or dishes..."
              placeholderTextColor="#a1a1aa"
              className="flex-1 ml-2.5 text-sm text-neutral-900 font-medium"
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <Pressable
                onPress={() => setSearchQuery('')}
                className="size-6 rounded-full bg-neutral-100 items-center justify-center mr-1.5">
                <XIcon size={13} color="#71717a" strokeWidth={2.5} />
              </Pressable>
            )}
            <Pressable
              onPress={() => setActiveFilterModal('DISTANCE')}
              className="pl-2 border-l border-neutral-200 active:opacity-70">
              <SlidersHorizontalIcon size={18} color="#18181b" />
            </Pressable>
          </View>
        </View>

        {/* 4. Cuisine Categories Horizontal Scroll */}
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
            {CUISINES.map((cuisine) => {
              const isSelected = selectedCuisine === cuisine.id;
              const IconComp = cuisine.icon;
              return (
                <Pressable
                  key={cuisine.id}
                  onPress={() => setSelectedCuisine(cuisine.id)}
                  className={`flex-row items-center gap-2 px-3.5 py-2 rounded-2xl active:scale-95 ${
                    isSelected
                      ? 'bg-[#dc2626] shadow-sm'
                      : 'bg-[#faf4ee] border border-[#fed7aa]/50'
                  }`}>
                  <View
                    className={`size-6 rounded-full items-center justify-center ${
                      isSelected ? 'bg-white/20' : 'bg-white'
                    }`}>
                    <IconComp
                      size={13}
                      color={isSelected ? '#ffffff' : '#ea580c'}
                      strokeWidth={2.2}
                    />
                  </View>
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-neutral-800'
                    }`}>
                    {cuisine.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* 5. Filter Dropdowns Row */}
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
            {/* Distance Filter */}
            <Pressable
              onPress={() => setActiveFilterModal('DISTANCE')}
              className={`flex-row items-center gap-1.5 px-3 py-2 rounded-full border active:bg-neutral-50 ${
                selectedDistance !== null
                  ? 'bg-red-50/80 border-[#dc2626]'
                  : 'bg-white border-neutral-200/90'
              }`}>
              <MapPinIcon size={13} color="#dc2626" />
              <Text
                className={`text-xs font-semibold ${
                  selectedDistance !== null
                    ? 'text-[#dc2626] font-bold'
                    : 'text-neutral-800'
                }`}>
                {selectedDistance !== null
                  ? `Distance: <${selectedDistance}km`
                  : 'Distance'}
              </Text>
              <ChevronDownIcon
                size={14}
                color={selectedDistance !== null ? '#dc2626' : '#71717a'}
              />
            </Pressable>

            {/* Rating Filter */}
            <Pressable
              onPress={() => setActiveFilterModal('RATING')}
              className={`flex-row items-center gap-1.5 px-3 py-2 rounded-full border active:bg-neutral-50 ${
                selectedRating !== null
                  ? 'bg-red-50/80 border-[#dc2626]'
                  : 'bg-white border-neutral-200/90'
              }`}>
              <StarIcon
                size={13}
                color="#dc2626"
                fill={selectedRating !== null ? '#dc2626' : 'none'}
              />
              <Text
                className={`text-xs font-semibold ${
                  selectedRating !== null
                    ? 'text-[#dc2626] font-bold'
                    : 'text-neutral-800'
                }`}>
                {selectedRating !== null ? `Rating: ${selectedRating}+` : 'Rating'}
              </Text>
              <ChevronDownIcon
                size={14}
                color={selectedRating !== null ? '#dc2626' : '#71717a'}
              />
            </Pressable>

            {/* Price Filter */}
            <Pressable
              onPress={() => setActiveFilterModal('PRICE')}
              className={`flex-row items-center gap-1.5 px-3 py-2 rounded-full border active:bg-neutral-50 ${
                selectedPrice !== null
                  ? 'bg-red-50/80 border-[#dc2626]'
                  : 'bg-white border-neutral-200/90'
              }`}>
              <IndianRupeeIcon size={13} color="#dc2626" />
              <Text
                className={`text-xs font-semibold ${
                  selectedPrice !== null
                    ? 'text-[#dc2626] font-bold'
                    : 'text-neutral-800'
                }`}>
                {selectedPrice !== null ? `Price: ${selectedPrice}` : 'Price'}
              </Text>
              <ChevronDownIcon
                size={14}
                color={selectedPrice !== null ? '#dc2626' : '#71717a'}
              />
            </Pressable>

            {/* Wait Time Filter */}
            <Pressable
              onPress={() => setActiveFilterModal('WAIT_TIME')}
              className={`flex-row items-center gap-1.5 px-3 py-2 rounded-full border active:bg-neutral-50 ${
                selectedMaxWait !== null
                  ? 'bg-red-50/80 border-[#dc2626]'
                  : 'bg-white border-neutral-200/90'
              }`}>
              <ClockIcon size={13} color="#dc2626" />
              <Text
                className={`text-xs font-semibold ${
                  selectedMaxWait !== null
                    ? 'text-[#dc2626] font-bold'
                    : 'text-neutral-800'
                }`}>
                {selectedMaxWait !== null
                  ? `Wait: <${selectedMaxWait}m`
                  : 'Wait Time'}
              </Text>
              <ChevronDownIcon
                size={14}
                color={selectedMaxWait !== null ? '#dc2626' : '#71717a'}
              />
            </Pressable>

            {/* Clear All Reset Filter Button */}
            {hasActiveFilters && (
              <Pressable
                onPress={resetAllFilters}
                className="flex-row items-center gap-1 px-3 py-2 rounded-full bg-neutral-200/80 active:bg-neutral-300">
                <RotateCcwIcon size={12} color="#18181b" />
                <Text className="text-xs font-bold text-neutral-800">Reset</Text>
              </Pressable>
            )}
          </ScrollView>
        </View>

        {/* 6. MODE SELECTION: MAP vs LIST */}
        {viewMode === 'MAP' ? (
          /* ========================================================
             MAP SERVICE IMPLEMENTATION (Live Map Service + Interactivity)
             ======================================================== */
          <View className="relative">
            {/* Map Service Canvas (Height: 480) */}
            <View
              className="relative w-full overflow-hidden bg-[#f4f1ea] border-y border-neutral-200"
              style={{ height: 480 }}>
              {/* Native Live Map Service */}
              {MapView ? (
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_DEFAULT}
                  style={{ width: '100%', height: '100%' }}
                  initialRegion={VADODARA_REGION}
                  onRegionChangeComplete={(r: any) => setCurrentRegion(r)}
                  showsUserLocation={true}
                  showsCompass={false}>
                  {MAP_PINS.map((pin) => {
                    const isSelected = selectedPinId === pin.id;
                    return (
                      <Marker
                        key={pin.id}
                        coordinate={{
                          latitude: pin.latitude,
                          longitude: pin.longitude,
                        }}
                        onPress={() => handleSelectPin(pin)}>
                        {renderPinMarker(pin, isSelected)}
                      </Marker>
                    );
                  })}
                </MapView>
              ) : (
                /* Fallback vector canvas for Web or environments without native map modules */
                <View className="relative w-full h-full">
                  <Svg width="100%" height="100%" viewBox="0 0 400 480">
                    <Rect x="0" y="0" width="400" height="480" fill="#f4f1ea" />
                    <Path
                      d="M -20,120 Q 30,100 65,140 Q 80,190 40,240 Q 0,270 -20,240 Z"
                      fill="#dceed6"
                      opacity={0.85}
                    />
                    <Path
                      d="M 280,-10 Q 350,10 390,70 Q 360,130 300,100 Q 260,50 280,-10 Z"
                      fill="#e0f2dc"
                      opacity={0.7}
                    />
                    <Path
                      d="M 370,140 Q 395,200 375,260 Q 360,330 390,400 Q 400,440 400,480 L 420,480 L 420,140 Z"
                      fill="#d7edf9"
                      opacity={0.8}
                    />
                    <Line
                      x1="0"
                      y1="190"
                      x2="400"
                      y2="280"
                      stroke="#ffffff"
                      strokeWidth="14"
                    />
                    <Line
                      x1="0"
                      y1="190"
                      x2="400"
                      y2="280"
                      stroke="#fbeee4"
                      strokeWidth="8"
                    />
                    <Line
                      x1="180"
                      y1="0"
                      x2="220"
                      y2="480"
                      stroke="#ffffff"
                      strokeWidth="12"
                    />
                    <Line
                      x1="80"
                      y1="0"
                      x2="160"
                      y2="480"
                      stroke="#ffffff"
                      strokeWidth="8"
                    />
                    <Line
                      x1="280"
                      y1="0"
                      x2="310"
                      y2="480"
                      stroke="#ffffff"
                      strokeWidth="10"
                    />
                  </Svg>

                  {/* City District Typography Labels */}
                  <View className="absolute top-[200px] left-[165px] pointer-events-none">
                    <Text className="text-sm font-extrabold text-neutral-400 tracking-wider uppercase opacity-70">
                      Alkapuri
                    </Text>
                  </View>
                  <View className="absolute top-[160px] right-[40px] pointer-events-none">
                    <Text className="text-xs font-bold text-neutral-400 tracking-wider uppercase opacity-70">
                      Sayajigunj
                    </Text>
                  </View>

                  {/* Interactive Pins on Canvas */}
                  {MAP_PINS.map((pin) => {
                    const isSelected = selectedPinId === pin.id;
                    return (
                      <View
                        key={pin.id}
                        style={{
                          position: 'absolute',
                          top: `${pin.topPercent}%`,
                          left: `${pin.leftPercent}%`,
                          zIndex: isSelected ? 40 : 20,
                        }}>
                        <Pressable
                          onPress={() => handleSelectPin(pin)}
                          className="active:scale-105"
                          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                          {renderPinMarker(pin, isSelected)}
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Floating Controls at Top of Map */}
              <View className="absolute top-3 left-0 right-0 px-4 flex-row items-center justify-between z-30">
                {/* Search This Area Button */}
                <Pressable
                  onPress={() => {
                    Alert.alert(
                      'Refreshing Area',
                      'Found 52 restaurants with live queues in Alkapuri, Vadodara.'
                    );
                  }}
                  className="bg-white/95 border border-red-200/80 rounded-full px-3.5 py-1.5 flex-row items-center gap-1.5 shadow-md active:bg-red-50">
                  <RotateCcwIcon size={12} color="#dc2626" />
                  <Text className="text-xs font-bold text-[#dc2626]">
                    Search this area
                  </Text>
                </Pressable>

                {/* View Mode Toggle: [🗺 Map] [≡ List] */}
                <View className="flex-row items-center bg-white/95 rounded-full p-1 border border-neutral-200/90 shadow-md">
                  <Pressable
                    onPress={() => setViewMode('MAP')}
                    className="flex-row items-center gap-1 bg-[#dc2626] px-3 py-1 rounded-full shadow-xs">
                    <MapIcon size={12} color="#ffffff" />
                    <Text className="text-xs font-bold text-white">Map</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setViewMode('LIST')}
                    className="flex-row items-center gap-1 px-3 py-1 rounded-full active:bg-neutral-100">
                    <ListIcon size={12} color="#71717a" />
                    <Text className="text-xs font-semibold text-neutral-600">
                      List
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Floating Map Actions: Recenter & Zoom Controls (Right) */}
              <View className="absolute top-16 right-4 gap-2 z-30">
                {/* GPS Recenter */}
                <Pressable
                  onPress={handleRecenter}
                  className="size-10 rounded-full bg-white items-center justify-center shadow-lg border border-neutral-200/80 active:bg-neutral-100">
                  <CrosshairIcon size={18} color="#18181b" strokeWidth={2.2} />
                </Pressable>

                {/* Zoom In */}
                <Pressable
                  onPress={() => handleZoom('in')}
                  className="size-10 rounded-full bg-white items-center justify-center shadow-lg border border-neutral-200/80 active:bg-neutral-100">
                  <PlusIcon size={18} color="#18181b" strokeWidth={2.2} />
                </Pressable>

                {/* Zoom Out */}
                <Pressable
                  onPress={() => handleZoom('out')}
                  className="size-10 rounded-full bg-white items-center justify-center shadow-lg border border-neutral-200/80 active:bg-neutral-100">
                  <MinusIcon size={18} color="#18181b" strokeWidth={2.2} />
                </Pressable>
              </View>
            </View>

            {/* Selected Restaurant Bottom Card / Sheet */}
            <View className="mx-4 -mt-6 bg-white rounded-3xl p-4 border border-neutral-100 shadow-xl shadow-black/15 z-30">
              {/* Drag Handle Bar */}
              <View className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-3" />

              {/* Restaurant Header */}
              <View className="flex-row items-start">
                <Image
                  source={{ uri: selectedRestaurant.image }}
                  className="size-20 rounded-2xl bg-neutral-100"
                  resizeMode="cover"
                />

                <View className="flex-1 pl-3.5 justify-between">
                  {/* Name & Favorite Heart */}
                  <View className="flex-row items-start justify-between">
                    <Text
                      className="text-base font-bold text-neutral-900 flex-1 pr-2"
                      numberOfLines={1}>
                      {selectedRestaurant.name}
                    </Text>
                    <Pressable
                      onPress={() => toggleFavorite(selectedRestaurant.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      className="size-7 rounded-full items-center justify-center -mt-1 active:opacity-70">
                      <HeartIcon
                        size={18}
                        color={
                          favorites.has(selectedRestaurant.id)
                            ? '#dc2626'
                            : '#71717a'
                        }
                        fill={
                          favorites.has(selectedRestaurant.id)
                            ? '#dc2626'
                            : 'transparent'
                        }
                      />
                    </Pressable>
                  </View>

                  {/* Cuisines Tags */}
                  <Text
                    className="text-xs text-neutral-500 mt-0.5"
                    numberOfLines={1}>
                    {selectedRestaurant.categories
                      ? selectedRestaurant.categories.join('  •  ')
                      : selectedRestaurant.cuisine}
                  </Text>

                  {/* Rating, Price & Open Badge */}
                  <View className="flex-row items-center justify-between mt-1.5">
                    <View className="flex-row items-center">
                      <StarIcon size={12} color="#eab308" fill="#eab308" />
                      <Text className="text-xs font-bold text-neutral-900 ml-1">
                        {selectedRestaurant.rating.toFixed(1)}
                      </Text>
                      <Text className="text-xs text-neutral-400 ml-1">
                        (
                        {selectedRestaurant.reviewCount >= 1000
                          ? `${(selectedRestaurant.reviewCount / 1000).toFixed(1)}k`
                          : selectedRestaurant.reviewCount}
                        )
                      </Text>
                      <Text className="text-xs text-neutral-400 mx-1.5">•</Text>
                      <Text className="text-xs font-semibold text-neutral-700">
                        {selectedRestaurant.priceRange.replace(/\$/g, '₹')}
                      </Text>
                    </View>

                    <View className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                      <Text className="text-[10px] font-bold text-emerald-700">
                        Open Now
                      </Text>
                    </View>
                  </View>

                  {/* Location & Distance */}
                  <View className="flex-row items-center mt-1.5">
                    <MapPinIcon size={12} color="#dc2626" />
                    <Text
                      className="text-xs text-neutral-500 ml-1 font-medium"
                      numberOfLines={1}>
                      {selectedRestaurant.address.split(',')[0]}, Vadodara •{' '}
                      {selectedRestaurant.distance}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Wait Time & Groups Ahead Box */}
              <View className="mt-3.5 bg-[#fef7f2] border border-[#fed7aa]/50 rounded-2xl p-2.5 flex-row items-center justify-between">
                <View className="flex-1 flex-row items-center gap-2 pl-2">
                  <View className="size-8 rounded-full bg-[#fee2e2] items-center justify-center">
                    <UsersIcon size={14} color="#dc2626" />
                  </View>
                  <View>
                    <Text className="text-xs font-extrabold text-neutral-900">
                      {selectedRestaurant.waitRange}
                    </Text>
                    <Text className="text-[10px] text-neutral-500 font-medium">
                      Est. wait time
                    </Text>
                  </View>
                </View>

                <View className="w-px h-6 bg-neutral-200 mx-1" />

                <View className="flex-1 flex-row items-center gap-2 pl-3">
                  <View className="size-8 rounded-full bg-[#fee2e2] items-center justify-center">
                    <UsersIcon size={14} color="#dc2626" />
                  </View>
                  <View>
                    <Text className="text-xs font-extrabold text-neutral-900">
                      {selectedRestaurant.groupsAhead ??
                        selectedRestaurant.partiesInQueue}{' '}
                      groups
                    </Text>
                    <Text className="text-[10px] text-neutral-500 font-medium">
                      ahead
                    </Text>
                  </View>
                </View>
              </View>

              {/* 2 Action Buttons: View Details & Join Queue */}
              <View className="flex-row items-center gap-2.5 mt-3.5">
                {/* Secondary Button: View Details */}
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/restaurant/[id]',
                      params: { id: selectedRestaurant.id },
                    })
                  }
                  style={{ height: 48 }}
                  className="flex-1 rounded-2xl bg-white border border-[#dc2626] active:bg-red-50/70 items-center justify-center">
                  <Text className="text-xs font-bold text-[#dc2626]">
                    View Details
                  </Text>
                </Pressable>

                {/* Primary Button: Join Queue */}
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/restaurant/join',
                      params: {
                        id: selectedRestaurant.id,
                        initialParty: '2',
                      },
                    })
                  }
                  style={{ height: 48 }}
                  className="flex-1 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] flex-row items-center justify-center gap-1.5 shadow-md shadow-red-500/25">
                  <UserPlusIcon size={15} color="#ffffff" strokeWidth={2.2} />
                  <Text className="text-xs font-bold text-white tracking-wide">
                    Join Queue
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : (
          /* ========================================================
             LIST VIEW IMPLEMENTATION (Matching Search & Filters List)
             ======================================================== */
          <View>
            {/* Results Count & Sort Bar */}
            <View className="px-5 flex-row items-center justify-between mb-3.5">
              <Text className="text-base font-extrabold text-neutral-900">
                {filteredRestaurants.length} Restaurants Nearby
              </Text>

              <View className="flex-row items-center gap-2">
                {/* Switch back to map toggle button */}
                <Pressable
                  onPress={() => setViewMode('MAP')}
                  className="flex-row items-center gap-1 border border-neutral-200/90 bg-white px-2.5 py-1 rounded-full shadow-xs active:bg-neutral-100">
                  <MapIcon size={12} color="#dc2626" />
                  <Text className="text-xs font-bold text-[#dc2626]">Map View</Text>
                </Pressable>

                {/* Sort By Dropdown */}
                <Pressable
                  onPress={() => setShowSortModal(true)}
                  className="flex-row items-center gap-1 bg-red-50/80 px-2.5 py-1 rounded-full border border-red-200/80 active:opacity-70">
                  <Text className="text-xs font-bold text-[#dc2626]">
                    {sortBy === 'RECOMMENDED'
                      ? 'Recommended'
                      : sortBy === 'WAIT_TIME'
                        ? 'Shortest Wait'
                        : sortBy === 'RATING'
                          ? 'Highest Rated'
                          : 'Nearest'}
                  </Text>
                  <ArrowDownIcon size={12} color="#dc2626" />
                </Pressable>
              </View>
            </View>

            {/* Restaurants Feed */}
            <View className="px-5 gap-3.5">
              {filteredRestaurants.length === 0 ? (
                <View className="bg-white rounded-3xl p-8 items-center justify-center border border-neutral-100 shadow-xs my-4">
                  <View className="size-16 rounded-full bg-red-50 items-center justify-center mb-3">
                    <SearchIcon size={26} color="#dc2626" />
                  </View>
                  <Text className="text-base font-bold text-neutral-900">
                    No Restaurants Found
                  </Text>
                  <Text className="text-xs text-neutral-500 text-center mt-1 max-w-[260px]">
                    We couldn&apos;t find restaurants matching your filters. Try clearing
                    filters or searching for a different dish or cuisine.
                  </Text>
                  <Pressable
                    onPress={resetAllFilters}
                    className="mt-4 px-5 py-2.5 rounded-full bg-[#dc2626] active:bg-[#b91c1c]">
                    <Text className="text-xs font-bold text-white">Reset All Filters</Text>
                  </Pressable>
                </View>
              ) : (
                filteredRestaurants.map((restaurant) => {
                  const isFav = favorites.has(restaurant.id);
                  const isBusy =
                    restaurant.tag === 'Busy Now' ||
                    restaurant.waitLabel === 'Busy' ||
                    (restaurant.waitMinutesEstimated ?? 0) > 30;

                  return (
                    <Pressable
                      key={restaurant.id}
                      onPress={() =>
                        router.push({
                          pathname: '/restaurant/[id]',
                          params: { id: restaurant.id },
                        })
                      }
                      className="bg-white rounded-3xl p-3.5 border border-neutral-100 shadow-xs active:bg-neutral-50">
                      {/* Top: Image & Details */}
                      <View className="flex-row items-start">
                        <Image
                          source={{ uri: restaurant.image }}
                          className="size-24 rounded-2xl bg-neutral-100"
                          resizeMode="cover"
                        />

                        <View className="flex-1 pl-3.5 justify-between">
                          <View className="flex-row items-start justify-between">
                            <Text
                              className="text-base font-bold text-neutral-900 flex-1 pr-2"
                              numberOfLines={1}>
                              {restaurant.name}
                            </Text>
                            <Pressable
                              onPress={() => toggleFavorite(restaurant.id)}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                              className="size-7 rounded-full items-center justify-center -mt-1 active:opacity-70">
                              <HeartIcon
                                size={18}
                                color={isFav ? '#dc2626' : '#71717a'}
                                fill={isFav ? '#dc2626' : 'transparent'}
                              />
                            </Pressable>
                          </View>

                          <Text
                            className="text-xs text-neutral-500 mt-0.5"
                            numberOfLines={1}>
                            {restaurant.categories
                              ? restaurant.categories.join('  •  ')
                              : restaurant.cuisine}
                          </Text>

                          <View className="flex-row items-center justify-between mt-1.5">
                            <View className="flex-row items-center">
                              <StarIcon size={12} color="#eab308" fill="#eab308" />
                              <Text className="text-xs font-bold text-neutral-900 ml-1">
                                {restaurant.rating.toFixed(1)}
                              </Text>
                              <Text className="text-xs text-neutral-400 ml-1">
                                (
                                {restaurant.reviewCount >= 1000
                                  ? `${(restaurant.reviewCount / 1000).toFixed(1)}k`
                                  : restaurant.reviewCount}
                                )
                              </Text>
                              <Text className="text-xs text-neutral-400 mx-1.5">•</Text>
                              <Text className="text-xs font-semibold text-neutral-700">
                                {restaurant.priceRange.replace(/\$/g, '₹')}
                              </Text>
                            </View>

                            <View
                              className={`px-2 py-0.5 rounded-full border ${
                                isBusy
                                  ? 'bg-red-50 border-red-200'
                                  : 'bg-emerald-50 border-emerald-200'
                              }`}>
                              <Text
                                className={`text-[10px] font-bold ${
                                  isBusy ? 'text-red-700' : 'text-emerald-700'
                                }`}>
                                {isBusy ? 'Busy Now' : 'Open Now'}
                              </Text>
                            </View>
                          </View>

                          <View className="flex-row items-center mt-1.5">
                            <MapPinIcon size={12} color="#dc2626" />
                            <Text
                              className="text-xs text-neutral-500 ml-1 font-medium"
                              numberOfLines={1}>
                              {restaurant.address.split(',')[0]}, Vadodara •{' '}
                              {restaurant.distance}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Queue Stats Box */}
                      <View className="mt-3 bg-[#fef7f2] border border-[#fed7aa]/50 rounded-2xl p-2.5 flex-row items-center justify-between">
                        <View className="flex-1 flex-row items-center gap-2 pl-1">
                          <View className="size-8 rounded-full bg-[#fee2e2] items-center justify-center">
                            <UsersIcon size={14} color="#dc2626" />
                          </View>
                          <View>
                            <Text className="text-xs font-extrabold text-neutral-900">
                              {restaurant.waitRange}
                            </Text>
                            <Text className="text-[10px] text-neutral-500 font-medium">
                              Est. wait time
                            </Text>
                          </View>
                        </View>

                        <View className="w-px h-6 bg-neutral-200 mx-1" />

                        <View className="flex-1 flex-row items-center gap-2 pl-2">
                          <View className="size-8 rounded-full bg-[#fee2e2] items-center justify-center">
                            <UsersIcon size={14} color="#dc2626" />
                          </View>
                          <View>
                            <Text className="text-xs font-extrabold text-neutral-900">
                              {restaurant.groupsAhead ?? restaurant.partiesInQueue}{' '}
                              groups
                            </Text>
                            <Text className="text-[10px] text-neutral-500 font-medium">
                              ahead
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  );
                })
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* 7. Bottom Navigation Bar */}
      <BottomNav
        activeTab="EXPLORE"
        onTabChange={(tab: TabKey) => {
          if (tab === 'HOME') {
            router.push('/');
          } else if (tab === 'MY_QUEUE') {
            router.push({
              pathname: '/restaurant/live-queue',
              params: { id: selectedRestaurant.id },
            });
          } else if (tab === 'SAVED') {
            Alert.alert(
              'Saved Restaurants',
              `You have ${favorites.size} saved favorite places.`
            );
          } else if (tab === 'PROFILE') {
            Alert.alert('Profile', 'Signed in as Malav.');
          }
        }}
        hasActiveQueue={true}
      />

      {/* 8. Filter Modal Sheets */}
      <Modal
        visible={activeFilterModal !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setActiveFilterModal(null)}>
        <Pressable
          onPress={() => setActiveFilterModal(null)}
          className="flex-1 bg-black/40 justify-end">
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl p-5 shadow-2xl"
            style={{ paddingBottom: insets.bottom + 20 }}>
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4 pb-2 border-b border-neutral-100">
              <Text className="text-base font-bold text-neutral-900">
                {activeFilterModal === 'DISTANCE' && 'Filter by Distance'}
                {activeFilterModal === 'RATING' && 'Filter by Rating'}
                {activeFilterModal === 'PRICE' && 'Filter by Price Range'}
                {activeFilterModal === 'WAIT_TIME' && 'Filter by Estimated Wait Time'}
              </Text>
              <Pressable
                onPress={() => setActiveFilterModal(null)}
                className="size-7 rounded-full bg-neutral-100 items-center justify-center">
                <XIcon size={16} color="#71717a" />
              </Pressable>
            </View>

            {/* Distance Options */}
            {activeFilterModal === 'DISTANCE' && (
              <View className="gap-2">
                {[
                  { label: 'Any Distance', val: null },
                  { label: '< 1.5 km (Walking distance)', val: 1.5 },
                  { label: '< 3.0 km (Short drive)', val: 3.0 },
                  { label: '< 5.0 km (Across town)', val: 5.0 },
                ].map((item, idx) => {
                  const isSel = selectedDistance === item.val;
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => {
                        setSelectedDistance(item.val);
                        setActiveFilterModal(null);
                      }}
                      className={`flex-row items-center justify-between p-3.5 rounded-2xl border ${
                        isSel
                          ? 'bg-red-50/80 border-[#dc2626]'
                          : 'border-neutral-200 bg-white'
                      }`}>
                      <Text
                        className={`text-sm ${
                          isSel ? 'font-bold text-[#dc2626]' : 'text-neutral-800'
                        }`}>
                        {item.label}
                      </Text>
                      {isSel && <CheckIcon size={16} color="#dc2626" />}
                    </Pressable>
                  );
                })}
              </View>
            )}

            {/* Rating Options */}
            {activeFilterModal === 'RATING' && (
              <View className="gap-2">
                {[
                  { label: 'Any Rating', val: null },
                  { label: '4.5+ ⭐ (Exceptional)', val: 4.5 },
                  { label: '4.0+ ⭐ (Very Good)', val: 4.0 },
                  { label: '3.5+ ⭐ (Good)', val: 3.5 },
                ].map((item, idx) => {
                  const isSel = selectedRating === item.val;
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => {
                        setSelectedRating(item.val);
                        setActiveFilterModal(null);
                      }}
                      className={`flex-row items-center justify-between p-3.5 rounded-2xl border ${
                        isSel
                          ? 'bg-red-50/80 border-[#dc2626]'
                          : 'border-neutral-200 bg-white'
                      }`}>
                      <Text
                        className={`text-sm ${
                          isSel ? 'font-bold text-[#dc2626]' : 'text-neutral-800'
                        }`}>
                        {item.label}
                      </Text>
                      {isSel && <CheckIcon size={16} color="#dc2626" />}
                    </Pressable>
                  );
                })}
              </View>
            )}

            {/* Price Options */}
            {activeFilterModal === 'PRICE' && (
              <View className="gap-2">
                {[
                  { label: 'Any Price', val: null },
                  { label: '₹ (Pocket-friendly / Street Eats)', val: '₹' },
                  { label: '₹₹ (Casual Dining)', val: '₹₹' },
                  { label: '₹₹₹ (Fine Dining / Premium)', val: '₹₹₹' },
                ].map((item, idx) => {
                  const isSel = selectedPrice === item.val;
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => {
                        setSelectedPrice(item.val);
                        setActiveFilterModal(null);
                      }}
                      className={`flex-row items-center justify-between p-3.5 rounded-2xl border ${
                        isSel
                          ? 'bg-red-50/80 border-[#dc2626]'
                          : 'border-neutral-200 bg-white'
                      }`}>
                      <Text
                        className={`text-sm ${
                          isSel ? 'font-bold text-[#dc2626]' : 'text-neutral-800'
                        }`}>
                        {item.label}
                      </Text>
                      {isSel && <CheckIcon size={16} color="#dc2626" />}
                    </Pressable>
                  );
                })}
              </View>
            )}

            {/* Wait Time Options */}
            {activeFilterModal === 'WAIT_TIME' && (
              <View className="gap-2">
                {[
                  { label: 'Any Wait Time', val: null },
                  { label: '< 15 mins (Almost No Wait)', val: 15 },
                  { label: '< 30 mins (Moderate)', val: 30 },
                  { label: '< 45 mins (Busy)', val: 45 },
                ].map((item, idx) => {
                  const isSel = selectedMaxWait === item.val;
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => {
                        setSelectedMaxWait(item.val);
                        setActiveFilterModal(null);
                      }}
                      className={`flex-row items-center justify-between p-3.5 rounded-2xl border ${
                        isSel
                          ? 'bg-red-50/80 border-[#dc2626]'
                          : 'border-neutral-200 bg-white'
                      }`}>
                      <Text
                        className={`text-sm ${
                          isSel ? 'font-bold text-[#dc2626]' : 'text-neutral-800'
                        }`}>
                        {item.label}
                      </Text>
                      {isSel && <CheckIcon size={16} color="#dc2626" />}
                    </Pressable>
                  );
                })}
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* 9. Sort By Modal Sheet */}
      <Modal
        visible={showSortModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowSortModal(false)}>
        <Pressable
          onPress={() => setShowSortModal(false)}
          className="flex-1 bg-black/40 justify-end">
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl p-5 shadow-2xl"
            style={{ paddingBottom: insets.bottom + 20 }}>
            <View className="flex-row items-center justify-between mb-4 pb-2 border-b border-neutral-100">
              <Text className="text-base font-bold text-neutral-900">
                Sort Restaurants By
              </Text>
              <Pressable
                onPress={() => setShowSortModal(false)}
                className="size-7 rounded-full bg-neutral-100 items-center justify-center">
                <XIcon size={16} color="#71717a" />
              </Pressable>
            </View>

            <View className="gap-2">
              {[
                { label: 'Recommended', val: 'RECOMMENDED' as SortOption },
                { label: 'Shortest Wait Time', val: 'WAIT_TIME' as SortOption },
                { label: 'Highest Rated', val: 'RATING' as SortOption },
                { label: 'Nearest Distance', val: 'DISTANCE' as SortOption },
              ].map((item, idx) => {
                const isSel = sortBy === item.val;
                return (
                  <Pressable
                    key={idx}
                    onPress={() => {
                      setSortBy(item.val);
                      setShowSortModal(false);
                    }}
                    className={`flex-row items-center justify-between p-3.5 rounded-2xl border ${
                      isSel
                        ? 'bg-red-50/80 border-[#dc2626]'
                        : 'border-neutral-200 bg-white'
                    }`}>
                    <Text
                      className={`text-sm ${
                        isSel ? 'font-bold text-[#dc2626]' : 'text-neutral-800'
                      }`}>
                      {item.label}
                    </Text>
                    {isSel && <CheckIcon size={16} color="#dc2626" />}
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 10. Location Modal */}
      <LocationModal
        visible={isLocationModalVisible}
        currentLocation={{
          area: areaName,
          city: locationName,
          pincode: '390007',
          isCustom: false,
        }}
        onClose={() => setIsLocationModalVisible(false)}
        onSelectLocation={(newLoc) => {
          setLocationName(newLoc.city);
          setAreaName(newLoc.area || 'Alkapuri, Vadodara');
          setIsLocationModalVisible(false);
        }}
      />
    </View>
  );
}

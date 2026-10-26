import { Text } from '@/components/ui/text';
import {
  MOCK_POPULAR_RESTAURANTS,
  MOCK_RESTAURANTS,
  MOCK_TRENDING_RESTAURANTS,
} from '@/lib/mock-data';
import { Restaurant } from '@/types/queuebite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AccessibilityIcon,
  ArmchairIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  ClockIcon,
  FileTextIcon,
  InfoIcon,
  MapPinIcon,
  MinusIcon,
  PlusIcon,
  StarIcon,
  UmbrellaIcon,
  UsersIcon,
  VolumeXIcon,
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

export default function JoinQueueScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; initialParty?: string }>();

  // Find restaurant or fallback to The Daily Bean
  const restaurant: Restaurant = React.useMemo(() => {
    const all = [
      ...MOCK_POPULAR_RESTAURANTS,
      ...MOCK_TRENDING_RESTAURANTS,
      ...MOCK_RESTAURANTS,
    ];
    if (params.id) {
      const found = all.find((r) => r.id === params.id);
      if (found) return found;
    }
    return MOCK_POPULAR_RESTAURANTS[0];
  }, [params.id]);

  // States
  const [partySize, setPartySize] = React.useState<number>(
    params.initialParty ? parseInt(params.initialParty, 10) || 2 : 2
  );
  const [specialRequests, setSpecialRequests] = React.useState<Set<string>>(
    new Set()
  );
  const [notes, setNotes] = React.useState('');

  // Toggle special request
  function handleToggleSpecialRequest(key: string) {
    setSpecialRequests((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  // Confirm join queue
  function handleConfirmJoin() {
    const requestsList =
      Array.from(specialRequests).join(', ') || (notes ? notes : 'None');
    router.push({
      pathname: '/restaurant/confirm',
      params: {
        id: restaurant.id,
        partySize: partySize.toString(),
        queueNumber: 'A12',
        requests: requestsList,
      },
    });
  }

  const specialOptions = [
    {
      id: 'high-chair',
      label: 'High Chair',
      icon: ArmchairIcon,
    },
    {
      id: 'wheelchair',
      label: 'Wheelchair\nAccessible',
      icon: AccessibilityIcon,
    },
    {
      id: 'outdoor',
      label: 'Outdoor\nSeating',
      icon: UmbrellaIcon,
    },
    {
      id: 'quiet',
      label: 'Quiet\nSeating',
      icon: VolumeXIcon,
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}>
        {/* 1. Hero Image Header with Overlay */}
        <View className="relative h-60 w-full bg-neutral-900">
          <Image
            source={{ uri: restaurant.image }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* Top Bar Back Button */}
          <View
            className="absolute top-0 left-0 right-0 px-4 flex-row items-center justify-between z-20"
            style={{ paddingTop: insets.top + 8 }}>
            <Pressable
              onPress={() => router.back()}
              className="size-10 rounded-full bg-white/90 backdrop-blur-md items-center justify-center shadow-md active:bg-white"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <ArrowLeftIcon size={20} color="#18181b" />
            </Pressable>
          </View>

          {/* Bottom Right Floating Badge: Live Queue & Groups Ahead */}
          <View className="absolute bottom-10 right-4 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl flex-row items-center gap-2.5 shadow-sm border border-white/60">
            <View className="size-8 rounded-full bg-[#fee2e2] items-center justify-center">
              <UsersIcon size={16} color="#dc2626" />
            </View>
            <View>
              <Text className="text-[10px] text-neutral-500 font-medium">
                Live Queue
              </Text>
              <Text className="text-xs font-bold text-neutral-900">
                {restaurant.groupsAhead || restaurant.partiesInQueue || 8} groups ahead
              </Text>
            </View>
          </View>
        </View>

        {/* 2. Restaurant Summary Card (Overlapping) */}
        <View className="-mt-7 mx-4 bg-white rounded-3xl p-3.5 shadow-sm border border-neutral-100 flex-row items-center justify-between">
          {/* Left Thumbnail & Info */}
          <View className="flex-row items-center gap-3 flex-1 pr-2">
            <Image
              source={{ uri: restaurant.image }}
              className="size-16 rounded-2xl bg-neutral-100"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text
                className="text-base font-bold text-neutral-900"
                numberOfLines={1}>
                {restaurant.name}
              </Text>
              <Text
                className="text-xs text-neutral-500 mt-0.5"
                numberOfLines={1}>
                {restaurant.categories
                  ? restaurant.categories.join('  •  ')
                  : restaurant.cuisine}
              </Text>

              {/* Rating */}
              <View className="flex-row items-center mt-1">
                <StarIcon size={13} color="#eab308" fill="#eab308" />
                <Text className="text-xs font-bold text-neutral-900 ml-1">
                  {restaurant.rating.toFixed(1)}
                </Text>
                <Text className="text-xs text-neutral-400 ml-1">
                  ({restaurant.reviewCount >= 1000 ? `${(restaurant.reviewCount / 1000).toFixed(1)}k` : restaurant.reviewCount} reviews)
                </Text>
              </View>

              {/* Location */}
              <View className="flex-row items-center mt-1">
                <MapPinIcon size={12} color="#dc2626" />
                <Text
                  className="text-xs text-neutral-600 ml-1"
                  numberOfLines={1}>
                  {restaurant.address.split(',')[0]} • {restaurant.distance}
                </Text>
              </View>
            </View>
          </View>

          {/* Right Status Badge & View Menu Button */}
          <View className="items-end justify-between self-stretch py-0.5">
            <View className="bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
              <Text className="text-[11px] font-bold text-emerald-700">
                Open Now
              </Text>
            </View>

            <Pressable
              onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: restaurant.id } })}
              className="bg-red-50/70 border border-red-200/70 rounded-full px-2.5 py-1.5 flex-row items-center gap-1.5 active:bg-red-100">
              <BookOpenIcon size={13} color="#dc2626" />
              <Text className="text-xs font-bold text-[#dc2626]">
                View Menu
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 3. Section Title & Subtitle */}
        <View className="px-5 pt-5 pb-3">
          <Text className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Join the Queue
          </Text>
          <Text className="text-xs text-neutral-500 mt-1 leading-relaxed">
            Select your party size and confirm to join the live queue at {restaurant.name}.
          </Text>
        </View>

        {/* 4. Estimated Wait Time & Groups Ahead Card */}
        <View className="px-5 mb-5">
          <View className="bg-[#fef7f2] border border-[#fbdcc8] rounded-3xl p-4 flex-row items-center justify-between shadow-xs">
            {/* Left Half: Estimated Wait */}
            <View className="flex-1 flex-row items-center gap-3">
              <View className="size-11 rounded-full bg-[#fee2e2] items-center justify-center">
                <ClockIcon size={20} color="#dc2626" />
              </View>
              <View>
                <Text className="text-xs text-neutral-500 font-medium">
                  Estimated Wait Time
                </Text>
                <Text className="text-lg font-extrabold text-neutral-900 mt-0.5">
                  {restaurant.waitRange}
                </Text>
                <Text className="text-[10px] text-neutral-400 mt-0.5">
                  Based on current queue
                </Text>
              </View>
            </View>

            {/* Vertical Divider */}
            <View className="w-px h-12 bg-[#f4d1bc] mx-2" />

            {/* Right Half: Groups Ahead */}
            <View className="flex-1 flex-row items-center gap-3 pl-2">
              <View className="size-11 rounded-full bg-[#fee2e2] items-center justify-center">
                <UsersIcon size={20} color="#dc2626" />
              </View>
              <View>
                <Text className="text-xs text-neutral-500 font-medium">
                  Groups Ahead
                </Text>
                <Text className="text-xl font-extrabold text-neutral-900 mt-0.5">
                  {restaurant.groupsAhead || restaurant.partiesInQueue || 8}
                </Text>
                <Text className="text-[10px] text-neutral-400 mt-0.5">
                  Updated {restaurant.lastUpdated}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 5. Party Size Stepper */}
        <View className="px-5 mb-5">
          <Text className="text-base font-bold text-neutral-900">
            Party Size
          </Text>
          <Text className="text-xs text-neutral-500 mt-0.5 mb-3">
            Include the total number of people in your group.
          </Text>

          <View className="bg-white border border-neutral-200/80 rounded-2xl p-3 flex-row items-center justify-between shadow-xs">
            {/* Minus Button */}
            <Pressable
              onPress={() => setPartySize((prev) => Math.max(1, prev - 1))}
              disabled={partySize <= 1}
              className="size-11 rounded-full bg-[#fee2e2] items-center justify-center active:bg-red-200 disabled:opacity-40"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MinusIcon size={18} color="#dc2626" strokeWidth={2.5} />
            </Pressable>

            {/* Center Number & Label */}
            <View className="items-center">
              <Text className="text-2xl font-extrabold text-neutral-900">
                {partySize}
              </Text>
              <Text className="text-xs text-neutral-400 mt-0.5">
                {partySize === 1 ? 'Person' : 'People'}
              </Text>
            </View>

            {/* Plus Button */}
            <Pressable
              onPress={() => setPartySize((prev) => Math.min(restaurant.maxPartySize || 10, prev + 1))}
              disabled={partySize >= (restaurant.maxPartySize || 10)}
              className="size-11 rounded-full bg-[#dc2626] items-center justify-center active:bg-[#b91c1c] disabled:opacity-40"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <PlusIcon size={18} color="#ffffff" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>

        {/* 6. Special Requests (Optional) */}
        <View className="px-5 mb-5">
          <Text className="text-base font-bold text-neutral-900">
            Special Requests (Optional)
          </Text>
          <Text className="text-xs text-neutral-500 mt-0.5 mb-3">
            Let the restaurant know if you have any special requirements.
          </Text>

          <View className="flex-row gap-2.5">
            {specialOptions.map((opt) => {
              const isSelected = specialRequests.has(opt.id);
              const IconComp = opt.icon;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => handleToggleSpecialRequest(opt.id)}
                  className={`flex-1 rounded-2xl p-3 items-center justify-center h-24 border ${
                    isSelected
                      ? 'bg-red-50 border-[#dc2626]'
                      : 'bg-white border-neutral-200/80 active:bg-neutral-50'
                  }`}>
                  <IconComp
                    size={22}
                    color={isSelected ? '#dc2626' : '#52525b'}
                    strokeWidth={1.8}
                  />
                  <Text
                    className={`text-[10px] text-center font-semibold mt-2 leading-tight ${
                      isSelected ? 'text-[#dc2626]' : 'text-neutral-700'
                    }`}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 7. Notes (Optional) */}
        <View className="px-5 mb-5">
          <Text className="text-base font-bold text-neutral-900 mb-2">
            Notes (Optional)
          </Text>

          <View className="bg-white border border-neutral-200 rounded-2xl p-3.5 shadow-xs">
            <View className="flex-row items-start gap-2.5">
              <FileTextIcon size={16} color="#71717a" className="mt-1" />
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any special request or note for the restaurant..."
                placeholderTextColor="#a1a1aa"
                maxLength={200}
                multiline
                textAlignVertical="top"
                className="flex-1 text-xs text-neutral-800 min-h-[50px] font-normal leading-relaxed p-0"
              />
            </View>
            <Text className="text-[11px] text-neutral-400 self-end mt-2">
              {notes.length}/200
            </Text>
          </View>
        </View>

        {/* 8. "Please Note" Warning / Info Box */}
        <View className="px-5 mb-6">
          <View className="bg-[#fef9ee] border border-[#fef08a] rounded-2xl p-4 flex-row items-start gap-3">
            <View className="size-6 rounded-full bg-[#facc15] items-center justify-center mt-0.5">
              <InfoIcon size={14} color="#ffffff" strokeWidth={2.5} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-neutral-900">
                Please Note
              </Text>
              <Text className="text-xs text-neutral-600 leading-relaxed mt-0.5">
                Waiting times are estimates and may vary based on restaurant operations, table availability and party sizes.
              </Text>
            </View>
          </View>
        </View>

        {/* 9. Primary Confirm & Join Queue Button */}
        <View className="px-5">
          <Pressable
            onPress={handleConfirmJoin}
            style={{ height: 56 }}
            className="w-full rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] flex-row items-center justify-center gap-2.5 shadow-md shadow-red-500/25 px-6">
            <UsersIcon size={20} color="#ffffff" strokeWidth={2.2} />
            <Text className="text-base font-bold text-white tracking-wide">
              Confirm &amp; Join Queue
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  HistoryIcon,
  RotateCcwIcon,
  SearchIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
  UtensilsCrossedIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileVisitHistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState('ALL');

  const visits = [
    {
      id: 'v-1',
      restaurantId: '1',
      restaurantName: 'The Daily Bean',
      restaurantImage: MOCK_POPULAR_RESTAURANTS[0].image,
      date: 'Yesterday, 8:15 PM',
      tableNumber: 'Table #14',
      partySize: 2,
      waitTime: '14 mins',
      amountSpent: '₹1,353',
      rating: 5,
    },
    {
      id: 'v-2',
      restaurantId: '2',
      restaurantName: 'Peshawri Royal',
      restaurantImage: MOCK_POPULAR_RESTAURANTS[1].image,
      date: 'Oct 22, 1:30 PM',
      tableNumber: 'Table #4',
      partySize: 4,
      waitTime: '22 mins',
      amountSpent: '₹2,480',
      rating: 4.8,
    },
    {
      id: 'v-3',
      restaurantId: '3',
      restaurantName: 'Saffron Courtyard',
      restaurantImage: MOCK_POPULAR_RESTAURANTS[2].image,
      date: 'Oct 15, 9:00 PM',
      tableNumber: 'Booth #2',
      partySize: 3,
      waitTime: '18 mins',
      amountSpent: '₹1,120',
      rating: 5,
    },
  ];

  const filteredVisits = visits.filter((v) =>
    v.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
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
              Visit History
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Past meals & wait times
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        {/* Stats Card */}
        <View className="px-5 pt-4">
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-xl font-bold text-neutral-900">24</Text>
                <Text className="text-[10px] text-neutral-500 font-semibold">Total Visits</Text>
              </View>

              <View className="w-px h-8 bg-neutral-200" />

              <View className="items-center">
                <Text className="text-xl font-bold text-[#dc2626]">4.8 hrs</Text>
                <Text className="text-[10px] text-neutral-500 font-semibold">Wait Saved</Text>
              </View>

              <View className="w-px h-8 bg-neutral-200" />

              <View className="items-center">
                <Text className="text-xl font-bold text-neutral-900">12 mins</Text>
                <Text className="text-[10px] text-neutral-500 font-semibold">Avg Wait Time</Text>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <View className="h-11 bg-white rounded-2xl border border-neutral-200/80 px-3.5 flex-row items-center gap-2.5 shadow-sm mb-4">
            <SearchIcon size={16} color="#71717a" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search past visits by restaurant..."
              placeholderTextColor="#a1a1aa"
              className="flex-1 text-xs text-neutral-900 font-medium h-full"
            />
          </View>

          {/* Visits List */}
          <View className="gap-3.5">
            {filteredVisits.map((visit) => (
              <View
                key={visit.id}
                className="bg-white rounded-xl p-4 border border-neutral-100 shadow-sm">
                <View className="flex-row items-center justify-between pb-3 border-b border-neutral-100">
                  <View className="flex-row items-center gap-3 flex-1 pr-2">
                    <Image
                      source={{ uri: visit.restaurantImage }}
                      className="size-12 rounded-xl bg-neutral-100"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-neutral-900" numberOfLines={1}>
                        {visit.restaurantName}
                      </Text>
                      <Text className="text-[10px] text-neutral-500">
                        {visit.date} • {visit.tableNumber}
                      </Text>
                    </View>
                  </View>

                  <View className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 flex-row items-center gap-1">
                    <CheckCircle2Icon size={11} color="#059669" />
                    <Text className="text-[10px] font-bold text-emerald-800">Seated</Text>
                  </View>
                </View>

                {/* Details Row */}
                <View className="py-2.5 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center gap-1">
                      <UsersIcon size={12} color="#71717a" />
                      <Text className="text-xs text-neutral-600">{visit.partySize} Guests</Text>
                    </View>
                    <View className="w-1 h-1 rounded-full bg-neutral-300" />
                    <View className="flex-row items-center gap-1">
                      <ClockIcon size={12} color="#71717a" />
                      <Text className="text-xs text-neutral-600">{visit.waitTime}</Text>
                    </View>
                  </View>

                  <Text className="text-xs font-bold text-neutral-900">{visit.amountSpent}</Text>
                </View>

                {/* Actions Row */}
                <View className="pt-2 border-t border-neutral-100 flex-row items-center gap-2">
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/restaurant/join',
                        params: { id: visit.restaurantId },
                      })
                    }
                    className="flex-1 py-2 rounded-xl bg-red-50 border border-red-200/80 items-center justify-center flex-row gap-1 active:bg-red-100">
                    <RotateCcwIcon size={12} color="#dc2626" />
                    <Text className="text-xs font-bold text-[#dc2626]">Queue Again</Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/restaurant/[id]/reviews',
                        params: { id: visit.restaurantId },
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-neutral-100 items-center justify-center flex-row gap-1 active:bg-neutral-200">
                    <StarIcon size={12} color="#f59e0b" fill="#f59e0b" />
                    <Text className="text-xs font-bold text-neutral-800">Rate</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

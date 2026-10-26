import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ClockIcon,
  RotateCcwIcon,
  SearchIcon,
  StarIcon,
  TimerOffIcon,
  UsersIcon,
  UtensilsCrossedIcon,
  XCircleIcon,
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

interface QueueHistoryEntry {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  cuisine: string;
  token: string;
  date: string;
  status: 'seated' | 'cancelled' | 'expired';
  partySize: number;
  waitTime: string;
  tableNumber?: string;
  cancelReason?: string;
}

const MOCK_HISTORY: QueueHistoryEntry[] = [
  {
    id: 'qh-1',
    restaurantId: '1',
    restaurantName: 'The Daily Bean',
    restaurantImage: MOCK_POPULAR_RESTAURANTS[0].image,
    cuisine: 'Cafe & Continental',
    token: 'A12',
    date: 'Yesterday, 8:15 PM',
    status: 'seated',
    partySize: 2,
    waitTime: '14 mins',
    tableNumber: 'Table #14',
  },
  {
    id: 'qh-2',
    restaurantId: '2',
    restaurantName: 'Peshawri Royal',
    restaurantImage: MOCK_POPULAR_RESTAURANTS[1].image,
    cuisine: 'North Indian & Mughlai',
    token: 'B07',
    date: 'Oct 22, 1:30 PM',
    status: 'seated',
    partySize: 4,
    waitTime: '22 mins',
    tableNumber: 'Table #4',
  },
  {
    id: 'qh-3',
    restaurantId: '3',
    restaurantName: 'Saffron Courtyard',
    restaurantImage: MOCK_POPULAR_RESTAURANTS[2].image,
    cuisine: 'Modern Gujarati',
    token: 'C19',
    date: 'Oct 19, 9:00 PM',
    status: 'cancelled',
    partySize: 3,
    waitTime: 'Waited 8 mins',
    cancelReason: 'Change of plans',
  },
  {
    id: 'qh-4',
    restaurantId: '4',
    restaurantName: 'Little Italy Trattoria',
    restaurantImage: MOCK_POPULAR_RESTAURANTS[3].image,
    cuisine: 'Woodfired Pizza & Pasta',
    token: 'D03',
    date: 'Oct 14, 8:40 PM',
    status: 'expired',
    partySize: 2,
    waitTime: '10m hold elapsed',
  },
];

export default function QueueHistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [activeTab, setActiveTab] = React.useState<'all' | 'seated' | 'cancelled' | 'expired'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredHistory = MOCK_HISTORY.filter((item) => {
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    const matchesSearch =
      item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
              Queue History
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Past dining waitlists & visits
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        {/* Search Input */}
        <View className="px-5 pt-4">
          <View className="h-11 bg-white rounded-2xl border border-neutral-200/80 px-3.5 flex-row items-center gap-2.5 shadow-sm">
            <SearchIcon size={16} color="#71717a" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by restaurant or token..."
              placeholderTextColor="#a1a1aa"
              className="flex-1 text-xs text-neutral-900 font-medium h-full"
            />
          </View>

          {/* Segmented Filter Pills */}
          <View className="flex-row gap-2 mt-3 mb-2">
            {[
              { id: 'all', label: 'All Queues' },
              { id: 'seated', label: 'Seated' },
              { id: 'cancelled', label: 'Cancelled' },
              { id: 'expired', label: 'Expired' },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full border ${
                    isSelected
                      ? 'bg-neutral-900 border-neutral-900'
                      : 'bg-white border-neutral-200/80 active:bg-neutral-50'
                  }`}>
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-neutral-600'
                    }`}>
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* History List */}
        <View className="px-5 pt-3">
          {filteredHistory.length === 0 ? (
            /* Empty State */
            <View className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm items-center my-6">
              <View className="size-16 rounded-full bg-neutral-100 items-center justify-center mb-3">
                <UtensilsCrossedIcon size={28} color="#71717a" />
              </View>
              <Text className="text-base font-bold text-neutral-900 text-center">
                No Past Queues Found
              </Text>
              <Text className="text-xs text-neutral-500 text-center mt-1 max-w-[240px]">
                No waitlist records match your current filter.
              </Text>
            </View>
          ) : (
            filteredHistory.map((item) => {
              const isSeated = item.status === 'seated';
              const isCancelled = item.status === 'cancelled';
              const isExpired = item.status === 'expired';

              return (
                <View
                  key={item.id}
                  className="bg-white rounded-3xl p-4 border border-neutral-100 shadow-sm mb-3.5">
                  {/* Top Bar: Restaurant & Status */}
                  <View className="flex-row items-center justify-between pb-3 border-b border-neutral-100">
                    <View className="flex-row items-center gap-3 flex-1 pr-2">
                      <Image
                        source={{ uri: item.restaurantImage }}
                        className="size-12 rounded-xl bg-neutral-100"
                        resizeMode="cover"
                      />
                      <View className="flex-1">
                        <Text className="text-sm font-bold text-neutral-900" numberOfLines={1}>
                          {item.restaurantName}
                        </Text>
                        <Text className="text-[10px] text-neutral-500">{item.date}</Text>
                      </View>
                    </View>

                    {/* Status Badge */}
                    <View
                      className={`px-2.5 py-1 rounded-full flex-row items-center gap-1 ${
                        isSeated
                          ? 'bg-emerald-50 border border-emerald-200'
                          : isCancelled
                          ? 'bg-neutral-100 border border-neutral-200'
                          : 'bg-amber-50 border border-amber-200'
                      }`}>
                      {isSeated && <CheckCircle2Icon size={11} color="#059669" />}
                      {isCancelled && <XCircleIcon size={11} color="#71717a" />}
                      {isExpired && <TimerOffIcon size={11} color="#b45309" />}
                      <Text
                        className={`text-[10px] font-bold capitalize ${
                          isSeated
                            ? 'text-emerald-800'
                            : isCancelled
                            ? 'text-neutral-700'
                            : 'text-amber-800'
                        }`}>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  {/* Metadata Row */}
                  <View className="py-2.5 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="flex-row items-center gap-1">
                        <UsersIcon size={12} color="#71717a" />
                        <Text className="text-xs text-neutral-600 font-medium">
                          {item.partySize} Guests
                        </Text>
                      </View>
                      <View className="w-1 h-1 rounded-full bg-neutral-300" />
                      <View className="flex-row items-center gap-1">
                        <ClockIcon size={12} color="#71717a" />
                        <Text className="text-xs text-neutral-600 font-medium">
                          {item.waitTime}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-xs font-black text-neutral-800">
                      Token #{item.token}
                    </Text>
                  </View>

                  {/* Action Buttons Row */}
                  <View className="pt-2 border-t border-neutral-100 flex-row items-center gap-2">
                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: '/restaurant/[id]',
                          params: { id: item.restaurantId },
                        })
                      }
                      className="flex-1 py-2 rounded-xl bg-red-50 border border-red-200/80 items-center justify-center flex-row gap-1.5 active:bg-red-100">
                      <RotateCcwIcon size={12} color="#dc2626" />
                      <Text className="text-xs font-bold text-[#dc2626]">Queue Again</Text>
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: '/queue/[id]',
                          params: { id: item.restaurantId },
                        })
                      }
                      className="flex-1 py-2 rounded-xl bg-neutral-100 items-center justify-center active:bg-neutral-200">
                      <Text className="text-xs font-bold text-neutral-800">View Pass</Text>
                    </Pressable>

                    {isSeated && (
                      <Pressable
                        onPress={() =>
                          router.push({
                            pathname: '/restaurant/[id]/reviews',
                            params: { id: item.restaurantId },
                          })
                        }
                        className="px-3 py-2 rounded-xl bg-neutral-100 items-center justify-center flex-row gap-1 active:bg-neutral-200">
                        <StarIcon size={12} color="#f59e0b" fill="#f59e0b" />
                        <Text className="text-xs font-bold text-neutral-800">Rate</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  RotateCcwIcon,
  SearchIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
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

interface PastGroupVisit {
  id: string;
  groupName: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  date: string;
  partySize: number;
  waitTime: string;
  tableNumber: string;
  rating: number;
  members: string[];
}

const MOCK_GROUP_HISTORY: PastGroupVisit[] = [
  {
    id: 'gh-1',
    groupName: 'Friday Foodies Squad',
    restaurantId: '1',
    restaurantName: 'The Daily Bean',
    restaurantImage: MOCK_POPULAR_RESTAURANTS[0].image,
    date: 'Last Friday, 8:30 PM',
    partySize: 4,
    waitTime: '14 mins',
    tableNumber: 'Booth #6',
    rating: 5,
    members: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'gh-2',
    groupName: 'Sunday Family Feast',
    restaurantId: '2',
    restaurantName: 'Peshawri Royal',
    restaurantImage: MOCK_POPULAR_RESTAURANTS[1].image,
    date: 'Oct 15, 1:15 PM',
    partySize: 6,
    waitTime: '22 mins',
    tableNumber: 'Table #12',
    rating: 4.8,
    members: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'gh-3',
    groupName: 'Tech Squad Lunch',
    restaurantId: '3',
    restaurantName: 'Saffron Courtyard',
    restaurantImage: MOCK_POPULAR_RESTAURANTS[2].image,
    date: 'Oct 8, 12:45 PM',
    partySize: 5,
    waitTime: '9 mins',
    tableNumber: 'Table #3',
    rating: 5,
    members: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    ],
  },
];

export default function GroupVisitHistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState<'all' | 'recent' | 'favorites'>(
    'all'
  );

  const filteredVisits = MOCK_GROUP_HISTORY.filter((item) => {
    return (
      item.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  function handleRecreateGroup(visit: PastGroupVisit) {
    Alert.alert(
      'Recreate Group',
      `Start a new dining group with the members of "${visit.groupName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Group',
          onPress: () => {
            router.push({
              pathname: '/group/create',
              params: { prefillName: visit.groupName },
            });
          },
        },
      ]
    );
  }

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
              Group Outings
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Past shared feasts & memories
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View className="px-5 pt-4">
          {/* Search Bar */}
          <View className="h-11 bg-white rounded-2xl border border-neutral-200/80 px-3.5 flex-row items-center gap-2.5 shadow-sm mb-3">
            <SearchIcon size={16} color="#71717a" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search group outings or places..."
              placeholderTextColor="#a1a1aa"
              className="flex-1 text-xs text-neutral-900 font-medium h-full"
            />
          </View>

          {/* Visits List */}
          <View className="gap-3.5">
            {filteredVisits.length === 0 ? (
              <View className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm items-center my-6">
                <View className="size-16 rounded-full bg-neutral-100 items-center justify-center mb-3">
                  <UsersIcon size={28} color="#71717a" />
                </View>
                <Text className="text-base font-bold text-neutral-900 text-center">
                  No Past Outings Found
                </Text>
                <Text className="text-xs text-neutral-500 text-center mt-1 max-w-[240px]">
                  No group visits match your search query.
                </Text>
              </View>
            ) : (
              filteredVisits.map((visit) => (
                <View
                  key={visit.id}
                  className="bg-white rounded-3xl p-4 border border-neutral-100 shadow-sm">
                  {/* Top Bar: Group Name & Restaurant */}
                  <View className="flex-row items-center justify-between pb-3 border-b border-neutral-100">
                    <View className="flex-row items-center gap-3 flex-1 pr-2">
                      <Image
                        source={{ uri: visit.restaurantImage }}
                        className="size-12 rounded-xl bg-neutral-100"
                        resizeMode="cover"
                      />
                      <View className="flex-1">
                        <Text className="text-sm font-black text-neutral-900" numberOfLines={1}>
                          {visit.groupName}
                        </Text>
                        <Text className="text-xs text-neutral-500 mt-0.5">
                          {visit.restaurantName} • {visit.date}
                        </Text>
                      </View>
                    </View>

                    <View className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 flex-row items-center gap-1">
                      <CheckCircle2Icon size={11} color="#059669" />
                      <Text className="text-[10px] font-bold text-emerald-800">Seated</Text>
                    </View>
                  </View>

                  {/* Metadata Row */}
                  <View className="py-2.5 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="flex-row items-center gap-1">
                        <UsersIcon size={12} color="#71717a" />
                        <Text className="text-xs text-neutral-600 font-medium">
                          {visit.partySize} Guests
                        </Text>
                      </View>
                      <View className="w-1 h-1 rounded-full bg-neutral-300" />
                      <View className="flex-row items-center gap-1">
                        <ClockIcon size={12} color="#71717a" />
                        <Text className="text-xs text-neutral-600 font-medium">
                          {visit.waitTime}
                        </Text>
                      </View>
                    </View>

                    {/* Member Avatars */}
                    <View className="flex-row -space-x-2">
                      {visit.members.map((avatar, idx) => (
                        <Image
                          key={idx}
                          source={{ uri: avatar }}
                          className="size-6 rounded-full border border-white bg-neutral-200"
                        />
                      ))}
                    </View>
                  </View>

                  {/* Actions Row */}
                  <View className="pt-2 border-t border-neutral-100 flex-row items-center gap-2">
                    <Pressable
                      onPress={() => handleRecreateGroup(visit)}
                      className="flex-1 py-2 rounded-xl bg-red-50 border border-red-200/80 items-center justify-center flex-row gap-1.5 active:bg-red-100">
                      <RotateCcwIcon size={12} color="#dc2626" />
                      <Text className="text-xs font-bold text-[#dc2626]">Recreate Group</Text>
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: '/restaurant/[id]/menu',
                          params: { id: visit.restaurantId },
                        })
                      }
                      className="flex-1 py-2 rounded-xl bg-neutral-100 items-center justify-center active:bg-neutral-200">
                      <Text className="text-xs font-bold text-neutral-800">View Menu</Text>
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: '/restaurant/[id]/reviews',
                          params: { id: visit.restaurantId },
                        })
                      }
                      className="px-3 py-2 rounded-xl bg-neutral-100 items-center justify-center flex-row gap-1 active:bg-neutral-200">
                      <StarIcon size={12} color="#f59e0b" fill="#f59e0b" />
                      <Text className="text-xs font-bold text-neutral-800">Rate</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Pressable
          onPress={() => router.push('/group/create')}
          className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center flex-row gap-2 shadow-md shadow-red-500/25">
          <UsersIcon size={16} color="#ffffff" />
          <Text className="text-xs font-bold text-white tracking-wide">
            Start New Group Dining
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

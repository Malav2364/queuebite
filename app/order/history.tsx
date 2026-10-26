import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ClockIcon,
  ReceiptIcon,
  RotateCcwIcon,
  SearchIcon,
  ShoppingBagIcon,
  UtensilsCrossedIcon,
  XCircleIcon,
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

interface PastOrder {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  date: string;
  itemsText: string;
  total: number;
  status: 'completed' | 'cancelled' | 'refunded';
  itemCount: number;
}

const MOCK_ORDER_HISTORY: PastOrder[] = [
  {
    id: 'QB-ORD-9281',
    restaurantId: '1',
    restaurantName: 'The Daily Bean',
    restaurantImage: MOCK_POPULAR_RESTAURANTS[0].image,
    date: 'Today, 7:45 PM',
    itemsText: 'Truffle Mushroom Risotto, Margherita Pizza, 2x Cappuccino',
    total: 1353,
    status: 'completed',
    itemCount: 4,
  },
  {
    id: 'QB-ORD-8812',
    restaurantId: '2',
    restaurantName: 'Peshawri Royal',
    restaurantImage: MOCK_POPULAR_RESTAURANTS[1].image,
    date: 'Oct 22, 1:45 PM',
    itemsText: 'Dal Bukhara, Butter Naan (x3), Paneer Tikka Platter',
    total: 1680,
    status: 'completed',
    itemCount: 5,
  },
  {
    id: 'QB-ORD-7724',
    restaurantId: '3',
    restaurantName: 'Saffron Courtyard',
    restaurantImage: MOCK_POPULAR_RESTAURANTS[2].image,
    date: 'Oct 18, 8:20 PM',
    itemsText: 'Gujarati Thali Deluxe (x2), Masala Chaas',
    total: 920,
    status: 'refunded',
    itemCount: 3,
  },
  {
    id: 'QB-ORD-6510',
    restaurantId: '4',
    restaurantName: 'Little Italy Trattoria',
    restaurantImage: MOCK_POPULAR_RESTAURANTS[3].image,
    date: 'Oct 12, 9:10 PM',
    itemsText: 'Four Cheese Ravioli, Tiramisu',
    total: 840,
    status: 'cancelled',
    itemCount: 2,
  },
];

export default function OrderHistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [activeTab, setActiveTab] = React.useState<'all' | 'completed' | 'cancelled' | 'refunded'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredOrders = MOCK_ORDER_HISTORY.filter((order) => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch =
      order.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.itemsText.toLowerCase().includes(searchQuery.toLowerCase());
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
              Order History
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Past pre-orders & dining bills
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
              placeholder="Search by restaurant or order ID..."
              placeholderTextColor="#a1a1aa"
              className="flex-1 text-xs text-neutral-900 font-medium h-full"
            />
          </View>

          {/* Filter Pills */}
          <View className="flex-row gap-2 mb-2">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'completed', label: 'Completed' },
              { id: 'refunded', label: 'Refunded' },
              { id: 'cancelled', label: 'Cancelled' },
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

        {/* Orders List */}
        <View className="px-5 pt-2">
          {filteredOrders.length === 0 ? (
            <View className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm items-center my-6">
              <View className="size-16 rounded-full bg-neutral-100 items-center justify-center mb-3">
                <ShoppingBagIcon size={28} color="#71717a" />
              </View>
              <Text className="text-base font-bold text-neutral-900 text-center">
                No Orders Found
              </Text>
              <Text className="text-xs text-neutral-500 text-center mt-1 max-w-[240px]">
                No orders match your search criteria.
              </Text>
            </View>
          ) : (
            filteredOrders.map((order) => {
              const isCompleted = order.status === 'completed';
              const isRefunded = order.status === 'refunded';

              return (
                <View
                  key={order.id}
                  className="bg-white rounded-3xl p-4 border border-neutral-100 shadow-sm mb-3.5">
                  {/* Top Bar */}
                  <View className="flex-row items-center justify-between pb-3 border-b border-neutral-100">
                    <View className="flex-row items-center gap-3 flex-1 pr-2">
                      <Image
                        source={{ uri: order.restaurantImage }}
                        className="size-12 rounded-xl bg-neutral-100"
                        resizeMode="cover"
                      />
                      <View className="flex-1">
                        <Text className="text-sm font-bold text-neutral-900" numberOfLines={1}>
                          {order.restaurantName}
                        </Text>
                        <Text className="text-[10px] text-neutral-400">
                          {order.id} • {order.date}
                        </Text>
                      </View>
                    </View>

                    {/* Status Badge */}
                    <View
                      className={`px-2.5 py-1 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-50 border border-emerald-200'
                          : isRefunded
                          ? 'bg-amber-50 border border-amber-200'
                          : 'bg-neutral-100 border border-neutral-200'
                      }`}>
                      <Text
                        className={`text-[10px] font-bold capitalize ${
                          isCompleted
                            ? 'text-emerald-800'
                            : isRefunded
                            ? 'text-amber-800'
                            : 'text-neutral-700'
                        }`}>
                        {order.status}
                      </Text>
                    </View>
                  </View>

                  {/* Items Description */}
                  <View className="py-2.5">
                    <Text className="text-xs text-neutral-700 font-medium" numberOfLines={2}>
                      {order.itemsText}
                    </Text>
                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-[11px] text-neutral-400">
                        {order.itemCount} items
                      </Text>
                      <Text className="text-sm font-black text-neutral-900">
                        ₹{order.total}
                      </Text>
                    </View>
                  </View>

                  {/* Actions Row */}
                  <View className="pt-2 border-t border-neutral-100 flex-row items-center gap-2">
                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: '/order/reorder',
                          params: { orderId: order.id },
                        })
                      }
                      className="flex-1 py-2 rounded-xl bg-red-50 border border-red-200/80 items-center justify-center flex-row gap-1.5 active:bg-red-100">
                      <RotateCcwIcon size={12} color="#dc2626" />
                      <Text className="text-xs font-bold text-[#dc2626]">Reorder</Text>
                    </Pressable>

                    {isRefunded ? (
                      <Pressable
                        onPress={() => router.push('/order/refund-status')}
                        className="flex-1 py-2 rounded-xl bg-amber-50 border border-amber-200 items-center justify-center active:bg-amber-100">
                        <Text className="text-xs font-bold text-amber-900">Track Refund</Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={() =>
                          router.push({
                            pathname: '/order/cancel',
                            params: { orderId: order.id },
                          })
                        }
                        className="flex-1 py-2 rounded-xl bg-neutral-100 items-center justify-center active:bg-neutral-200">
                        <Text className="text-xs font-bold text-neutral-800">Report Issue</Text>
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

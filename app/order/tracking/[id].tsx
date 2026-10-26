import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BellRingIcon,
  CheckCircle2Icon,
  ChefHatIcon,
  ClockIcon,
  FlameIcon,
  PhoneIcon,
  PlusIcon,
  SparklesIcon,
  UtensilsCrossedIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Animated,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OrderTrackingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const restaurant = MOCK_POPULAR_RESTAURANTS[0];
  const orderId = params.id || 'QB-ORD-9281';

  // Pulsing animation for cooking radar
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const [itemsProgress, setItemsProgress] = React.useState([
    {
      id: 'it-1',
      name: 'Truffle Mushroom Risotto',
      status: 'Plating in kitchen',
      progress: 90,
      color: '#059669',
    },
    {
      id: 'it-2',
      name: 'Woodfired Margherita Pizza',
      status: 'Baking in woodfired oven',
      progress: 75,
      color: '#ea580c',
    },
    {
      id: 'it-3',
      name: 'Classic Cappuccino (x2)',
      status: 'Barista prepped & kept warm',
      progress: 100,
      color: '#059669',
    },
  ]);

  function handleCallServer() {
    const phone = restaurant.phone || '+919876543210';
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Call Server Desk', `Calling ${restaurant.name} at ${phone}`);
    });
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
              Live Kitchen Tracker
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Order #{orderId} • Token #A12
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View className="px-5 pt-4">
          {/* Main Cooking Live Radar Card */}
          <View className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm items-center mb-4">
            <View className="relative items-center justify-center size-28 mb-3">
              <Animated.View
                style={{
                  transform: [{ scale: pulseAnim }],
                  position: 'absolute',
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: '#fee2e2',
                }}
              />
              <View className="size-20 rounded-full bg-[#dc2626] items-center justify-center shadow-lg shadow-red-500/25">
                <ChefHatIcon size={34} color="#ffffff" />
              </View>
            </View>

            <View className="px-3 py-1 rounded-full bg-orange-100 mb-2">
              <Text className="text-[11px] font-black text-orange-900 uppercase tracking-widest">
                Stove Active • In Progress
              </Text>
            </View>

            <Text className="text-2xl font-black text-neutral-900 tracking-tight text-center">
              Chef is Preparing Your Food
            </Text>

            <Text className="text-xs text-neutral-500 text-center mt-1 leading-relaxed max-w-[280px]">
              Fired in sync with your waitlist progression. Estimated serving in ~7 minutes!
            </Text>

            {/* Target Seating Banner */}
            <View className="w-full mt-4 bg-[#faf8f5] rounded-2xl p-3.5 border border-neutral-200 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <ClockIcon size={16} color="#dc2626" />
                <View>
                  <Text className="text-xs font-bold text-neutral-900">Destination</Text>
                  <Text className="text-[10px] text-neutral-500">Table #14 • Spot #1</Text>
                </View>
              </View>
              <Text className="text-sm font-black text-[#dc2626]">~7 mins</Text>
            </View>
          </View>

          {/* Dishes Prep Progress */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-3">
              Kitchen Item Progress
            </Text>

            <View className="gap-3.5">
              {itemsProgress.map((item) => (
                <View key={item.id} className="gap-1.5">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs font-bold text-neutral-900">{item.name}</Text>
                    <Text className="text-[10px] font-bold" style={{ color: item.color }}>
                      {item.progress}%
                    </Text>
                  </View>

                  <Text className="text-[11px] text-neutral-500">{item.status}</Text>

                  {/* Progress Bar */}
                  <View className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${item.progress}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* In-Dining Actions */}
          <View className="flex-row gap-2.5 mb-4">
            <Pressable
              onPress={() => router.push('/order/menu')}
              className="flex-1 py-3 rounded-2xl bg-white border border-neutral-200 items-center justify-center flex-row gap-1.5 active:bg-neutral-50 shadow-sm">
              <PlusIcon size={14} color="#dc2626" />
              <Text className="text-xs font-bold text-neutral-900">Add More Food</Text>
            </Pressable>

            <Pressable
              onPress={handleCallServer}
              className="flex-1 py-3 rounded-2xl bg-white border border-neutral-200 items-center justify-center flex-row gap-1.5 active:bg-neutral-50 shadow-sm">
              <PhoneIcon size={14} color="#dc2626" />
              <Text className="text-xs font-bold text-neutral-900">Call Server Desk</Text>
            </Pressable>
          </View>

          {/* Cancel or Report Issue link */}
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/order/cancel',
                params: { orderId },
              })
            }
            className="w-full py-3 rounded-2xl bg-neutral-100 items-center justify-center active:bg-neutral-200">
            <Text className="text-xs font-bold text-neutral-700">
              Need Help or Cancel Order?
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

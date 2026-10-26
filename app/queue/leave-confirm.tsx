import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  HeartHandshakeIcon,
  LogOutIcon,
  ShieldAlertIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LeaveQueueConfirmScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    restaurantName?: string;
    position?: string;
  }>();

  const [selectedReason, setSelectedReason] = React.useState<string>(
    'Wait time took longer than expected'
  );
  const [isLeaving, setIsLeaving] = React.useState(false);

  const restaurant = MOCK_POPULAR_RESTAURANTS[0];
  const position = params.position || '5';

  const leaveReasons = [
    'Wait time took longer than expected',
    'Found another place with no wait',
    'Change of plans / leaving area',
    'Emergency / unexpected delay',
    'Party members could not make it',
    'Just testing the app',
  ];

  function handleConfirmLeave() {
    setIsLeaving(true);
    setTimeout(() => {
      setIsLeaving(false);
      router.replace({
        pathname: '/queue/cancelled',
        params: {
          restaurantName: restaurant.name,
          reason: selectedReason,
        },
      });
    }, 600);
  }

  return (
    <View className="flex-1 bg-[#faf8f5]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        className="px-5 pb-3 bg-white border-b border-neutral-100 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 8 }}>
        <Pressable
          onPress={() => router.back()}
          className="size-9 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <XIcon size={18} color="#18181b" />
        </Pressable>

        <Text className="text-base font-black text-neutral-900 tracking-tight">
          Leave Queue?
        </Text>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        <View className="px-5 pt-4">
          {/* Warning Banner Card */}
          <View className="bg-red-50/80 border border-red-200 rounded-3xl p-5 mb-4 items-center">
            <View className="size-16 rounded-full bg-red-100 items-center justify-center mb-3">
              <AlertTriangleIcon size={32} color="#dc2626" />
            </View>

            <Text className="text-lg font-black text-red-950 text-center">
              Are you sure you want to leave?
            </Text>

            <Text className="text-xs text-red-800 text-center mt-1 leading-relaxed max-w-[280px]">
              You will permanently forfeit your priority spot in line. If you rejoin later, you will
              start at the end of the waitlist.
            </Text>

            {/* Current Spot Summary Badge */}
            <View className="mt-4 px-4 py-2 rounded-2xl bg-white border border-red-200/80 flex-row items-center gap-3">
              <View className="flex-row items-center gap-1.5">
                <UsersIcon size={14} color="#dc2626" />
                <Text className="text-xs font-bold text-neutral-700">
                  Current Spot: <Text className="text-neutral-950 font-black">#{position}</Text>
                </Text>
              </View>
              <View className="w-px h-3.5 bg-neutral-200" />
              <View className="flex-row items-center gap-1.5">
                <ClockIcon size={14} color="#dc2626" />
                <Text className="text-xs font-bold text-neutral-700">
                  Est. Wait: <Text className="text-neutral-950 font-black">~12 mins</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Restaurant Being Left */}
          <View className="bg-white rounded-3xl p-4 border border-neutral-100 shadow-sm flex-row items-center gap-3 mb-4">
            <Image
              source={{ uri: restaurant.image }}
              className="size-14 rounded-2xl bg-neutral-100"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Current Reservation
              </Text>
              <Text className="text-base font-bold text-neutral-900" numberOfLines={1}>
                {restaurant.name}
              </Text>
              <Text className="text-xs text-neutral-500 mt-0.5">
                Token #A12 • Party of 2 Guests
              </Text>
            </View>
          </View>

          {/* Reason Selection */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-1">
              Help us improve (Optional)
            </Text>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Why are you cancelling your spot today?
            </Text>

            <View className="gap-2">
              {leaveReasons.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <Pressable
                    key={reason}
                    onPress={() => setSelectedReason(reason)}
                    className={`p-3.5 rounded-2xl border flex-row items-center justify-between ${
                      isSelected
                        ? 'bg-neutral-900 border-neutral-900'
                        : 'bg-neutral-50 border-neutral-200/80 active:bg-neutral-100'
                    }`}>
                    <Text
                      className={`text-xs font-semibold flex-1 pr-2 ${
                        isSelected ? 'text-white font-bold' : 'text-neutral-800'
                      }`}>
                      {reason}
                    </Text>

                    <View
                      className={`size-5 rounded-full items-center justify-center border ${
                        isSelected
                          ? 'bg-white border-white'
                          : 'border-neutral-300 bg-white'
                      }`}>
                      {isSelected && <CheckIcon size={12} color="#18181b" strokeWidth={3} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100 gap-2.5"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        {/* Primary Safe Action: Keep Spot */}
        <Pressable
          onPress={() => router.back()}
          className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center shadow-md shadow-red-500/25">
          <Text className="text-xs font-bold text-white tracking-wide">
            Keep My Spot (#{position})
          </Text>
        </Pressable>

        {/* Destructive Action: Leave Queue */}
        <Pressable
          onPress={handleConfirmLeave}
          disabled={isLeaving}
          className="w-full h-12 rounded-2xl bg-white border border-red-300 active:bg-red-50 items-center justify-center flex-row gap-2">
          <LogOutIcon size={16} color="#dc2626" />
          <Text className="text-xs font-bold text-[#dc2626]">
            {isLeaving ? 'Cancelling Waitlist...' : 'Confirm & Leave Queue'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

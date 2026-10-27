import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BabyIcon,
  CheckIcon,
  ClockIcon,
  HelpCircleIcon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
  UsersIcon,
  UtensilsCrossedIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditPartySizeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ currentSize?: string }>();

  const initialSize = params.currentSize ? parseInt(params.currentSize, 10) || 2 : 2;
  const [partySize, setPartySize] = React.useState<number>(initialSize);
  const [highChairs, setHighChairs] = React.useState<number>(0);
  const [seatingType, setSeatingType] = React.useState<'any' | 'standard' | 'bar' | 'patio'>('any');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const restaurant = MOCK_POPULAR_RESTAURANTS[0];

  // Dynamic wait time impact calculation
  const sizeDiff = partySize - initialSize;
  const waitImpact =
    sizeDiff === 0
      ? 0
      : sizeDiff > 0
      ? sizeDiff * 4
      : sizeDiff * 2;

  function handleSave() {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Party Size Updated',
        `Your party size is now ${partySize} guests. The host stand has been notified.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 600);
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
            <Text className="text-xl font-bold text-neutral-900 tracking-tight">
              Edit Party Size
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              {restaurant.name} • Token #A12
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View className="px-5 pt-5">
          {/* Main Party Size Selector Card */}
          <View className="bg-white rounded-xl p-6 border border-neutral-100 shadow-sm mb-4 items-center">
            <View className="size-12 rounded-2xl bg-red-50 items-center justify-center mb-3">
              <UsersIcon size={22} color="#dc2626" />
            </View>

            <Text className="text-sm font-bold text-neutral-500 uppercase tracking-wider">
              Total Guests in Party
            </Text>

            <View className="flex-row items-center justify-center gap-6 my-4">
              <Pressable
                onPress={() => setPartySize((prev) => Math.max(1, prev - 1))}
                disabled={partySize <= 1}
                className={`size-14 rounded-2xl items-center justify-center border ${
                  partySize <= 1
                    ? 'bg-neutral-100 border-neutral-200 opacity-40'
                    : 'bg-white border-neutral-200 active:bg-neutral-100 shadow-sm'
                }`}>
                <MinusIcon size={24} color="#18181b" />
              </Pressable>

              <View className="items-center min-w-[80px]">
                <Text className="text-5xl font-bold text-neutral-900 tracking-tight">
                  {partySize}
                </Text>
                <Text className="text-xs font-semibold text-neutral-400 mt-0.5">
                  {partySize === 1 ? 'Guest' : 'Guests'}
                </Text>
              </View>

              <Pressable
                onPress={() => setPartySize((prev) => Math.min(12, prev + 1))}
                disabled={partySize >= 12}
                className={`size-14 rounded-2xl items-center justify-center border ${
                  partySize >= 12
                    ? 'bg-neutral-100 border-neutral-200 opacity-40'
                    : 'bg-white border-neutral-200 active:bg-neutral-100 shadow-sm'
                }`}>
                <PlusIcon size={24} color="#18181b" />
              </Pressable>
            </View>

            {/* Wait Time Impact Feedback */}
            <View
              className={`w-full rounded-2xl p-3 flex-row items-center justify-between border ${
                sizeDiff === 0
                  ? 'bg-neutral-50 border-neutral-200/80'
                  : sizeDiff > 0
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-emerald-50 border-emerald-200'
              }`}>
              <View className="flex-row items-center gap-2">
                <ClockIcon
                  size={16}
                  color={sizeDiff === 0 ? '#71717a' : sizeDiff > 0 ? '#b45309' : '#059669'}
                />
                <Text
                  className={`text-xs font-bold ${
                    sizeDiff === 0
                      ? 'text-neutral-700'
                      : sizeDiff > 0
                      ? 'text-amber-900'
                      : 'text-emerald-900'
                  }`}>
                  Wait time impact:
                </Text>
              </View>

              <Text
                className={`text-xs font-bold ${
                  sizeDiff === 0
                    ? 'text-neutral-600'
                    : sizeDiff > 0
                    ? 'text-amber-800'
                    : 'text-emerald-700'
                }`}>
                {sizeDiff === 0
                  ? 'No change (~12 mins)'
                  : sizeDiff > 0
                  ? `+${waitImpact} mins (~${12 + waitImpact} mins)`
                  : `${waitImpact} mins (~${Math.max(4, 12 + waitImpact)} mins)`}
              </Text>
            </View>
          </View>

          {/* Seating Type Preference */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-1">
              Seating Preference
            </Text>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Select your preferred table arrangement
            </Text>

            <View className="gap-2">
              {[
                {
                  id: 'any',
                  label: 'First Available (Fastest)',
                  desc: 'Seated at the very next open table',
                },
                {
                  id: 'standard',
                  label: 'Standard Dining Table',
                  desc: 'Low dining table with chairs',
                },
                {
                  id: 'bar',
                  label: 'Bar / High Top',
                  desc: 'High stools near the counter',
                },
                {
                  id: 'patio',
                  label: 'Outdoor Patio',
                  desc: 'Open-air al fresco dining',
                },
              ].map((opt) => {
                const isSelected = seatingType === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setSeatingType(opt.id as any)}
                    className={`p-3.5 rounded-2xl border flex-row items-center justify-between ${
                      isSelected
                        ? 'bg-red-50/60 border-[#dc2626]'
                        : 'bg-white border-neutral-200/80 active:bg-neutral-50'
                    }`}>
                    <View>
                      <Text
                        className={`text-xs font-bold ${
                          isSelected ? 'text-[#dc2626]' : 'text-neutral-900'
                        }`}>
                        {opt.label}
                      </Text>
                      <Text className="text-[10px] text-neutral-500 mt-0.5">{opt.desc}</Text>
                    </View>

                    <View
                      className={`size-5 rounded-full items-center justify-center border ${
                        isSelected
                          ? 'bg-[#dc2626] border-[#dc2626]'
                          : 'border-neutral-300 bg-white'
                      }`}>
                      {isSelected && <CheckIcon size={12} color="#ffffff" strokeWidth={3} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* High Chairs / Children */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="size-10 rounded-2xl bg-amber-50 items-center justify-center">
                  <BabyIcon size={18} color="#d97706" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-neutral-900">
                    High Chairs / Boosters
                  </Text>
                  <Text className="text-[10px] text-neutral-500">For infants or toddlers</Text>
                </View>
              </View>

              <View className="flex-row items-center gap-2">
                <Pressable
                  onPress={() => setHighChairs((prev) => Math.max(0, prev - 1))}
                  disabled={highChairs === 0}
                  className={`size-8 rounded-xl items-center justify-center border ${
                    highChairs === 0
                      ? 'bg-neutral-100 border-neutral-200 opacity-40'
                      : 'bg-white border-neutral-300 active:bg-neutral-100'
                  }`}>
                  <MinusIcon size={14} color="#18181b" />
                </Pressable>

                <Text className="text-sm font-bold text-neutral-900 w-6 text-center">
                  {highChairs}
                </Text>

                <Pressable
                  onPress={() => setHighChairs((prev) => Math.min(3, prev + 1))}
                  disabled={highChairs >= 3}
                  className={`size-8 rounded-xl items-center justify-center border ${
                    highChairs >= 3
                      ? 'bg-neutral-100 border-neutral-200 opacity-40'
                      : 'bg-white border-neutral-300 active:bg-neutral-100'
                  }`}>
                  <PlusIcon size={14} color="#18181b" />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Policy Notice Box */}
          <View className="bg-neutral-100/80 rounded-2xl p-4 flex-row items-start gap-2.5 mb-6">
            <AlertCircleIcon size={16} color="#71717a" style={{ marginTop: 2 }} />
            <Text className="text-xs text-neutral-600 flex-1 leading-relaxed">
              <Text className="font-bold text-neutral-900">Queue Position Policy: </Text>
              Minor party changes (±1-2 guests) usually keep your relative position. Larger groups
              may be reassigned to the next suitable table configuration.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100 flex-row items-center gap-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Pressable
          onPress={() => router.back()}
          className="flex-1 h-12 rounded-2xl bg-neutral-100 items-center justify-center active:bg-neutral-200">
          <Text className="text-xs font-bold text-neutral-700">Cancel</Text>
        </Pressable>

        <Pressable
          onPress={handleSave}
          disabled={isSubmitting}
          className="flex-[2] h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center shadow-md shadow-red-500/25">
          <Text className="text-xs font-bold text-white tracking-wide">
            {isSubmitting ? 'Updating Party...' : 'Confirm Party Change'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { PreOrderTimingMode } from '@/types/order';
import { useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  FlameIcon,
  HourglassIcon,
  ShieldCheckIcon,
  SparklesIcon,
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

export default function PreOrderTimingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [timingMode, setTimingMode] =
    React.useState<PreOrderTimingMode>('ten_mins_before');

  const timingOptions: {
    id: PreOrderTimingMode;
    title: string;
    badge?: string;
    desc: string;
    estServing: string;
  }[] = [
    {
      id: 'ten_mins_before',
      title: 'Fire 10 mins before seating',
      badge: 'Recommended',
      desc: 'Kitchen begins cooking when you reach Spot #1 so hot food lands right when you sit down!',
      estServing: 'Within 2 mins of seating',
    },
    {
      id: 'upon_seating',
      title: 'Hold until we are seated',
      desc: 'Chef holds preparation until the host scans your token at Table #14. Ideal if you want to settle in and order drinks first.',
      estServing: '12-15 mins after seating',
    },
    {
      id: 'immediate',
      title: 'Cook Immediately (Express)',
      desc: 'Kitchen starts right now without delay. Recommended if queue is moving fast (< 10 mins).',
      estServing: 'In ~15 mins from now',
    },
    {
      id: 'scheduled',
      title: 'Custom Scheduled Time',
      desc: 'Choose an exact time for the kitchen to plate your meal tonight.',
      estServing: 'Tonight at 8:30 PM',
    },
  ];

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
              Kitchen Timing
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Queue-synced food preparation
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        <View className="px-5 pt-4">
          {/* Smart Coordination Diagram Card */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center gap-2 mb-2">
              <SparklesIcon size={16} color="#dc2626" />
              <Text className="text-xs font-bold text-neutral-900">
                QueueBite Smart Kitchen Sync
              </Text>
            </View>
            <Text className="text-[11px] text-neutral-500 leading-relaxed mb-4">
              Our automated kitchen dispatch connects directly with table turnover. Never wait for food after being seated!
            </Text>

            {/* Visual Timeline Steps */}
            <View className="bg-[#faf8f5] p-3.5 rounded-2xl border border-neutral-200/60 flex-row items-center justify-between">
              <View className="items-center flex-1">
                <View className="size-8 rounded-full bg-red-100 items-center justify-center mb-1">
                  <HourglassIcon size={14} color="#dc2626" />
                </View>
                <Text className="text-[10px] font-bold text-neutral-900 text-center">In Line</Text>
                <Text className="text-[9px] text-neutral-400">Spot #5</Text>
              </View>

              <View className="h-0.5 w-6 bg-red-300" />

              <View className="items-center flex-1">
                <View className="size-8 rounded-full bg-orange-100 items-center justify-center mb-1">
                  <FlameIcon size={14} color="#ea580c" />
                </View>
                <Text className="text-[10px] font-bold text-neutral-900 text-center">Chef Fires</Text>
                <Text className="text-[9px] text-neutral-400">At Spot #1</Text>
              </View>

              <View className="h-0.5 w-6 bg-emerald-300" />

              <View className="items-center flex-1">
                <View className="size-8 rounded-full bg-emerald-100 items-center justify-center mb-1">
                  <UtensilsCrossedIcon size={14} color="#059669" />
                </View>
                <Text className="text-[10px] font-bold text-neutral-900 text-center">Served Hot</Text>
                <Text className="text-[9px] text-neutral-400">At Table</Text>
              </View>
            </View>
          </View>

          {/* Timing Mode Options List */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-1">
              Select When to Start Cooking
            </Text>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Choose the timing that best suits your party
            </Text>

            <View className="gap-3">
              {timingOptions.map((opt) => {
                const isSelected = timingMode === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setTimingMode(opt.id)}
                    className={`p-4 rounded-2xl border ${
                      isSelected
                        ? 'bg-red-50/60 border-[#dc2626]'
                        : 'bg-neutral-50 border-neutral-200/80 active:bg-neutral-100'
                    }`}>
                    <View className="flex-row items-center justify-between mb-1.5">
                      <View className="flex-row items-center gap-2">
                        <Text
                          className={`text-xs font-bold ${
                            isSelected ? 'text-[#dc2626]' : 'text-neutral-900'
                          }`}>
                          {opt.title}
                        </Text>
                        {opt.badge && (
                          <View className="px-2 py-0.2 rounded-md bg-red-100">
                            <Text className="text-[9px] font-bold text-[#dc2626]">
                              {opt.badge}
                            </Text>
                          </View>
                        )}
                      </View>

                      <View
                        className={`size-5 rounded-full items-center justify-center border ${
                          isSelected
                            ? 'bg-[#dc2626] border-[#dc2626]'
                            : 'border-neutral-300 bg-white'
                        }`}>
                        {isSelected && <CheckIcon size={12} color="#ffffff" strokeWidth={3} />}
                      </View>
                    </View>

                    <Text className="text-[11px] text-neutral-600 leading-relaxed mb-2">
                      {opt.desc}
                    </Text>

                    <View className="flex-row items-center gap-1.5 pt-2 border-t border-neutral-200/60">
                      <ClockIcon size={12} color="#71717a" />
                      <Text className="text-[10px] font-bold text-neutral-700">
                        Estimated Serving: {opt.estServing}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Guarantee Note */}
          <View className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex-row items-start gap-2.5 mb-6">
            <ShieldCheckIcon size={18} color="#059669" style={{ marginTop: 2 }} />
            <Text className="text-xs text-emerald-950 flex-1 leading-relaxed">
              <Text className="font-bold">No-Cold-Food Guarantee: </Text>
              If your table takes slightly longer to turn over, our kitchen display system
              automatically pauses food assembly until your party is called!
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/order/review',
              params: { timing: timingMode },
            })
          }
          className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center flex-row gap-2 shadow-md shadow-red-500/25">
          <Text className="text-xs font-bold text-white tracking-wide">
            Proceed to Order Review
          </Text>
          <ChevronRightIcon size={16} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

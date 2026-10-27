import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  FileTextIcon,
  ShieldCheckIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TermsOfServiceScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
              Terms of Service
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Effective October 2026
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        <View className="px-5 pt-4">
          <View className="bg-white rounded-xl p-6 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center gap-2 mb-3">
              <FileTextIcon size={18} color="#dc2626" />
              <Text className="text-sm font-bold text-neutral-900">QueueBite User Agreement</Text>
            </View>

            <Text className="text-xs text-neutral-600 leading-relaxed mb-4">
              Welcome to QueueBite. By accessing or using our platform, smart queue management,
              and pre-order services, you agree to comply with and be bound by the following terms.
            </Text>

            <View className="gap-4">
              <View>
                <Text className="text-xs font-bold text-neutral-900 mb-1">
                  1. Waitlist Integrity & Queue Fairness
                </Text>
                <Text className="text-xs text-neutral-600 leading-relaxed">
                  Queue positions are determined algorithmically based on arrival timestamp, party
                  size, and live table turnover. Holding multiple queues simultaneously without
                  intent to dine is prohibited to ensure fair access for all guests.
                </Text>
              </View>

              <View>
                <Text className="text-xs font-bold text-neutral-900 mb-1">
                  2. 10-Minute Table Hold Window
                </Text>
                <Text className="text-xs text-neutral-600 leading-relaxed">
                  When your table is prepared, a 10-minute hold notification is dispatched to your
                  device. If your party does not check in at the host podium within this window,
                  the table will be released to the next waiting party.
                </Text>
              </View>

              <View>
                <Text className="text-xs font-bold text-neutral-900 mb-1">
                  3. Pre-Order Dining & Cancellation Refunds
                </Text>
                <Text className="text-xs text-neutral-600 leading-relaxed">
                  Pre-ordered dishes can be cancelled with a 100% full refund before the kitchen
                  begins preparation at Spot #1. Once food has entered the active cooking phase,
                  cancellation may incur standard ingredient preparation costs.
                </Text>
              </View>

              <View>
                <Text className="text-xs font-bold text-neutral-900 mb-1">
                  4. Group Dining Etiquette
                </Text>
                <Text className="text-xs text-neutral-600 leading-relaxed">
                  The primary group host is responsible for coordinating arrival readiness. Participating
                  restaurants reserve the right to seat complete parties before partial groups.
                </Text>
              </View>

              <View>
                <Text className="text-xs font-bold text-neutral-900 mb-1">
                  5. Account Security
                </Text>
                <Text className="text-xs text-neutral-600 leading-relaxed">
                  Users are responsible for safeguarding login credentials and prompt notification
                  of any unauthorized account activity.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

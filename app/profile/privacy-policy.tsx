import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  LockIcon,
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

export default function PrivacyPolicyScreen() {
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
              Privacy Policy
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Data protection standards
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
              <ShieldCheckIcon size={18} color="#059669" />
              <Text className="text-sm font-bold text-neutral-900">Your Privacy is Protected</Text>
            </View>

            <Text className="text-xs text-neutral-600 leading-relaxed mb-4">
              QueueBite is dedicated to safeguarding your personal information. This Privacy Policy
              describes how we collect, store, and process your data to power smooth dining waitlists.
            </Text>

            <View className="gap-4">
              <View>
                <Text className="text-xs font-bold text-neutral-900 mb-1">
                  1. Information We Collect
                </Text>
                <Text className="text-xs text-neutral-600 leading-relaxed">
                  We collect account identifiers (Name, verified Phone, Email), approximate GPS
                  location while browsing restaurants, and voluntary dining preferences (Allergies,
                  Dietary notes, Seating style).
                </Text>
              </View>

              <View>
                <Text className="text-xs font-bold text-neutral-900 mb-1">
                  2. Use of Location Services
                </Text>
                <Text className="text-xs text-neutral-600 leading-relaxed">
                  GPS coordinates are used strictly to calculate walking/driving distances, display
                  interactive restaurant map pins, and trigger automatic arrival notifications
                  at the host stand. We do not track your background location when the app is closed.
                </Text>
              </View>

              <View>
                <Text className="text-xs font-bold text-neutral-900 mb-1">
                  3. Information Shared with Restaurants
                </Text>
                <Text className="text-xs text-neutral-600 leading-relaxed">
                  When you join a waitlist, only essential dining details are shared with the
                  restaurant's host podium: your first name, token code, party size, and specified
                  dietary restrictions.
                </Text>
              </View>

              <View>
                <Text className="text-xs font-bold text-neutral-900 mb-1">
                  4. Secure Payment Processing
                </Text>
                <Text className="text-xs text-neutral-600 leading-relaxed">
                  All monetary transactions are handled by RBI-certified, PCI-DSS compliant payment
                  gateways. QueueBite never stores raw card credentials or UPI passwords.
                </Text>
              </View>

              <View>
                <Text className="text-xs font-bold text-neutral-900 mb-1">
                  5. Data Retention & Erasure Rights
                </Text>
                <Text className="text-xs text-neutral-600 leading-relaxed">
                  You hold the absolute right to export an archive of your data or permanently delete
                  your profile at any time through the Delete Account settings screen.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

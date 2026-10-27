import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BellIcon,
  CheckCircle2Icon,
  FlameIcon,
  ShieldAlertIcon,
  SparklesIcon,
  UsersIcon,
  Volume2Icon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationPreferencesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [tableReadyUrgent, setTableReadyUrgent] = React.useState(true);
  const [queueAdvancement, setQueueAdvancement] = React.useState(true);
  const [kitchenFiring, setKitchenFiring] = React.useState(true);
  const [groupSync, setGroupSync] = React.useState(true);
  const [promotions, setPromotions] = React.useState(false);
  const [soundVibration, setSoundVibration] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  function handleSave() {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert('Settings Saved', 'Your notification preferences have been updated.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    }, 400);
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
            className="size-9 rounded-lg bg-neutral-100 items-center justify-center active:bg-neutral-200"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ArrowLeftIcon size={18} color="#18181b" />
          </Pressable>
          <View>
            <Text className="text-xl font-bold text-neutral-900 tracking-tight">
              Notifications
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Alerts & table ready pings
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View className="px-5 pt-4">
          {/* Critical Alerts Card */}
          <View className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs mb-3.5">
            <Text className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
              Critical Queue Alerts
            </Text>

            <View className="gap-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-xs font-bold text-neutral-900">
                    Table Ready Urgency Alerts
                  </Text>
                  <Text className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                    Persistent ring when host marks your table ready for 10-minute hold window
                  </Text>
                </View>
                <Switch
                  value={tableReadyUrgent}
                  onValueChange={setTableReadyUrgent}
                  trackColor={{ false: '#e4e4e7', true: '#dc2626' }}
                  thumbColor="#ffffff"
                />
              </View>

              <View className="h-px bg-neutral-100" />

              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-xs font-bold text-neutral-900">
                    Queue Spot Advancement
                  </Text>
                  <Text className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                    Pings every time your party moves up in line or reaches Spot #1
                  </Text>
                </View>
                <Switch
                  value={queueAdvancement}
                  onValueChange={setQueueAdvancement}
                  trackColor={{ false: '#e4e4e7', true: '#dc2626' }}
                  thumbColor="#ffffff"
                />
              </View>

              <View className="h-px bg-neutral-100" />

              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-xs font-bold text-neutral-900">
                    Sound & Strong Haptic Vibration
                  </Text>
                  <Text className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                    Vibrates phone so you never miss a table announcement in loud lobbies
                  </Text>
                </View>
                <Switch
                  value={soundVibration}
                  onValueChange={setSoundVibration}
                  trackColor={{ false: '#e4e4e7', true: '#dc2626' }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </View>

          {/* Dining Coordination */}
          <View className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs mb-3.5">
            <Text className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
              Kitchen & Group Coordination
            </Text>

            <View className="gap-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-xs font-bold text-neutral-900">
                    Pre-Order Kitchen Firing
                  </Text>
                  <Text className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                    Alerts when the chef turns on the stove 10 mins before your seating
                  </Text>
                </View>
                <Switch
                  value={kitchenFiring}
                  onValueChange={setKitchenFiring}
                  trackColor={{ false: '#e4e4e7', true: '#dc2626' }}
                  thumbColor="#ffffff"
                />
              </View>

              <View className="h-px bg-neutral-100" />

              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-xs font-bold text-neutral-900">
                    Group Dining Readiness
                  </Text>
                  <Text className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                    Alerts when friends in your group arrive at the restaurant or parking
                  </Text>
                </View>
                <Switch
                  value={groupSync}
                  onValueChange={setGroupSync}
                  trackColor={{ false: '#e4e4e7', true: '#dc2626' }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </View>

          {/* Marketing & Deals */}
          <View className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs mb-3.5">
            <Text className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
              Offers & Discovery
            </Text>

            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-xs font-bold text-neutral-900">
                  Zero-Wait Drops & Special Offers
                </Text>
                <Text className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                  Only receive notifications when favorite restaurants drop wait times below 5 mins
                </Text>
              </View>
              <Switch
                value={promotions}
                onValueChange={setPromotions}
                trackColor={{ false: '#e4e4e7', true: '#dc2626' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          className="w-full h-11 rounded-xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center shadow-sm">
          <Text className="text-xs font-bold text-white tracking-wide">
            {isSaving ? 'Saving...' : 'Save Notification Settings'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

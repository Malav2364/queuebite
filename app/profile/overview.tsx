import { BottomNav, TabKey } from '@/components/bottom-nav';
import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { useUser } from '@clerk/expo';
import { useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BellIcon,
  BookmarkIcon,
  ChevronRightIcon,
  ClockIcon,
  CreditCardIcon,
  CrownIcon,
  Edit3Icon,
  FileTextIcon,
  HeartIcon,
  HelpCircleIcon,
  HistoryIcon,
  LockIcon,
  LogOutIcon,
  MoonIcon,
  PhoneIcon,
  ReceiptIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Trash2Icon,
  UserCheckIcon,
  UserIcon,
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
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileOverviewScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useUser();

  const userName = user?.fullName || 'Malav Patel';
  const userEmail = user?.primaryEmailAddress?.emailAddress || 'malav@example.com';
  const userAvatar =
    user?.imageUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

  return (
    <View className="flex-1 bg-[#faf8f5]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        className="px-5 pb-3 bg-white border-b border-neutral-200/80 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.push('/')}
            className="size-9 rounded-lg bg-neutral-100 items-center justify-center active:bg-neutral-200"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ArrowLeftIcon size={18} color="#18181b" />
          </Pressable>
          <View>
            <Text className="text-xl font-bold text-neutral-900 tracking-tight">
              My Profile
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Account & preferences
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>
        <View className="px-5 pt-4">
          {/* User Profile Card */}
          <View className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs mb-3.5">
            <View className="flex-row items-center gap-3.5">
              <View className="relative">
                <Image
                  source={{ uri: userAvatar }}
                  className="size-14 rounded-full bg-neutral-200 border border-neutral-200"
                  resizeMode="cover"
                />
                <View className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-[#dc2626] items-center justify-center border border-white">
                  <CrownIcon size={9} color="#ffffff" />
                </View>
              </View>

              <View className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-base font-bold text-neutral-900" numberOfLines={1}>
                    {userName}
                  </Text>
                  <View className="px-1.5 py-0.5 rounded bg-amber-100">
                    <Text className="text-[9px] font-bold text-amber-900">VIP Diner</Text>
                  </View>
                </View>

                <Text className="text-xs text-neutral-500 mt-0.5" numberOfLines={1}>
                  {userEmail}
                </Text>
                <Text className="text-[11px] text-neutral-400 mt-0.5">
                  Member since Oct 2026 • Vadodara
                </Text>
              </View>

              <Pressable
                onPress={() => router.push('/profile/edit')}
                className="size-8 rounded-lg bg-neutral-100 items-center justify-center active:bg-neutral-200">
                <Edit3Icon size={15} color="#18181b" />
              </Pressable>
            </View>

            {/* Stats Row */}
            <View className="mt-3.5 pt-3 border-t border-neutral-100 flex-row justify-around">
              <View className="items-center">
                <Text className="text-base font-bold text-neutral-900">24</Text>
                <Text className="text-[10px] text-neutral-500 font-medium">Queues Joined</Text>
              </View>

              <View className="w-px h-7 bg-neutral-200" />

              <View className="items-center">
                <Text className="text-base font-bold text-[#dc2626]">4.8 hrs</Text>
                <Text className="text-[10px] text-neutral-500 font-medium">Time Saved</Text>
              </View>

              <View className="w-px h-7 bg-neutral-200" />

              <View className="items-center">
                <Text className="text-base font-bold text-neutral-900">8</Text>
                <Text className="text-[10px] text-neutral-500 font-medium">Favorite Spots</Text>
              </View>
            </View>
          </View>

          {/* Section 1: Personalization & Dining */}
          <View className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs mb-3.5">
            <Text className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Personalization & Dining
            </Text>

            <View className="gap-0.5">
              {/* Highlighted Personalization Preferences */}
              <Pressable
                onPress={() => router.push('/profile/preferences')}
                className="py-2.5 flex-row items-center justify-between active:opacity-70">
                <View className="flex-row items-center gap-3 flex-1 pr-2">
                  <View className="size-8 rounded-lg bg-red-50 items-center justify-center">
                    <UtensilsCrossedIcon size={16} color="#dc2626" />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-1.5">
                      <Text className="text-xs font-bold text-neutral-900">
                        Personalization Preferences
                      </Text>
                      <View className="px-1.5 py-0.2 rounded bg-emerald-100">
                        <Text className="text-[9px] font-bold text-emerald-800">Customized</Text>
                      </View>
                    </View>
                    <Text className="text-[11px] text-neutral-500 mt-0.5" numberOfLines={1}>
                      Dietary, seating, atmosphere, spend & language
                    </Text>
                  </View>
                </View>
                <ChevronRightIcon size={14} color="#71717a" />
              </Pressable>

              <View className="h-px bg-neutral-100" />

              <Pressable
                onPress={() => router.push('/profile/favorites')}
                className="py-2.5 flex-row items-center justify-between active:opacity-70">
                <View className="flex-row items-center gap-3">
                  <View className="size-8 rounded-lg bg-red-50 items-center justify-center">
                    <HeartIcon size={16} color="#dc2626" />
                  </View>
                  <View>
                    <Text className="text-xs font-semibold text-neutral-900">Favorite Restaurants</Text>
                    <Text className="text-[11px] text-neutral-500">Bookmarked tables & cafes</Text>
                  </View>
                </View>
                <ChevronRightIcon size={14} color="#71717a" />
              </Pressable>

              <View className="h-px bg-neutral-100" />

              <Pressable
                onPress={() => router.push('/profile/visits')}
                className="py-2.5 flex-row items-center justify-between active:opacity-70">
                <View className="flex-row items-center gap-3">
                  <View className="size-8 rounded-lg bg-red-50 items-center justify-center">
                    <HistoryIcon size={16} color="#dc2626" />
                  </View>
                  <View>
                    <Text className="text-xs font-semibold text-neutral-900">Visit & Queue History</Text>
                    <Text className="text-[11px] text-neutral-500">Past meals, wait times & bills</Text>
                  </View>
                </View>
                <ChevronRightIcon size={14} color="#71717a" />
              </Pressable>

              <View className="h-px bg-neutral-100" />

              <Pressable
                onPress={() => router.push('/profile/notifications')}
                className="py-2.5 flex-row items-center justify-between active:opacity-70">
                <View className="flex-row items-center gap-3">
                  <View className="size-8 rounded-lg bg-red-50 items-center justify-center">
                    <BellIcon size={16} color="#dc2626" />
                  </View>
                  <View>
                    <Text className="text-xs font-semibold text-neutral-900">Notification Preferences</Text>
                    <Text className="text-[11px] text-neutral-500">Table ready, alerts & sound</Text>
                  </View>
                </View>
                <ChevronRightIcon size={14} color="#71717a" />
              </Pressable>
            </View>
          </View>

          {/* Section 2: App & Legal */}
          <View className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs mb-3.5">
            <Text className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              App & Legal
            </Text>

            <View className="gap-0.5">
              <Pressable
                onPress={() => router.push('/profile/settings')}
                className="py-2.5 flex-row items-center justify-between active:opacity-70">
                <View className="flex-row items-center gap-3">
                  <View className="size-8 rounded-lg bg-neutral-100 items-center justify-center">
                    <SettingsIcon size={15} color="#18181b" />
                  </View>
                  <Text className="text-xs font-semibold text-neutral-900">App Settings</Text>
                </View>
                <ChevronRightIcon size={14} color="#71717a" />
              </Pressable>

              <View className="h-px bg-neutral-100" />

              <Pressable
                onPress={() => router.push('/profile/privacy-permissions')}
                className="py-2.5 flex-row items-center justify-between active:opacity-70">
                <View className="flex-row items-center gap-3">
                  <View className="size-8 rounded-lg bg-neutral-100 items-center justify-center">
                    <ShieldCheckIcon size={15} color="#18181b" />
                  </View>
                  <Text className="text-xs font-semibold text-neutral-900">Privacy & Permissions</Text>
                </View>
                <ChevronRightIcon size={14} color="#71717a" />
              </Pressable>

              <View className="h-px bg-neutral-100" />

              <Pressable
                onPress={() => router.push('/profile/support')}
                className="py-2.5 flex-row items-center justify-between active:opacity-70">
                <View className="flex-row items-center gap-3">
                  <View className="size-8 rounded-lg bg-neutral-100 items-center justify-center">
                    <HelpCircleIcon size={15} color="#18181b" />
                  </View>
                  <Text className="text-xs font-semibold text-neutral-900">Help & Support</Text>
                </View>
                <ChevronRightIcon size={14} color="#71717a" />
              </Pressable>

              <View className="h-px bg-neutral-100" />

              <Pressable
                onPress={() => router.push('/profile/terms')}
                className="py-2.5 flex-row items-center justify-between active:opacity-70">
                <View className="flex-row items-center gap-3">
                  <View className="size-8 rounded-lg bg-neutral-100 items-center justify-center">
                    <FileTextIcon size={15} color="#18181b" />
                  </View>
                  <Text className="text-xs font-semibold text-neutral-900">Terms of Service</Text>
                </View>
                <ChevronRightIcon size={14} color="#71717a" />
              </Pressable>

              <View className="h-px bg-neutral-100" />

              <Pressable
                onPress={() => router.push('/profile/privacy-policy')}
                className="py-2.5 flex-row items-center justify-between active:opacity-70">
                <View className="flex-row items-center gap-3">
                  <View className="size-8 rounded-lg bg-neutral-100 items-center justify-center">
                    <LockIcon size={15} color="#18181b" />
                  </View>
                  <Text className="text-xs font-semibold text-neutral-900">Privacy Policy</Text>
                </View>
                <ChevronRightIcon size={14} color="#71717a" />
              </Pressable>
            </View>
          </View>

          {/* Section 3: Account Actions */}
          <View className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs mb-6">
            <Pressable
              onPress={() => router.push('/profile/sign-out-confirm')}
              className="py-2 flex-row items-center justify-between active:opacity-70">
              <View className="flex-row items-center gap-3">
                <LogOutIcon size={15} color="#dc2626" />
                <Text className="text-xs font-semibold text-[#dc2626]">Sign Out</Text>
              </View>
              <ChevronRightIcon size={14} color="#dc2626" />
            </Pressable>

            <View className="h-px bg-neutral-100 my-1" />

            <Pressable
              onPress={() => router.push('/profile/delete-account')}
              className="py-2 flex-row items-center justify-between active:opacity-70">
              <View className="flex-row items-center gap-3">
                <Trash2Icon size={15} color="#71717a" />
                <Text className="text-xs font-semibold text-neutral-500">Delete Account</Text>
              </View>
              <ChevronRightIcon size={14} color="#71717a" />
            </Pressable>
          </View>

          <Text className="text-[11px] text-neutral-400 text-center font-medium mb-4">
            QueueBite v2.4.0 • Smarter dining without the wait
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab="PROFILE"
        onTabChange={(tab: TabKey) => {
          if (tab === 'HOME') router.push('/');
          else if (tab === 'EXPLORE') router.push('/explore');
          else if (tab === 'MY_QUEUE') router.push('/queue/overview');
          else if (tab === 'SAVED') router.push('/saved');
        }}
      />
    </View>
  );
}

import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { useClerk, useUser } from '@clerk/expo';
import { useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  LogOutIcon,
  ShieldAlertIcon,
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

export default function SignOutConfirmScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const [isSigningOut, setIsSigningOut] = React.useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
      router.replace('/(auth)/welcome');
    } catch (err) {
      setIsSigningOut(false);
      router.replace('/(auth)/welcome');
    }
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

        <Text className="text-base font-bold text-neutral-900 tracking-tight">
          Sign Out
        </Text>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View className="px-5 pt-8 items-center">
          {/* User Avatar */}
          <Image
            source={{
              uri:
                user?.imageUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
            }}
            className="size-20 rounded-full bg-neutral-200 border-2 border-white shadow-md mb-3"
          />

          <Text className="text-xl font-bold text-neutral-900 text-center tracking-tight">
            Sign out of QueueBite?
          </Text>

          <Text className="text-xs text-neutral-500 text-center mt-1 max-w-[260px]">
            Signed in as {user?.fullName || 'Malav Patel'} ({user?.primaryEmailAddress?.emailAddress || 'malav@example.com'})
          </Text>

          {/* Active Queue Warning Card */}
          <View className="w-full bg-amber-50/80 border border-amber-200/80 rounded-xl p-5 mt-6 mb-4">
            <View className="flex-row items-center gap-2 mb-2">
              <AlertCircleIcon size={18} color="#b45309" />
              <Text className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Active Waitlist Notice
              </Text>
            </View>
            <Text className="text-xs text-amber-900 leading-relaxed">
              You are currently holding <Text className="font-bold">Spot #5 at The Daily Bean</Text>.
              Signing out may interrupt real-time table turnover notifications.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100 gap-2.5"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Pressable
          onPress={() => router.back()}
          className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center shadow-md shadow-red-500/25">
          <Text className="text-xs font-bold text-white tracking-wide">
            Stay Signed In
          </Text>
        </Pressable>

        <Pressable
          onPress={handleSignOut}
          disabled={isSigningOut}
          className="w-full h-12 rounded-2xl bg-white border border-neutral-300 active:bg-neutral-100 items-center justify-center flex-row gap-2">
          <LogOutIcon size={16} color="#71717a" />
          <Text className="text-xs font-bold text-neutral-800">
            {isSigningOut ? 'Signing Out...' : 'Confirm Sign Out'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

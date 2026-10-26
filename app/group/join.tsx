import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_ACTIVE_GROUP } from '@/types/group';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  SparklesIcon,
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
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function JoinGroupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string }>();

  const [inviteCode, setInviteCode] = React.useState(params.code || '');
  const [selectedDietary, setSelectedDietary] = React.useState<string[]>([]);
  const [arrivalStatus, setArrivalStatus] = React.useState<'on_the_way' | 'arrived' | 'parking'>(
    'on_the_way'
  );
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isJoining, setIsJoining] = React.useState(false);

  // Verified group data if code matches QB-8842
  const group = MOCK_ACTIVE_GROUP;
  const isCodeMatched =
    inviteCode.trim().toUpperCase() === 'QB-8842' ||
    inviteCode.trim().toUpperCase() === 'QB8842' ||
    inviteCode.trim().length >= 6;

  function toggleDietary(tag: string) {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleJoinGroup() {
    if (!isCodeMatched) {
      Alert.alert('Invalid Code', 'Please enter a valid 6-character group invite code.');
      return;
    }

    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      Alert.alert(
        'Joined Group!',
        `You have joined ${group.name}. You are now synchronized with their live queue token #${group.queueToken}.`,
        [
          {
            text: 'View Group Queue',
            onPress: () => router.replace('/group/queue'),
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
            <Text className="text-xl font-black text-neutral-900 tracking-tight">
              Join Group
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Enter invite code or link
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View className="px-5 pt-4">
          {/* Code Input Card */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-1">
              Group Invite Code
            </Text>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Ask your host for the 6-character code (e.g., QB-8842)
            </Text>

            <View className="flex-row gap-2.5">
              <TextInput
                value={inviteCode}
                onChangeText={(val) => setInviteCode(val.toUpperCase())}
                placeholder="QB-8842"
                placeholderTextColor="#a1a1aa"
                autoCapitalize="characters"
                maxLength={8}
                className="flex-1 h-12 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 text-base font-black tracking-widest text-neutral-900 text-center"
              />

              <Pressable
                onPress={() => setInviteCode('QB-8842')}
                className="px-4 h-12 bg-neutral-100 rounded-2xl items-center justify-center border border-neutral-200 active:bg-neutral-200">
                <Text className="text-xs font-bold text-neutral-700">Paste Demo</Text>
              </Pressable>
            </View>

            {/* QR Code Scanner Shortcut */}
            <Pressable
              onPress={() =>
                Alert.alert('Scan QR', 'Opening camera to scan host’s on-screen QR code...')
              }
              className="mt-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex-row items-center justify-center gap-2 active:bg-neutral-100">
              <QrCodeIcon size={14} color="#18181b" />
              <Text className="text-xs font-bold text-neutral-800">Scan Host QR Code</Text>
            </Pressable>
          </View>

          {/* Verified Group Preview Card */}
          {isCodeMatched && (
            <View className="bg-white rounded-3xl p-5 border border-emerald-200 shadow-sm mb-4">
              <View className="flex-row items-center justify-between pb-3 border-b border-neutral-100">
                <View className="flex-row items-center gap-2">
                  <View className="size-2 rounded-full bg-emerald-500" />
                  <Text className="text-xs font-bold text-emerald-800">Invite Code Verified</Text>
                </View>
                <View className="px-2.5 py-0.5 rounded-full bg-red-100">
                  <Text className="text-[10px] font-bold text-[#dc2626]">
                    Token #{group.queueToken}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-3 pt-3 mb-3">
                <Image
                  source={{ uri: group.restaurantImage }}
                  className="size-14 rounded-2xl bg-neutral-100"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="text-base font-black text-neutral-900" numberOfLines={1}>
                    {group.name}
                  </Text>
                  <Text className="text-xs text-neutral-600 mt-0.5" numberOfLines={1}>
                    {group.restaurantName} • Hosted by {group.hostName.split(' ')[0]}
                  </Text>
                </View>
              </View>

              {/* Members Joined Avatar Stack */}
              <View className="pt-2 border-t border-neutral-100 flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5">
                  <UsersIcon size={14} color="#71717a" />
                  <Text className="text-xs text-neutral-600 font-medium">
                    {group.members.length} members already joined
                  </Text>
                </View>

                <View className="flex-row -space-x-2">
                  {group.members.map((m) => (
                    <Image
                      key={m.id}
                      source={{ uri: m.avatar }}
                      className="size-7 rounded-full border-2 border-white bg-neutral-200"
                    />
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Current Arrival Status */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-1">
              Your Arrival Status
            </Text>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Let the host know how close you are to the restaurant
            </Text>

            <View className="gap-2">
              {[
                { id: 'arrived', label: "I'm already at the entrance", color: '#059669' },
                { id: 'parking', label: 'Parking nearby (< 5 mins)', color: '#2563eb' },
                { id: 'on_the_way', label: 'On my way (~10 mins away)', color: '#d97706' },
              ].map((opt) => {
                const isSelected = arrivalStatus === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setArrivalStatus(opt.id as any)}
                    className={`p-3 rounded-2xl border flex-row items-center justify-between ${
                      isSelected
                        ? 'bg-neutral-900 border-neutral-900'
                        : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                    }`}>
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? 'text-white' : 'text-neutral-800'
                      }`}>
                      {opt.label}
                    </Text>
                    {isSelected && <CheckIcon size={14} color="#ffffff" strokeWidth={3} />}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Dietary Restrictions */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-1">
              Your Dietary Restrictions
            </Text>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Added to group preferences for the restaurant
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {['Pure Veg', 'Jain Food', 'Nut Allergy', 'Gluten-Free', 'Halal', 'No Onion/Garlic'].map(
                (tag) => {
                  const isSelected = selectedDietary.includes(tag);
                  return (
                    <Pressable
                      key={tag}
                      onPress={() => toggleDietary(tag)}
                      className={`px-3 py-1.5 rounded-full border ${
                        isSelected
                          ? 'bg-red-50 border-[#dc2626]'
                          : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                      }`}>
                      <Text
                        className={`text-xs font-bold ${
                          isSelected ? 'text-[#dc2626]' : 'text-neutral-700'
                        }`}>
                        {tag}
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Pressable
          onPress={handleJoinGroup}
          disabled={isJoining}
          className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center flex-row gap-2 shadow-md shadow-red-500/25">
          <CheckCircle2Icon size={16} color="#ffffff" />
          <Text className="text-xs font-bold text-white tracking-wide">
            {isJoining ? 'Joining Group...' : 'Join Group & Sync Queue'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

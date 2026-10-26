import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { GroupMember, MOCK_ACTIVE_GROUP } from '@/types/group';
import { useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  CrownIcon,
  LockIcon,
  PlusIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UserCheckIcon,
  UserMinusIcon,
  UserPlusIcon,
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
  Switch,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ManageGroupMembersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [members, setMembers] = React.useState<GroupMember[]>(MOCK_ACTIVE_GROUP.members);
  const [isLocked, setIsLocked] = React.useState<boolean>(false);
  const [isSaving, setIsSaving] = React.useState(false);

  function handleRemoveMember(memberId: string, memberName: string) {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${memberName} from this dining group?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setMembers((prev) => prev.filter((m) => m.id !== memberId));
          },
        },
      ]
    );
  }

  function handleMakeHost(memberId: string, memberName: string) {
    Alert.alert(
      'Transfer Host Role',
      `Make ${memberName} the primary host of this group? They will manage seating and waitlist changes.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Transfer',
          onPress: () => {
            setMembers((prev) =>
              prev.map((m) => ({
                ...m,
                role: m.id === memberId ? 'host' : 'member',
              }))
            );
          },
        },
      ]
    );
  }

  function handleSave() {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert(
        'Group Updated',
        'Member roster and kitchen dietary notes updated for the restaurant host.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 500);
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
              Manage Members
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Party size & host controls
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View className="px-5 pt-4">
          {/* Lock Group Size Toggle */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4 flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <View className="flex-row items-center gap-1.5">
                <LockIcon size={14} color="#18181b" />
                <Text className="text-xs font-bold text-neutral-900">Lock Group Size ({members.length})</Text>
              </View>
              <Text className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                Prevents new invitees from joining so party size remains fixed for table turnover
              </Text>
            </View>

            <Switch
              value={isLocked}
              onValueChange={setIsLocked}
              trackColor={{ false: '#e4e4e7', true: '#dc2626' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Members List */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xs font-bold text-neutral-900">
                Party Roster ({members.length} Diners)
              </Text>
              <Pressable
                onPress={() => router.push('/group/invite')}
                className="flex-row items-center gap-1 active:opacity-70">
                <UserPlusIcon size={12} color="#dc2626" />
                <Text className="text-xs font-bold text-[#dc2626]">Add Friend</Text>
              </Pressable>
            </View>

            <View className="gap-3">
              {members.map((member) => (
                <View
                  key={member.id}
                  className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1 pr-2">
                      <Image
                        source={{ uri: member.avatar }}
                        className="size-11 rounded-full bg-neutral-200"
                      />
                      <View className="flex-1">
                        <View className="flex-row items-center gap-1.5">
                          <Text className="text-xs font-bold text-neutral-900" numberOfLines={1}>
                            {member.name}
                          </Text>
                          {member.role === 'host' && (
                            <View className="px-1.5 py-0.2 rounded-md bg-red-100 flex-row items-center gap-0.5">
                              <CrownIcon size={10} color="#dc2626" />
                              <Text className="text-[9px] font-bold text-[#dc2626]">Host</Text>
                            </View>
                          )}
                        </View>
                        {member.dietary && member.dietary.length > 0 ? (
                          <Text className="text-[10px] text-neutral-500 mt-0.5">
                            Dietary: {member.dietary.join(', ')}
                          </Text>
                        ) : (
                          <Text className="text-[10px] text-neutral-400 mt-0.5">
                            No special diet
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Member Controls (if not host) */}
                    {member.role !== 'host' ? (
                      <View className="flex-row items-center gap-1">
                        <Pressable
                          onPress={() => handleMakeHost(member.id, member.name)}
                          className="px-2 py-1 rounded-lg bg-neutral-100 active:bg-neutral-200">
                          <Text className="text-[10px] font-bold text-neutral-700">Make Host</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => handleRemoveMember(member.id, member.name)}
                          className="size-7 rounded-lg bg-red-50 items-center justify-center active:bg-red-100">
                          <Trash2Icon size={12} color="#dc2626" />
                        </Pressable>
                      </View>
                    ) : (
                      <View className="px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
                        <Text className="text-[10px] font-bold text-emerald-800">You (Host)</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Group Dietary Requirements Summary */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center gap-2 mb-2">
              <UtensilsCrossedIcon size={16} color="#dc2626" />
              <Text className="text-xs font-bold text-neutral-900">
                Combined Kitchen Dietary Notes
              </Text>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Automatically compiled from your party members' preferences
            </Text>

            <View className="p-3 bg-[#faf8f5] rounded-2xl border border-neutral-200/80 gap-1.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-700">Pure Vegetarian</Text>
                <Text className="text-xs font-bold text-neutral-900">2 Diners</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-700">Jain Food (No onion/garlic)</Text>
                <Text className="text-xs font-bold text-neutral-900">1 Diner</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-neutral-700">Gluten-Free</Text>
                <Text className="text-xs font-bold text-neutral-900">1 Diner</Text>
              </View>
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
          className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center shadow-md shadow-red-500/25">
          <Text className="text-xs font-bold text-white tracking-wide">
            {isSaving ? 'Updating...' : 'Save Member Settings'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

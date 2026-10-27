import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MemberReadinessStatus, MOCK_ACTIVE_GROUP } from '@/types/group';
import { useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BellRingIcon,
  CarIcon,
  CheckCircle2Icon,
  ClockIcon,
  FootprintsIcon,
  HelpCircleIcon,
  MapPinIcon,
  NavigationIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
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

export default function GroupReadinessScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [members, setMembers] = React.useState(MOCK_ACTIVE_GROUP.members);
  const [myStatus, setMyStatus] = React.useState<MemberReadinessStatus>('arrived');

  const readyCount = members.filter((m) => m.status === 'arrived' || m.status === 'parking').length;
  const isAllReady = readyCount === members.length;

  function updateMyStatus(newStatus: MemberReadinessStatus) {
    setMyStatus(newStatus);
    setMembers((prev) =>
      prev.map((m) =>
        m.isCurrentUser
          ? {
              ...m,
              status: newStatus,
              eta:
                newStatus === 'arrived'
                  ? 'At Entrance'
                  : newStatus === 'parking'
                  ? 'Parking (< 3m)'
                  : 'On the way (8m)',
            }
          : m
      )
    );
  }

  function handlePingMember(memberName: string) {
    Alert.alert(
      'Nudge Sent',
      `Sent a high-priority arrival reminder to ${memberName} on QueueBite.`
    );
  }

  function handleNotifyHostAllReady() {
    Alert.alert(
      'Host Notified',
      'The host stand has been informed that all 4 members are present at the entrance!',
      [
        {
          text: 'View Queue',
          onPress: () => router.push('/group/queue'),
        },
      ]
    );
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
              Group Readiness
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Party presence & arrival tracker
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View className="px-5 pt-4">
          {/* 1. Readiness Summary Card */}
          <View className="bg-white rounded-xl p-6 border border-neutral-100 shadow-sm mb-4 items-center">
            <View
              className={`size-20 rounded-full items-center justify-center mb-3 ${
                isAllReady ? 'bg-emerald-100' : 'bg-red-50'
              }`}>
              <ShieldCheckIcon size={38} color={isAllReady ? '#059669' : '#dc2626'} />
            </View>

            <Text className="text-2xl font-bold text-neutral-900 tracking-tight text-center">
              {readyCount} of {members.length} Members Present
            </Text>

            <Text className="text-xs text-neutral-500 text-center mt-1 max-w-[280px]">
              {isAllReady
                ? 'Your entire party is assembled and ready to be seated immediately.'
                : '1 member is still en route. Host requires all guests at the podium before seating.'}
            </Text>

            {/* Visual Readiness Progress Bar */}
            <View className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden mt-4 mb-2">
              <View
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${(readyCount / members.length) * 100}%` }}
              />
            </View>
          </View>

          {/* 2. Update My Personal Status */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-1">
              Your Current Location Status
            </Text>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Tap to update your friends and host
            </Text>

            <View className="gap-2">
              {[
                {
                  id: 'arrived',
                  label: "I'm at the entrance",
                  desc: 'Inside restaurant or at host podium',
                  color: '#059669',
                },
                {
                  id: 'parking',
                  label: 'Parking nearby (< 5 mins)',
                  desc: 'Parking car or walking from lot',
                  color: '#2563eb',
                },
                {
                  id: 'on_the_way',
                  label: 'On my way (~10 mins away)',
                  desc: 'In cab or transit',
                  color: '#d97706',
                },
              ].map((opt) => {
                const isSelected = myStatus === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => updateMyStatus(opt.id as any)}
                    className={`p-3.5 rounded-2xl border flex-row items-center justify-between ${
                      isSelected
                        ? 'bg-red-50/70 border-[#dc2626]'
                        : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
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
                        isSelected ? 'bg-[#dc2626] border-[#dc2626]' : 'border-neutral-300 bg-white'
                      }`}>
                      {isSelected && <CheckCircle2Icon size={12} color="#ffffff" strokeWidth={3} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* 3. Member Readiness Checklist */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-3">
              Member Arrival Statuses
            </Text>

            <View className="gap-3">
              {members.map((member) => {
                const isArrived = member.status === 'arrived';
                const isParking = member.status === 'parking';

                return (
                  <View
                    key={member.id}
                    className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex-row items-center justify-between">
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
                            <View className="px-1.5 py-0.2 rounded-md bg-red-100">
                              <Text className="text-[9px] font-bold text-[#dc2626]">Host</Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-[10px] text-neutral-500 mt-0.5">
                          {member.distance} away • {member.eta}
                        </Text>
                      </View>
                    </View>

                    {/* Action or Status Badge */}
                    {!isArrived && !member.isCurrentUser ? (
                      <Pressable
                        onPress={() => handlePingMember(member.name)}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 flex-row items-center gap-1 active:bg-amber-100">
                        <BellRingIcon size={11} color="#b45309" />
                        <Text className="text-[11px] font-bold text-amber-900">Ping</Text>
                      </Pressable>
                    ) : (
                      <View
                        className={`px-2.5 py-1 rounded-full flex-row items-center gap-1 ${
                          isArrived
                            ? 'bg-emerald-100 border border-emerald-300'
                            : 'bg-blue-100 border border-blue-300'
                        }`}>
                        <CheckCircle2Icon
                          size={11}
                          color={isArrived ? '#059669' : '#2563eb'}
                        />
                        <Text
                          className={`text-[10px] font-bold ${
                            isArrived ? 'text-emerald-800' : 'text-blue-800'
                          }`}>
                          {isArrived ? 'At Entrance' : 'Parking'}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Pressable
          onPress={handleNotifyHostAllReady}
          className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center flex-row gap-2 shadow-md shadow-red-500/25">
          <CheckCircle2Icon size={16} color="#ffffff" />
          <Text className="text-xs font-bold text-white tracking-wide">
            {isAllReady ? 'Notify Host: Entire Party Here' : 'Open Shared Group Queue'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

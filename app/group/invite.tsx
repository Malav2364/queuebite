import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_ACTIVE_GROUP } from '@/types/group';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  CheckIcon,
  CopyIcon,
  Link2Icon,
  MessageCircleIcon,
  QrCodeIcon,
  SendIcon,
  Share2Icon,
  UsersIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Clipboard,
  Image,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function InviteFriendsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    groupName?: string;
    restaurantName?: string;
  }>();

  const group = MOCK_ACTIVE_GROUP;
  const inviteCode = group.inviteCode;
  const inviteUrl = `https://queuebite.app/join/${inviteCode}`;

  const [copied, setCopied] = React.useState(false);
  const [invitedContacts, setInvitedContacts] = React.useState<Set<string>>(
    new Set(['c-1', 'c-2'])
  );

  const mockContacts = [
    {
      id: 'c-1',
      name: 'Rohan Sharma',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'c-2',
      name: 'Priya Patel',
      phone: '+91 98234 56789',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'c-3',
      name: 'Arjun Mehta',
      phone: '+91 97123 45678',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'c-4',
      name: 'Neha Kapoor',
      phone: '+91 96543 21098',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
    },
  ];

  function handleCopy() {
    Clipboard.setString(inviteCode);
    setCopied(true);
    Alert.alert('Code Copied', `Invite code ${inviteCode} copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShareLink() {
    Share.share({
      title: `Join ${params.groupName || group.name} on QueueBite`,
      message: `Hey! I created a group waitlist on QueueBite for ${
        params.restaurantName || group.restaurantName
      }. Tap this link to join and track our table live: ${inviteUrl} (Code: ${inviteCode})`,
    }).catch(() => {});
  }

  function toggleInviteContact(id: string) {
    setInvitedContacts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
              Invite Friends
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Share code & sync live queue
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>
        <View className="px-5 pt-4">
          {/* Main Invite Code Card */}
          <View className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm mb-4 items-center">
            <Text className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Group Invite Code
            </Text>

            <Text className="text-4xl font-black text-neutral-900 tracking-widest my-2">
              {inviteCode}
            </Text>

            <Pressable
              onPress={handleCopy}
              className="mt-1 px-4 py-2 rounded-xl bg-neutral-100 border border-neutral-200 flex-row items-center gap-1.5 active:bg-neutral-200">
              {copied ? (
                <>
                  <CheckIcon size={14} color="#059669" />
                  <Text className="text-xs font-bold text-emerald-700">Copied!</Text>
                </>
              ) : (
                <>
                  <CopyIcon size={14} color="#18181b" />
                  <Text className="text-xs font-bold text-neutral-800">Copy Code</Text>
                </>
              )}
            </Pressable>

            {/* In-Person QR Code Graphic */}
            <View className="size-44 p-3 rounded-2xl bg-neutral-50 border-2 border-neutral-200 items-center justify-center my-4">
              <QrCodeIcon size={140} color="#18181b" />
            </View>

            <Text className="text-[11px] text-neutral-500 text-center font-medium">
              Friends can point their phone camera or QueueBite scanner at this screen
            </Text>
          </View>

          {/* Quick Share Buttons */}
          <View className="flex-row gap-2.5 mb-4">
            <Pressable
              onPress={handleShareLink}
              className="flex-1 py-3 rounded-2xl bg-[#25D366] items-center justify-center flex-row gap-2 active:opacity-90 shadow-sm">
              <MessageCircleIcon size={16} color="#ffffff" />
              <Text className="text-xs font-bold text-white">WhatsApp</Text>
            </Pressable>

            <Pressable
              onPress={handleShareLink}
              className="flex-1 py-3 rounded-2xl bg-[#dc2626] items-center justify-center flex-row gap-2 active:bg-[#b91c1c] shadow-md shadow-red-500/25">
              <Share2Icon size={16} color="#ffffff" />
              <Text className="text-xs font-bold text-white">Share Link</Text>
            </Pressable>
          </View>

          {/* Quick Contacts List */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <UsersIcon size={16} color="#dc2626" />
                <Text className="text-xs font-bold text-neutral-900">Recent Dining Friends</Text>
              </View>
              <Text className="text-[11px] text-neutral-400">Tap to invite</Text>
            </View>

            <View className="gap-2.5">
              {mockContacts.map((contact) => {
                const isInvited = invitedContacts.has(contact.id);
                return (
                  <View
                    key={contact.id}
                    className="flex-row items-center justify-between p-2.5 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                    <View className="flex-row items-center gap-3">
                      <Image
                        source={{ uri: contact.avatar }}
                        className="size-10 rounded-full bg-neutral-200"
                      />
                      <View>
                        <Text className="text-xs font-bold text-neutral-900">{contact.name}</Text>
                        <Text className="text-[10px] text-neutral-500">{contact.phone}</Text>
                      </View>
                    </View>

                    <Pressable
                      onPress={() => toggleInviteContact(contact.id)}
                      className={`px-3 py-1.5 rounded-xl border flex-row items-center gap-1 ${
                        isInvited
                          ? 'bg-emerald-50 border-emerald-300'
                          : 'bg-white border-neutral-300 active:bg-neutral-100'
                      }`}>
                      {isInvited ? (
                        <>
                          <CheckCircle2Icon size={12} color="#059669" />
                          <Text className="text-[11px] font-bold text-emerald-800">Invited</Text>
                        </>
                      ) : (
                        <Text className="text-[11px] font-bold text-neutral-800">+ Invite</Text>
                      )}
                    </Pressable>
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
          onPress={() =>
            router.push({
              pathname: '/group/[id]',
              params: { id: 'grp-01' },
            })
          }
          className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center shadow-md shadow-red-500/25">
          <Text className="text-xs font-bold text-white tracking-wide">
            Done • View Group Details
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

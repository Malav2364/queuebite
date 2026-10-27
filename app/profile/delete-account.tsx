import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { useClerk } from '@clerk/expo';
import { useRouter } from 'expo-router';
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CheckIcon,
  ShieldAlertIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DeleteAccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut } = useClerk();

  const [confirmText, setConfirmText] = React.useState('');
  const [selectedReason, setSelectedReason] = React.useState('Not using the app frequently');
  const [isDeleting, setIsDeleting] = React.useState(false);

  const reasons = [
    'Not using the app frequently',
    'Moving to a city without QueueBite restaurants',
    'Privacy or data tracking concerns',
    'Technical or map issues',
    'Created a duplicate account',
  ];

  const isConfirmed = confirmText.trim().toUpperCase() === 'DELETE';

  function handleDeleteAccount() {
    if (!isConfirmed) {
      Alert.alert('Confirmation Required', 'Please type DELETE into the text field to proceed.');
      return;
    }

    Alert.alert(
      'Final Confirmation',
      'Are you absolutely sure? All active waitlist passes, dine wallet credits (₹1,450), and past dining receipts will be deleted permanently.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await signOut();
              router.replace('/(auth)/welcome');
            } catch (err) {
              setIsDeleting(false);
              router.replace('/(auth)/welcome');
            }
          },
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
        <Pressable
          onPress={() => router.back()}
          className="size-9 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <XIcon size={18} color="#18181b" />
        </Pressable>

        <Text className="text-base font-bold text-neutral-900 tracking-tight">
          Delete Account
        </Text>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>
        <View className="px-5 pt-4">
          {/* Warning Banner */}
          <View className="bg-red-50/80 border border-red-200 rounded-xl p-5 mb-4 items-center">
            <View className="size-16 rounded-full bg-red-100 items-center justify-center mb-3">
              <AlertTriangleIcon size={32} color="#dc2626" />
            </View>

            <Text className="text-lg font-bold text-red-950 text-center">
              Permanent Account Deletion
            </Text>

            <Text className="text-xs text-red-800 text-center mt-1 leading-relaxed max-w-[280px]">
              This action is irreversible. All your profile data, dining stats, and credits will be
              erased immediately.
            </Text>

            {/* Losses Breakdown */}
            <View className="w-full mt-4 p-3 bg-white rounded-2xl border border-red-200/80 gap-1.5">
              <Text className="text-[11px] text-neutral-700">
                • <Text className="font-bold text-neutral-900">Active Queues: </Text>
                Instant spot forfeiture
              </Text>
              <Text className="text-[11px] text-neutral-700">
                • <Text className="font-bold text-neutral-900">Dine Wallet: </Text>
                ₹1,450 balance will be closed
              </Text>
              <Text className="text-[11px] text-neutral-700">
                • <Text className="font-bold text-neutral-900">Visit History: </Text>
                24 past dining receipts erased
              </Text>
            </View>
          </View>

          {/* Reason Selection */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-1">
              Why are you leaving? (Optional)
            </Text>
            <Text className="text-[11px] text-neutral-400 mb-3">
              Help us understand how we can improve QueueBite
            </Text>

            <View className="gap-2">
              {reasons.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <Pressable
                    key={reason}
                    onPress={() => setSelectedReason(reason)}
                    className={`p-3.5 rounded-2xl border flex-row items-center justify-between ${
                      isSelected
                        ? 'bg-neutral-900 border-neutral-900'
                        : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                    }`}>
                    <Text
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-white font-bold' : 'text-neutral-800'
                      }`}>
                      {reason}
                    </Text>
                    <View
                      className={`size-5 rounded-full items-center justify-center border ${
                        isSelected ? 'bg-white border-white' : 'border-neutral-300 bg-white'
                      }`}>
                      {isSelected && <CheckIcon size={12} color="#18181b" strokeWidth={3} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Confirmation Input Box */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-900 mb-1">Type DELETE to Confirm</Text>
            <Text className="text-[11px] text-neutral-400 mb-3">
              To prevent accidental deletion, type DELETE in capital letters below
            </Text>

            <TextInput
              value={confirmText}
              onChangeText={setConfirmText}
              placeholder="Type DELETE"
              placeholderTextColor="#a1a1aa"
              autoCapitalize="characters"
              className="h-12 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 text-sm font-bold text-neutral-900 tracking-wider text-center"
            />
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
            Keep My Account
          </Text>
        </Pressable>

        <Pressable
          onPress={handleDeleteAccount}
          disabled={!isConfirmed || isDeleting}
          className={`w-full h-12 rounded-2xl border items-center justify-center flex-row gap-2 ${
            isConfirmed
              ? 'bg-red-50 border-red-300 active:bg-red-100'
              : 'bg-neutral-100 border-neutral-200 opacity-40'
          }`}>
          <Trash2Icon size={16} color="#dc2626" />
          <Text className="text-xs font-bold text-[#dc2626]">
            {isDeleting ? 'Deleting Account...' : 'Permanently Delete Account'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

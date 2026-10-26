import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  ClockIcon,
  FileQuestionIcon,
  HeartHandshakeIcon,
  HelpCircleIcon,
  PhoneIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  Trash2Icon,
  XCircleIcon,
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

export default function OrderCancelOrIssueScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string }>();

  const orderId = params.orderId || 'QB-ORD-9281';
  const [activeTab, setActiveTab] = React.useState<'cancel' | 'issue'>('cancel');
  const [cancelReason, setCancelReason] = React.useState('Queue took longer than expected');
  const [issueType, setIssueType] = React.useState('Missing item from order');
  const [issueDescription, setIssueDescription] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const cancelReasons = [
    'Queue took longer than expected',
    'Change of dining plans',
    'Selected wrong dishes by mistake',
    'Party members could not make it',
    'Emergency departure',
  ];

  const issueTypes = [
    'Missing item from order',
    'Food arrived cold or delayed',
    'Allergy or dietary preparation error',
    'Incorrect portion or wrong dish',
    'Service / Host podium concern',
  ];

  function handleConfirmCancel() {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.replace({
        pathname: '/order/refund-status',
        params: {
          orderId,
          refundAmount: '1353',
          reason: cancelReason,
        },
      });
    }, 600);
  }

  function handleSubmitIssue() {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Issue Reported to Manager',
        'The restaurant floor manager and server desk have been alerted. A staff member is on the way to assist your table.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
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
              Order Assistance
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Order #{orderId}
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        {/* Tab Switcher: Cancel vs Issue */}
        <View className="px-5 pt-4">
          <View className="h-11 bg-neutral-100 p-1 rounded-2xl flex-row items-center mb-4">
            <Pressable
              onPress={() => setActiveTab('cancel')}
              className={`flex-1 h-full rounded-xl items-center justify-center ${
                activeTab === 'cancel' ? 'bg-white shadow-xs' : ''
              }`}>
              <Text
                className={`text-xs font-bold ${
                  activeTab === 'cancel' ? 'text-neutral-900' : 'text-neutral-500'
                }`}>
                Cancel Pre-Order
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('issue')}
              className={`flex-1 h-full rounded-xl items-center justify-center ${
                activeTab === 'issue' ? 'bg-white shadow-xs' : ''
              }`}>
              <Text
                className={`text-xs font-bold ${
                  activeTab === 'issue' ? 'text-neutral-900' : 'text-neutral-500'
                }`}>
                Report Dining Issue
              </Text>
            </Pressable>
          </View>

          {activeTab === 'cancel' ? (
            /* Cancel View */
            <>
              {/* Refund Eligibility Notice */}
              <View className="bg-emerald-50/80 border border-emerald-200/80 rounded-3xl p-5 mb-4 items-center">
                <View className="size-14 rounded-full bg-emerald-100 items-center justify-center mb-2">
                  <ShieldCheckIcon size={28} color="#059669" />
                </View>
                <Text className="text-base font-black text-emerald-950 text-center">
                  100% Instant Refund Eligible
                </Text>
                <Text className="text-xs text-emerald-800 text-center mt-1 leading-relaxed max-w-[280px]">
                  The kitchen has not started cooking your order yet. You will receive a full ₹1,353
                  refund directly to your Google Pay UPI account.
                </Text>
              </View>

              {/* Reasons */}
              <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
                <Text className="text-xs font-bold text-neutral-900 mb-1">
                  Reason for Cancellation
                </Text>
                <Text className="text-[11px] text-neutral-400 mb-3">
                  Please let us know why you are cancelling
                </Text>

                <View className="gap-2">
                  {cancelReasons.map((reason) => {
                    const isSelected = cancelReason === reason;
                    return (
                      <Pressable
                        key={reason}
                        onPress={() => setCancelReason(reason)}
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
            </>
          ) : (
            /* Issue View */
            <>
              <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
                <Text className="text-xs font-bold text-neutral-900 mb-1">
                  What went wrong?
                </Text>
                <Text className="text-[11px] text-neutral-400 mb-3">
                  Select the issue you experienced
                </Text>

                <View className="gap-2">
                  {issueTypes.map((type) => {
                    const isSelected = issueType === type;
                    return (
                      <Pressable
                        key={type}
                        onPress={() => setIssueType(type)}
                        className={`p-3.5 rounded-2xl border flex-row items-center justify-between ${
                          isSelected
                            ? 'bg-neutral-900 border-neutral-900'
                            : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                        }`}>
                        <Text
                          className={`text-xs font-semibold ${
                            isSelected ? 'text-white font-bold' : 'text-neutral-800'
                          }`}>
                          {type}
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

              <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
                <Text className="text-xs font-bold text-neutral-900 mb-1">
                  Details for Floor Manager
                </Text>
                <TextInput
                  value={issueDescription}
                  onChangeText={setIssueDescription}
                  placeholder="Explain briefly so staff can bring immediate resolution..."
                  placeholderTextColor="#a1a1aa"
                  multiline
                  numberOfLines={3}
                  style={{ textAlignVertical: 'top' }}
                  className="h-24 p-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs text-neutral-900 font-medium"
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        {activeTab === 'cancel' ? (
          <Pressable
            onPress={handleConfirmCancel}
            disabled={isSubmitting}
            className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center shadow-md shadow-red-500/25">
            <Text className="text-xs font-bold text-white tracking-wide">
              {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation & 100% Refund'}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleSubmitIssue}
            disabled={isSubmitting}
            className="w-full h-12 rounded-2xl bg-neutral-900 active:bg-neutral-800 items-center justify-center shadow-md">
            <Text className="text-xs font-bold text-white tracking-wide">
              {isSubmitting ? 'Submitting...' : 'Alert Floor Manager'}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

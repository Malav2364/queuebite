import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  CheckIcon,
  CreditCardIcon,
  LockIcon,
  PlusIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  UsersIcon,
  UtensilsCrossedIcon,
  WalletIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PaymentMethodScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ amount?: string }>();

  const totalAmount = parseInt(params.amount || '1353', 10);
  const [selectedMethod, setSelectedMethod] = React.useState<string>('upi_gpay');
  const [splitBill, setSplitBill] = React.useState<boolean>(false);
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);

  const perPersonAmount = Math.round(totalAmount / 2);

  function handlePay() {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Route to Payment Status (Success)
      router.replace({
        pathname: '/order/payment-status',
        params: {
          status: 'success',
          amount: (splitBill ? perPersonAmount : totalAmount).toString(),
          method: selectedMethod,
        },
      });
    }, 800);
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
              Payment Method
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Amount: ₹{splitBill ? perPersonAmount : totalAmount}
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        <View className="px-5 pt-4">
          {/* Bill Split Toggle Card */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4 flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <View className="flex-row items-center gap-1.5">
                <UsersIcon size={14} color="#dc2626" />
                <Text className="text-xs font-bold text-neutral-900">
                  Split Bill with Party (2 Diners)
                </Text>
              </View>
              <Text className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                Pay only your share now (₹{perPersonAmount}); a payment link is pinged to your partner
              </Text>
            </View>

            <Switch
              value={splitBill}
              onValueChange={setSplitBill}
              trackColor={{ false: '#e4e4e7', true: '#dc2626' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Section 1: UPI Options */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <SmartphoneIcon size={16} color="#dc2626" />
                <Text className="text-xs font-bold text-neutral-900">UPI Applications</Text>
              </View>
              <View className="px-2 py-0.5 rounded-full bg-emerald-50">
                <Text className="text-[9px] font-bold text-emerald-700">Zero Fee</Text>
              </View>
            </View>

            <View className="gap-2">
              {[
                { id: 'upi_gpay', name: 'Google Pay', subtitle: 'Fastest checkout' },
                { id: 'upi_phonepe', name: 'PhonePe', subtitle: 'Instant UPI pin' },
                { id: 'upi_paytm', name: 'Paytm UPI', subtitle: 'Pay via Paytm wallet or bank' },
              ].map((opt) => {
                const isSelected = selectedMethod === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setSelectedMethod(opt.id)}
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
                        {opt.name}
                      </Text>
                      <Text className="text-[10px] text-neutral-400 mt-0.5">{opt.subtitle}</Text>
                    </View>

                    <View
                      className={`size-5 rounded-full items-center justify-center border ${
                        isSelected ? 'bg-[#dc2626] border-[#dc2626]' : 'border-neutral-300 bg-white'
                      }`}>
                      {isSelected && <CheckIcon size={12} color="#ffffff" strokeWidth={3} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Section 2: Cards */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center gap-2 mb-3">
              <CreditCardIcon size={16} color="#dc2626" />
              <Text className="text-xs font-bold text-neutral-900">Credit / Debit Cards</Text>
            </View>

            <Pressable
              onPress={() => setSelectedMethod('card_hdfc')}
              className={`p-3.5 rounded-2xl border flex-row items-center justify-between ${
                selectedMethod === 'card_hdfc'
                  ? 'bg-red-50/70 border-[#dc2626]'
                  : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
              }`}>
              <View>
                <Text
                  className={`text-xs font-bold ${
                    selectedMethod === 'card_hdfc' ? 'text-[#dc2626]' : 'text-neutral-900'
                  }`}>
                  HDFC Visa Platinum ending in 4102
                </Text>
                <Text className="text-[10px] text-neutral-400 mt-0.5">Exp 08/28 • Malav Patel</Text>
              </View>

              <View
                className={`size-5 rounded-full items-center justify-center border ${
                  selectedMethod === 'card_hdfc'
                    ? 'bg-[#dc2626] border-[#dc2626]'
                    : 'border-neutral-300 bg-white'
                }`}>
                {selectedMethod === 'card_hdfc' && (
                  <CheckIcon size={12} color="#ffffff" strokeWidth={3} />
                )}
              </View>
            </Pressable>
          </View>

          {/* Section 3: QueueBite Dine Wallet */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Pressable
              onPress={() => setSelectedMethod('wallet')}
              className={`p-3.5 rounded-2xl border flex-row items-center justify-between ${
                selectedMethod === 'wallet'
                  ? 'bg-red-50/70 border-[#dc2626]'
                  : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
              }`}>
              <View className="flex-row items-center gap-3">
                <View className="size-10 rounded-2xl bg-red-100 items-center justify-center">
                  <WalletIcon size={18} color="#dc2626" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-neutral-900">QueueBite Dine Wallet</Text>
                  <Text className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    Available Balance: ₹1,450
                  </Text>
                </View>
              </View>

              <View
                className={`size-5 rounded-full items-center justify-center border ${
                  selectedMethod === 'wallet'
                    ? 'bg-[#dc2626] border-[#dc2626]'
                    : 'border-neutral-300 bg-white'
                }`}>
                {selectedMethod === 'wallet' && (
                  <CheckIcon size={12} color="#ffffff" strokeWidth={3} />
                )}
              </View>
            </Pressable>
          </View>

          {/* Section 4: Pay at Table */}
          <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Pressable
              onPress={() => setSelectedMethod('table_pay')}
              className={`p-3.5 rounded-2xl border flex-row items-center justify-between ${
                selectedMethod === 'table_pay'
                  ? 'bg-red-50/70 border-[#dc2626]'
                  : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
              }`}>
              <View className="flex-row items-center gap-3">
                <View className="size-10 rounded-2xl bg-amber-100 items-center justify-center">
                  <UtensilsCrossedIcon size={18} color="#b45309" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-neutral-900">
                    Pay at Table (Post-Meal)
                  </Text>
                  <Text className="text-[10px] text-neutral-500 mt-0.5">
                    Charge added to your final restaurant dining bill
                  </Text>
                </View>
              </View>

              <View
                className={`size-5 rounded-full items-center justify-center border ${
                  selectedMethod === 'table_pay'
                    ? 'bg-[#dc2626] border-[#dc2626]'
                    : 'border-neutral-300 bg-white'
                }`}>
                {selectedMethod === 'table_pay' && (
                  <CheckIcon size={12} color="#ffffff" strokeWidth={3} />
                )}
              </View>
            </Pressable>
          </View>

          {/* Security Encrypted Notice */}
          <View className="flex-row items-center justify-center gap-1.5 my-2">
            <LockIcon size={12} color="#71717a" />
            <Text className="text-[10px] text-neutral-500 font-semibold">
              256-bit SSL encrypted • RBI regulated payment gateway
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Pressable
          onPress={handlePay}
          disabled={isProcessing}
          className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center shadow-md shadow-red-500/25">
          <Text className="text-xs font-bold text-white tracking-wide">
            {isProcessing
              ? 'Processing Payment...'
              : `Pay ₹${splitBill ? perPersonAmount : totalAmount} Securely`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

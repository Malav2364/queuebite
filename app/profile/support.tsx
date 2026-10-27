import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  HeadphonesIcon,
  HelpCircleIcon,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
  SearchIcon,
  SparklesIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HelpAndSupportScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedFaq, setExpandedFaq] = React.useState<string | null>('faq-1');

  const faqs = [
    {
      id: 'faq-1',
      question: 'How does live queue estimation work?',
      answer:
        'QueueBite calculates wait times using real-time table turnover data from the host desk, party size matching, and historic dining durations. We update your estimated seating countdown continuously.',
    },
    {
      id: 'faq-2',
      question: 'What happens if I arrive after the 10-minute hold window?',
      answer:
        'If the 10-minute table ready countdown expires, the table is offered to the next waiting diner to maintain fairness. You can request a 5-minute grace extension in the app or rejoin with priority spot placement.',
    },
    {
      id: 'faq-3',
      question: 'How do pre-order food cancellations & refunds work?',
      answer:
        'You can cancel your pre-ordered food anytime with a 100% instant refund before the kitchen begins cooking at Spot #1. Refunds are credited back to your original UPI or card immediately.',
    },
    {
      id: 'faq-4',
      question: 'How do I invite friends to my dining group?',
      answer:
        'Tap Group Dining -> Invite Friends to share your unique 6-character code (e.g. QB-8842) via WhatsApp or let friends scan your screen QR code. Everyone syncs to the same waitlist token.',
    },
    {
      id: 'faq-5',
      question: 'What if the restaurant host skips my queue token?',
      answer:
        'Show your digital boarding pass on the Queue Details screen to the host podium. If there is an unexpected discrepancy, tap "Report Dining Issue" to alert the floor manager immediately.',
    },
  ];

  function toggleFaq(id: string) {
    setExpandedFaq((prev) => (prev === id ? null : id));
  }

  function handleCall() {
    Linking.openURL('tel:18002664321').catch(() => {
      Alert.alert('Helpline', 'Call QueueBite Support at 1800-266-4321');
    });
  }

  function handleEmail() {
    Linking.openURL('mailto:support@queuebite.com').catch(() => {
      Alert.alert('Email Support', 'Contact us at support@queuebite.com');
    });
  }

  function handleLiveChat() {
    Alert.alert(
      'Live Chat Support',
      'Connecting you to QueueBite Diner Support agent... Estimated response time: 2 mins.'
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
              Help & Support
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              24/7 diner assistance
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        <View className="px-5 pt-4">
          {/* Support Channels Card */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
              Direct Contact Channels
            </Text>

            <View className="flex-row gap-2.5">
              <Pressable
                onPress={handleLiveChat}
                className="flex-1 p-3.5 rounded-2xl bg-red-50 border border-red-200/80 items-center justify-center active:bg-red-100">
                <MessageCircleIcon size={20} color="#dc2626" />
                <Text className="text-xs font-bold text-[#dc2626] mt-1.5">Live Chat</Text>
                <Text className="text-[9px] text-neutral-400 mt-0.5">~2 min response</Text>
              </Pressable>

              <Pressable
                onPress={handleCall}
                className="flex-1 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 items-center justify-center active:bg-neutral-100">
                <PhoneIcon size={20} color="#18181b" />
                <Text className="text-xs font-bold text-neutral-900 mt-1.5">Call Us</Text>
                <Text className="text-[9px] text-neutral-400 mt-0.5">Toll-free 24/7</Text>
              </Pressable>

              <Pressable
                onPress={handleEmail}
                className="flex-1 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 items-center justify-center active:bg-neutral-100">
                <MailIcon size={20} color="#18181b" />
                <Text className="text-xs font-bold text-neutral-900 mt-1.5">Email</Text>
                <Text className="text-[9px] text-neutral-400 mt-0.5">Quick reply</Text>
              </Pressable>
            </View>
          </View>

          {/* Search FAQ */}
          <View className="h-11 bg-white rounded-2xl border border-neutral-200/80 px-3.5 flex-row items-center gap-2.5 shadow-sm mb-4">
            <SearchIcon size={16} color="#71717a" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search help topics or questions..."
              placeholderTextColor="#a1a1aa"
              className="flex-1 text-xs text-neutral-900 font-medium h-full"
            />
          </View>

          {/* FAQ Accordion List */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-6">
            <Text className="text-xs font-bold text-neutral-900 mb-3">
              Frequently Asked Questions
            </Text>

            <View className="gap-2.5">
              {faqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <View
                    key={faq.id}
                    className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60 overflow-hidden">
                    <Pressable
                      onPress={() => toggleFaq(faq.id)}
                      className="flex-row items-center justify-between">
                      <Text
                        className={`text-xs font-bold flex-1 pr-2 ${
                          isExpanded ? 'text-[#dc2626]' : 'text-neutral-900'
                        }`}>
                        {faq.question}
                      </Text>
                      {isExpanded ? (
                        <ChevronUpIcon size={16} color="#dc2626" />
                      ) : (
                        <ChevronDownIcon size={16} color="#71717a" />
                      )}
                    </Pressable>

                    {isExpanded && (
                      <Text className="text-xs text-neutral-600 mt-2.5 pt-2 border-t border-neutral-200/60 leading-relaxed">
                        {faq.answer}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BellIcon,
  BellOffIcon,
  CheckCheckIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ClockIcon,
  SparklesIcon,
  Trash2Icon,
  UtensilsCrossedIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface NotificationItem {
  id: string;
  type: 'table_ready' | 'nearly_up' | 'position_update' | 'queue_joined' | 'promo';
  title: string;
  body: string;
  time: string;
  read: boolean;
  route: string;
  actionLabel: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'table_ready',
    title: 'Table Ready! Claim Now',
    body: 'Your table at The Daily Bean is prepared. Token #A12. 10-minute hold window started.',
    time: '2 mins ago',
    read: false,
    route: '/restaurant/table-ready',
    actionLabel: 'View Table Pass',
  },
  {
    id: 'notif-2',
    type: 'nearly_up',
    title: "You're Nearly Up (Spot #1)",
    body: 'Only 1 party ahead of you at The Daily Bean. Table is being cleared & sanitized.',
    time: '8 mins ago',
    read: false,
    route: '/queue/nearly-up',
    actionLabel: 'Check In',
  },
  {
    id: 'notif-3',
    type: 'position_update',
    title: 'Advanced to Spot #5',
    body: 'You moved up 3 spots in the waitlist! Estimated seating in ~12 mins.',
    time: '15 mins ago',
    read: false,
    route: '/queue/overview',
    actionLabel: 'View Queue',
  },
  {
    id: 'notif-4',
    type: 'queue_joined',
    title: 'Waitlist Confirmed (Token #A12)',
    body: 'Party of 2 confirmed at The Daily Bean. Special requests attached.',
    time: '24 mins ago',
    read: true,
    route: '/queue/overview',
    actionLabel: 'Manage Queue',
  },
  {
    id: 'notif-5',
    type: 'promo',
    title: 'Zero Wait Times Tonight',
    body: 'Peshawri Royal and Saffron Courtyard have immediate walk-in seating available right now.',
    time: '2 hours ago',
    read: true,
    route: '/trending',
    actionLabel: 'See Places',
  },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [notifications, setNotifications] =
    React.useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = React.useState<'all' | 'alerts' | 'updates'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function clearAll() {
    Alert.alert('Clear All Notifications', 'Are you sure you want to delete all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => setNotifications([]) },
    ]);
  }

  function handleNotificationPress(item: NotificationItem) {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    router.push(item.route as any);
  }

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'alerts') {
      return item.type === 'table_ready' || item.type === 'nearly_up';
    }
    if (filter === 'updates') {
      return item.type === 'position_update' || item.type === 'queue_joined' || item.type === 'promo';
    }
    return true;
  });

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
            <View className="flex-row items-center gap-2">
              <Text className="text-xl font-black text-neutral-900 tracking-tight">
                Notifications
              </Text>
              {unreadCount > 0 && (
                <View className="px-2 py-0.5 rounded-full bg-[#dc2626]">
                  <Text className="text-[10px] font-black text-white">{unreadCount} New</Text>
                </View>
              )}
            </View>
            <Text className="text-xs text-neutral-500 font-medium">
              Queue alerts & live updates
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          {unreadCount > 0 && (
            <Pressable
              onPress={markAllAsRead}
              className="size-9 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <CheckCheckIcon size={16} color="#18181b" />
            </Pressable>
          )}
          <BrandLogo size="sm" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        {/* Filter Pills */}
        <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
          <View className="flex-row gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'alerts', label: 'Queue Alerts' },
              { id: 'updates', label: 'Updates' },
            ].map((tab) => {
              const isSelected = filter === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full border ${
                    isSelected
                      ? 'bg-neutral-900 border-neutral-900'
                      : 'bg-white border-neutral-200/80 active:bg-neutral-50'
                  }`}>
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-neutral-600'
                    }`}>
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {notifications.length > 0 && (
            <Pressable
              onPress={clearAll}
              className="flex-row items-center gap-1 active:opacity-60">
              <Trash2Icon size={12} color="#71717a" />
              <Text className="text-[11px] font-bold text-neutral-500">Clear</Text>
            </Pressable>
          )}
        </View>

        {/* Notifications List */}
        <View className="px-5 pt-2">
          {filteredNotifications.length === 0 ? (
            /* Empty State */
            <View className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm items-center my-6">
              <View className="size-16 rounded-full bg-neutral-100 items-center justify-center mb-3">
                <BellOffIcon size={28} color="#71717a" />
              </View>
              <Text className="text-base font-bold text-neutral-900 text-center">
                All Caught Up!
              </Text>
              <Text className="text-xs text-neutral-500 text-center mt-1 max-w-[240px]">
                You have no unread queue alerts or notifications right now.
              </Text>
              <Pressable
                onPress={() => router.push('/explore')}
                className="mt-5 px-5 py-2.5 rounded-xl bg-[#dc2626] active:bg-[#b91c1c]">
                <Text className="text-xs font-bold text-white">Find a Restaurant</Text>
              </Pressable>
            </View>
          ) : (
            filteredNotifications.map((item) => {
              const isAlert = item.type === 'table_ready' || item.type === 'nearly_up';

              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleNotificationPress(item)}
                  className={`rounded-3xl p-4 border mb-3 active:opacity-90 ${
                    !item.read
                      ? isAlert
                        ? 'bg-red-50/50 border-red-200 shadow-sm'
                        : 'bg-white border-neutral-300 shadow-sm'
                      : 'bg-white border-neutral-100'
                  }`}>
                  <View className="flex-row items-start gap-3">
                    {/* Notification Type Icon */}
                    <View
                      className={`size-10 rounded-2xl items-center justify-center ${
                        item.type === 'table_ready'
                          ? 'bg-red-100'
                          : item.type === 'nearly_up'
                          ? 'bg-orange-100'
                          : item.type === 'position_update'
                          ? 'bg-emerald-100'
                          : 'bg-neutral-100'
                      }`}>
                      {item.type === 'table_ready' && <UtensilsCrossedIcon size={18} color="#dc2626" />}
                      {item.type === 'nearly_up' && <ClockIcon size={18} color="#ea580c" />}
                      {item.type === 'position_update' && <CheckCircle2Icon size={18} color="#059669" />}
                      {item.type === 'queue_joined' && <BellIcon size={18} color="#18181b" />}
                      {item.type === 'promo' && <SparklesIcon size={18} color="#b45309" />}
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text
                          className={`text-xs font-bold ${
                            !item.read ? 'text-neutral-900' : 'text-neutral-700'
                          }`}>
                          {item.title}
                        </Text>
                        <Text className="text-[10px] text-neutral-400">{item.time}</Text>
                      </View>

                      <Text className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        {item.body}
                      </Text>

                      {/* Action Pill */}
                      <View className="flex-row items-center justify-between mt-3 pt-2 border-t border-neutral-100">
                        <View className="flex-row items-center gap-1">
                          <Text className="text-[11px] font-bold text-[#dc2626]">
                            {item.actionLabel}
                          </Text>
                          <ChevronRightIcon size={12} color="#dc2626" />
                        </View>

                        {!item.read && (
                          <View className="size-2 rounded-full bg-[#dc2626]" />
                        )}
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

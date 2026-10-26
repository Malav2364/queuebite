import { LiveQueueTrackingView } from '@/components/live-queue-tracking-view';
import { Text } from '@/components/ui/text';
import { ClockIcon, UsersIcon, XIcon } from 'lucide-react-native';
import * as React from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  View,
} from 'react-native';

interface FloatingQueueWidgetProps {
  restaurantName?: string;
  queueNumber?: string;
  position?: number;
  waitRange?: string;
  restaurantId?: string;
  visible?: boolean;
}

export function FloatingQueueWidget({
  restaurantName = 'The Daily Bean',
  queueNumber = 'A12',
  position = 5,
  waitRange = '15–25m',
  restaurantId = 'pop-1',
  visible = true,
}: FloatingQueueWidgetProps) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isDismissed, setIsDismissed] = React.useState(false);

  // Pulse animation for live badge
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  if (!visible || isDismissed) return null;

  return (
    <>
      {/* Floating Mini Widget */}
      <View
        className="absolute bottom-20 right-4 z-50 shadow-2xl"
        pointerEvents="box-none">
        <Pressable
          onPress={() => setModalVisible(true)}
          className="bg-neutral-950/95 active:scale-95 rounded-full pl-3.5 pr-4 py-2.5 flex-row items-center gap-3 border border-neutral-700/80 shadow-lg shadow-black/40">
          {/* Animated Pulsing Queue Badge */}
          <Animated.View
            style={{ transform: [{ scale: pulseAnim }] }}
            className="size-7 rounded-full bg-[#dc2626] items-center justify-center border-2 border-white/80 shadow-xs">
            <Text className="text-[11px] font-extrabold text-white">
              #{position}
            </Text>
          </Animated.View>

          {/* Details */}
          <View>
            <View className="flex-row items-center gap-1.5">
              <View className="size-1.5 rounded-full bg-emerald-400" />
              <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
                Live Queue • {queueNumber}
              </Text>
            </View>
            <Text
              className="text-xs font-bold text-neutral-200 mt-0.5"
              numberOfLines={1}>
              {restaurantName} • {waitRange}
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Live Queue Tracking Pop-up Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-white">
          <LiveQueueTrackingView
            onClose={() => setModalVisible(false)}
            isModal={true}
            restaurantId={restaurantId}
          />
        </View>
      </Modal>
    </>
  );
}

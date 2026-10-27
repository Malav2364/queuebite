import { LiveQueueTrackingView } from '@/components/live-queue-tracking-view';
import { Text } from '@/components/ui/text';
import {
  ChevronRightIcon,
  ClockIcon,
  Maximize2Icon,
  Minimize2Icon,
  SparklesIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Animated,
  Easing,
  Modal,
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
  bottomOffset?: number;
  progressPercent?: number; // 0 - 100
  initialMode?: 'stacked' | 'circular';
}

export function FloatingQueueWidget({
  restaurantName = 'The Daily Bean',
  queueNumber = 'A12',
  position = 5,
  waitRange = '15–25m',
  restaurantId = 'pop-1',
  visible = true,
  bottomOffset = 68,
  progressPercent = 65,
  initialMode = 'stacked',
}: FloatingQueueWidgetProps) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isDismissed, setIsDismissed] = React.useState(false);
  const [mode, setMode] = React.useState<'stacked' | 'circular'>(initialMode);

  // Pulse animation for live badge & progress glow
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  // Animated progress width
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Pulse animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.18,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // Progress bar fill animation
    Animated.timing(progressAnim, {
      toValue: progressPercent,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => {
      pulseLoop.stop();
    };
  }, [pulseAnim, progressAnim, progressPercent]);

  if (!visible || isDismissed) return null;

  return (
    <>
      {mode === 'stacked' ? (
        /* ============================================================ */
        /* SWIGGY / ZOMATO STYLE STACKED TAB ABOVE NAVBAR              */
        /* ============================================================ */
        <View
          style={{ bottom: bottomOffset }}
          className="absolute left-3 right-3 z-50 shadow-2xl"
          pointerEvents="box-none">
          <View className="bg-neutral-950/95 rounded-2xl border border-neutral-800 shadow-xl shadow-black/50 overflow-hidden">
            {/* Top Progress Bar running along the upper border */}
            <View className="h-1 bg-neutral-800 w-full overflow-hidden">
              <Animated.View
                style={{
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </View>

            {/* Main Interactive Row */}
            <Pressable
              onPress={() => setModalVisible(true)}
              className="flex-row items-center px-3.5 py-2.5 active:opacity-90">
              {/* Left Circular Badge */}
              <View className="relative mr-3">
                <Animated.View
                  style={{ transform: [{ scale: pulseAnim }] }}
                  className="size-8 rounded-full bg-[#dc2626] items-center justify-center border-2 border-white/20 shadow-sm">
                  <Text className="text-[11px] font-bold text-white">
                    #{position}
                  </Text>
                </Animated.View>
                <View className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 border border-neutral-950" />
              </View>

              {/* Center Info: Swiggy/Zomato style 2-line live tracker */}
              <View className="flex-1 mr-2">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-[12px] font-bold text-white tracking-tight">
                    In Queue • Token {queueNumber}
                  </Text>
                  <View className="bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    <Text className="text-[9px] font-bold text-emerald-400">
                      {waitRange}
                    </Text>
                  </View>
                </View>
                <Text
                  className="text-[11px] font-medium text-neutral-300 mt-0.5"
                  numberOfLines={1}>
                  {restaurantName} • {position} parties ahead
                </Text>
              </View>

              {/* Right Action: Track CTA + Circular mode toggle */}
              <View className="flex-row items-center gap-1.5">
                <View className="bg-emerald-500 px-2.5 py-1.5 rounded-xl flex-row items-center gap-1 shadow-sm shadow-emerald-500/30">
                  <Text className="text-[11px] font-bold text-neutral-950">
                    Track
                  </Text>
                  <ChevronRightIcon size={12} color="#0a0a0a" strokeWidth={3} />
                </View>

                {/* Minimize to circular button */}
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    setMode('circular');
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  className="size-7 rounded-full bg-neutral-800/80 items-center justify-center active:bg-neutral-700 ml-1">
                  <Minimize2Icon size={12} color="#a1a1aa" />
                </Pressable>
              </View>
            </Pressable>
          </View>
        </View>
      ) : (
        /* ============================================================ */
        /* COMPACT CIRCULAR MODE (Alternate clean circular puck)        */
        /* ============================================================ */
        <View
          style={{ bottom: bottomOffset + 6 }}
          className="absolute right-4 z-50 shadow-2xl"
          pointerEvents="box-none">
          <Pressable
            onPress={() => setModalVisible(true)}
            className="size-14 rounded-full bg-neutral-950/95 active:scale-95 items-center justify-center border-2 border-emerald-500 shadow-xl shadow-black/50 relative">
            {/* Pulsing Outer Badge */}
            <Animated.View
              style={{ transform: [{ scale: pulseAnim }] }}
              className="size-10 rounded-full bg-[#dc2626] items-center justify-center shadow-xs">
              <Text className="text-[12px] font-bold text-white">
                #{position}
              </Text>
            </Animated.View>

            {/* Live Indicator Dot */}
            <View className="absolute top-1 right-1 size-3 rounded-full bg-emerald-400 border-2 border-neutral-950" />

            {/* Expand back to stacked bar hint */}
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                setMode('stacked');
              }}
              className="absolute -bottom-1 -left-1 size-5 rounded-full bg-neutral-800 items-center justify-center border border-neutral-700">
              <Maximize2Icon size={9} color="#ffffff" />
            </Pressable>
          </Pressable>
        </View>
      )}

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

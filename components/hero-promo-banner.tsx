import { Text } from '@/components/ui/text';
import { ArrowRightIcon } from 'lucide-react-native';
import * as React from 'react';
import { Image, Pressable, View } from 'react-native';

interface HeroPromoBannerProps {
  onExplorePress: () => void;
}

export function HeroPromoBanner({ onExplorePress }: HeroPromoBannerProps) {
  const [activePage, setActivePage] = React.useState(0);

  return (
    <View className="px-5 pt-1 pb-3">
      {/* Banner Card */}
      <View className="relative bg-[#fef4ec] rounded-3xl p-5 overflow-hidden border border-[#fae2d0] shadow-xs">
        <View className="flex-row items-center justify-between">
          {/* Left Text Content */}
          <View className="flex-1 pr-2 z-10">
            <Text className="text-[11px] font-extrabold text-[#c2410c] uppercase tracking-wider mb-1">
              SKIP THE WAIT
            </Text>

            <Text className="text-[22px] font-extrabold text-neutral-900 leading-[26px]">
              Good Food
            </Text>
            <Text className="text-[22px] font-extrabold text-[#dc2626] leading-[26px]">
              Without the Queue
            </Text>

            <Text className="text-xs text-neutral-600 mt-2 mb-4 leading-[16px] max-w-[190px]">
              Check live queues, join remotely and get notified when it&apos;s your turn.
            </Text>

            <Pressable
              onPress={onExplorePress}
              className="flex-row items-center justify-center gap-1.5 bg-[#dc2626] active:bg-[#b91c1c] self-start px-4 py-2.5 rounded-full shadow-sm">
              <Text className="text-xs font-bold text-white">
                Explore Nearby
              </Text>
              <ArrowRightIcon size={14} color="#ffffff" />
            </Pressable>
          </View>

          {/* Right Image Content: Gourmet Pasta Dish */}
          <View className="size-36 rounded-full overflow-hidden shadow-md border-2 border-white/80">
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?q=80&w=600&auto=format&fit=crop',
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      {/* Pagination Indicator Dots */}
      <View className="flex-row items-center justify-center gap-1.5 mt-2.5">
        <View className="w-5 h-2 rounded-full bg-[#dc2626]" />
        <View className="size-2 rounded-full bg-neutral-300" />
        <View className="size-2 rounded-full bg-neutral-300" />
        <View className="size-2 rounded-full bg-neutral-300" />
      </View>
    </View>
  );
}

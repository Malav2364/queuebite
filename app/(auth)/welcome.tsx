import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRightIcon } from 'lucide-react-native';
import * as React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Background Image Container */}
      <View className="flex-1 relative">
        <ImageBackground
          source={require('@/assets/images/get_started.png')}
          resizeMode="cover"
          className="flex-1">
          {/* Top Bar with Logo on Top Left and Skip on Top Right */}
          <View
            style={{
              paddingTop: Math.max(insets.top, 20) + 8,
              paddingHorizontal: 20,
            }}
            className="flex-row items-center justify-between z-20">
            {/* QueueBite Logo */}
            <Image
              source={require('@/assets/images/queuebite-logo.png')}
              style={{ width: 200, height: 50 }}
              resizeMode="contain"
              alt="QueueBite"
            />

            {/* Skip Button */}
            <Pressable
              onPress={() => router.push('/(auth)/sign-in')}
              className="bg-white/90 active:bg-white px-4 py-1.5 rounded-full shadow-sm shadow-black/10 border border-black/5">
              <Text className="text-xs font-semibold text-neutral-800">Skip</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>

      {/* Bottom Sheet Card */}
      <View
        style={{
          paddingBottom: Math.max(insets.bottom, 10) + 12,
        }}
        className="bg-[#faf7f2] px-6 pt-6 rounded-t-3xl shadow-xl shadow-black/10">
        <Text className="text-2xl font-bold tracking-tight text-neutral-900 mb-5">
          Get started with QueueBite
        </Text>

        {/* Continue Button */}
        <Pressable
          onPress={() => router.push('/(auth)/sign-in')}
          className="w-full bg-[#d94148] active:bg-[#0a663a] h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm">
          <Text className="text-white text-base font-semibold">Continue</Text>
          <ArrowRightIcon color="white" size={18} />
        </Pressable>
      </View>
    </View>
  );
}

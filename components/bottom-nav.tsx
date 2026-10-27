import { Text } from '@/components/ui/text';
import {
  HeartIcon,
  HomeIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

export type TabKey =
  | 'HOME'
  | 'EXPLORE'
  | 'MY_QUEUE'
  | 'SAVED'
  | 'PROFILE'
  | 'MAP'
  | 'JOIN_QUEUE';

interface BottomNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  hasActiveQueue?: boolean;
}

export function BottomNav({
  activeTab,
  onTabChange,
  hasActiveQueue = false,
}: BottomNavProps) {
  return (
    <View className="bg-white border-t border-neutral-100 px-3 pt-2 pb-6 shadow-xl shadow-black/10">
      <View className="flex-row items-center justify-around">
        {/* 1. Home Tab */}
        <Pressable
          onPress={() => onTabChange('HOME')}
          className="items-center justify-center py-1 flex-1 active:opacity-70">
          <HomeIcon
            size={22}
            color={activeTab === 'HOME' ? '#dc2626' : '#71717a'}
          />
          <Text
            className={`text-[10px] mt-1 font-semibold ${
              activeTab === 'HOME' ? 'text-[#dc2626]' : 'text-neutral-500'
            }`}>
            Home
          </Text>
        </Pressable>

        {/* 2. Explore Tab */}
        <Pressable
          onPress={() => onTabChange('EXPLORE')}
          className="items-center justify-center py-1 flex-1 active:opacity-70">
          <SearchIcon
            size={22}
            color={activeTab === 'EXPLORE' ? '#dc2626' : '#71717a'}
          />
          <Text
            className={`text-[10px] mt-1 font-semibold ${
              activeTab === 'EXPLORE' ? 'text-[#dc2626]' : 'text-neutral-500'
            }`}>
            Explore
          </Text>
        </Pressable>

        {/* 3. My Queue Tab */}
        <Pressable
          onPress={() => onTabChange('MY_QUEUE')}
          className="items-center justify-center py-1 flex-1 active:opacity-70">
          <View className="relative">
            <UsersIcon
              size={22}
              color={activeTab === 'MY_QUEUE' ? '#dc2626' : '#71717a'}
            />
            {hasActiveQueue && (
              <View className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-500 border border-white" />
            )}
          </View>
          <Text
            className={`text-[10px] mt-1 font-semibold ${
              activeTab === 'MY_QUEUE' ? 'text-[#dc2626]' : 'text-neutral-500'
            }`}>
            My Queue
          </Text>
        </Pressable>

        {/* 4. Saved Tab */}
        <Pressable
          onPress={() => onTabChange('SAVED')}
          className="items-center justify-center py-1 flex-1 active:opacity-70">
          <HeartIcon
            size={22}
            color={activeTab === 'SAVED' ? '#dc2626' : '#71717a'}
          />
          <Text
            className={`text-[10px] mt-1 font-semibold ${
              activeTab === 'SAVED' ? 'text-[#dc2626]' : 'text-neutral-500'
            }`}>
            Saved
          </Text>
        </Pressable>

        {/* 5. Profile Tab */}
        <Pressable
          onPress={() => onTabChange('PROFILE')}
          className="items-center justify-center py-1 flex-1 active:opacity-70">
          <UserIcon
            size={22}
            color={activeTab === 'PROFILE' ? '#dc2626' : '#71717a'}
          />
          <Text
            className={`text-[10px] mt-1 font-semibold ${
              activeTab === 'PROFILE' ? 'text-[#dc2626]' : 'text-neutral-500'
            }`}>
            Profile
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

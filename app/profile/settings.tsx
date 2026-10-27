import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CheckIcon,
  GlobeIcon,
  HardDriveIcon,
  InfoIcon,
  MoonIcon,
  RulerIcon,
  SmartphoneIcon,
  SparklesIcon,
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

export default function AppSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [theme, setTheme] = React.useState<'system' | 'light' | 'dark'>('system');
  const [language, setLanguage] = React.useState('English');
  const [distanceUnit, setDistanceUnit] = React.useState<'km' | 'mi'>('km');
  const [cacheSize, setCacheSize] = React.useState('42.8 MB');

  function handleClearCache() {
    Alert.alert('Clear Cache', 'Clear temporary offline map tiles and cached restaurant photos?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          setCacheSize('0 KB');
          Alert.alert('Cache Cleared', 'Freed 42.8 MB of device storage.');
        },
      },
    ]);
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
              App Settings
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Theme, language & storage
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        <View className="px-5 pt-4">
          {/* Theme Preference */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center gap-2 mb-1">
              <MoonIcon size={16} color="#18181b" />
              <Text className="text-xs font-bold text-neutral-900">Theme Appearance</Text>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Choose how QueueBite looks on your device
            </Text>

            <View className="flex-row gap-2">
              {[
                { id: 'system', label: 'System' },
                { id: 'light', label: 'Light' },
                { id: 'dark', label: 'Dark' },
              ].map((t) => {
                const isSelected = theme === t.id;
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => setTheme(t.id as any)}
                    className={`flex-1 py-2.5 rounded-2xl border items-center justify-center ${
                      isSelected
                        ? 'bg-neutral-900 border-neutral-900'
                        : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                    }`}>
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? 'text-white' : 'text-neutral-700'
                      }`}>
                      {t.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Language Preference */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center gap-2 mb-1">
              <GlobeIcon size={16} color="#18181b" />
              <Text className="text-xs font-bold text-neutral-900">App Language</Text>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Select your preferred display language
            </Text>

            <View className="gap-2">
              {['English', 'Hindi (हिंदी)', 'Gujarati (ગુજરાતી)'].map((lang) => {
                const isSelected = language.startsWith(lang.split(' ')[0]);
                return (
                  <Pressable
                    key={lang}
                    onPress={() => setLanguage(lang)}
                    className={`p-3 rounded-2xl border flex-row items-center justify-between ${
                      isSelected
                        ? 'bg-red-50/70 border-[#dc2626]'
                        : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                    }`}>
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? 'text-[#dc2626]' : 'text-neutral-800'
                      }`}>
                      {lang}
                    </Text>
                    {isSelected && <CheckIcon size={12} color="#dc2626" strokeWidth={3} />}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Distance Units */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-bold text-neutral-900">Distance Units</Text>
                <Text className="text-[11px] text-neutral-500 mt-0.5">
                  Used for restaurant distance & walking times
                </Text>
              </View>

              <View className="flex-row gap-1 bg-neutral-100 p-1 rounded-xl">
                <Pressable
                  onPress={() => setDistanceUnit('km')}
                  className={`px-3 py-1 rounded-lg ${
                    distanceUnit === 'km' ? 'bg-white shadow-xs' : ''
                  }`}>
                  <Text
                    className={`text-xs font-bold ${
                      distanceUnit === 'km' ? 'text-neutral-900' : 'text-neutral-500'
                    }`}>
                    KM
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setDistanceUnit('mi')}
                  className={`px-3 py-1 rounded-lg ${
                    distanceUnit === 'mi' ? 'bg-white shadow-xs' : ''
                  }`}>
                  <Text
                    className={`text-xs font-bold ${
                      distanceUnit === 'mi' ? 'text-neutral-900' : 'text-neutral-500'
                    }`}>
                    MI
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Storage & Cache */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2.5">
                <HardDriveIcon size={16} color="#18181b" />
                <View>
                  <Text className="text-xs font-bold text-neutral-900">Offline Cache</Text>
                  <Text className="text-[10px] text-neutral-500">{cacheSize} cached assets</Text>
                </View>
              </View>

              <Pressable
                onPress={handleClearCache}
                className="px-3 py-1.5 rounded-xl bg-neutral-100 active:bg-neutral-200">
                <Text className="text-xs font-bold text-neutral-800">Clear</Text>
              </Pressable>
            </View>
          </View>

          {/* App Build Info */}
          <View className="bg-neutral-100/80 rounded-2xl p-4 flex-row items-center justify-between">
            <View>
              <Text className="text-xs font-bold text-neutral-800">QueueBite Core</Text>
              <Text className="text-[10px] text-neutral-400">Version 2.4.0 • Build 891</Text>
            </View>
            <View className="px-2 py-0.5 rounded-full bg-emerald-100">
              <Text className="text-[10px] font-bold text-emerald-800">Up to date</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

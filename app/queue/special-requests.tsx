import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CakeIcon,
  CheckIcon,
  Edit3Icon,
  HeartIcon,
  InfoIcon,
  ShieldAlertIcon,
  SparklesIcon,
  UtensilsIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SpecialRequestsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ note?: string }>();

  // State
  const [selectedSeating, setSelectedSeating] = React.useState<string[]>([
    'Quiet Booth',
    'High Chair',
  ]);
  const [selectedOccasion, setSelectedOccasion] = React.useState<string | null>(null);
  const [selectedDietary, setSelectedDietary] = React.useState<string[]>([]);
  const [customNote, setCustomNote] = React.useState<string>(params.note || '');
  const [notifyOnArrival, setNotifyOnArrival] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const restaurant = MOCK_POPULAR_RESTAURANTS[0];

  function toggleSeating(tag: string) {
    setSelectedSeating((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  }

  function toggleDietary(tag: string) {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  }

  function handleSave() {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert(
        'Requests Saved',
        'Your seating preferences and kitchen notes have been updated for the host team.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 500);
  }

  function handleClearAll() {
    setSelectedSeating([]);
    setSelectedOccasion(null);
    setSelectedDietary([]);
    setCustomNote('');
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
              Special Requests
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              {restaurant.name} • Token #A12
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View className="px-5 pt-4">
          {/* Seating & Environment */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center gap-2 mb-1">
              <SparklesIcon size={16} color="#dc2626" />
              <Text className="text-xs font-bold text-neutral-900">Seating & Atmosphere</Text>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              We try our best to accommodate seating preferences based on table turnover.
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {[
                'Quiet Booth',
                'Window Seat',
                'Outdoor Patio',
                'Wheelchair Accessible',
                'High Chair',
                'Near Outlet',
                'Away from Kitchen',
              ].map((tag) => {
                const isSelected = selectedSeating.includes(tag);
                return (
                  <Pressable
                    key={tag}
                    onPress={() => toggleSeating(tag)}
                    className={`px-3.5 py-2 rounded-2xl border flex-row items-center gap-1.5 ${
                      isSelected
                        ? 'bg-red-50/70 border-[#dc2626]'
                        : 'bg-neutral-50 border-neutral-200/80 active:bg-neutral-100'
                    }`}>
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? 'text-[#dc2626]' : 'text-neutral-700'
                      }`}>
                      {tag}
                    </Text>
                    {isSelected && <CheckIcon size={12} color="#dc2626" strokeWidth={3} />}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Special Occasion */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center gap-2 mb-1">
              <CakeIcon size={16} color="#dc2626" />
              <Text className="text-xs font-bold text-neutral-900">Special Occasion</Text>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Let the staff know if you are celebrating a special moment today.
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {[
                'Birthday',
                'Anniversary',
                'Date Night',
                'Business Meeting',
                'Family Gathering',
              ].map((tag) => {
                const isSelected = selectedOccasion === tag;
                return (
                  <Pressable
                    key={tag}
                    onPress={() => setSelectedOccasion(isSelected ? null : tag)}
                    className={`px-3.5 py-2 rounded-2xl border flex-row items-center gap-1.5 ${
                      isSelected
                        ? 'bg-red-50/70 border-[#dc2626]'
                        : 'bg-neutral-50 border-neutral-200/80 active:bg-neutral-100'
                    }`}>
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? 'text-[#dc2626]' : 'text-neutral-700'
                      }`}>
                      {tag}
                    </Text>
                    {isSelected && <CheckIcon size={12} color="#dc2626" strokeWidth={3} />}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Dietary & Kitchen Notes */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center gap-2 mb-1">
              <ShieldAlertIcon size={16} color="#dc2626" />
              <Text className="text-xs font-bold text-neutral-900">Dietary & Allergies</Text>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Pre-alert the waitstaff and kitchen brigade before being seated.
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {[
                'Pure Veg Only',
                'Jain Preparation',
                'Nut Allergy',
                'Gluten-Free',
                'Dairy Allergy',
                'No Onion/Garlic',
                'Mild Spiciness',
              ].map((tag) => {
                const isSelected = selectedDietary.includes(tag);
                return (
                  <Pressable
                    key={tag}
                    onPress={() => toggleDietary(tag)}
                    className={`px-3.5 py-2 rounded-2xl border flex-row items-center gap-1.5 ${
                      isSelected
                        ? 'bg-red-50/70 border-[#dc2626]'
                        : 'bg-neutral-50 border-neutral-200/80 active:bg-neutral-100'
                    }`}>
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? 'text-[#dc2626]' : 'text-neutral-700'
                      }`}>
                      {tag}
                    </Text>
                    {isSelected && <CheckIcon size={12} color="#dc2626" strokeWidth={3} />}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Custom Note Input */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center gap-2">
                <Edit3Icon size={16} color="#dc2626" />
                <Text className="text-xs font-bold text-neutral-900">Custom Notes to Host</Text>
              </View>
              <Text className="text-[10px] text-neutral-400 font-semibold">
                {customNote.length}/150
              </Text>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Any other preferences or specific instructions for your party?
            </Text>

            <TextInput
              value={customNote}
              onChangeText={(text) => {
                if (text.length <= 150) setCustomNote(text);
              }}
              placeholder="e.g., Arriving by cab, please prepare high chair near booth..."
              placeholderTextColor="#a1a1aa"
              multiline
              numberOfLines={3}
              style={{ textAlignVertical: 'top' }}
              className="w-full h-24 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 font-medium leading-relaxed"
            />
          </View>

          {/* Arrival Notification Toggle */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4 flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-xs font-bold text-neutral-900">
                Notify Host Upon Arrival
              </Text>
              <Text className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                Automatically ping the front desk when your GPS reaches within 50 meters
              </Text>
            </View>

            <Switch
              value={notifyOnArrival}
              onValueChange={setNotifyOnArrival}
              trackColor={{ false: '#e4e4e7', true: '#dc2626' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100 flex-row items-center gap-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Pressable
          onPress={handleClearAll}
          className="flex-1 h-12 rounded-2xl bg-neutral-100 items-center justify-center active:bg-neutral-200">
          <Text className="text-xs font-bold text-neutral-700">Clear All</Text>
        </Pressable>

        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          className="flex-[2] h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center shadow-md shadow-red-500/25">
          <Text className="text-xs font-bold text-white tracking-wide">
            {isSaving ? 'Saving...' : 'Save Special Requests'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

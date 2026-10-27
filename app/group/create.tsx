import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { MOCK_POPULAR_RESTAURANTS } from '@/lib/mock-data';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  HelpCircleIcon,
  InfoIcon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
  UsersIcon,
  UtensilsCrossedIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateGroupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // State
  const [groupName, setGroupName] = React.useState('');
  const [selectedRestaurantId, setSelectedRestaurantId] = React.useState(
    MOCK_POPULAR_RESTAURANTS[0].id
  );
  const [targetPartySize, setTargetPartySize] = React.useState(4);
  const [occasion, setOccasion] = React.useState('Weekend Hangout');
  const [seatingType, setSeatingType] = React.useState('Spacious Booth');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const selectedRestaurant =
    MOCK_POPULAR_RESTAURANTS.find((r) => r.id === selectedRestaurantId) ||
    MOCK_POPULAR_RESTAURANTS[0];

  const nameSuggestions = [
    'Friday Foodies',
    'Weekend Squad',
    'Family Dinner',
    'Office Team Lunch',
    'Birthday Bash',
    'Taco Night',
  ];

  const occasions = [
    'Weekend Hangout',
    'Birthday Party',
    'Family Gathering',
    'Team Lunch',
    'Celebration',
  ];

  function handleCreate() {
    if (!groupName.trim()) {
      Alert.alert('Group Name Required', 'Please enter a name for your dining group.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Route directly to Invite Friends screen for the newly created group
      router.push({
        pathname: '/group/invite',
        params: {
          groupName: groupName.trim(),
          restaurantName: selectedRestaurant.name,
          partySize: targetPartySize.toString(),
        },
      });
    }, 500);
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
              Create Group Dining
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Coordinate & queue together
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View className="px-5 pt-4">
          {/* 1. Group Name Input */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center gap-2 mb-1">
              <UsersIcon size={16} color="#dc2626" />
              <Text className="text-xs font-bold text-neutral-900">Group Name</Text>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Give your party a fun or recognizable name
            </Text>

            <TextInput
              value={groupName}
              onChangeText={setGroupName}
              placeholder="e.g. Friday Foodies Squad"
              placeholderTextColor="#a1a1aa"
              className="h-12 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 text-xs font-bold text-neutral-900"
            />

            {/* Quick Suggestions */}
            <View className="flex-row flex-wrap gap-2 mt-3">
              {nameSuggestions.map((suggestion) => (
                <Pressable
                  key={suggestion}
                  onPress={() => setGroupName(suggestion)}
                  className="px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200/60 active:bg-neutral-200">
                  <Text className="text-[11px] font-bold text-neutral-700">{suggestion}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* 2. Restaurant Selector */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center gap-2">
                <UtensilsCrossedIcon size={16} color="#dc2626" />
                <Text className="text-xs font-bold text-neutral-900">Destination Restaurant</Text>
              </View>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Select where the group will dine
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2.5">
              {MOCK_POPULAR_RESTAURANTS.map((place) => {
                const isSelected = place.id === selectedRestaurantId;
                return (
                  <Pressable
                    key={place.id}
                    onPress={() => setSelectedRestaurantId(place.id)}
                    className={`w-44 p-3 rounded-2xl border ${
                      isSelected
                        ? 'bg-red-50/70 border-[#dc2626]'
                        : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                    }`}>
                    <Image
                      source={{ uri: place.image }}
                      className="w-full h-20 rounded-xl mb-2 bg-neutral-200"
                      resizeMode="cover"
                    />
                    <Text className="text-xs font-bold text-neutral-900" numberOfLines={1}>
                      {place.name}
                    </Text>
                    <Text className="text-[10px] text-neutral-500 mt-0.5">
                      {place.waitRange} wait
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* 3. Expected Party Size Stepper */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-bold text-neutral-900">Expected Party Size</Text>
                <Text className="text-[11px] text-neutral-500 mt-0.5">
                  Friends can still join or adjust later
                </Text>
              </View>

              <View className="flex-row items-center gap-3">
                <Pressable
                  onPress={() => setTargetPartySize((prev) => Math.max(2, prev - 1))}
                  disabled={targetPartySize <= 2}
                  className={`size-10 rounded-xl items-center justify-center border ${
                    targetPartySize <= 2
                      ? 'bg-neutral-100 border-neutral-200 opacity-40'
                      : 'bg-white border-neutral-200 active:bg-neutral-100 shadow-sm'
                  }`}>
                  <MinusIcon size={16} color="#18181b" />
                </Pressable>

                <View className="items-center min-w-[36px]">
                  <Text className="text-xl font-bold text-neutral-900">{targetPartySize}</Text>
                  <Text className="text-[9px] font-bold text-neutral-400">Guests</Text>
                </View>

                <Pressable
                  onPress={() => setTargetPartySize((prev) => Math.min(16, prev + 1))}
                  disabled={targetPartySize >= 16}
                  className={`size-10 rounded-xl items-center justify-center border ${
                    targetPartySize >= 16
                      ? 'bg-neutral-100 border-neutral-200 opacity-40'
                      : 'bg-white border-neutral-200 active:bg-neutral-100 shadow-sm'
                  }`}>
                  <PlusIcon size={16} color="#18181b" />
                </Pressable>
              </View>
            </View>
          </View>

          {/* 4. Occasion Type */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row items-center gap-2 mb-1">
              <SparklesIcon size={16} color="#dc2626" />
              <Text className="text-xs font-bold text-neutral-900">Occasion</Text>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Helps the restaurant arrange ideal table setup
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {occasions.map((occ) => {
                const isSelected = occasion === occ;
                return (
                  <Pressable
                    key={occ}
                    onPress={() => setOccasion(occ)}
                    className={`px-3.5 py-2 rounded-2xl border flex-row items-center gap-1.5 ${
                      isSelected
                        ? 'bg-neutral-900 border-neutral-900'
                        : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                    }`}>
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? 'text-white' : 'text-neutral-700'
                      }`}>
                      {occ}
                    </Text>
                    {isSelected && <CheckIcon size={12} color="#ffffff" strokeWidth={3} />}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* 5. Smart Group Seating Explainer */}
          <View className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80 mb-6 flex-row items-start gap-2.5">
            <InfoIcon size={16} color="#b45309" style={{ marginTop: 2 }} />
            <Text className="text-xs text-amber-900 flex-1 leading-relaxed">
              <Text className="font-bold">QueueBite Smart Group Sync: </Text>
              Once you create the group, you will receive a 6-character code and shareable link. All
              friends can track live wait times and mark arrival readiness.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Pressable
          onPress={handleCreate}
          disabled={isSubmitting}
          className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center flex-row gap-2 shadow-md shadow-red-500/25">
          <UsersIcon size={16} color="#ffffff" />
          <Text className="text-xs font-bold text-white tracking-wide">
            {isSubmitting ? 'Creating Group...' : 'Create Group & Invite Friends'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

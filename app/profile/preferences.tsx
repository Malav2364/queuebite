import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CoinsIcon,
  CompassIcon,
  GlobeIcon,
  HeartIcon,
  InfoIcon,
  LanguagesIcon,
  LeafIcon,
  ShieldAlertIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  UsersIcon,
  UtensilsCrossedIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PreferencesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ onboarding?: string }>();
  const isOnboarding = params.onboarding === 'true' || params.onboarding === '1';

  // 1. Dietary Requirements
  const [dietary, setDietary] = React.useState<string[]>([
    'Vegetarian',
  ]);

  // 2. Seating Preference
  const [seating, setSeating] = React.useState<string>('Indoor');

  // 3. Restaurant Atmosphere
  const [atmosphere, setAtmosphere] = React.useState<string[]>([
    'Casual',
    'Family-friendly',
  ]);

  // 4. Group Dining Habits
  const [groupHabit, setGroupHabit] = React.useState<string>('Couple');

  // 5. Preferred Price Range
  const [priceRanges, setPriceRanges] = React.useState<string[]>([
    '$$ (Moderate)',
  ]);

  // 6. Preferred Sorting
  const [preferredSort, setPreferredSort] = React.useState<string>(
    'Shortest wait'
  );

  // 7. Favorite quick venues
  const [favorites, setFavorites] = React.useState<Record<string, boolean>>({
    'The Daily Bean': true,
    'Peshawri Royal': true,
    'Little Italy Trattoria': false,
  });

  // 8. Language
  const [language, setLanguage] = React.useState<string>('English');

  const [isSaving, setIsSaving] = React.useState(false);

  function toggleDietary(item: string) {
    setDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  }

  function toggleAtmosphere(item: string) {
    setAtmosphere((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  }

  function togglePrice(item: string) {
    setPriceRanges((prev) =>
      prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item]
    );
  }

  function handleSave() {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (isOnboarding) {
        Alert.alert(
          'Preferences Saved!',
          'Your dining preferences have been configured. You can edit them anytime in your profile.',
          [
            {
              text: 'Start Exploring',
              onPress: () => router.replace('/'),
            },
          ]
        );
      } else {
        Alert.alert(
          'Preferences Updated',
          'Your personalized dining recommendations and waitlist defaults have been saved.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      }
    }, 450);
  }

  function handleSkip() {
    router.replace('/');
  }

  return (
    <View className="flex-1 bg-[#faf8f5]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        className="px-5 pb-3 bg-white border-b border-neutral-200/80 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center gap-3">
          {!isOnboarding ? (
            <Pressable
              onPress={() => router.back()}
              className="size-9 rounded-lg bg-neutral-100 items-center justify-center active:bg-neutral-200"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <ArrowLeftIcon size={18} color="#18181b" />
            </Pressable>
          ) : (
            <View className="size-9 rounded-lg bg-red-50 items-center justify-center">
              <SparklesIcon size={18} color="#dc2626" />
            </View>
          )}

          <View>
            <Text className="text-xl font-bold text-neutral-900 tracking-tight">
              {isOnboarding ? 'Dining Preferences' : 'Personalization'}
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              {isOnboarding
                ? 'Step 1 of 1 • Tailor your experience'
                : 'Recommendations & waitlist defaults'}
            </Text>
          </View>
        </View>

        {isOnboarding ? (
          <Pressable
            onPress={handleSkip}
            className="py-1 px-3 rounded-lg bg-neutral-100 active:bg-neutral-200">
            <Text className="text-xs font-semibold text-neutral-600">Skip</Text>
          </Pressable>
        ) : (
          <BrandLogo size="sm" />
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>
        <View className="px-5 pt-4">
          {/* Important Allergy & Dietary Safety Notice */}
          <View className="bg-amber-50/80 border border-amber-300/80 rounded-xl p-3.5 flex-row items-start gap-2.5 mb-4">
            <ShieldAlertIcon size={18} color="#b45309" style={{ marginTop: 2 }} />
            <View className="flex-1">
              <Text className="text-xs font-bold text-amber-900">
                Allergy & Dietary Safety Notice
              </Text>
              <Text className="text-[11px] text-amber-950 mt-1 leading-[17px]">
                Dietary requirements and severe allergies are not the same thing. Cross-contamination
                and ingredient details are labeled as unverified until confirmed directly with venue
                staff. Never rely on algorithm recommendations for severe medical food allergies.
              </Text>
            </View>
          </View>

          {/* Section 1: Dietary Requirements */}
          <View className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs mb-3.5">
            <View className="flex-row items-center gap-2 mb-1">
              <LeafIcon size={16} color="#059669" />
              <Text className="text-xs font-bold text-neutral-900">
                Dietary Requirements
              </Text>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Filters restaurants and dishes where verified options exist
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {[
                'Vegetarian',
                'Vegan',
                'Jain',
                'Gluten-free',
                'Halal',
                'No Restrictions',
              ].map((item) => {
                const isSelected = dietary.includes(item);
                return (
                  <Pressable
                    key={item}
                    onPress={() => toggleDietary(item)}
                    className={`px-3 py-2 rounded-lg border flex-row items-center gap-1.5 ${
                      isSelected
                        ? 'bg-neutral-900 border-neutral-900'
                        : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                    }`}>
                    {isSelected && <CheckIcon size={12} color="#ffffff" />}
                    <Text
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-white' : 'text-neutral-700'
                      }`}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Section 2: Seating Preference */}
          <View className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs mb-3.5">
            <View className="flex-row items-center gap-2 mb-1">
              <UtensilsCrossedIcon size={16} color="#dc2626" />
              <Text className="text-xs font-bold text-neutral-900">
                Seating Preference
              </Text>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Recommends venues when they support your preferred table area
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {['Indoor', 'Outdoor', 'Quiet area', 'Window Booth', 'Rooftop'].map(
                (item) => {
                  const isSelected = seating === item;
                  return (
                    <Pressable
                      key={item}
                      onPress={() => setSeating(item)}
                      className={`px-3 py-2 rounded-lg border ${
                        isSelected
                          ? 'bg-neutral-900 border-neutral-900'
                          : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                      }`}>
                      <Text
                        className={`text-xs font-semibold ${
                          isSelected ? 'text-white' : 'text-neutral-700'
                        }`}>
                        {item}
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </View>
          </View>

          {/* Section 3: Restaurant Atmosphere */}
          <View className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs mb-3.5">
            <View className="flex-row items-center gap-2 mb-1">
              <SparklesIcon size={16} color="#ea580c" />
              <Text className="text-xs font-bold text-neutral-900">
                Restaurant Atmosphere
              </Text>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Improves recommendations tailored to your dining mood
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {[
                'Casual',
                'Family-friendly',
                'Date night',
                'Work-friendly',
                'Lively & Vibrant',
              ].map((item) => {
                const isSelected = atmosphere.includes(item);
                return (
                  <Pressable
                    key={item}
                    onPress={() => toggleAtmosphere(item)}
                    className={`px-3 py-2 rounded-lg border ${
                      isSelected
                        ? 'bg-neutral-900 border-neutral-900'
                        : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                    }`}>
                    <Text
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-white' : 'text-neutral-700'
                      }`}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Section 4: Group Dining Habits */}
          <View className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs mb-3.5">
            <View className="flex-row items-center gap-2 mb-1">
              <UsersIcon size={16} color="#2563eb" />
              <Text className="text-xs font-bold text-neutral-900">
                Group Dining Habits
              </Text>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Sets default party size when checking in or joining waitlists
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {[
                { label: 'Usually solo (1)', value: 'Solo' },
                { label: 'Couple (2)', value: 'Couple' },
                { label: 'Friends (3–4)', value: 'Friends' },
                { label: 'Family (5+)', value: 'Family' },
              ].map((item) => {
                const isSelected = groupHabit === item.value;
                return (
                  <Pressable
                    key={item.value}
                    onPress={() => setGroupHabit(item.value)}
                    className={`px-3 py-2 rounded-lg border ${
                      isSelected
                        ? 'bg-neutral-900 border-neutral-900'
                        : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                    }`}>
                    <Text
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-white' : 'text-neutral-700'
                      }`}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Section 5: Preferred Price Range */}
          <View className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs mb-3.5">
            <View className="flex-row items-center gap-2 mb-1">
              <CoinsIcon size={16} color="#059669" />
              <Text className="text-xs font-bold text-neutral-900">
                Preferred Price Range
              </Text>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Prevents highlighting venues outside your budget
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {[
                '$ (Budget • Under ₹400)',
                '$$ (Moderate • ₹400–1,000)',
                '$$$ (Fine Dining • ₹1,000–2,500)',
                '$$$$ (Luxury • ₹2,500+)',
              ].map((item) => {
                const isSelected = priceRanges.includes(item);
                return (
                  <Pressable
                    key={item}
                    onPress={() => togglePrice(item)}
                    className={`px-3 py-2 rounded-lg border ${
                      isSelected
                        ? 'bg-neutral-900 border-neutral-900'
                        : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                    }`}>
                    <Text
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-white' : 'text-neutral-700'
                      }`}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Section 6: Preferred Sorting */}
          <View className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs mb-3.5">
            <View className="flex-row items-center gap-2 mb-1">
              <SlidersHorizontalIcon size={16} color="#7c3aed" />
              <Text className="text-xs font-bold text-neutral-900">
                Preferred Discovery Order
              </Text>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Default ordering for restaurant searches and feed lists
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {[
                'Shortest wait',
                'Closest distance',
                'Highest rated',
                'Recommended',
              ].map((item) => {
                const isSelected = preferredSort === item;
                return (
                  <Pressable
                    key={item}
                    onPress={() => setPreferredSort(item)}
                    className={`px-3 py-2 rounded-lg border ${
                      isSelected
                        ? 'bg-neutral-900 border-neutral-900'
                        : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                    }`}>
                    <Text
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-white' : 'text-neutral-700'
                      }`}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Section 7: Quick Favorite Venues */}
          <View className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs mb-3.5">
            <View className="flex-row items-center gap-2 mb-1">
              <HeartIcon size={16} color="#dc2626" />
              <Text className="text-xs font-bold text-neutral-900">
                Favorite Venues (Quick Access)
              </Text>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Pins frequently visited restaurants to your top shortcuts
            </Text>

            <View className="gap-2.5">
              {[
                { name: 'The Daily Bean', area: 'Alkapuri • Cafe' },
                { name: 'Peshawri Royal', area: 'Sayajigunj • North Indian' },
                { name: 'Little Italy Trattoria', area: 'Akota • Pizza & Pasta' },
              ].map((venue) => {
                const isFav = favorites[venue.name] ?? false;
                return (
                  <View
                    key={venue.name}
                    className="flex-row items-center justify-between py-1.5">
                    <View>
                      <Text className="text-xs font-semibold text-neutral-900">
                        {venue.name}
                      </Text>
                      <Text className="text-[11px] text-neutral-500">
                        {venue.area}
                      </Text>
                    </View>
                    <Switch
                      value={isFav}
                      onValueChange={(val) =>
                        setFavorites((prev) => ({ ...prev, [venue.name]: val }))
                      }
                      trackColor={{ false: '#e4e4e7', true: '#dc2626' }}
                      thumbColor="#ffffff"
                    />
                  </View>
                );
              })}
            </View>
          </View>

          {/* Section 8: Supported App Languages */}
          <View className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs mb-4">
            <View className="flex-row items-center gap-2 mb-1">
              <LanguagesIcon size={16} color="#4b5563" />
              <Text className="text-xs font-bold text-neutral-900">
                Display Language
              </Text>
            </View>
            <Text className="text-[11px] text-neutral-500 mb-3">
              Shows app interface, queue tokens and instructions in this language
            </Text>

            <View className="flex-row gap-2">
              {[
                { label: 'English', value: 'English' },
                { label: 'ગુજરાતી (Gujarati)', value: 'Gujarati' },
                { label: 'हिन्दी (Hindi)', value: 'Hindi' },
              ].map((item) => {
                const isSelected = language === item.value;
                return (
                  <Pressable
                    key={item.value}
                    onPress={() => setLanguage(item.value)}
                    className={`px-3 py-2 rounded-lg border flex-1 items-center ${
                      isSelected
                        ? 'bg-neutral-900 border-neutral-900'
                        : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                    }`}>
                    <Text
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-white' : 'text-neutral-700'
                      }`}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-200/80"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          className="w-full h-11 rounded-xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center shadow-sm">
          <Text className="text-xs font-bold text-white tracking-wide">
            {isSaving
              ? 'Saving Preferences...'
              : isOnboarding
              ? 'Save & Continue'
              : 'Save Preferences'}
          </Text>
        </Pressable>

        {isOnboarding && (
          <Pressable onPress={handleSkip} className="mt-2.5 py-1 items-center">
            <Text className="text-xs font-semibold text-neutral-500">
              Skip for now, set up later in Profile
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

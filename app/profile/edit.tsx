import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { useUser } from '@clerk/expo';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CameraIcon,
  CheckCircle2Icon,
  CheckIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
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

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useUser();

  const [fullName, setFullName] = React.useState(user?.fullName || 'Malav Patel');
  const [email, setEmail] = React.useState(
    user?.primaryEmailAddress?.emailAddress || 'malav@example.com'
  );
  const [phone, setPhone] = React.useState('+91 98765 43210');
  const [city, setCity] = React.useState('Vadodara, Gujarat');
  const [gender, setGender] = React.useState<'male' | 'female' | 'other'>('male');
  const [isSaving, setIsSaving] = React.useState(false);

  function handleSave() {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert('Profile Updated', 'Your profile details have been saved successfully.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    }, 600);
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
              Edit Profile
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Update personal info
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View className="px-5 pt-5">
          {/* Avatar Edit */}
          <View className="items-center mb-6">
            <View className="relative">
              <Image
                source={{
                  uri:
                    user?.imageUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
                }}
                className="size-24 rounded-full bg-neutral-200 border-2 border-white shadow-md"
              />
              <Pressable
                onPress={() =>
                  Alert.alert('Upload Photo', 'Choose an option to update profile picture:', [
                    { text: 'Take Photo' },
                    { text: 'Choose from Library' },
                    { text: 'Cancel', style: 'cancel' },
                  ])
                }
                className="absolute bottom-0 right-0 size-8 rounded-full bg-[#dc2626] items-center justify-center border-2 border-white shadow-sm">
                <CameraIcon size={14} color="#ffffff" />
              </Pressable>
            </View>
            <Text className="text-xs text-neutral-500 font-medium mt-2">
              Tap camera to change photo
            </Text>
          </View>

          {/* Form Fields */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            {/* Full Name */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-neutral-900 mb-1.5">Full Name</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your name"
                placeholderTextColor="#a1a1aa"
                className="h-12 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 text-xs font-bold text-neutral-900"
              />
            </View>

            {/* Email Address */}
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-xs font-bold text-neutral-900">Email Address</Text>
                <View className="flex-row items-center gap-1">
                  <CheckCircle2Icon size={11} color="#059669" />
                  <Text className="text-[10px] font-bold text-emerald-700">Verified</Text>
                </View>
              </View>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="h-12 bg-neutral-100 border border-neutral-200 rounded-2xl px-4 text-xs font-medium text-neutral-600"
                editable={false}
              />
            </View>

            {/* Phone Number */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-neutral-900 mb-1.5">Phone Number</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                className="h-12 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 text-xs font-bold text-neutral-900"
              />
            </View>

            {/* Home Location */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-neutral-900 mb-1.5">Primary Dining City</Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                className="h-12 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 text-xs font-bold text-neutral-900"
              />
            </View>

            {/* Gender */}
            <View>
              <Text className="text-xs font-bold text-neutral-900 mb-2">Gender</Text>
              <View className="flex-row gap-2">
                {[
                  { id: 'male', label: 'Male' },
                  { id: 'female', label: 'Female' },
                  { id: 'other', label: 'Other' },
                ].map((g) => {
                  const isSelected = gender === g.id;
                  return (
                    <Pressable
                      key={g.id}
                      onPress={() => setGender(g.id as any)}
                      className={`flex-1 py-2.5 rounded-2xl border items-center justify-center ${
                        isSelected
                          ? 'bg-neutral-900 border-neutral-900'
                          : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                      }`}>
                      <Text
                        className={`text-xs font-bold ${
                          isSelected ? 'text-white' : 'text-neutral-700'
                        }`}>
                        {g.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        className="px-5 pt-3 pb-5 bg-white border-t border-neutral-100"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          className="w-full h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center shadow-md shadow-red-500/25">
          <Text className="text-xs font-bold text-white tracking-wide">
            {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

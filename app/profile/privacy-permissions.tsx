import { BrandLogo } from '@/components/brand-logo';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  BellIcon,
  CameraIcon,
  CheckCircle2Icon,
  DownloadIcon,
  LockIcon,
  MapPinIcon,
  MicIcon,
  ShieldCheckIcon,
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

export default function PrivacyPermissionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [locationPermission, setLocationPermission] = React.useState(true);
  const [cameraPermission, setCameraPermission] = React.useState(true);
  const [pushPermission, setPushPermission] = React.useState(true);
  const [micPermission, setMicPermission] = React.useState(false);
  const [personalization, setPersonalization] = React.useState(true);
  const [crashReports, setCrashReports] = React.useState(true);

  function handleExportData() {
    Alert.alert(
      'Export Data Archive',
      'We have initiated an archive of your dining profile, queue history, and pre-orders. A secure download link will be emailed within 24 hours.'
    );
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
              Privacy & Permissions
            </Text>
            <Text className="text-xs text-neutral-500 font-medium">
              Data control & device access
            </Text>
          </View>
        </View>

        <BrandLogo size="sm" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        <View className="px-5 pt-4">
          {/* Device Permissions Card */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
              Device Permissions
            </Text>

            <View className="gap-4">
              {/* Location */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-start gap-3 flex-1 pr-3">
                  <View className="size-8 rounded-xl bg-red-50 items-center justify-center mt-0.5">
                    <MapPinIcon size={16} color="#dc2626" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-neutral-900">Location Access</Text>
                    <Text className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                      Required for live distance, interactive map pins & arrival readiness
                    </Text>
                  </View>
                </View>
                <Switch
                  value={locationPermission}
                  onValueChange={setLocationPermission}
                  trackColor={{ false: '#e4e4e7', true: '#dc2626' }}
                  thumbColor="#ffffff"
                />
              </View>

              <View className="h-px bg-neutral-100" />

              {/* Camera */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-start gap-3 flex-1 pr-3">
                  <View className="size-8 rounded-xl bg-red-50 items-center justify-center mt-0.5">
                    <CameraIcon size={16} color="#dc2626" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-neutral-900">Camera Access</Text>
                    <Text className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                      Used for scanning host podium QR codes and boarding passes
                    </Text>
                  </View>
                </View>
                <Switch
                  value={cameraPermission}
                  onValueChange={setCameraPermission}
                  trackColor={{ false: '#e4e4e7', true: '#dc2626' }}
                  thumbColor="#ffffff"
                />
              </View>

              <View className="h-px bg-neutral-100" />

              {/* Push Notifications */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-start gap-3 flex-1 pr-3">
                  <View className="size-8 rounded-xl bg-red-50 items-center justify-center mt-0.5">
                    <BellIcon size={16} color="#dc2626" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-neutral-900">Push Notifications</Text>
                    <Text className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                      Urgent table ready 10-minute hold window countdown alerts
                    </Text>
                  </View>
                </View>
                <Switch
                  value={pushPermission}
                  onValueChange={setPushPermission}
                  trackColor={{ false: '#e4e4e7', true: '#dc2626' }}
                  thumbColor="#ffffff"
                />
              </View>

              <View className="h-px bg-neutral-100" />

              {/* Microphone */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-start gap-3 flex-1 pr-3">
                  <View className="size-8 rounded-xl bg-neutral-100 items-center justify-center mt-0.5">
                    <MicIcon size={16} color="#71717a" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-neutral-900">Microphone Access</Text>
                    <Text className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                      Used for in-app voice restaurant and food search
                    </Text>
                  </View>
                </View>
                <Switch
                  value={micPermission}
                  onValueChange={setMicPermission}
                  trackColor={{ false: '#e4e4e7', true: '#dc2626' }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </View>

          {/* Privacy & Data Sharing Card */}
          <View className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mb-4">
            <Text className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
              Data & Personalization
            </Text>

            <View className="gap-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-xs font-bold text-neutral-900">
                    Personalized Recommendations
                  </Text>
                  <Text className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                    Personalize wait time alerts based on past dining cuisines
                  </Text>
                </View>
                <Switch
                  value={personalization}
                  onValueChange={setPersonalization}
                  trackColor={{ false: '#e4e4e7', true: '#dc2626' }}
                  thumbColor="#ffffff"
                />
              </View>

              <View className="h-px bg-neutral-100" />

              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-xs font-bold text-neutral-900">
                    Anonymous Crash Reports
                  </Text>
                  <Text className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                    Helps engineers fix app stability and map rendering bugs
                  </Text>
                </View>
                <Switch
                  value={crashReports}
                  onValueChange={setCrashReports}
                  trackColor={{ false: '#e4e4e7', true: '#dc2626' }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </View>

          {/* Data Export Button */}
          <Pressable
            onPress={handleExportData}
            className="w-full py-3.5 bg-white rounded-2xl border border-neutral-200 active:bg-neutral-50 flex-row items-center justify-center gap-2 mb-6">
            <DownloadIcon size={16} color="#18181b" />
            <Text className="text-xs font-bold text-neutral-800">
              Request My Personal Data Archive
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

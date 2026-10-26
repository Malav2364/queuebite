import { Text } from '@/components/ui/text';
import { UserLocation } from '@/types/queuebite';
import * as Location from 'expo-location';
import {
  CheckIcon,
  CompassIcon,
  MapPinIcon,
  SearchIcon,
  SparklesIcon,
  XIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  currentLocation: UserLocation;
  onSelectLocation: (loc: UserLocation) => void;
}

const POPULAR_AREAS = [
  { area: 'Alkapuri', city: 'Vadodara', pincode: '390007' },
  { area: 'Sayajigunj', city: 'Vadodara', pincode: '390005' },
  { area: 'Gotri', city: 'Vadodara', pincode: '390021' },
  { area: 'Manjalpur', city: 'Vadodara', pincode: '390011' },
  { area: 'Fatehgunj', city: 'Vadodara', pincode: '390002' },
  { area: 'Akota', city: 'Vadodara', pincode: '390020' },
];

export function LocationModal({
  visible,
  onClose,
  currentLocation,
  onSelectLocation,
}: LocationModalProps) {
  const [pincode, setPincode] = React.useState('');
  const [isDetecting, setIsDetecting] = React.useState(false);
  const [permissionDenied, setPermissionDenied] = React.useState(false);

  // Reset state when modal opens
  React.useEffect(() => {
    if (visible) {
      setPincode(currentLocation.pincode || '');
      setPermissionDenied(false);
    }
  }, [visible, currentLocation]);

  // Request GPS permission and fetch location
  async function handleDetectLocation() {
    setIsDetecting(true);
    setPermissionDenied(false);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setPermissionDenied(true);
        setIsDetecting(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (geocode) {
        const area =
          geocode.district ||
          geocode.subregion ||
          geocode.name ||
          'Central';
        const city = geocode.city || geocode.region || 'Vadodara';
        const postalCode = geocode.postalCode || '390001';

        onSelectLocation({
          area,
          city,
          pincode: postalCode,
          isCustom: false,
        });
        onClose();
      } else {
        // Fallback default
        onSelectLocation({
          area: 'Vadodara',
          city: 'Gujarat',
          pincode: '390001',
          isCustom: false,
        });
        onClose();
      }
    } catch (err) {
      console.warn('GPS location error:', err);
      setPermissionDenied(true);
    } finally {
      setIsDetecting(false);
    }
  }

  function handleSavePincode() {
    const trimmed = pincode.trim();
    if (!trimmed) {
      Alert.alert('Please enter a pincode or area name');
      return;
    }

    // Match popular area or use custom
    const matched = POPULAR_AREAS.find(
      (a) => a.pincode === trimmed || a.area.toLowerCase() === trimmed.toLowerCase()
    );

    if (matched) {
      onSelectLocation({
        area: matched.area,
        city: matched.city,
        pincode: matched.pincode,
        isCustom: true,
      });
    } else {
      onSelectLocation({
        area: isNaN(Number(trimmed)) ? trimmed : `PIN ${trimmed}`,
        city: 'Vadodara',
        pincode: trimmed,
        isCustom: true,
      });
    }

    onClose();
  }

  function handleSelectArea(item: typeof POPULAR_AREAS[0]) {
    onSelectLocation({
      area: item.area,
      city: item.city,
      pincode: item.pincode,
      isCustom: true,
    });
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <Pressable className="flex-1" onPress={onClose} />
        
        <View className="bg-white rounded-t-3xl p-6 shadow-2xl max-h-[85%]">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-neutral-100">
            <View className="flex-row items-center gap-2">
              <View className="size-8 rounded-full bg-red-50 items-center justify-center">
                <MapPinIcon size={18} color="#dc2626" />
              </View>
              <Text className="text-lg font-bold text-neutral-900">
                Choose Location
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              className="size-8 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200">
              <XIcon size={18} color="#4b5563" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="pt-4">
            {/* Permission Denied Alert Banner */}
            {permissionDenied && (
              <View className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-4">
                <Text className="text-xs font-bold text-amber-900 mb-0.5">
                  Location Permission Denied
                </Text>
                <Text className="text-xs text-amber-800 leading-relaxed">
                  No problem! Enter your 6-digit Pincode or choose your area below to see live wait times.
                </Text>
              </View>
            )}

            {/* GPS Auto-Detect Button */}
            <Pressable
              onPress={handleDetectLocation}
              disabled={isDetecting}
              className="flex-row items-center justify-between bg-neutral-900 active:bg-neutral-800 p-4 rounded-2xl mb-4">
              <View className="flex-row items-center gap-3">
                <View className="size-9 rounded-xl bg-white/10 items-center justify-center">
                  {isDetecting ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <SparklesIcon size={18} color="#ffffff" />
                  )}
                </View>
                <View>
                  <Text className="text-sm font-bold text-white">
                    {isDetecting ? 'Detecting current location...' : 'Use Current GPS Location'}
                  </Text>
                  <Text className="text-[11px] text-neutral-400 mt-0.5">
                    Automatically find restaurants nearest to you
                  </Text>
                </View>
              </View>
              <CompassIcon size={18} color="#9ca3af" />
            </Pressable>

            {/* Divider */}
            <View className="flex-row items-center gap-3 my-2">
              <View className="flex-1 h-px bg-neutral-200" />
              <Text className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Or enter pincode
              </Text>
              <View className="flex-1 h-px bg-neutral-200" />
            </View>

            {/* Pincode Input Form */}
            <View className="flex-row items-center gap-2 mt-2 mb-4">
              <View className="flex-1 flex-row items-center bg-neutral-100 rounded-xl px-3.5 h-12 border border-neutral-200">
                <SearchIcon size={18} color="#9ca3af" />
                <TextInput
                  value={pincode}
                  onChangeText={setPincode}
                  placeholder="Enter 6-digit pincode or area (e.g. 390007)"
                  placeholderTextColor="#9ca3af"
                  keyboardType="default"
                  maxLength={15}
                  className="flex-1 text-sm text-neutral-900 ml-2.5 font-medium"
                  returnKeyType="done"
                  onSubmitEditing={handleSavePincode}
                />
              </View>

              <Pressable
                onPress={handleSavePincode}
                className="h-12 px-5 bg-[#dc2626] active:bg-red-700 rounded-xl items-center justify-center">
                <Text className="text-sm font-bold text-white">Apply</Text>
              </Pressable>
            </View>

            {/* Popular Vadodara Areas */}
            <Text className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
              Popular Areas in Vadodara
            </Text>

            <View className="flex-row flex-wrap gap-2 mb-6">
              {POPULAR_AREAS.map((item) => {
                const isSelected =
                  currentLocation.area?.toLowerCase() === item.area.toLowerCase();
                return (
                  <Pressable
                    key={item.pincode}
                    onPress={() => handleSelectArea(item)}
                    className={`flex-row items-center gap-1.5 px-3.5 py-2.5 rounded-xl border ${
                      isSelected
                        ? 'bg-red-50 border-[#dc2626]'
                        : 'bg-neutral-50 border-neutral-200 active:bg-neutral-100'
                    }`}>
                    <MapPinIcon
                      size={13}
                      color={isSelected ? '#dc2626' : '#71717a'}
                    />
                    <Text
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-[#dc2626]' : 'text-neutral-800'
                      }`}>
                      {item.area} ({item.pincode})
                    </Text>
                    {isSelected && <CheckIcon size={14} color="#dc2626" />}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

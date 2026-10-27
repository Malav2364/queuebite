import { Text } from '@/components/ui/text';
import {
  ArrowDownIcon,
  CheckIcon,
  ClockIcon,
  IndianRupeeIcon,
  MapPinIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  StarIcon,
  XIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface FilterSortState {
  sortBy: 'RECOMMENDED' | 'WAIT_TIME' | 'RATING' | 'DISTANCE' | 'PRICE_LOW';
  maxDistance: number | null; // in km
  minRating: number | null;
  price: string | null; // '₹' | '₹₹' | '₹₹₹'
  maxWait: number | null; // in mins
  openOnly: boolean;
}

interface FilterSortModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterSortState;
  onApply: (newFilters: FilterSortState) => void;
  onReset: () => void;
}

export function FilterSortModal({
  visible,
  onClose,
  filters,
  onApply,
  onReset,
}: FilterSortModalProps) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = React.useState<FilterSortState>(filters);

  React.useEffect(() => {
    setDraft(filters);
  }, [filters, visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 bg-black/45 justify-end">
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-white rounded-t-3xl max-h-[85%] shadow-2xl"
          style={{ paddingBottom: insets.bottom + 12 }}>
          {/* Header */}
          <View className="px-5 py-4 border-b border-neutral-100 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <SlidersHorizontalIcon size={18} color="#dc2626" />
              <Text className="text-lg font-bold text-neutral-900 tracking-tight">
                Filters & Sorting
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              className="size-8 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200">
              <XIcon size={16} color="#71717a" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="px-5 py-3">
            {/* 1. Sort By */}
            <View className="mb-5">
              <Text className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
                Sort By
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[
                  { id: 'RECOMMENDED', label: 'Recommended' },
                  { id: 'WAIT_TIME', label: 'Shortest Wait' },
                  { id: 'RATING', label: 'Highest Rated' },
                  { id: 'DISTANCE', label: 'Nearest Distance' },
                  { id: 'PRICE_LOW', label: 'Price: Low to High' },
                ].map((item) => {
                  const isSel = draft.sortBy === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => setDraft((p) => ({ ...p, sortBy: item.id as any }))}
                      className={`px-3.5 py-2 rounded-xl border flex-row items-center gap-1.5 active:scale-95 ${
                        isSel
                          ? 'bg-red-50/80 border-[#dc2626]'
                          : 'bg-white border-neutral-200/90'
                      }`}>
                      <Text
                        className={`text-xs ${
                          isSel ? 'font-bold text-[#dc2626]' : 'font-semibold text-neutral-700'
                        }`}>
                        {item.label}
                      </Text>
                      {isSel && <CheckIcon size={13} color="#dc2626" />}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 2. Maximum Wait Time */}
            <View className="mb-5">
              <Text className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
                Max Wait Time
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[
                  { val: null, label: 'Any Wait' },
                  { val: 15, label: '< 15 mins' },
                  { val: 30, label: '< 30 mins' },
                  { val: 45, label: '< 45 mins' },
                ].map((item, idx) => {
                  const isSel = draft.maxWait === item.val;
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => setDraft((p) => ({ ...p, maxWait: item.val }))}
                      className={`px-3.5 py-2 rounded-xl border flex-row items-center gap-1.5 ${
                        isSel
                          ? 'bg-red-50/80 border-[#dc2626]'
                          : 'bg-white border-neutral-200/90'
                      }`}>
                      <ClockIcon size={12} color={isSel ? '#dc2626' : '#71717a'} />
                      <Text
                        className={`text-xs ${
                          isSel ? 'font-bold text-[#dc2626]' : 'font-semibold text-neutral-700'
                        }`}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 3. Distance Radius */}
            <View className="mb-5">
              <Text className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
                Distance Radius
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[
                  { val: null, label: 'Any Distance' },
                  { val: 1.5, label: '< 1.5 km' },
                  { val: 3.0, label: '< 3.0 km' },
                  { val: 5.0, label: '< 5.0 km' },
                  { val: 10.0, label: '< 10 km' },
                ].map((item, idx) => {
                  const isSel = draft.maxDistance === item.val;
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => setDraft((p) => ({ ...p, maxDistance: item.val }))}
                      className={`px-3.5 py-2 rounded-xl border flex-row items-center gap-1.5 ${
                        isSel
                          ? 'bg-red-50/80 border-[#dc2626]'
                          : 'bg-white border-neutral-200/90'
                      }`}>
                      <MapPinIcon size={12} color={isSel ? '#dc2626' : '#71717a'} />
                      <Text
                        className={`text-xs ${
                          isSel ? 'font-bold text-[#dc2626]' : 'font-semibold text-neutral-700'
                        }`}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 4. Minimum Rating */}
            <View className="mb-5">
              <Text className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
                Rating
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[
                  { val: null, label: 'Any Rating' },
                  { val: 4.5, label: '4.5+ ⭐' },
                  { val: 4.0, label: '4.0+ ⭐' },
                  { val: 3.5, label: '3.5+ ⭐' },
                ].map((item, idx) => {
                  const isSel = draft.minRating === item.val;
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => setDraft((p) => ({ ...p, minRating: item.val }))}
                      className={`px-3.5 py-2 rounded-xl border flex-row items-center gap-1.5 ${
                        isSel
                          ? 'bg-red-50/80 border-[#dc2626]'
                          : 'bg-white border-neutral-200/90'
                      }`}>
                      <StarIcon
                        size={12}
                        color={isSel ? '#dc2626' : '#eab308'}
                        fill={isSel ? '#dc2626' : '#eab308'}
                      />
                      <Text
                        className={`text-xs ${
                          isSel ? 'font-bold text-[#dc2626]' : 'font-semibold text-neutral-700'
                        }`}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 5. Price Range */}
            <View className="mb-5">
              <Text className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
                Price
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[
                  { val: null, label: 'All Prices' },
                  { val: '₹', label: '₹ Pocket-Friendly' },
                  { val: '₹₹', label: '₹₹ Casual Dining' },
                  { val: '₹₹₹', label: '₹₹₹ Fine Dining' },
                ].map((item, idx) => {
                  const isSel = draft.price === item.val;
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => setDraft((p) => ({ ...p, price: item.val }))}
                      className={`px-3.5 py-2 rounded-xl border flex-row items-center gap-1.5 ${
                        isSel
                          ? 'bg-red-50/80 border-[#dc2626]'
                          : 'bg-white border-neutral-200/90'
                      }`}>
                      <IndianRupeeIcon size={12} color={isSel ? '#dc2626' : '#71717a'} />
                      <Text
                        className={`text-xs ${
                          isSel ? 'font-bold text-[#dc2626]' : 'font-semibold text-neutral-700'
                        }`}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View className="px-5 pt-3 border-t border-neutral-100 flex-row items-center gap-3">
            <Pressable
              onPress={() => {
                onReset();
                onClose();
              }}
              className="px-5 h-12 rounded-2xl bg-neutral-100 active:bg-neutral-200 items-center justify-center flex-row gap-1.5">
              <RotateCcwIcon size={14} color="#18181b" />
              <Text className="text-xs font-bold text-neutral-800">Reset</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                onApply(draft);
                onClose();
              }}
              className="flex-1 h-12 rounded-2xl bg-[#dc2626] active:bg-[#b91c1c] items-center justify-center shadow-md shadow-red-500/25">
              <Text className="text-xs font-bold text-white tracking-wide">Apply Filters</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

import { Text } from '@/components/ui/text';
import { FilterKey } from '@/components/filter-bar';
import {
  ClockIcon,
  FlameIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { Pressable, TextInput, View } from 'react-native';

interface SearchAndFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilters: Set<FilterKey>;
  onToggleFilter: (filter: FilterKey) => void;
  partySize: number;
  onPartySizeChange: (size: number) => void;
}

export function SearchAndFilterBar({
  searchQuery,
  onSearchChange,
  activeFilters,
  onToggleFilter,
  partySize,
  onPartySizeChange,
}: SearchAndFilterBarProps) {
  const [showFilterDrawer, setShowFilterDrawer] = React.useState(false);

  const filterChips: { key: FilterKey; label: string; icon: any }[] = [
    { key: 'OPEN_NOW', label: 'Open now', icon: ClockIcon },
    { key: 'SHORTEST_WAIT', label: 'Shortest wait', icon: FlameIcon },
    { key: 'FITS_PARTY', label: `Party of ${partySize}`, icon: UsersIcon },
    { key: 'FAVORITES', label: 'Favorites', icon: HeartIcon },
  ];

  return (
    <View className="px-5 pt-2 pb-2">
      {/* Search Input Row with Filter Button */}
      <View className="flex-row items-center gap-2.5">
        <View className="flex-1 flex-row items-center bg-[#f4f4f5] h-12 rounded-2xl px-3.5 border border-neutral-200/80">
          <SearchIcon size={18} color="#71717a" />
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search restaurants, cuisines or areas..."
            placeholderTextColor="#71717a"
            className="flex-1 ml-2.5 text-sm text-neutral-900 font-medium"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => onSearchChange('')}
              className="size-6 rounded-full bg-neutral-200 items-center justify-center mr-1">
              <XIcon size={12} color="#52525b" />
            </Pressable>
          )}
        </View>

        {/* Filter Button */}
        <Pressable
          onPress={() => setShowFilterDrawer((prev) => !prev)}
          className={`size-12 rounded-2xl border items-center justify-center ${
            showFilterDrawer || activeFilters.size > 0
              ? 'bg-neutral-900 border-neutral-900'
              : 'bg-white border-neutral-200 active:bg-neutral-100'
          }`}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
          <SlidersHorizontalIcon
            size={18}
            color={showFilterDrawer || activeFilters.size > 0 ? '#ffffff' : '#18181b'}
          />
          {activeFilters.size > 0 && (
            <View className="absolute -top-1 -right-1 size-4 rounded-full bg-[#dc2626] items-center justify-center">
              <Text className="text-[9px] font-bold text-white">
                {activeFilters.size}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Expandable Party Size & Filter Bar */}
      {showFilterDrawer && (
        <View className="mt-3 bg-neutral-50 rounded-2xl p-3 border border-neutral-200">
          {/* Party Size Stepper */}
          <View className="flex-row items-center justify-between pb-3 border-b border-neutral-200/80">
            <View>
              <Text className="text-xs font-bold text-neutral-800">
                Party Size: {partySize} {partySize === 1 ? 'diner' : 'diners'}
              </Text>
              <Text className="text-[11px] text-neutral-500">
                Personalizes table availability and wait badges
              </Text>
            </View>

            <View className="flex-row items-center bg-white rounded-xl border border-neutral-200 px-1 py-0.5">
              <Pressable
                onPress={() => onPartySizeChange(Math.max(1, partySize - 1))}
                disabled={partySize <= 1}
                className="size-7 rounded-lg items-center justify-center active:bg-neutral-100 disabled:opacity-30">
                <MinusIcon size={14} color="#18181b" />
              </Pressable>
              <Text className="w-6 text-center text-xs font-extrabold text-neutral-900">
                {partySize}
              </Text>
              <Pressable
                onPress={() => onPartySizeChange(Math.min(8, partySize + 1))}
                disabled={partySize >= 8}
                className="size-7 rounded-lg items-center justify-center active:bg-neutral-100 disabled:opacity-30">
                <PlusIcon size={14} color="#18181b" />
              </Pressable>
            </View>
          </View>

          {/* Quick Filter Chips */}
          <View className="flex-row flex-wrap gap-1.5 mt-2.5">
            {filterChips.map((chip) => {
              const isActive = activeFilters.has(chip.key);
              const ChipIcon = chip.icon;
              return (
                <Pressable
                  key={chip.key}
                  onPress={() => onToggleFilter(chip.key)}
                  className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                    isActive
                      ? 'bg-neutral-900 border-neutral-900'
                      : 'bg-white border-neutral-200 active:bg-neutral-100'
                  }`}>
                  <ChipIcon size={13} color={isActive ? '#ffffff' : '#52525b'} />
                  <Text
                    className={`text-xs font-semibold ${
                      isActive ? 'text-white' : 'text-neutral-700'
                    }`}>
                    {chip.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

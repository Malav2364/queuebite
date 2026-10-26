import { Text } from '@/components/ui/text';
import {
  ClockIcon,
  FlameIcon,
  HeartIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';

export type FilterKey = 'OPEN_NOW' | 'SHORTEST_WAIT' | 'FITS_PARTY' | 'FAVORITES';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilters: Set<FilterKey>;
  onToggleFilter: (filter: FilterKey) => void;
  selectedCuisine: string | null;
  onSelectCuisine: (cuisine: string | null) => void;
}

const CUISINES = [
  'All',
  'Italian',
  'Burgers',
  'Japanese',
  'Mexican',
  'Seafood',
  'Indian',
  'French',
];

export function FilterBar({
  searchQuery,
  onSearchChange,
  activeFilters,
  onToggleFilter,
  selectedCuisine,
  onSelectCuisine,
}: FilterBarProps) {
  return (
    <View className="px-4 mb-3 gap-2.5">
      {/* Search Input Bar */}
      <View className="flex-row items-center gap-2.5 bg-white rounded-2xl px-3.5 border border-neutral-200/90 h-12 shadow-xs">
        <SearchIcon size={18} color="#737373" />
        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search restaurant, cuisine, or dish..."
          placeholderTextColor="#a3a3a3"
          className="flex-1 text-sm text-neutral-900"
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => onSearchChange('')} className="p-1">
            <XIcon size={16} color="#737373" />
          </Pressable>
        )}
      </View>

      {/* Quick Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2">
        {/* Open Now Chip */}
        <Pressable
          onPress={() => onToggleFilter('OPEN_NOW')}
          className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
            activeFilters.has('OPEN_NOW')
              ? 'bg-[#d94148] border-[#d94148]'
              : 'bg-white border-neutral-200'
          }`}>
          <FlameIcon
            size={13}
            color={activeFilters.has('OPEN_NOW') ? 'white' : '#737373'}
          />
          <Text
            className={`text-xs font-semibold ${
              activeFilters.has('OPEN_NOW') ? 'text-white' : 'text-neutral-700'
            }`}>
            Open now
          </Text>
        </Pressable>

        {/* Shortest Wait Chip */}
        <Pressable
          onPress={() => onToggleFilter('SHORTEST_WAIT')}
          className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
            activeFilters.has('SHORTEST_WAIT')
              ? 'bg-[#d94148] border-[#d94148]'
              : 'bg-white border-neutral-200'
          }`}>
          <ClockIcon
            size={13}
            color={activeFilters.has('SHORTEST_WAIT') ? 'white' : '#737373'}
          />
          <Text
            className={`text-xs font-semibold ${
              activeFilters.has('SHORTEST_WAIT') ? 'text-white' : 'text-neutral-700'
            }`}>
            Shortest wait
          </Text>
        </Pressable>

        {/* Fits My Party Chip */}
        <Pressable
          onPress={() => onToggleFilter('FITS_PARTY')}
          className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
            activeFilters.has('FITS_PARTY')
              ? 'bg-[#d94148] border-[#d94148]'
              : 'bg-white border-neutral-200'
          }`}>
          <UsersIcon
            size={13}
            color={activeFilters.has('FITS_PARTY') ? 'white' : '#737373'}
          />
          <Text
            className={`text-xs font-semibold ${
              activeFilters.has('FITS_PARTY') ? 'text-white' : 'text-neutral-700'
            }`}>
            Fits my party
          </Text>
        </Pressable>

        {/* Favorites Chip */}
        <Pressable
          onPress={() => onToggleFilter('FAVORITES')}
          className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
            activeFilters.has('FAVORITES')
              ? 'bg-[#d94148] border-[#d94148]'
              : 'bg-white border-neutral-200'
          }`}>
          <HeartIcon
            size={13}
            color={activeFilters.has('FAVORITES') ? 'white' : '#737373'}
            fill={activeFilters.has('FAVORITES') ? 'white' : 'none'}
          />
          <Text
            className={`text-xs font-semibold ${
              activeFilters.has('FAVORITES') ? 'text-white' : 'text-neutral-700'
            }`}>
            Favorites
          </Text>
        </Pressable>
      </ScrollView>

      {/* Cuisine Selector Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2">
        {CUISINES.map((cuisine) => {
          const isSelected =
            cuisine === 'All' ? selectedCuisine === null : selectedCuisine === cuisine;
          return (
            <Pressable
              key={cuisine}
              onPress={() => onSelectCuisine(cuisine === 'All' ? null : cuisine)}
              className={`px-3 py-1 rounded-full ${
                isSelected
                  ? 'bg-neutral-900'
                  : 'bg-neutral-100 active:bg-neutral-200'
              }`}>
              <Text
                className={`text-xs font-semibold ${
                  isSelected ? 'text-white' : 'text-neutral-600'
                }`}>
                {cuisine}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

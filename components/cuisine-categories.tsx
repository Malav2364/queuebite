import { Text } from '@/components/ui/text';
import { CUISINE_CATEGORIES, CuisineCategory } from '@/lib/mock-data';
import * as React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

interface CuisineCategoriesProps {
  selectedCuisine: string | null;
  onSelectCuisine: (cuisine: string | null) => void;
}

export function CuisineCategories({
  selectedCuisine,
  onSelectCuisine,
}: CuisineCategoriesProps) {
  return (
    <View className="py-2.5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
        {CUISINE_CATEGORIES.map((item) => {
          const isSelected = selectedCuisine === item.name;
          return (
            <Pressable
              key={item.id}
              onPress={() => onSelectCuisine(isSelected ? null : item.name)}
              className="items-center active:opacity-80">
              {/* Circular Plate Container */}
              <View
                className={`size-[68px] rounded-full p-1 items-center justify-center border-2 ${
                  isSelected
                    ? 'border-[#dc2626] bg-red-50'
                    : 'border-[#f2e7d5] bg-[#faefe0]'
                } shadow-xs`}>
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-full rounded-full"
                  resizeMode="cover"
                />
              </View>

              {/* Label */}
              <Text
                className={`text-xs mt-1.5 font-semibold ${
                  isSelected ? 'text-[#dc2626] font-bold' : 'text-neutral-800'
                }`}>
                {item.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

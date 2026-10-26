import { Text } from '@/components/ui/text';
import { MinusIcon, PlusIcon, UsersIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

interface PartySizeStepperProps {
  partySize: number;
  onPartySizeChange: (size: number) => void;
  min?: number;
  max?: number;
}

export function PartySizeStepper({
  partySize,
  onPartySizeChange,
  min = 1,
  max = 8,
}: PartySizeStepperProps) {
  function handleDecrement() {
    if (partySize > min) {
      onPartySizeChange(partySize - 1);
    }
  }

  function handleIncrement() {
    if (partySize < max) {
      onPartySizeChange(partySize + 1);
    }
  }

  return (
    <View className="px-4 mb-4">
      <View className="flex-row items-center justify-between bg-white rounded-2xl p-3 border border-neutral-200/90 shadow-xs">
        <View className="flex-row items-center gap-2.5">
          <View className="size-9 rounded-xl bg-neutral-100 items-center justify-center">
            <UsersIcon size={18} color="#1c1c1e" />
          </View>
          <View>
            <Text className="text-xs font-bold text-neutral-900">
              Party size: {partySize} {partySize === 1 ? 'diner' : 'diners'}
            </Text>
            <Text className="text-[10px] text-neutral-500">
              Personalizes wait times &amp; seating availability
            </Text>
          </View>
        </View>

        {/* Stepper Controls */}
        <View className="flex-row items-center gap-2">
          <Pressable
            disabled={partySize <= min}
            onPress={handleDecrement}
            className={`size-8 rounded-lg items-center justify-center border ${
              partySize <= min
                ? 'bg-neutral-50 border-neutral-200 opacity-40'
                : 'bg-white active:bg-neutral-100 border-neutral-300'
            }`}>
            <MinusIcon size={14} color="#1c1c1e" />
          </Pressable>

          <View className="w-6 items-center justify-center">
            <Text className="text-base font-extrabold text-neutral-900">
              {partySize}
            </Text>
          </View>

          <Pressable
            disabled={partySize >= max}
            onPress={handleIncrement}
            className={`size-8 rounded-lg items-center justify-center border ${
              partySize >= max
                ? 'bg-neutral-50 border-neutral-200 opacity-40'
                : 'bg-white active:bg-neutral-100 border-neutral-300'
            }`}>
            <PlusIcon size={14} color="#1c1c1e" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

import * as React from 'react';
import { Image, ImageStyle, StyleProp, View } from 'react-native';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: StyleProp<ImageStyle>;
}

export function BrandLogo({ size = 'md', style }: BrandLogoProps) {
  // Dimensions matching the exact 3.63:1 aspect ratio of the trimmed logo
  const dimensions = {
    sm: { width: 102, height: 28 },
    md: { width: 124, height: 34 },
    lg: { width: 153, height: 42 },
    xl: { width: 182, height: 50 },
  };

  const { width, height } = dimensions[size];

  return (
    <View className="justify-center items-start">
      <Image
        source={require('@/assets/images/queuebite-logo.png')}
        style={[{ width, height, resizeMode: 'contain' }, style]}
        alt="QueueBite"
      />
    </View>
  );
}

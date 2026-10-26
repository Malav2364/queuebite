import * as React from 'react';
import { Image, ImageStyle, StyleProp, View } from 'react-native';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: StyleProp<ImageStyle>;
}

export function BrandLogo({ size = 'md', style }: BrandLogoProps) {
  // Dimensions tailored to the original QueueBite logo aspect ratio
  const dimensions = {
    sm: { width: 110, height: 28 },
    md: { width: 140, height: 35 },
    lg: { width: 175, height: 44 },
    xl: { width: 210, height: 52 },
  };

  const { width, height } = dimensions[size];

  return (
    <View className="justify-center">
      <Image
        source={require('@/assets/images/queuebite-logo.png')}
        style={[{ width, height, resizeMode: 'contain' }, style]}
        alt="QueueBite"
      />
    </View>
  );
}

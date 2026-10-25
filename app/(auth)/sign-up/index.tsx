import { SignUpForm } from '@/components/sign-up-form';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';
import { ChevronLeftIcon } from 'lucide-react-native';
import * as React from 'react';
import { ImageBackground, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <ImageBackground
        source={require('@/assets/images/login-bg.png')}
        resizeMode="cover"
        className="flex-1">
        {/* Top Back Navigation with safe-area spacing */}
        <View
          style={{ paddingTop: Math.max(insets.top, 12) + 2 }}
          className="px-4 pb-0 z-10">
          {router.canGoBack() ? (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full size-8 bg-white/80 active:bg-white border border-black/5 shadow-sm"
              onPress={() => router.back()}>
              <ChevronLeftIcon size={20} className="text-foreground" />
            </Button>
          ) : null}
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="grow items-center justify-center px-4 pt-0 pb-16"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive">
          <View className="w-full max-w-sm -mt-6">
            <SignUpForm />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

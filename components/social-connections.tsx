import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useSSO } from '@clerk/expo';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, Pressable, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export function SocialConnections() {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();

  async function onGoogleLoginPress() {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }

  return (
    <View className="w-full items-center justify-center -mt-1">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Continue with Google"
        className="size-12 rounded-full items-center justify-center border border-neutral-200 shadow-sm"
        style={{ backgroundColor: '#ffffff' }}
        onPress={onGoogleLoginPress}>
        <Image
          className="size-5"
          resizeMode="contain"
          source={{ uri: 'https://img.clerk.com/static/google.png?width=160' }}
        />
      </Pressable>
    </View>
  );
}

const useWarmUpBrowser = Platform.select({
  web: () => { },
  default: () => {
    React.useEffect(() => {
      // Preloads the browser for Android devices to reduce authentication load time
      // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
      void WebBrowser.warmUpAsync();
      return () => {
        // Cleanup: closes browser when component unmounts
        void WebBrowser.coolDownAsync();
      };
    }, []);
  },
});

import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { useSignIn } from '@clerk/expo';
import { Link } from 'expo-router';
import * as React from 'react';
import { Image, type TextInputInstance, View } from 'react-native';

import { MailIcon, LockIcon, ArrowRightIcon } from 'lucide-react-native';

export function SignInForm() {
  const { signIn, fetchStatus } = useSignIn();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const passwordInputRef = React.useRef<TextInputInstance>(null);
  const [error, setError] = React.useState<{ email?: string; password?: string }>({});

  async function onSubmit() {
    if (fetchStatus === 'fetching') {
      return;
    }

    // Start the sign-in process using the email and password provided
    try {
      const { error } = await signIn.password({
        identifier: email,
        password,
      });

      if (error) {
        const message = error.longMessage ?? error.message;
        const isEmailMessage =
          message.toLowerCase().includes('identifier') || message.toLowerCase().includes('email');
        setError(isEmailMessage ? { email: message } : { password: message });
        return;
      }

      if (signIn.status === 'needs_client_trust') {
        setError({
          password: 'Additional verification is required before this device can sign in.',
        });
        return;
      }

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signIn.status === 'complete') {
        setError({ email: '', password: '' });
        await signIn.finalize();
        return;
      }
      // TODO: Handle other statuses
      console.error(JSON.stringify(signIn, null, 2));
    } catch (err) {
      // See https://go.clerk.com/mRUDrIe for more info on error handling
      const message = err instanceof Error ? err.message : 'Something went wrong';
      const isEmailMessage =
        message.toLowerCase().includes('identifier') || message.toLowerCase().includes('email');
      setError(isEmailMessage ? { email: message } : { password: message });
    }
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  return (
    <View className="gap-2">
      <Card className="bg-transparent border-0 shadow-none py-0">
        <CardHeader className="items-start pt-0 px-0 pb-1.5 gap-1">
          <Image
            source={require('@/assets/images/queuebite-logo.png')}
            style={{ width: 195, height: 68, resizeMode: 'contain', marginBottom: 2 }}
            alt="QueueBite"
          />
          <CardTitle className="text-left text-2xl font-bold tracking-tight text-neutral-900">
            Sign in to QueueBite
          </CardTitle>
          <CardDescription className="text-left text-neutral-500 text-xs">
            Welcome back! Please sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-4 px-0 pb-0">
          <View className="gap-4">
            {/* Email Field with Icon */}
            <View className="gap-1.5">
              <Label htmlFor="email" className="text-neutral-900 font-bold text-sm">Email</Label>
              <View className="relative flex-row items-center">
                <View className="absolute left-3.5 z-10">
                  <MailIcon size={18} color="#9ca3af" />
                </View>
                <Input
                  id="email"
                  className="pl-10 h-12 bg-white rounded-xl border-neutral-200 text-neutral-900 text-base"
                  placeholder="m@example.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoComplete="email"
                  autoCapitalize="none"
                  onChangeText={setEmail}
                  onSubmitEditing={onEmailSubmitEditing}
                  returnKeyType="next"
                  submitBehavior="submit"
                />
              </View>
              {error.email ? (
                <Text className="text-xs font-medium text-destructive">{error.email}</Text>
              ) : null}
            </View>

            {/* Password Field with Icon and Red Forgot Password */}
            <View className="gap-1.5">
              <View className="flex-row items-center justify-between">
                <Label htmlFor="password" className="text-neutral-900 font-bold text-sm">Password</Label>
                <Link asChild href={`/(auth)/forgot-password?email=${email}`}>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0">
                    <Text className="text-xs font-semibold text-[#dc2626]">Forgot your password?</Text>
                  </Button>
                </Link>
              </View>
              <View className="relative flex-row items-center">
                <View className="absolute left-3.5 z-10">
                  <LockIcon size={18} color="#9ca3af" />
                </View>
                <Input
                  ref={passwordInputRef}
                  id="password"
                  className="pl-10 h-12 bg-white rounded-xl border-neutral-200 text-neutral-900 text-base"
                  secureTextEntry
                  onChangeText={setPassword}
                  returnKeyType="send"
                  onSubmitEditing={onSubmit}
                />
              </View>
              {error.password ? (
                <Text className="text-xs font-medium text-destructive">{error.password}</Text>
              ) : null}
            </View>

            {/* Dark Continue Button with Arrow */}
            <Button
              className={cn("w-full h-12 rounded-2xl bg-[#1c1c1e] active:bg-neutral-800 flex-row items-center justify-center gap-2 mt-1 shadow-sm", fetchStatus === 'fetching' && 'opacity-50')}
              onPress={onSubmit}>
              <Text className="text-white font-semibold text-base">Continue</Text>
              <ArrowRightIcon size={18} color="white" />
            </Button>
          </View>

          {/* Don't have an account? Sign up centered */}
          <Text className="text-center text-xs text-neutral-700">
            Don&apos;t have an account?{' '}
            <Link href="/(auth)/sign-up" className="text-xs font-semibold text-[#dc2626]">
              Sign up
            </Link>
          </Text>

          {/* Divider */}
          <View className="flex-row items-center py-0.5">
            <Separator className="flex-1 bg-neutral-200" />
            <Text className="px-3 text-xs text-neutral-400 font-normal">or</Text>
            <Separator className="flex-1 bg-neutral-200" />
          </View>

          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}

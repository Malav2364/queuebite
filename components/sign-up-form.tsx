import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { useSignUp } from '@clerk/expo';
import { Link, router } from 'expo-router';
import * as React from 'react';
import { Image, type TextInputInstance, View } from 'react-native';

import { MailIcon, LockIcon, UserIcon, ArrowRightIcon } from 'lucide-react-native';

export function SignUpForm() {
  const { signUp, fetchStatus } = useSignUp();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const lastNameInputRef = React.useRef<TextInputInstance>(null);
  const emailInputRef = React.useRef<TextInputInstance>(null);
  const usernameInputRef = React.useRef<TextInputInstance>(null);
  const passwordInputRef = React.useRef<TextInputInstance>(null);
  const [error, setError] = React.useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    username?: string;
    password?: string;
  }>({});

  async function onSubmit() {
    if (fetchStatus === 'fetching') return;

    setError({});

    try {
      const { error: createError } = await signUp.password({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        emailAddress: email.trim(),
        username: username.trim() || undefined,
        password,
      });

      if (createError) {
        const message = createError.longMessage ?? createError.message;
        const lower = message.toLowerCase();
        if (lower.includes('first name') || lower.includes('first_name')) {
          setError({ firstName: message });
        } else if (lower.includes('last name') || lower.includes('last_name')) {
          setError({ lastName: message });
        } else if (lower.includes('username')) {
          setError({ username: message });
        } else if (lower.includes('identifier') || lower.includes('email')) {
          setError({ email: message });
        } else {
          setError({ password: message });
        }
        return;
      }

      // If email verification is needed
      if (signUp.unverifiedFields?.includes('email_address')) {
        const { error: sendCodeError } = await signUp.verifications.sendEmailCode();
        if (sendCodeError) {
          setError({ email: sendCodeError.longMessage ?? sendCodeError.message });
          return;
        }
        router.push(`/(auth)/sign-up/verify-email?email=${encodeURIComponent(email.trim())}`);
        return;
      }

      if (signUp.status === 'complete') {
        await signUp.finalize();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      const lower = message.toLowerCase();
      if (lower.includes('first name') || lower.includes('first_name')) {
        setError({ firstName: message });
      } else if (lower.includes('last name') || lower.includes('last_name')) {
        setError({ lastName: message });
      } else if (lower.includes('username')) {
        setError({ username: message });
      } else if (lower.includes('identifier') || lower.includes('email')) {
        setError({ email: message });
      } else {
        setError({ password: message });
      }
    }
  }

  function onFirstNameSubmitEditing() {
    lastNameInputRef.current?.focus();
  }

  function onLastNameSubmitEditing() {
    emailInputRef.current?.focus();
  }

  function onEmailSubmitEditing() {
    usernameInputRef.current?.focus();
  }

  function onUsernameSubmitEditing() {
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
            Create your account
          </CardTitle>
          <CardDescription className="text-left text-neutral-500 text-xs">
            Welcome! Please fill in the details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-3 px-0 pb-0">
          <View className="gap-3">
            <View className="flex-row gap-2.5">
              <View className="flex-1 gap-1">
                <Label htmlFor="firstName" className="text-neutral-900 font-bold text-xs">First name</Label>
                <Input
                  id="firstName"
                  className="h-11 px-3.5 text-sm bg-white rounded-xl border-neutral-200"
                  placeholder="John"
                  autoComplete="name-given"
                  autoCapitalize="words"
                  onChangeText={setFirstName}
                  onSubmitEditing={onFirstNameSubmitEditing}
                  returnKeyType="next"
                  submitBehavior="submit"
                />
                {error.firstName ? (
                  <Text className="text-xs font-medium text-destructive">{error.firstName}</Text>
                ) : null}
              </View>

              <View className="flex-1 gap-1">
                <Label htmlFor="lastName" className="text-neutral-900 font-bold text-xs">Last name</Label>
                <Input
                  ref={lastNameInputRef}
                  id="lastName"
                  className="h-11 px-3.5 text-sm bg-white rounded-xl border-neutral-200"
                  placeholder="Doe"
                  autoComplete="name-family"
                  autoCapitalize="words"
                  onChangeText={setLastName}
                  onSubmitEditing={onLastNameSubmitEditing}
                  returnKeyType="next"
                  submitBehavior="submit"
                />
                {error.lastName ? (
                  <Text className="text-xs font-medium text-destructive">{error.lastName}</Text>
                ) : null}
              </View>
            </View>

            <View className="gap-1">
              <Label htmlFor="email" className="text-neutral-900 font-bold text-xs">Email</Label>
              <View className="relative flex-row items-center">
                <View className="absolute left-3.5 z-10">
                  <MailIcon size={18} color="#9ca3af" />
                </View>
                <Input
                  ref={emailInputRef}
                  id="email"
                  className="pl-10 h-11 text-sm bg-white rounded-xl border-neutral-200"
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

            <View className="gap-1">
              <Label htmlFor="username" className="text-neutral-900 font-bold text-xs">Username</Label>
              <View className="relative flex-row items-center">
                <View className="absolute left-3.5 z-10">
                  <UserIcon size={18} color="#9ca3af" />
                </View>
                <Input
                  ref={usernameInputRef}
                  id="username"
                  className="pl-10 h-11 text-sm bg-white rounded-xl border-neutral-200"
                  placeholder="johndoe"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  autoComplete="username"
                  onChangeText={setUsername}
                  onSubmitEditing={onUsernameSubmitEditing}
                  returnKeyType="next"
                  submitBehavior="submit"
                />
              </View>
              {error.username ? (
                <Text className="text-xs font-medium text-destructive">{error.username}</Text>
              ) : null}
            </View>

            <View className="gap-1">
              <Label htmlFor="password" className="text-neutral-900 font-bold text-xs">Password</Label>
              <View className="relative flex-row items-center">
                <View className="absolute left-3.5 z-10">
                  <LockIcon size={18} color="#9ca3af" />
                </View>
                <Input
                  ref={passwordInputRef}
                  id="password"
                  className="pl-10 h-11 text-sm bg-white rounded-xl border-neutral-200"
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
              className={cn("w-full h-12 rounded-2xl bg-[#1c1c1e] active:bg-neutral-800 flex-row items-center justify-center gap-2 mt-0.5 shadow-sm", fetchStatus === 'fetching' && 'opacity-50')}
              onPress={onSubmit}>
              <Text className="text-white text-sm font-semibold">Continue</Text>
              <ArrowRightIcon size={16} color="white" />
            </Button>
          </View>

          <Text className="text-center text-xs text-neutral-700">
            Already have an account?{' '}
            <Link href="/(auth)/sign-in" dismissTo className="text-xs font-semibold text-[#d94148]">
              Sign in
            </Link>
          </Text>
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

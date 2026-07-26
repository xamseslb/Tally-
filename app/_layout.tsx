import '@/lib/i18n';

import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { type AuthStatus, useAuthStore } from '@/features/auth';
import { type MembershipStatus, useMembershipStore } from '@/features/organizations';
import { colors } from '@/ui';

// Error boundary på rotnivå (spec §4). Gjelder hele treet.
export { RouteError as ErrorBoundary } from '@/ui';

void SplashScreen.preventAutoHideAsync();

/** Ruter etter auth OG medlemskap: uinnlogget → innlogging, uten org → onboarding. */
function useProtectedRoute(authStatus: AuthStatus, memberStatus: MembershipStatus): void {
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    if (authStatus === 'loading') return;
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    if (authStatus === 'signedOut') {
      if (!inAuthGroup) router.replace('/(auth)/sign-in');
      return;
    }
    // signedIn — vent til medlemskap er avklart
    if (memberStatus === 'loading') return;
    if (memberStatus === 'none') {
      if (!inOnboarding) router.replace('/onboarding');
      return;
    }
    // Fullt medlem: ut av auth/onboarding og inn i appen
    if (inAuthGroup || inOnboarding) router.replace('/(tabs)/reports');
  }, [authStatus, memberStatus, segments, router]);
}

export default function RootLayout() {
  const status = useAuthStore((s) => s.status);
  const session = useAuthStore((s) => s.session);
  const initialize = useAuthStore((s) => s.initialize);
  const memberStatus = useMembershipStore((s) => s.status);
  const refreshMembership = useMembershipStore((s) => s.refresh);
  const resetMembership = useMembershipStore((s) => s.reset);

  useEffect(() => initialize(), [initialize]);

  useEffect(() => {
    const userId = session?.user.id;
    if (status === 'signedIn' && userId) void refreshMembership(userId);
    else if (status === 'signedOut') resetMembership();
  }, [status, session, refreshMembership, resetMembership]);

  useEffect(() => {
    if (status !== 'loading') void SplashScreen.hideAsync();
  }, [status]);

  useProtectedRoute(status, memberStatus);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.paper },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="report/[id]/index" options={{ presentation: 'card' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = { root: { flex: 1 } } as const;

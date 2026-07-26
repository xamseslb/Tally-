import '@/lib/i18n';

import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { type AuthStatus, useAuthStore } from '@/features/auth';
import { colors } from '@/ui';

// Error boundary på rotnivå (spec §4). Gjelder hele treet.
export { RouteError as ErrorBoundary } from '@/ui';

void SplashScreen.preventAutoHideAsync();

/** Sender uinnloggede til innlogging og innloggede vekk fra auth-skjermene. */
function useProtectedRoute(status: AuthStatus): void {
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    if (status === 'loading') return;
    const inAuthGroup = segments[0] === '(auth)';
    if (status === 'signedOut' && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (status === 'signedIn' && inAuthGroup) {
      router.replace('/(tabs)/reports');
    }
  }, [status, segments, router]);
}

export default function RootLayout() {
  const status = useAuthStore((s) => s.status);
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => initialize(), [initialize]);

  useEffect(() => {
    if (status !== 'loading') void SplashScreen.hideAsync();
  }, [status]);

  useProtectedRoute(status);

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
          <Stack.Screen name="report/[id]/index" options={{ presentation: 'card' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = { root: { flex: 1 } } as const;

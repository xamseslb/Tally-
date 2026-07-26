import { Redirect } from 'expo-router';

// Foreløpig inngang. Ekte auth-gate (sesjon fra secure-store) kommer i Fase 1.
export default function Index() {
  return <Redirect href="/(tabs)/reports" />;
}

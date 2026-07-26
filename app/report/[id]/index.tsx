import { useLocalSearchParams } from 'expo-router';

import { Screen, Text } from '@/ui';

/** Rapportdetalj — plassholder i Fase 0. Skjema + tilstandsmaskin i Fase 3. */
export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Screen>
      <Text variant="title">Rapport</Text>
      <Text variant="mono" color="slate">
        {id}
      </Text>
    </Screen>
  );
}

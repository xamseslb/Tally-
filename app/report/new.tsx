import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Card, Screen, Text, colors, spacing } from '@/ui';

/** Plassholder for rapport-flyten (Fase 3–5). Skjema + signatur bygges her. */
export default function NewReportScreen() {
  const router = useRouter();
  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Tilbake" hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </Pressable>
        <Text variant="title">Ny rapport</Text>
      </View>

      <Card>
        <Text variant="heading">Rapportskjemaet bygges nå</Text>
        <Text variant="body" color="slate">
          Dato, vær, bemanning, utført arbeid, vedlegg (bilder/video) og elektronisk signatur kommer
          i neste steg — koblet til databasen med tilstandsmaskinen utkast → levert → signert → låst
          (spec §3 FR-3 til FR-8).
        </Text>
      </Card>
    </Screen>
  );
}

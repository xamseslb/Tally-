import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { NewReportForm } from '@/features/reports';
import { Screen, Text, colors, spacing } from '@/ui';

export default function NewReportScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Back" hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </Pressable>
        <Text variant="title">{t('overview.newReport')}</Text>
      </View>
      <NewReportForm onCreated={() => router.back()} defaultProjectId={projectId} />
    </Screen>
  );
}

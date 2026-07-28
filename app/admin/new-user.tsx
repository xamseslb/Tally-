import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { CreateUserForm } from '@/features/team';
import { Screen, Text, colors, spacing } from '@/ui';

export default function NewUserScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Back" hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </Pressable>
        <Text variant="title">{t('team.newUser')}</Text>
      </View>
      <CreateUserForm onCreated={() => router.back()} />
    </Screen>
  );
}

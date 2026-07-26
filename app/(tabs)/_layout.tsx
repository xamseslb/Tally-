import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { colors } from '@/ui';

export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.slate,
      }}
    >
      <Tabs.Screen name="projects/index" options={{ title: t('tabs.projects') }} />
      <Tabs.Screen name="reports/index" options={{ title: t('tabs.reports') }} />
      <Tabs.Screen name="chat/index" options={{ title: t('tabs.chat') }} />
    </Tabs>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { type ColorValue } from 'react-native';

import { colors } from '@/ui';

type IoniconName = keyof typeof Ionicons.glyphMap;

function tabIcon(name: IoniconName) {
  const Icon = ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={name} size={size} color={color} />
  );
  Icon.displayName = `TabIcon(${name})`;
  return Icon;
}

export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.slate,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="reports/index"
        options={{ title: t('tabs.oversikt'), tabBarIcon: tabIcon('home-outline') }}
      />
      <Tabs.Screen
        name="projects/index"
        options={{ title: t('tabs.projects'), tabBarIcon: tabIcon('business-outline') }}
      />
      <Tabs.Screen
        name="chat/index"
        options={{ title: t('tabs.chat'), tabBarIcon: tabIcon('chatbubble-outline') }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{ title: t('tabs.profil'), tabBarIcon: tabIcon('person-outline') }}
      />
    </Tabs>
  );
}

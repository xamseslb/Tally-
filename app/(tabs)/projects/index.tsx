import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, Field, Header, Screen, Text, colors, radius, spacing } from '@/ui';

type Filter = 'active' | 'archived' | 'all';

/** Prosjektliste — søk + filtre (mockup). Ekte data kobles på i Fase 2. */
export default function ProsjekterScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>('active');
  const filters: Filter[] = ['active', 'archived', 'all'];

  return (
    <Screen scroll>
      <Header
        title={t('tabs.projects')}
        right={
          <Pressable accessibilityLabel={t('projects.newProject')} hitSlop={8}>
            <Ionicons name="add-circle" size={28} color={colors.brand} />
          </Pressable>
        }
      />

      <Field label={t('projects.search')} placeholder={t('projects.search')} />

      <View style={styles.segment}>
        {filters.map((f) => {
          const selected = f === filter;
          return (
            <Pressable
              key={f}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => setFilter(f)}
              style={[styles.pill, selected && styles.pillSelected]}
            >
              <Text variant="label" style={{ color: selected ? colors.onBrand : colors.slate }}>
                {t(`projects.${f}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Card>
        <View style={{ alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm }}>
          <Ionicons name="business-outline" size={40} color={colors.slate} />
          <Text variant="body" color="slate">
            {t('projects.empty')}
          </Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  segment: { flexDirection: 'row', gap: spacing.sm },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  pillSelected: { backgroundColor: colors.brand, borderColor: colors.brand },
});

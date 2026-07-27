import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProjectCard, useProjects } from '@/features/projects';
import { Card, Field, Header, Text, colors, radius, spacing } from '@/ui';

type Filter = 'active' | 'archived' | 'all';
const FILTERS: Filter[] = ['active', 'archived', 'all'];

export default function ProsjekterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { projects, refetch } = useProjects();
  const [filter, setFilter] = useState<Filter>('active');
  const [query, setQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  const visible = useMemo(() => {
    const archived = (s: string) => s === 'archived' || s === 'completed';
    return projects
      .filter((p) =>
        filter === 'all' ? true : filter === 'archived' ? archived(p.status) : !archived(p.status),
      )
      .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));
  }, [projects, filter, query]);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <FlatList
          data={visible}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.content}
          renderItem={({ item }) => <ProjectCard project={item} />}
          ListHeaderComponent={
            <View style={styles.headerBlock}>
              <Header
                title={t('tabs.projects')}
                right={
                  <Pressable
                    accessibilityLabel={t('projects.newProject')}
                    hitSlop={8}
                    onPress={() => router.push('/project/new')}
                  >
                    <Ionicons name="add-circle" size={28} color={colors.brand} />
                  </Pressable>
                }
              />
              <Field
                label={t('projects.search')}
                placeholder={t('projects.search')}
                value={query}
                onChangeText={setQuery}
              />
              <View style={styles.segment}>
                {FILTERS.map((f) => {
                  const selected = f === filter;
                  return (
                    <Pressable
                      key={f}
                      accessibilityRole="tab"
                      accessibilityState={{ selected }}
                      onPress={() => setFilter(f)}
                      style={[styles.pill, selected && styles.pillSelected]}
                    >
                      <Text
                        variant="label"
                        style={{ color: selected ? colors.onBrand : colors.slate }}
                      >
                        {t(`projects.${f}`)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          }
          ListEmptyComponent={
            <Card>
              <View style={styles.empty}>
                <Ionicons name="business-outline" size={40} color={colors.slate} />
                <Text variant="body" color="slate">
                  {t('projects.empty')}
                </Text>
              </View>
            </Card>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  flex: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.md },
  headerBlock: { gap: spacing.lg, marginBottom: spacing.xs },
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
  empty: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
});

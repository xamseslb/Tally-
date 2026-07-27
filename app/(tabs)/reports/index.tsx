import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ReportCard, useReports } from '@/features/reports';
import { Button, Card, Header, Text, colors, spacing } from '@/ui';

/** Oversikt (hjem) — «Mine rapporter» med ekte data + «Ny rapport». */
export default function OversiktScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { reports, refetch } = useReports();

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <FlatList
          data={reports}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.content}
          renderItem={({ item }) => <ReportCard report={item} />}
          ListHeaderComponent={
            <View style={styles.headerBlock}>
              <Header
                title={t('tabs.oversikt')}
                right={
                  <Pressable accessibilityLabel="Varsler" hitSlop={8}>
                    <Ionicons name="notifications-outline" size={24} color={colors.ink} />
                  </Pressable>
                }
              />
              <Text variant="heading">{t('overview.myReports')}</Text>
            </View>
          }
          ListEmptyComponent={
            <Card>
              <View style={styles.empty}>
                <Ionicons name="document-text-outline" size={40} color={colors.slate} />
                <Text variant="body" color="slate" style={{ textAlign: 'center' }}>
                  {t('overview.empty')}
                </Text>
              </View>
            </Card>
          }
          ListFooterComponent={
            <View style={{ marginTop: spacing.lg }}>
              <Button
                label={`+  ${t('overview.newReport')}`}
                onPress={() => router.push('/report/new')}
              />
            </View>
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
  empty: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
});

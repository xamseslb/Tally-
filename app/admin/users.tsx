import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MemberCard, useMembers } from '@/features/team';
import { Card, Header, Text, colors, spacing } from '@/ui';

export default function TeamScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { members, refetch } = useMembers();

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <FlatList
          data={members}
          keyExtractor={(m) => m.user_id}
          contentContainerStyle={styles.content}
          renderItem={({ item }) => <MemberCard member={item} />}
          ListHeaderComponent={
            <View style={{ marginBottom: spacing.xs }}>
              <Header
                title={t('team.title')}
                right={
                  <Pressable
                    accessibilityLabel={t('team.newUser')}
                    hitSlop={8}
                    onPress={() => router.push('/admin/new-user')}
                  >
                    <Ionicons name="person-add" size={26} color={colors.brand} />
                  </Pressable>
                }
              />
            </View>
          }
          ListEmptyComponent={
            <Card>
              <Text variant="body" color="slate">
                {t('team.empty')}
              </Text>
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
});

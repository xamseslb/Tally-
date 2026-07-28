import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Badge, type BadgeTone, Card, Text } from '@/ui';

import type { Member } from '../api/team-api';

const TONE: Record<string, BadgeTone> = {
  admin: 'info',
  manager: 'info',
  client: 'warning',
};

export function MemberCard({ member }: { member: Member }) {
  const { t } = useTranslation();
  return (
    <Card>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text variant="heading">{member.profiles?.full_name ?? '—'}</Text>
          {member.profiles?.username ? (
            <Text variant="mono" color="slate">
              @{member.profiles.username}
            </Text>
          ) : null}
        </View>
        <Badge tone={TONE[member.role] ?? 'neutral'} label={t(`roles.${member.role}`)} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  info: { flexShrink: 1, gap: 2 },
});

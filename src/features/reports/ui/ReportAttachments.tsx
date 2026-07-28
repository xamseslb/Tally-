import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native';

import { Card, Text, colors, radius, spacing } from '@/ui';

import { getSignedUrl, removeAttachment, uploadAttachment } from '../api/attachments-api';
import type { AttachmentRow, ReportDetail } from '../api/reports-api';

function Thumb({
  att,
  editable,
  onRemove,
}: {
  att: AttachmentRow;
  editable: boolean;
  onRemove: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (att.storage_path) void getSignedUrl(att.storage_path).then(setUrl);
  }, [att.storage_path]);

  return (
    <View style={styles.thumbWrap}>
      {att.kind === 'video' ? (
        <View style={[styles.thumb, styles.centered]}>
          <Ionicons name="videocam" size={28} color={colors.slate} />
        </View>
      ) : url ? (
        <Image source={{ uri: url }} style={styles.thumb} resizeMode="cover" />
      ) : (
        <View style={[styles.thumb, styles.centered]}>
          <ActivityIndicator />
        </View>
      )}
      {editable ? (
        <Pressable style={styles.remove} onPress={onRemove} accessibilityLabel="Remove" hitSlop={6}>
          <Ionicons name="close-circle" size={22} color={colors.ink} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function ReportAttachments({
  report,
  editable,
  onChanged,
}: {
  report: ReportDetail;
  editable: boolean;
  onChanged: () => void;
}) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);

  const pickAndUpload = async (): Promise<void> => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 0.7,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];

    setBusy(true);
    let lat: number | undefined;
    let lng: number | undefined;
    try {
      const loc = await Location.requestForegroundPermissionsAsync();
      if (loc.granted) {
        const pos = await Location.getCurrentPositionAsync({});
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      }
    } catch {
      // GPS er valgfritt — hopp over hvis det ikke er tilgjengelig
    }
    await uploadAttachment(report.id, { uri: asset.uri, mimeType: asset.mimeType }, { lat, lng });
    setBusy(false);
    onChanged();
  };

  return (
    <Card>
      <Text variant="heading">{t('report.photos')}</Text>
      {report.attachments.length === 0 ? (
        <Text variant="small" color="slate">
          {t('report.none')}
        </Text>
      ) : (
        <View style={styles.grid}>
          {report.attachments.map((a) => (
            <Thumb
              key={a.id}
              att={a}
              editable={editable}
              onRemove={async () => {
                await removeAttachment(a.id, a.storage_path);
                onChanged();
              }}
            />
          ))}
        </View>
      )}
      {editable ? (
        <Pressable
          onPress={() => void pickAndUpload()}
          style={styles.addBtn}
          accessibilityRole="button"
          accessibilityLabel={t('report.addPhoto')}
        >
          {busy ? (
            <ActivityIndicator color={colors.brand} />
          ) : (
            <>
              <Ionicons name="camera-outline" size={20} color={colors.brand} />
              <Text variant="label" style={{ color: colors.brand }}>
                {t('report.addPhoto')}
              </Text>
            </>
          )}
        </Pressable>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  thumbWrap: { position: 'relative' },
  thumb: { width: 96, height: 96, borderRadius: radius.md, backgroundColor: colors.paper },
  centered: { alignItems: 'center', justifyContent: 'center' },
  remove: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.surface,
    borderRadius: 999,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.brand,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
});

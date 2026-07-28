import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Field, Text, colors, spacing } from '@/ui';

import {
  addEquipment,
  addManpower,
  addMaterial,
  type LineKind,
  removeLineItem,
  type ReportDetail,
} from '../api/reports-api';

interface SectionProps {
  report: ReportDetail;
  editable: boolean;
  onChanged: () => void;
}

const num = (s: string): number => {
  const n = Number(s.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};

function RemoveButton({
  kind,
  id,
  onChanged,
}: {
  kind: LineKind;
  id: string;
  onChanged: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel="Remove"
      hitSlop={6}
      onPress={async () => {
        await removeLineItem(kind, id);
        onChanged();
      }}
    >
      <Ionicons name="close-circle" size={20} color={colors.slate} />
    </Pressable>
  );
}

function Row({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Text variant="body" style={{ flexShrink: 1 }}>
        {label}
      </Text>
      {children}
    </View>
  );
}

export function ReportLineItems({ report, editable, onChanged }: SectionProps) {
  const { t } = useTranslation();

  // Local add-state
  const [trade, setTrade] = useState('');
  const [headcount, setHeadcount] = useState('');
  const [hours, setHours] = useState('');
  const [eqName, setEqName] = useState('');
  const [eqHours, setEqHours] = useState('');
  const [matName, setMatName] = useState('');
  const [matQty, setMatQty] = useState('');
  const [matUnit, setMatUnit] = useState('');

  const addLabour = async () => {
    if (!trade.trim()) return;
    await addManpower(report.id, {
      trade: trade.trim(),
      headcount: num(headcount) || 1,
      hours: num(hours),
    });
    setTrade('');
    setHeadcount('');
    setHours('');
    onChanged();
  };
  const addEquip = async () => {
    if (!eqName.trim()) return;
    await addEquipment(report.id, {
      name: eqName.trim(),
      hours: eqHours ? num(eqHours) : undefined,
    });
    setEqName('');
    setEqHours('');
    onChanged();
  };
  const addMat = async () => {
    if (!matName.trim()) return;
    await addMaterial(report.id, {
      name: matName.trim(),
      quantity: matQty ? num(matQty) : undefined,
      unit: matUnit.trim() || undefined,
    });
    setMatName('');
    setMatQty('');
    setMatUnit('');
    onChanged();
  };

  return (
    <>
      <Card>
        <Text variant="heading">{t('report.labour')}</Text>
        {report.manpower.length === 0 ? (
          <Text variant="small" color="slate">
            {t('report.none')}
          </Text>
        ) : (
          report.manpower.map((m) => (
            <Row key={m.id} label={`${m.trade} — ${m.headcount} × ${m.hours}h`}>
              {editable ? <RemoveButton kind="manpower" id={m.id} onChanged={onChanged} /> : null}
            </Row>
          ))
        )}
        {editable ? (
          <View style={styles.addBlock}>
            <Field label={t('report.trade')} value={trade} onChangeText={setTrade} />
            <View style={styles.inline}>
              <View style={styles.half}>
                <Field
                  label={t('report.headcount')}
                  value={headcount}
                  onChangeText={setHeadcount}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.half}>
                <Field
                  label={t('report.hours')}
                  value={hours}
                  onChangeText={setHours}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            <Button label={t('report.add')} variant="secondary" onPress={() => void addLabour()} />
          </View>
        ) : null}
      </Card>

      <Card>
        <Text variant="heading">{t('report.equipment')}</Text>
        {report.equipment.length === 0 ? (
          <Text variant="small" color="slate">
            {t('report.none')}
          </Text>
        ) : (
          report.equipment.map((e) => (
            <Row key={e.id} label={`${e.name}${e.hours != null ? ` — ${e.hours}h` : ''}`}>
              {editable ? <RemoveButton kind="equipment" id={e.id} onChanged={onChanged} /> : null}
            </Row>
          ))
        )}
        {editable ? (
          <View style={styles.addBlock}>
            <Field label={t('report.equipmentName')} value={eqName} onChangeText={setEqName} />
            <Field
              label={t('report.hours')}
              value={eqHours}
              onChangeText={setEqHours}
              keyboardType="decimal-pad"
            />
            <Button label={t('report.add')} variant="secondary" onPress={() => void addEquip()} />
          </View>
        ) : null}
      </Card>

      <Card>
        <Text variant="heading">{t('report.materials')}</Text>
        {report.materials.length === 0 ? (
          <Text variant="small" color="slate">
            {t('report.none')}
          </Text>
        ) : (
          report.materials.map((m) => (
            <Row
              key={m.id}
              label={`${m.name}${m.quantity != null ? ` — ${m.quantity}${m.unit ? ' ' + m.unit : ''}` : ''}`}
            >
              {editable ? <RemoveButton kind="materials" id={m.id} onChanged={onChanged} /> : null}
            </Row>
          ))
        )}
        {editable ? (
          <View style={styles.addBlock}>
            <Field label={t('report.materialName')} value={matName} onChangeText={setMatName} />
            <View style={styles.inline}>
              <View style={styles.half}>
                <Field
                  label={t('report.quantity')}
                  value={matQty}
                  onChangeText={setMatQty}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.half}>
                <Field label={t('report.unit')} value={matUnit} onChangeText={setMatUnit} />
              </View>
            </View>
            <Button label={t('report.add')} variant="secondary" onPress={() => void addMat()} />
          </View>
        ) : null}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingVertical: 2,
  },
  addBlock: { gap: spacing.sm, marginTop: spacing.sm },
  inline: { flexDirection: 'row', gap: spacing.sm },
  half: { flex: 1 },
});

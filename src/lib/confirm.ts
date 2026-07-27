import { Alert, Platform } from 'react-native';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
}

/**
 * Kryssplattform bekreftelse. På enhet brukes iOS/Android sin native Alert;
 * på web (forhåndsvisning) brukes window.confirm siden react-native-web ikke
 * implementerer Alert.
 */
export function confirm(opts: ConfirmOptions): void {
  if (Platform.OS === 'web') {
    const text = opts.message ? `${opts.title}\n\n${opts.message}` : opts.title;
    const ok = typeof window !== 'undefined' && window.confirm(text);
    if (ok) opts.onConfirm();
    return;
  }
  Alert.alert(opts.title, opts.message, [
    { text: opts.cancelLabel, style: 'cancel' },
    {
      text: opts.confirmLabel,
      style: opts.destructive ? 'destructive' : 'default',
      onPress: opts.onConfirm,
    },
  ]);
}

/** Kryssplattform enkel melding. */
export function notify(message: string): void {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.alert(message);
    return;
  }
  Alert.alert('', message);
}

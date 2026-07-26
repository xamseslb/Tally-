import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button, Field, Screen, Text, spacing } from '@/ui';

/**
 * Innloggingsskjerm — kun UI i Fase 0. Ekte auth (e-post + passord, magic link,
 * Sign in with Apple) bygges i Fase 1 med Supabase Auth.
 */
export default function SignInScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Screen>
      <View style={{ gap: spacing.lg, flex: 1, justifyContent: 'center' }}>
        <Text variant="display">{t('app.name')}</Text>
        <Field
          label={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <Field
          label={t('auth.password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
        />
        <Button label={t('auth.signIn')} onPress={() => {}} />
      </View>
    </Screen>
  );
}

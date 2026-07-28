import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button, Field, Text, spacing } from '@/ui';

import { sendMagicLink, signInWithPassword } from '../api/auth-api';
import { magicLinkSchema, signInSchema, type SignInInput } from '../model/schemas';

/** Innloggingsskjema. Ved vellykket innlogging bytter auth-lytteren rute selv. */
export function SignInForm() {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);

  const onSubmit = async (input: SignInInput): Promise<void> => {
    setFormError(null);
    const result = await signInWithPassword(input);
    if (!result.ok) setFormError(result.error);
  };

  const onMagicLink = async (): Promise<void> => {
    setFormError(null);
    const parsed = magicLinkSchema.safeParse({ email: getValues('email') });
    if (!parsed.success) {
      setFormError('Skriv inn e-post for å få en innloggingslenke.');
      return;
    }
    const result = await sendMagicLink(parsed.data);
    if (result.ok) setMagicSent(true);
    else setFormError(result.error);
  };

  return (
    <View style={{ gap: spacing.md }}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Field
            label={t('auth.emailOrUsername')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Field
            label={t('auth.password')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
            secureTextEntry
            textContentType="password"
          />
        )}
      />

      {formError ? (
        <Text variant="small" color="alert" accessibilityLiveRegion="polite">
          {formError}
        </Text>
      ) : null}
      {magicSent ? (
        <Text variant="small" color="slate" accessibilityLiveRegion="polite">
          {t('auth.magicLinkSent')}
        </Text>
      ) : null}

      <Button
        label={t('auth.signIn')}
        loading={isSubmitting}
        onPress={() => {
          void handleSubmit(onSubmit)();
        }}
      />
      <Button
        label={t('auth.magicLink')}
        variant="secondary"
        onPress={() => {
          void onMagicLink();
        }}
      />
    </View>
  );
}

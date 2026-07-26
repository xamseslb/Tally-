import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import nb from './locales/nb.json';

/**
 * i18n fra dag én (spec §4). Norsk bokmål er standard, engelsk er andrespråk.
 * Etterinnføring av oversettelse er dyrt — derfor all tekst via nøkler herfra.
 */
const deviceLanguage = getLocales()[0]?.languageCode ?? 'nb';

// eslint-disable-next-line import/no-named-as-default-member -- i18n.use er riktig kjede-API
void i18n.use(initReactI18next).init({
  resources: {
    nb: { translation: nb },
    en: { translation: en },
  },
  lng: deviceLanguage === 'en' ? 'en' : 'nb',
  fallbackLng: 'nb',
  interpolation: { escapeValue: false },
});

export default i18n;

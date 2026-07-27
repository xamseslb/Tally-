import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import nb from './locales/nb.json';

/**
 * i18n fra dag én. Appen brukes i Somalia med engelsk grensesnitt, så engelsk
 * er standard. Norsk beholdes for utvikling; somali kan legges til som `so.json`.
 * All tekst går via nøkler herfra — etterinnføring av oversettelse er dyrt.
 */
// eslint-disable-next-line import/no-named-as-default-member -- i18n.use er riktig kjede-API
void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    nb: { translation: nb },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;

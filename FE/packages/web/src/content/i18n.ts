import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enHomepage from './locales/en/homepage.json';
import esHomepage from './locales/es/homepage.json';
import enCommon from './locales/en/common.json';
import esCommon from './locales/es/common.json';

const resources = {
  en: {
    homepage: enHomepage,
    common: enCommon,
  },
  es: {
    homepage: esHomepage,
    common: esCommon,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    defaultNS: 'common',
    ns: ['common', 'homepage'],
  });

export default i18n;

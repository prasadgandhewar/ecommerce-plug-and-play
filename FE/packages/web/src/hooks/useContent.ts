import { useTranslation } from 'react-i18next';

export const useContent = (namespace?: string) => {
  const { t, i18n } = useTranslation();
  
  const translate = (key: string, options?: any) => {
    const fullKey = namespace ? `${namespace}:${key}` : key;
    return t(fullKey, options);
  };
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const getAvailableLanguages = () => {
    return ['en', 'es'];
  };

  return {
    t: translate,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    isRTL: i18n.dir() === 'rtl',
  };
};

export default useContent;

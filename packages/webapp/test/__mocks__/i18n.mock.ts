import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as i18nEn from '../../src/webview/i18n/i18n.json';

const data = i18nEn;
const i18nData: { [x: string]: string } = {};

Object.keys(data).forEach((key: string) => {
    i18nData[key] = key;
});

i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    debug: false,

    interpolation: {
        escapeValue: false // not needed for react!!
    },

    resources: { en: { translations: i18nData } }
});

export default i18n;

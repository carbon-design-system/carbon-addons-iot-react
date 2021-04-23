import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import pluralGetSet from 'dayjs/plugin/pluralGetSet';
import timezone from 'dayjs/plugin/timezone';
import localeData from 'dayjs/plugin/localeData';

// dayjs doesn't load locale data automatically, specify locales to include in bundle here
// eslint-disable-next-line global-require, import/no-dynamic-require
['en', 'es', 'de', 'fr', 'ja'].forEach((locale) => require(`dayjs/locale/${locale}`));

dayjs.extend(localizedFormat); // gives the 'L' formatting ability for .format
dayjs.extend(utc); // gives .utc() and .local()
dayjs.extend(pluralGetSet); // gives .hour .minute get/set ability
dayjs.extend(pluralGetSet); // gives .hour .minute get/set ability
dayjs.extend(timezone); // timezone support
dayjs.extend(localeData); // gives local specific data

export default dayjs;

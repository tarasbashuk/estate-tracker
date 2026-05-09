import { cookies } from 'next/headers';

import { localeCookieName, isLocale, type Locale } from './i18n';

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(localeCookieName)?.value;

  return isLocale(locale) ? locale : 'en';
}

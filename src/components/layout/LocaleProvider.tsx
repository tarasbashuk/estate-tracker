'use client';

import { createContext, useContext, useEffect } from 'react';

import { translate, type Locale } from '@/lib/i18n';

const LocaleContext = createContext<Locale>('en');

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>
      <DomTranslator locale={locale} />
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useT() {
  const locale = useLocale();

  return (text: string) => translate(locale, text);
}

function DomTranslator({ locale }: { locale: Locale }) {
  useEffect(() => {
    if (locale === 'en') return;

    const translateNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const value = node.textContent;
        const trimmed = value?.trim();

        if (!value || !trimmed) return;

        const translated = translate(locale, trimmed);

        if (translated !== trimmed) {
          node.textContent = value.replace(trimmed, translated);
        }

        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return;

      node.childNodes.forEach(translateNode);
    };

    translateNode(document.body);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(translateNode);
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [locale]);

  return null;
}

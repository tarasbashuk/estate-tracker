export const locales = ['en', 'uk'] as const;

export type Locale = (typeof locales)[number];

export const localeCookieName = 'estate-tracker-locale';

export function isLocale(value: unknown): value is Locale {
  return locales.includes(value as Locale);
}

export const dictionary = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      properties: 'Properties',
      tenants: 'Tenants',
      agreements: 'Agreements',
      statements: 'Statements',
      reminders: 'Reminders',
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Snapshot of properties, income, and open operational tasks.',
      activeProperties: 'Active properties',
      activeAgreements: 'Active agreements',
      expectedIncome: 'Expected income',
      receivedIncome: 'Received income',
      overdueReminders: 'Overdue reminders',
      openReminders: 'Open reminders',
      openRemindersSubtitle:
        'Upcoming and overdue work that still needs attention.',
      viewAllReminders: 'View all reminders',
      noOpenReminders: 'No open reminders',
      noOpenRemindersDescription:
        'Create reminders for readings, payment due dates, or custom tasks.',
    },
    language: {
      label: 'Language',
      english: 'EN',
      ukrainian: 'UK',
    },
  },
  uk: {
    nav: {
      dashboard: 'Дашборд',
      properties: 'Нерухомість',
      tenants: 'Орендарі',
      agreements: 'Договори',
      statements: 'Рахунки',
      reminders: 'Нагадування',
    },
    dashboard: {
      title: 'Дашборд',
      subtitle: 'Огляд нерухомості, оплат і відкритих задач.',
      activeProperties: 'Активні обʼєкти',
      activeAgreements: 'Активні договори',
      expectedIncome: 'Очікуваний дохід',
      receivedIncome: 'Отриманий дохід',
      overdueReminders: 'Прострочені нагадування',
      openReminders: 'Відкриті нагадування',
      openRemindersSubtitle:
        'Найближчі та прострочені задачі, які потребують уваги.',
      viewAllReminders: 'Усі нагадування',
      noOpenReminders: 'Немає відкритих нагадувань',
      noOpenRemindersDescription:
        'Створіть нагадування для показників, дат оплати або власних задач.',
    },
    language: {
      label: 'Мова',
      english: 'EN',
      ukrainian: 'UK',
    },
  },
} as const;

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

const ukTranslations: Record<string, string> = {
  'Estate Tracker': 'Estate Tracker',
  'Private rental property management for properties, tenants, statements, payments, and operational tasks.':
    'Приватний застосунок для керування нерухомістю, орендарями, рахунками, оплатами та задачами.',
  'Open dashboard': 'Відкрити дашборд',
  'Sign in': 'Увійти',
  Close: 'Закрити',
  Back: 'Назад',
  'Try again': 'Спробувати ще раз',
  None: 'Немає',
  Label: 'Назва',
  Context: 'Контекст',
  Month: 'Місяць',
  Year: 'Рік',
  Item: 'Рядок',
  Address: 'Адреса',
  Contact: 'Контакт',
  Saving: 'Збереження',
  'Saving...': 'Збереження...',
  Creating: 'Створення',
  'Creating...': 'Створення...',
  Edit: 'Редагувати',
  Done: 'Готово',
  Skip: 'Пропустити',
  Cancel: 'Скасувати',
  Actions: 'Дії',
  Status: 'Статус',
  Notes: 'Нотатки',
  Type: 'Тип',
  Name: 'Назва',
  Description: 'Опис',
  Property: 'Обʼєкт',
  Tenant: 'Орендар',
  Agreement: 'Договір',
  Statement: 'Рахунок',
  Meter: 'Лічильник',
  Amount: 'Сума',
  Currency: 'Валюта',
  Category: 'Категорія',
  Method: 'Метод',
  Date: 'Дата',
  Total: 'Разом',
  Paid: 'Сплачено',
  Remaining: 'Залишок',
  Expected: 'Очікується',
  'Due date': 'Дата оплати',
  Due: 'До',
  Period: 'Період',
  Workflow: 'Процес',
  Payment: 'Оплата',
  Items: 'Рядки',
  Overview: 'Огляд',
  History: 'Історія',
  'No schedule': 'Без графіка',
  'No readings': 'Немає показників',
  'No meters yet': 'Лічильників ще немає',
  'No payments recorded': 'Платежів ще немає',
  'Record received tenant payments against this statement.':
    'Записуйте отримані платежі орендаря для цього рахунку.',

  // Properties
  Properties: 'Нерухомість',
  'Rental properties': 'Орендна нерухомість',
  'Add property': 'Додати обʼєкт',
  'Create property': 'Створити обʼєкт',
  'Edit property': 'Редагувати обʼєкт',
  'Save changes': 'Зберегти зміни',
  'Property name': 'Назва обʼєкта',
  'Property type': 'Тип обʼєкта',
  'Address line 1': 'Адреса, рядок 1',
  'Address line 2': 'Адреса, рядок 2',
  City: 'Місто',
  Country: 'Країна',
  'Postal code': 'Поштовий індекс',
  Area: 'Площа',
  Rooms: 'Кімнати',
  Apartment: 'Квартира',
  House: 'Будинок',
  Commercial: 'Комерційна',
  Other: 'Інше',
  Archive: 'Архівувати',
  'No properties yet': 'Обʼєктів ще немає',
  'Create your first rental property to start replacing the spreadsheet workflow.':
    'Створіть перший обʼєкт, щоб почати замінювати Excel-процес.',
  'Add the basic property details. Tenant and agreement setup comes later.':
    'Додайте базові дані обʼєкта. Орендарі та договори налаштовуються окремо.',
  'Back to properties': 'Назад до обʼєктів',

  // Tenants
  Tenants: 'Орендарі',
  'Add tenant': 'Додати орендаря',
  'Create tenant': 'Створити орендаря',
  'Edit tenant': 'Редагувати орендаря',
  'Full name': 'Повне імʼя',
  Phone: 'Телефон',
  Email: 'Email',
  Messenger: 'Месенджер',
  'Messenger handle': 'Контакт у месенджері',
  'No tenants yet': 'Орендарів ще немає',
  'Create your first tenant to prepare for rental agreements.':
    'Створіть першого орендаря, щоб підготувати договори оренди.',
  'Update contact details for this tenant.':
    'Оновіть контактні дані цього орендаря.',
  'Add contact details for a tenant. Agreements come later.':
    'Додайте контактні дані орендаря. Договори налаштовуються окремо.',
  'Back to tenants': 'Назад до орендарів',

  // Agreements
  Agreements: 'Договори',
  'Rental agreements': 'Договори оренди',
  'Add agreement': 'Додати договір',
  'Add rental agreement': 'Додати договір оренди',
  'Edit rental agreement': 'Редагувати договір оренди',
  'Create agreement': 'Створити договір',
  'Connect properties and tenants with rent and payment terms.':
    'Повʼяжіть обʼєкти й орендарів з умовами оренди та оплати.',
  'Connect a property and tenant with rent and payment terms.':
    'Повʼяжіть обʼєкт і орендаря з умовами оренди та оплати.',
  'Start date': 'Дата початку',
  'End date': 'Дата завершення',
  'Monthly rent': 'Місячна оренда',
  'Rent currency': 'Валюта оренди',
  'Payment due day': 'День оплати',
  Deposit: 'Депозит',
  'Deposit currency': 'Валюта депозиту',
  Draft: 'Чернетка',
  Active: 'Активний',
  Ended: 'Завершений',
  Cancelled: 'Скасований',
  Ready: 'Готовий',
  'Ready to send': 'Готовий до надсилання',
  Sent: 'Надісланий',
  'No rental agreements yet': 'Договорів ще немає',
  'Create an agreement after you have at least one property and tenant.':
    'Створіть договір після того, як додасте хоча б один обʼєкт і орендаря.',
  'Update rent, dates, tenant, property, or agreement status.':
    'Оновіть оренду, дати, орендаря, обʼєкт або статус договору.',
  'Create at least one property and one tenant before creating a rental agreement.':
    'Створіть хоча б один обʼєкт і одного орендаря перед створенням договору.',
  'Back to agreements': 'Назад до договорів',
  'Cancel agreement': 'Скасувати договір',

  // Utilities and meters
  Utilities: 'Комунальні',
  'Add utility': 'Додати комунальну',
  'Edit utility': 'Редагувати комунальну',
  'Custom type': 'Власний тип',
  'Add custom utility type': 'Додати власний тип',
  'Utility type': 'Тип комунальної',
  'Default amount': 'Типова сума',
  Enabled: 'Увімкнено',
  Disabled: 'Вимкнено',
  System: 'Системний',
  Custom: 'Власний',
  'No utilities configured': 'Комунальні ще не налаштовані',
  Utility: 'Комунальна',
  'Enable a utility or recurring charge for this property.':
    'Увімкніть комунальну або регулярний платіж для цього обʼєкта.',
  'Update the default amount, notes, or enabled state.':
    'Оновіть типову суму, нотатки або стан увімкнення.',
  'Create a reusable utility or recurring charge type.':
    'Створіть повторно використовуваний тип комунальної або регулярного платежу.',
  'Enabled for this property': 'Увімкнено для цього обʼєкта',
  'Add rent-related utility rows such as electricity, water, heating, internet, or building maintenance.':
    'Додайте комунальні рядки: електроенергію, воду, опалення, інтернет або утримання будинку.',
  Meters: 'Лічильники',
  'Add meter': 'Додати лічильник',
  'Edit meter': 'Редагувати лічильник',
  'Add reading': 'Додати показник',
  'Add meter reading': 'Додати показник лічильника',
  Provider: 'Постачальник',
  'Account number': 'Особовий рахунок',
  Submission: 'Подача',
  'Submission method': 'Спосіб подачі',
  'Submission URL': 'URL для подачі',
  'Submission email': 'Email для подачі',
  'Day from': 'День від',
  'Day to': 'День до',
  'Meter name': 'Назва лічильника',
  'Active meter': 'Активний лічильник',
  'Latest readings': 'Останні показники',
  'Previous value': 'Попереднє значення',
  'Current value': 'Поточне значення',
  'Waiting': 'Очікує',
  'Received': 'Отримано',
  'Submitted': 'Подано',
  'Not required': 'Не потрібно',
  'Add electricity, water, heating, gas, or other meters for this property.':
    'Додайте лічильники електроенергії, води, опалення, газу або інші для цього обʼєкта.',
  'Store provider and submission details for a property meter.':
    'Збережіть дані постачальника та подачі показників для лічильника.',
  'Update meter details and provider submission settings.':
    'Оновіть дані лічильника й налаштування подачі постачальнику.',
  'Record a monthly reading and track tenant/provider status.':
    'Запишіть місячний показник і відстежуйте статус орендаря/постачальника.',
  'Create a meter before adding readings.':
    'Створіть лічильник перед додаванням показників.',
  'Received from tenant': 'Отримано від орендаря',
  'Submitted to provider': 'Подано постачальнику',
  Website: 'Сайт',
  'In person': 'Особисто',

  // Statements and payments
  Statements: 'Рахунки',
  'Monthly statements': 'Місячні рахунки',
  'Add statement': 'Додати рахунок',
  'Add monthly statement': 'Додати місячний рахунок',
  'Create statement': 'Створити рахунок',
  'Create tenant-facing monthly summaries from agreements and utilities.':
    'Створюйте місячні підсумки для орендарів з договорів і комунальних.',
  'No monthly statements yet': 'Місячних рахунків ще немає',
  'Create a statement after a property has an active rental agreement.':
    'Створіть рахунок після того, як обʼєкт матиме активний договір.',
  'Create a statement from the active agreement and enabled property utilities.':
    'Створіть рахунок з активного договору і ввімкнених комунальних.',
  'Create a property and active rental agreement before creating a monthly statement.':
    'Створіть обʼєкт і активний договір перед створенням місячного рахунку.',
  'Back to statements': 'Назад до рахунків',
  'Tenant summary': 'Підсумок для орендаря',
  'Message and printable statement for the tenant.':
    'Повідомлення і друкований рахунок для орендаря.',
  'Copy message': 'Копіювати повідомлення',
  'Message copied': 'Повідомлення скопійовано',
  'Printable summary': 'Друкований підсумок',
  'Monthly Statement': 'Місячний рахунок',
  'Print / Save PDF': 'Друк / Зберегти PDF',
  Payments: 'Оплати',
  'Add payment': 'Додати оплату',
  'Save payment': 'Зберегти оплату',
  'Payment history': 'Історія оплат',
  'Paid date': 'Дата оплати',
  'Bank transfer': 'Банківський переказ',
  Cash: 'Готівка',
  Card: 'Картка',
  Rent: 'Оренда',
  RentPaid: 'Оренда',
  UtilitiesPaid: 'Комунальні',
  Mixed: 'Змішаний',
  'Record a tenant payment. Partial payment status is derived from totals.':
    'Запишіть оплату орендаря. Частковий статус рахується з підсумків.',
  'Paid amount and partial status are derived from payment totals.':
    'Сплачена сума і частковий статус рахуються з підсумку оплат.',
  Unpaid: 'Не сплачено',
  Partial: 'Частково',
  PaidStatus: 'Сплачено',
  Overpaid: 'Переплата',
  Overdue: 'Прострочено',

  // Reminders
  Reminders: 'Нагадування',
  Reminder: 'Нагадування',
  'Add reminder': 'Додати нагадування',
  'Create reminder': 'Створити нагадування',
  'Open reminders': 'Відкриті нагадування',
  'No reminders': 'Нагадувань немає',
  'Loading reminders...': 'Завантаження нагадувань...',
  'Unable to load reminders.': 'Не вдалося завантажити нагадування.',
  'Create reminders for meter readings, payments, and operational tasks.':
    'Створіть нагадування для показників, оплат і операційних задач.',
  'Internal tasks for readings, provider submissions, payments, and custom follow-ups.':
    'Внутрішні задачі для показників, подачі постачальнику, оплат і власних нагадувань.',
  'Request meter readings': 'Запитати показники',
  'Submit readings to provider': 'Подати показники постачальнику',
  'Rent payment due': 'Оплата оренди',
  'Utilities payment due': 'Оплата комунальних',
  Open: 'Відкрите',
  Skipped: 'Пропущене',
  'Create reminders for readings, payment due dates, or custom tasks.':
    'Створіть нагадування для показників, дат оплати або власних задач.',
  'Create an internal task. Estate Tracker will not send messages automatically.':
    'Створіть внутрішню задачу. Estate Tracker не надсилає повідомлення автоматично.',

  // Loading/errors
  'Loading property...': 'Завантаження обʼєкта...',
  'Loading properties...': 'Завантаження обʼєктів...',
  'Loading tenant...': 'Завантаження орендаря...',
  'Loading tenants...': 'Завантаження орендарів...',
  'Loading agreement...': 'Завантаження договору...',
  'Loading agreements...': 'Завантаження договорів...',
  'Loading statement...': 'Завантаження рахунку...',
  'Loading statements...': 'Завантаження рахунків...',
  'Unable to load monthly statements.':
    'Не вдалося завантажити місячні рахунки.',
  'Unable to load this monthly statement.':
    'Не вдалося завантажити цей місячний рахунок.',
};

export function translate(locale: Locale, text: string) {
  if (locale === 'en') return text;

  return ukTranslations[text] ?? text;
}
